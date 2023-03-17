import { Gender } from '@/auth/enums/gender.enum';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50, { message: 'name must be at most 50 characters long' })
  readonly name: string;

  @IsEmail()
  @MaxLength(50, { message: 'email must be at most 50 characters long' })
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'phone must be at least 6 characters long' })
  readonly password: string;

  @IsString()
  @MinLength(3, { message: 'username must be at least 4 characters long' })
  @MaxLength(20, { message: 'username must be at most 20 characters long' })
  readonly username: string;

  @IsString()
  readonly phone: string;

  @IsEnum(Gender)
  readonly gender: Gender;

  @IsString()
  readonly birthInfo: string;

  @IsOptional()
  @IsString()
  readonly address: string;
}
