import { ProcessResponse } from '@/types';
import { Types } from 'mongoose';

export interface IWishlistService {
  addToWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse>;
  removeFromWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProcessResponse>;

  removeWishlist(userId: Types.ObjectId): Promise<ProcessResponse>;
}
