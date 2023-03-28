import { IsString } from 'class-validator';

export class ResetUserDto {
  @IsString()
  readonly token: string;

  @IsString()
  readonly password: string;
}
