import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { IWishlistController } from './interfaces/wishlist.controller.interface';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController implements IWishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(
    @CurrentUser('id') userId: Types.ObjectId,
    @Body('bookId') bookId: Types.ObjectId,
  ) {
    return await this.wishlistService.addToWishlist(userId, bookId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeFrom(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('id') bookId: Types.ObjectId,
  ) {
    return await this.wishlistService.removeFromWishlist(userId, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@CurrentUser('id') userId: Types.ObjectId) {
    return await this.wishlistService.removeWishlist(userId);
  }
}
