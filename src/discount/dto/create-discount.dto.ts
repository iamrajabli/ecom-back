import { IsDate, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDiscountDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  book: Types.ObjectId;

  @IsNumber()
  percent: number;
}
