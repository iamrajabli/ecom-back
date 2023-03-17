import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;

  @IsNumber()
  publishingYear: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  oldPrice: number;

  @IsNumber()
  stock: number;

  @IsString()
  category: Types.ObjectId;

  @IsString()
  photo: string;
}
