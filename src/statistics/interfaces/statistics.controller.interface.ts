import {
  ClientStatistics,
  OrderStatistics,
} from '@statistics/types/statistics.type';
import { OrderStatisticsDto } from '@statistics/dto/order-statistics.dto';

export interface IStatisticsController {
  client(): Promise<ClientStatistics>;
  order(dto: OrderStatisticsDto): Promise<OrderStatistics>;
}
