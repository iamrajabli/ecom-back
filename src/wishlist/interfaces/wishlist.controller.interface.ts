import { ProccessResponse } from '@/types';
import { Types } from 'mongoose';

export interface IWishlistController {
  add(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProccessResponse>;
  removeFrom(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProccessResponse>;

  remove(userId: Types.ObjectId): Promise<ProccessResponse>;
}
