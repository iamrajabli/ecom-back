import { Role } from '@/auth/enums/role.enum';
import { User, UserDocument } from '@/auth/schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { ProfileResponse } from './types/user.types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async updateProfile(
    id: Types.ObjectId,
    dto: UpdateUserDto,
  ): Promise<ProfileResponse> {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, dto, {
          new: true,
        })
        .select('-password, -roles');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async disableProfile(id: Types.ObjectId): Promise<ProfileResponse> {
    try {
      return await this.userModel
        .findByIdAndUpdate(
          id,
          { isDisabled: true },
          {
            new: true,
          },
        )
        .select('-password, -roles');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      await user.remove();

      return {
        message: 'User successfully deleted',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeRole(id: Types.ObjectId, role: Role) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      user.roles = role === 'user' ? [Role.User] : [Role.User, role];
      await user.save();

      return {
        message: 'User role successfully changed',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers() {
    try {
      return await this.userModel.find().select('-password').exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id).select('-password');

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
