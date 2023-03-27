import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Book } from '@/book/schemas/book.schema';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true })
export class Discount {
  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Book' })
  book: Book;

  @Prop()
  percent: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
