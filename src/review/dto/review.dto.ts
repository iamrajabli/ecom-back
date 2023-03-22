import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ReviewDto {
  @IsString()
  bookId: Types.ObjectId;

  @IsNumber()
  star: number;

  @IsOptional()
  @IsString()
  comment: string;
}
