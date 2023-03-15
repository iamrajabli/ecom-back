import { IsEmail, IsString } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
