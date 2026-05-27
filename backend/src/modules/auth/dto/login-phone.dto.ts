import { IsString, Length, Matches } from 'class-validator';

export class LoginPhoneDto {
  @IsString()
  @Length(11, 11)
  @Matches(/^1[3-9]\d{9}$/)
  phone: string;

  @IsString()
  @Length(4, 6)
  code: string;
}
