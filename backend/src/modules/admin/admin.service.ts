import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like, Between } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../../entities/admin-user.entity';
import { User } from '../../entities/user.entity';
import { Note } from '../../entities/note.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { Withdrawal, WithdrawalStatus } from '../../entities/withdrawal.entity';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Withdrawal)
    private withdrawalRepo: Repository<Withdrawal>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async login(dto: LoginAdminDto) {
    let admin = await this.adminRepo.findOne({ where: { username: dto.username } });
    
    // 首次登录自动创建管理员（开发便利，生产环境建议移除）
    if (!admin && dto.username === 'admin') {
      admin = this.adminRepo.create({
        username: dto.username,
        passwordHash: await bcrypt.hash(dto.password, 10),
        role: 'admin',
      });
      await this.adminRepo.save(admin);
    }
    
    if (!admin) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const token = this.jwtService.sign(
      { sub: admin.id, username: admin.username, type: 'admin' },
      { expiresIn: '1d' },
    );

    return { token, admin: { id: admin.id, username: admin.username, role: admin.role } };
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newUsersToday, ordersToday, pendingWithdrawals] = await Promise.all([
      this.userRepo.count({ where: { createdAt: Between(today, new Date()) } }),
      this.orderRepo.count({ where: { createdAt: Between(today, new Date()), status: OrderStatus.SUCCESS } }),
      this.withdrawalRepo.count({ where: { status: WithdrawalStatus.PENDING } }),
    ]);

    const todayRevenue = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.amount)', 'total')
      .where('order.createdAt >= :today', { today })
      .andWhere('order.status = :status', { status: 'success' })
      .getRawOne();

    return {
      newUsersToday,
      todayRevenue: parseInt(todayRevenue?.total || '0', 10),
      pendingWithdrawals,
    };
  }

  async findUsers(query: any) {
    const { page = 1, limit = 20, keyword } = query;
    const qb = this.userRepo.createQueryBuilder('user');
    if (keyword) {
      qb.where('user.phone LIKE :kw OR user.nickname LIKE :kw', { kw: `%${keyword}%` });
    }
    qb.orderBy('user.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async updateUserStatus(id: string, isActive: boolean) {
    await this.userRepo.update(id, { isActive });
    return { success: true };
  }

  async findNotes(query: any) {
    const { page = 1, limit = 20, keyword } = query;
    const qb = this.noteRepo.createQueryBuilder('note').leftJoinAndSelect('note.author', 'author');
    if (keyword) {
      qb.where('note.title LIKE :kw', { kw: `%${keyword}%` });
    }
    qb.orderBy('note.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async updateNoteStatus(id: string, isActive: boolean) {
    await this.noteRepo.update(id, { isActive });
    return { success: true };
  }

  async findOrders(query: any) {
    const { page = 1, limit = 20, type, startDate, endDate } = query;
    const qb = this.orderRepo.createQueryBuilder('order').leftJoinAndSelect('order.user', 'user');
    if (type) qb.andWhere('order.type = :type', { type });
    if (startDate && endDate) {
      qb.andWhere('order.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
    }
    qb.orderBy('order.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findWithdrawals(query: any) {
    const { page = 1, limit = 20, status } = query;
    const qb = this.withdrawalRepo.createQueryBuilder('w')
      .leftJoinAndSelect('w.user', 'user');
    if (status) qb.andWhere('w.status = :status', { status });
    qb.orderBy('w.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async reviewWithdrawal(id: string, adminId: string, status: WithdrawalStatus, remark?: string) {
    const withdrawal = await this.withdrawalRepo.findOne({ where: { id } });
    if (!withdrawal) throw new NotFoundException('提现记录不存在');
    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('该提现记录已处理');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (status === WithdrawalStatus.REJECTED) {
        // 拒绝则退回余额
        await queryRunner.manager.increment(User, { id: withdrawal.userId }, 'balance', withdrawal.amount);
      }

      await queryRunner.manager.update(Withdrawal, id, {
        status,
        adminId,
        remark,
      });

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
