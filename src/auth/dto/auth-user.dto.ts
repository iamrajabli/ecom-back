import { IsString } from 'class-validator';

export class AuthUserDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly password: string;
}
