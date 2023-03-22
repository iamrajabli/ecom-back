import { ProcessResponse } from '@/types';
import { Types } from 'mongoose';

export interface IWishlistController {
  add(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse>;
  removeFrom(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse>;

  remove(userId: Types.ObjectId): Promise<ProcessResponse>;
}
