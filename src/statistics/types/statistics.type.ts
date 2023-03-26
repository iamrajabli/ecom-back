import { OrderStatus } from '@/order/enums/order.enum';

export type ClientStatistics = {
  books: number;
  users: number;
  reviews: number;
  sales: number;
};

export type OrderStatisticsItem = {
  books: number;
  order: number;
  total: number;
};

export type OrderStatistics = {
  [OrderStatus.SUCCESS]: OrderStatisticsItem;
  [OrderStatus.FAILED]: OrderStatisticsItem;
  [OrderStatus.IN_WAITING]: OrderStatisticsItem;
  [OrderStatus.IN_PROCESS]: OrderStatisticsItem;
};
