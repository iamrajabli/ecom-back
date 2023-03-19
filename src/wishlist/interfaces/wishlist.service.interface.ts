import { ProccessResponse } from '@/types';
import { Types } from 'mongoose';

export interface IWishlistService {
  addToWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProccessResponse>;
  removeFromWishlist(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
  ): Promise<ProccessResponse>;

  removeWishlist(userId: Types.ObjectId): Promise<ProccessResponse>;
}
