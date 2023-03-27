import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DiscountService } from './discount.service';
import { DiscountQueryDto } from './dto/discount-query.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { IDiscountController } from './interfaces/discount.controller.interface';

@Controller('discount')
export class DiscountController implements IDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get(':id')
  async discount(@Param('id') id: Types.ObjectId) {
    return await this.discountService.getDiscount(id);
  }

  @Get('book/:id')
  async discountOfBook(@Param('id') id: Types.ObjectId) {
    return await this.discountService.getDiscountOfBook(id);
  }

  @Get()
  async discounts(@Query() dto: DiscountQueryDto) {
    return await this.discountService.getDiscounts(dto);
  }

  @Post()
  async create(@Body() dto: CreateDiscountDto) {
    return await this.discountService.createDiscount(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: UpdateDiscountDto,
  ) {
    return await this.discountService.updateDiscount(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: Types.ObjectId) {
    return await this.discountService.removeDiscount(id);
  }
}
