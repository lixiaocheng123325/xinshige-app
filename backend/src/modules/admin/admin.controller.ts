import { Controller, Get, Post, Put, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { WithdrawalStatus } from '../../entities/withdrawal.entity';

@ApiTags('管理后台')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('auth/login')
  @ApiOperation({ summary: '管理员登录' })
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: '统计数据' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: '用户列表' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  findUsers(@Query() query: any) {
    return this.adminService.findUsers(query);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: '更新用户状态' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  updateUserStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateUserStatus(id, body.isActive);
  }

  @Get('notes')
  @ApiOperation({ summary: '笔记列表' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  findNotes(@Query() query: any) {
    return this.adminService.findNotes(query);
  }

  @Put('notes/:id/status')
  @ApiOperation({ summary: '更新笔记状态' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  updateNoteStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateNoteStatus(id, body.isActive);
  }

  @Get('orders')
  @ApiOperation({ summary: '订单列表' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  findOrders(@Query() query: any) {
    return this.adminService.findOrders(query);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: '提现列表' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  findWithdrawals(@Query() query: any) {
    return this.adminService.findWithdrawals(query);
  }

  @Put('withdrawals/:id')
  @ApiOperation({ summary: '审核提现' })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  reviewWithdrawal(
    @Param('id') id: string,
    @Body() body: { status: WithdrawalStatus; remark?: string },
    @Request() req,
  ) {
    return this.adminService.reviewWithdrawal(id, req.admin.id, body.status, body.remark);
  }
}
