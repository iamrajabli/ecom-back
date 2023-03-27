import { ProcessResponse } from '@/types';
import { Discount } from '@discount/schema/discount.schema';
import { Types } from 'mongoose';
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { DiscountQueryDto } from '@discount/dto/discount-query.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

export interface IDiscountController {
  discount(id: Types.ObjectId): Promise<Discount>;
  discountOfBook(id: Types.ObjectId): Promise<Discount>;
  discounts(dto: DiscountQueryDto): Promise<Discount[]>;
  create(dto: CreateDiscountDto): Promise<Discount>;
  update(id: Types.ObjectId, dto: UpdateDiscountDto): Promise<Discount>;
  remove(id: Types.ObjectId): Promise<ProcessResponse>;
}
