import { ProcessResponse } from '@/types';
import { Types } from 'mongoose';
import { CreateOrderDto } from '@order/dto/create-order.dto';
import { UpdateOrderDto } from '@order/dto/update-order.dto';
import { OrderStatus } from '@order/enums/order.enum';
import { Order } from '@order/schemas/order.schema';

export interface IOrderService {
  getOrder(id: Types.ObjectId): Promise<Order>;
  getOrders(): Promise<Order[]>;
  changeStatus(
    id: Types.ObjectId,
    status: OrderStatus,
  ): Promise<ProcessResponse>;
  createOrder(userId: Types.ObjectId, dto: CreateOrderDto): Promise<Order>;
  updateOrder(orderId: Types.ObjectId, dto: UpdateOrderDto): Promise<Order>;
  deleteOrder(
    userId: Types.ObjectId,
    orderId: Types.ObjectId,
  ): Promise<ProcessResponse>;
}
