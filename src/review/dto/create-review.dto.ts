import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  book: Types.ObjectId;

  @IsNumber()
  star: number;

  @IsOptional()
  @IsString()
  comment: string;
}
