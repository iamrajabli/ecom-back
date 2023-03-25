import { User, UserDocument } from '@/auth/schemas/user.schema';
import { Book, BookDocument } from '@/book/schemas/book.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enum/order.enum';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderService: Model<OrderDocument>,
    @InjectModel(User.name)
    private readonly userService: Model<UserDocument>,
    @InjectModel(Book.name)
    private readonly bookService: Model<BookDocument>,
  ) {}

  async getOrder(id: Types.ObjectId) {
    try {
      const order = await this.orderService
        .findById(id)
        .populate({ path: 'order.book', model: 'Book' });

      if (!order) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getOrders() {
    try {
      return await this.orderService
        .find()
        .populate({ path: 'order.book', model: 'Book' })
        .exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async changeStatus(id: Types.ObjectId, status: OrderStatus) {
    try {
      const order = await this.orderService.findById(id);

      if (!order) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }

      if (status !== order.status) {
        if (
          (status === OrderStatus.IN_PROCESS &&
            order.status !== OrderStatus.SUCCESS) ||
          (status === OrderStatus.SUCCESS &&
            order.status !== OrderStatus.IN_PROCESS)
        ) {
          for (const item of order.order) {
            const book = await this.bookService.findById(item.book);

            book.stock -= item.count;
            book.sold += 1;

            await book.save();
          }
        }

        if (
          (status === OrderStatus.FAILED &&
            order.status !== OrderStatus.IN_WAITING) ||
          (status === OrderStatus.IN_WAITING &&
            order.status !== OrderStatus.FAILED)
        ) {
          for (const item of order.order) {
            const book = await this.bookService.findById(item.book);

            book.stock += item.count;
            book.sold -= 1;

            await book.save();
          }
        }
      }

      order.status = status;
      await order.save();

      return {
        message: 'Book status successfuly changed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createOrder(userId: Types.ObjectId, dto: CreateOrderDto) {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      // Stock check
      for (const item of dto.order) {
        const book = await this.bookService.findById(item.book);

        if (item.count > book.stock) {
          throw new HttpException(
            `${book.title} - stock limit exceeded`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // totals array
      const totals: number[] = await Promise.all(
        dto.order.map(async (order) => {
          const book = await this.bookService.findById(order.book);
          if (book) {
            const sum = book.price * order.count;
            return sum;
          }
          return 0;
        }),
      );

      // totals array sum
      const total: number = totals.reduce((acc, val) => acc + val, 0);
      const order = await this.orderService.create({
        ...dto,
        user: user.id,
        total,
      });

      user.order.push(order);

      await user.save();

      return order;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateOrder(orderId: Types.ObjectId, dto: UpdateOrderDto) {
    try {
      const order = await this.orderService.findById(orderId);

      if (order.status !== OrderStatus.IN_WAITING) {
        throw new HttpException(
          'Status is not << In Waiting >>.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userService.findById(dto.userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      // Stock check // Fix me DRY
      for (const item of dto.order) {
        const book = await this.bookService.findById(item.book);

        if (item.count > book.stock) {
          throw new HttpException(
            `${book.title} - stock limit exceeded`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // totals array // Fix me DRY
      const totals: number[] = await Promise.all(
        dto.order.map(async (order) => {
          const book = await this.bookService.findById(order.book);
          if (book) {
            const sum = book.price * order.count;
            return sum;
          }
          return 0;
        }),
      );

      // totals array sum
      const total: number = totals.reduce((acc, val) => acc + val, 0);
      order.order = dto.order;
      order.total = total;

      await order.save();

      return order;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteOrder(userId: Types.ObjectId, orderId: Types.ObjectId) {
    try {
      const order = await this.orderService.findById(orderId);

      if (!order) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }

      const user = await this.userService.findById(userId);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      await this.userService.findByIdAndUpdate(userId, {
        $pull: { order: order.id },
      });

      await order.remove();

      return {
        message: 'Order successfully removed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async orderStatistics(startDate = '1970-01-01', endDate = '') {
    try {
      const orders = await this.orderService
        .find({
          createdAt: {
            $gte: new Date(startDate),
            $lte: endDate ? new Date(endDate) : new Date(),
          },
        })
        .exec();

      const { FAILED, IN_PROCESS, IN_WAITING, SUCCESS } = OrderStatus;

      const statistics = {
        [SUCCESS]: 0,
        [FAILED]: 0,
        [IN_WAITING]: 0,
        [IN_PROCESS]: 0,
      };

      if (orders.length < 1) {
        return statistics;
      }

      for (const order of orders) {
        if ([FAILED, IN_PROCESS, SUCCESS, IN_WAITING].includes(order.status)) {
          statistics[order.status] += order.total;
        }
      }

      return statistics;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
