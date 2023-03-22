import { OrderItem } from '@order/schemas/order.schema';
import { Types } from 'mongoose';

export class UpdateOrderDto {
  readonly order: OrderItem[];
  readonly userId: Types.ObjectId;
}
