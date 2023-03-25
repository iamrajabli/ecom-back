import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { mongodbConfig } from './config/mongodb.config';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongodbConfig,
    }),
    UserModule,
    BookModule,
    CategoryModule,
    ReviewModule,
    WishlistModule,
    OrderModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
