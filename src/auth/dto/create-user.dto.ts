import { Gender } from '@/auth/enums/gender.enum';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50, { message: 'name must be max 50 characters long' })
  readonly name: string;

  @IsEmail()
  @MaxLength(50, { message: 'email must be max 50 characters long' })
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  readonly phone: string;

  @IsEnum(Gender)
  readonly gender: Gender;

  @IsString()
  readonly birthInfo: string;
}
