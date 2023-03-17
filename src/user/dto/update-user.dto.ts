import { Gender } from '@/auth/enums/gender.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'name must be max 50 characters long' })
  readonly name: string;

  @IsOptional()
  @IsEnum(Gender)
  readonly gender: Gender;

  @IsOptional()
  @IsString()
  readonly birthInfo: string;

  @IsOptional()
  @IsString()
  readonly address: string;
}
