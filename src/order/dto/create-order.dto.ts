import { OrderItem } from '@order/schemas/order.schema';

export class CreateOrderDto {
  readonly order: OrderItem[];
}
