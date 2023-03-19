import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  publisher: string;

  @IsOptional()
  @IsNumber()
  publishingYear: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  oldPrice: number;

  @IsOptional()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  category: Types.ObjectId;

  @IsOptional()
  @IsString()
  photo: string;
}
