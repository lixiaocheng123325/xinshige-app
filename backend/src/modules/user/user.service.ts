import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    await this.userRepo.update(userId, {
      nickname: data.nickname,
      avatar: data.avatar,
    });
    return this.findById(userId);
  }
}
