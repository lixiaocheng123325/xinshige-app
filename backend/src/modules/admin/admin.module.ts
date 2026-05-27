import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminUser } from '../../entities/admin-user.entity';
import { User } from '../../entities/user.entity';
import { Note } from '../../entities/note.entity';
import { Order } from '../../entities/order.entity';
import { Withdrawal } from '../../entities/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, User, Note, Order, Withdrawal]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
