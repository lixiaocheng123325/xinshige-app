import { Controller, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';

@ApiTags('支付')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pay')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('wechat-unified')
  @ApiOperation({ summary: '微信统一下单' })
  wechatUnified(@Request() req, @Body() body: { amount: number }) {
    return this.paymentService.createWechatOrder(req.user.userId, body.amount);
  }

  @Post('alipay-create')
  @ApiOperation({ summary: '支付宝下单' })
  alipayCreate(@Request() req, @Body() body: { amount: number }) {
    return this.paymentService.createAlipayOrder(req.user.userId, body.amount);
  }

  @Post('notify/wechat')
  @ApiOperation({ summary: '微信支付回调' })
  wechatNotify(@Body() body: any) {
    // TODO: 验签并确认订单
    return { code: 'SUCCESS' };
  }

  @Post('notify/alipay')
  @ApiOperation({ summary: '支付宝支付回调' })
  alipayNotify(@Body() body: any) {
    // TODO: 验签并确认订单
    return 'success';
  }

  @Post('purchase-note')
  @ApiOperation({ summary: '购买笔记' })
  purchaseNote(@Request() req, @Body() body: { noteId: string; amount: number }) {
    return this.paymentService.purchaseNote(req.user.userId, body.noteId, body.amount);
  }
}

@ApiTags('Apple IAP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('iap')
export class IapController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: '创建IAP订单' })
  createIap(@Request() req, @Body() body: { productId: string; amount: number }) {
    return this.paymentService.createIapOrder(req.user.userId, body.productId, body.amount);
  }

  @Post('verify')
  @ApiOperation({ summary: '验证IAP收据' })
  verifyIap(@Request() req, @Body() body: { orderId: string; receipt: string }) {
    return this.paymentService.verifyIap(req.user.userId, body.orderId, body.receipt);
  }
}
