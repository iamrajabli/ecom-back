import { User } from '@/auth/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from '@order/enum/order.enum';
import { Book } from '@/book/schemas/book.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Book' })
  book: Book;

  @Prop({ required: true })
  count: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  order: OrderItem[];

  @Prop({ required: true })
  total: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.IN_WAITING })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
