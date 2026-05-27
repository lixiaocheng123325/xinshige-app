import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@ApiTags('用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: '获取个人资料' })
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: '更新个人资料' })
  updateProfile(@Request() req, @Body() body: { nickname?: string; avatar?: string }) {
    return this.userService.updateProfile(req.user.userId, body);
  }
}
