import { User, UserDocument } from '@/auth/schemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { ProfileResponse, UserResponse } from './types/user.types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUser(username: string): Promise<UserResponse> {
    try {
      const user = (await this.userModel.findOne({ username })) as User & {
        createdAt: Date;
      };

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      return this.generateUserFields(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async getUsers(): Promise<UserResponse[]> {
    try {
      const users = await this.userModel.find().exec();

      return users?.map(this.generateUserFields);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

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

  generateUserFields(user: User): UserResponse {
    const { name, gender, createdAt, username } = user;

    return { name, gender, createdAt, username };
  }
}
