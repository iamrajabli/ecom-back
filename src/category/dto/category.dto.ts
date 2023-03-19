import { IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;
}
