import { HydratedDocument, Types } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from '@/auth/schemas/user.schema';
import { Book } from '@/book/schemas/book.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ enum: [1, 2, 3, 4, 5] })
  star: number;

  @Prop()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: 'Book' })
  book: Book;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
