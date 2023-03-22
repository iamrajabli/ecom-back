import { Types } from 'mongoose';
import { PriceSort } from '@book/enums/book.enums';

export class QueryBookDto {
  query: string;
  max: number;
  min: number;
  offset: number;
  limit: number;
  categoryId: Types.ObjectId;
  priceSort: PriceSort;
  author: string;
}
