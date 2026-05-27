import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController, IapController } from './payment.controller';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { NotePurchase } from '../../entities/note-purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, NotePurchase])],
  providers: [PaymentService],
  controllers: [PaymentController, IapController],
  exports: [PaymentService],
})
export class PaymentModule {}
