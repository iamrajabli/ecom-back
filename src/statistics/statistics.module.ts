import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '@/book/schemas/book.schema';
import { Review, ReviewSchema } from '@/review/schemas/review.schema';
import { User, UserSchema } from '@/auth/schemas/user.schema';
import { Order, OrderSchema } from '@/order/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
