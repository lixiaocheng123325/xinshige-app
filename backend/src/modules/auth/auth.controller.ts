import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginPhoneDto } from './dto/login-phone.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-sms')
  @ApiOperation({ summary: '发送短信验证码' })
  sendSms(@Body() dto: SendSmsDto) {
    return this.authService.sendSms(dto);
  }

  @Post('login-phone')
  @ApiOperation({ summary: '手机号验证码登录' })
  loginPhone(@Body() dto: LoginPhoneDto) {
    return this.authService.loginPhone(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新Token' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
