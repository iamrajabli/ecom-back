import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { SummaryDto } from './dto/summary.dto';
import { OrderStatus } from './enum/order.enum';
import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async order(@Param('id') id: Types.ObjectId) {
    return await this.orderService.getOrder(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get('')
  async orders() {
    return await this.orderService.getOrders();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch('status/:id')
  async status(
    @Param('id') id: Types.ObjectId,
    @Body('status') status: OrderStatus,
  ) {
    return await this.orderService.changeStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(
    @CurrentUser('id') userId: Types.ObjectId,
    @Body() dto: CreateOrderDto,
  ) {
    return await this.orderService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id') orderId: Types.ObjectId,
    @Body() dto: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(orderId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('id') orderId: Types.ObjectId,
  ) {
    return await this.orderService.deleteOrder(userId, orderId);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get('summary/statistics')
  async statistics(@Query() dto: SummaryDto) {
    return await this.orderService.orderStatistics(dto.startDate, dto.endDate);
  }
}
