import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  star: number;

  @IsOptional()
  @IsString()
  comment: string;
}
