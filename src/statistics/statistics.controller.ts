import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrderStatisticsDto } from './dto/order-statistics.dto';
import { IStatisticsController } from './interfaces/statistics.controller.interface';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController implements IStatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/client')
  async client() {
    return await this.statisticsService.clientStatistics();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get('/order')
  async order(@Query() dto: OrderStatisticsDto) {
    return await this.statisticsService.orderStatistics(
      dto.startDate,
      dto.endDate,
    );
  }
}
