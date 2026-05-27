import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SmsCode } from '../../entities/sms-code.entity';
import { SendSmsDto } from './dto/send-sms.dto';
import { LoginPhoneDto } from './dto/login-phone.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(SmsCode)
    private smsCodeRepo: Repository<SmsCode>,
    private jwtService: JwtService,
  ) {}

  async sendSms(dto: SendSmsDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    const smsCode = this.smsCodeRepo.create({
      phone: dto.phone,
      code,
      expireAt,
    });
    await this.smsCodeRepo.save(smsCode);

    if (process.env.SMS_MOCK === 'true') {
      console.log(`[SMS MOCK] Phone: ${dto.phone}, Code: ${code}`);
    } else {
      // TODO: 集成阿里云短信SDK发送真实短信
      console.log(`[SMS] Send to ${dto.phone}: ${code}`);
    }

    return { message: '验证码已发送' };
  }

  async loginPhone(dto: LoginPhoneDto) {
    const smsCode = await this.smsCodeRepo.findOne({
      where: {
        phone: dto.phone,
        code: dto.code,
        used: false,
        expireAt: MoreThan(new Date()),
      },
    });

    if (!smsCode) {
      throw new BadRequestException('验证码错误或已过期');
    }

    smsCode.used = true;
    await this.smsCodeRepo.save(smsCode);

    let user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) {
      user = this.userRepo.create({ phone: dto.phone, nickname: `用户${dto.phone.slice(-4)}` });
      await this.userRepo.save(user);
    }

    const payload = { sub: user.id, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        balance: user.balance,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }
      const newPayload = { sub: user.id, phone: user.phone };
      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      });
      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Refresh Token 无效');
    }
  }

  async cleanExpiredSmsCodes() {
    await this.smsCodeRepo.delete({ expireAt: LessThan(new Date()) });
  }
}


