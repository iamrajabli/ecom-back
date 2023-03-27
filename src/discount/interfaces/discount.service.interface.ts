import { ProcessResponse } from '@/types';
import { Discount } from '@discount/schema/discount.schema';
import { Types } from 'mongoose';
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { DiscountQueryDto } from '@discount/dto/discount-query.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

export interface IDiscountService {
  getDiscount(id: Types.ObjectId): Promise<Discount>;
  getDiscountOfBook(id: Types.ObjectId): Promise<Discount>;
  getDiscounts(dto: DiscountQueryDto): Promise<Discount[]>;
  createDiscount(dto: CreateDiscountDto): Promise<Discount>;
  updateDiscount(id: Types.ObjectId, dto: UpdateDiscountDto): Promise<Discount>;
  removeDiscount(id: Types.ObjectId): Promise<ProcessResponse>;
}
