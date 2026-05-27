import { IsString, Length } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
