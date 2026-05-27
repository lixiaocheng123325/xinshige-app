import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WithdrawalService } from './withdrawal.service';

@ApiTags('提现')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class WithdrawalController {
  constructor(private withdrawalService: WithdrawalService) {}

  @Post()
  @ApiOperation({ summary: '申请提现' })
  create(
    @Request() req,
    @Body() body: { amount: number; accountName: string; accountNumber: string },
  ) {
    return this.withdrawalService.create(
      req.user.userId,
      body.amount,
      body.accountName,
      body.accountNumber,
    );
  }

  @Get()
  @ApiOperation({ summary: '我的提现记录' })
  findByUser(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.withdrawalService.findByUser(
      req.user.userId,
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }
}
