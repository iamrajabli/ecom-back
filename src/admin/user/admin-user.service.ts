import { User, UserDocument } from '@/auth/schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProccessResponse } from '@admin/types/admin.types';
import { Role } from '@/auth/enums/role.enum';
import { IAdminUserService } from './interfaces/admin-user.service.interface';

@Injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async deleteUser(id: Types.ObjectId): Promise<ProccessResponse> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      await user.remove();

      return {
        message: 'User successfuly deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeRole(id: Types.ObjectId, role: Role): Promise<ProccessResponse> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      user.roles = role === 'user' ? [Role.User] : [Role.User, role];
      await user.save();

      return {
        message: 'User role successfuly changed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().select('-password').exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(username: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ username })
        .select('-password');

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
