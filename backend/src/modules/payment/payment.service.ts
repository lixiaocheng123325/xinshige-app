import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderType, OrderStatus } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { NotePurchase } from '../../entities/note-purchase.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(NotePurchase)
    private purchaseRepo: Repository<NotePurchase>,
    private dataSource: DataSource,
  ) {}

  async createWechatOrder(userId: string, amount: number) {
    const order = this.orderRepo.create({
      userId,
      type: OrderType.WECHAT,
      amount,
      status: OrderStatus.PENDING,
    });
    await this.orderRepo.save(order);

    if (process.env.PAY_MOCK === 'true') {
      await this.confirmOrder(order.id, 'mock_wechat_' + Date.now());
      return { mock: true, message: '模拟支付成功' };
    }

    // TODO: 调用微信统一下单API
    return {
      orderId: order.id,
      prepayId: 'mock_prepay_id',
      appId: process.env.WECHAT_APPID,
      // ... 其他调起参数
    };
  }

  async createAlipayOrder(userId: string, amount: number) {
    const order = this.orderRepo.create({
      userId,
      type: OrderType.ALIPAY,
      amount,
      status: OrderStatus.PENDING,
    });
    await this.orderRepo.save(order);

    if (process.env.PAY_MOCK === 'true') {
      await this.confirmOrder(order.id, 'mock_alipay_' + Date.now());
      return { mock: true, message: '模拟支付成功' };
    }

    // TODO: 生成支付宝orderString
    return {
      orderId: order.id,
      orderString: 'mock_order_string',
    };
  }

  async createIapOrder(userId: string, productId: string, amount: number) {
    const order = this.orderRepo.create({
      userId,
      type: OrderType.IAP,
      amount,
      status: OrderStatus.PENDING,
      payload: { productId },
    });
    await this.orderRepo.save(order);
    return { orderId: order.id };
  }

  async verifyIap(userId: string, orderId: string, receipt: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) {
      throw new BadRequestException('订单不存在');
    }

    if (process.env.PAY_MOCK === 'true') {
      await this.confirmOrder(orderId, 'mock_iap_' + Date.now());
      return { success: true };
    }

    // TODO: 向苹果服务器验证收据
    // const verifyUrl = process.env.NODE_ENV === 'production'
    //   ? 'https://buy.itunes.apple.com/verifyReceipt'
    //   : 'https://sandbox.itunes.apple.com/verifyReceipt';

    return { success: true };
  }

  async confirmOrder(orderId: string, transactionId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order || order.status !== OrderStatus.PENDING) {
        await queryRunner.rollbackTransaction();
        return;
      }

      await queryRunner.manager.update(Order, orderId, {
        status: OrderStatus.SUCCESS,
        transactionId,
      });

      await queryRunner.manager.increment(
        User,
        { id: order.userId },
        'balance',
        order.amount,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async purchaseNote(userId: string, noteId: string, amount: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    // Mock 模式下免余额直接购买，方便测试
    if (process.env.PAY_MOCK !== 'true' && user.balance < amount) {
      throw new BadRequestException('余额不足');
    }

    const existing = await this.purchaseRepo.findOne({ where: { userId, noteId } });
    if (existing) {
      throw new BadRequestException('已购买该笔记');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.decrement(User, { id: userId }, 'balance', amount);
      await queryRunner.manager.increment(User, { id: userId }, 'balance', 0); // 触发检查

      const purchase = queryRunner.manager.create(NotePurchase, {
        userId,
        noteId,
        amount,
      });
      await queryRunner.manager.save(purchase);

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('购买失败');
    } finally {
      await queryRunner.release();
    }
  }
}
