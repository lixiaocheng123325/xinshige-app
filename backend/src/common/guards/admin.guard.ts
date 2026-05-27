import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../../entities/admin-user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('缺少管理员Token');
    }
    
    const token = authHeader.substring(7);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'default_secret',
      });
      
      if (payload.type !== 'admin') {
        throw new UnauthorizedException('非管理员Token');
      }
      
      const admin = await this.adminRepo.findOne({ where: { id: payload.sub } });
      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('管理员账号无效');
      }
      
      request.admin = admin;
      return true;
    } catch {
      throw new UnauthorizedException('Token无效');
    }
  }
}
