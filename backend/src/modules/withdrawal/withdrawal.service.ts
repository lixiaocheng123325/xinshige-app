import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Withdrawal, WithdrawalStatus } from '../../entities/withdrawal.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepo: Repository<Withdrawal>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, amount: number, accountName: string, accountNumber: string) {
    const MIN_WITHDRAWAL = 100; // 1元 = 100分

    if (amount < MIN_WITHDRAWAL) {
      throw new BadRequestException(`最低提现金额为 ${MIN_WITHDRAWAL / 100} 元`);
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.balance < amount) {
      throw new BadRequestException('余额不足');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.decrement(User, { id: userId }, 'balance', amount);

      const withdrawal = queryRunner.manager.create(Withdrawal, {
        userId,
        amount,
        accountName,
        accountNumber,
        status: WithdrawalStatus.PENDING,
      });
      await queryRunner.manager.save(withdrawal);

      await queryRunner.commitTransaction();
      return withdrawal;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('提现申请失败');
    } finally {
      await queryRunner.release();
    }
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.withdrawalRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }
}
