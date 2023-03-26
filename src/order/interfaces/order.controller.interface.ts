import { ProcessResponse } from '@/types';
import { Types } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderStatus } from '../enums/order.enum';
import { Order } from '../schemas/order.schema';

export interface IOrderController {
  order(id: Types.ObjectId): Promise<Order>;
  orders(): Promise<Order[]>;
  status(id: Types.ObjectId, status: OrderStatus): Promise<ProcessResponse>;
  create(userId: Types.ObjectId, dto: CreateOrderDto): Promise<Order>;
  update(orderId: Types.ObjectId, dto: UpdateOrderDto): Promise<Order>;
  delete(
    userId: Types.ObjectId,
    orderId: Types.ObjectId,
  ): Promise<ProcessResponse>;
}
