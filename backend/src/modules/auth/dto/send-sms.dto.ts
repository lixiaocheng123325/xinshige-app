import { IsString, Length, Matches } from 'class-validator';

export class SendSmsDto {
  @IsString()
  @Length(11, 11)
  @Matches(/^1[3-9]\d{9}$/)
  phone: string;
}
