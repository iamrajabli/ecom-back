import { User, UserDocument } from '@/auth/schemas/user.schema';
import { Book, BookDocument } from '@/book/schemas/book.schema';
import { OrderStatus } from '@/order/enums/order.enum';
import { Order, OrderDocument } from '@/order/schemas/order.schema';
import { Review, ReviewDocument } from '@/review/schemas/review.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStatisticsService } from './interfaces/statistics.service.interface';

@Injectable()
export class StatisticsService implements IStatisticsService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async clientStatistics() {
    const [booksCount, userCount, reviewsCount, ordersCount] =
      await Promise.all([
        this.bookModel.countDocuments({ isShow: true }),
        this.userModel.countDocuments({ isDisabled: false }),
        this.reviewModel.countDocuments().exec(),
        this.orderModel.countDocuments({
          status: {
            $in: [OrderStatus.IN_PROCESS, OrderStatus.SUCCESS],
          },
        }),
      ]);

    return {
      books: booksCount,
      users: userCount,
      reviews: reviewsCount,
      sales: ordersCount,
    };
  }

  async orderStatistics(startDate = '1970-01-01', endDate = '') {
    try {
      const orders = await this.orderModel
        .find({
          createdAt: {
            $gte: new Date(startDate),
            $lte: endDate ? new Date(endDate) : new Date(),
          },
        })
        .exec();

      const { FAILED, IN_PROCESS, IN_WAITING, SUCCESS } = OrderStatus;

      const statistics = {
        [SUCCESS]: {
          books: 0,
          order: 0,
          total: 0,
        },
        [FAILED]: {
          books: 0,
          order: 0,
          total: 0,
        },
        [IN_WAITING]: {
          books: 0,
          order: 0,
          total: 0,
        },
        [IN_PROCESS]: {
          books: 0,
          order: 0,
          total: 0,
        },
      };

      if (orders.length < 1) {
        return statistics;
      }

      for (const order of orders) {
        if ([FAILED, IN_PROCESS, SUCCESS, IN_WAITING].includes(order.status)) {
          const status = order.status;

          statistics[status]['total'] += order.total;
          statistics[status]['order'] += order.order.length;
          statistics[status]['books'] += order.order.reduce(
            (acc, ord) => (acc + ord.count) as unknown as number,
            0,
          );
        }
      }

      return statistics;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
