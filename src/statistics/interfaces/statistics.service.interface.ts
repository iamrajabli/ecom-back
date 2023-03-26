import {
  ClientStatistics,
  OrderStatistics,
} from '@statistics/types/statistics.type';

export interface IStatisticsService {
  clientStatistics(): Promise<ClientStatistics>;
  orderStatistics(startDate: string, endDate: string): Promise<OrderStatistics>;
}
