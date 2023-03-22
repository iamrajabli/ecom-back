import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { Types } from 'mongoose';
import { ReviewDto } from '@/review/dto/review.dto';
import { IReviewController } from './interfaces/review.controller.interface';

@Controller('review')
export class ReviewController implements IReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser('id') userId: Types.ObjectId,
    @Body() dto: ReviewDto,
  ) {
    return await this.reviewService.createReview(userId, dto);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  async update(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('reviewId') reviewId: Types.ObjectId,
    @Body() dto: ReviewDto,
  ) {
    return await this.reviewService.updateReview(userId, reviewId, dto);
  }

  @Get('')
  async reviews() {
    return await this.reviewService.getReviews();
  }

  @Get('star/:bookId')
  async reviewsOfBook(@Param('bookId') bookId: Types.ObjectId) {
    return await this.reviewService.getReviewsOfBook(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:bookId')
  async reviewOfUser(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('bookId') bookId: Types.ObjectId,
  ) {
    return await this.reviewService.getReviewOfUser(userId, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  async remove(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('reviewId') reviewId: Types.ObjectId,
  ) {
    return await this.reviewService.removeReview(userId, reviewId);
  }
}
