import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { User } from '@/auth/schemas/user.schema';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserController } from './interfaces/user.controller.interface';
import { ProfileResponse } from './types/user.types';
import { UserService } from './user.service';

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@CurrentUser() user: User): Promise<ProfileResponse> {
    return user;
  }

  @Get(':username')
  async user(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @Get('')
  async users() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') id: Types.ObjectId,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/disable')
  async disableProfile(@CurrentUser('id') id: Types.ObjectId) {
    return this.userService.disableProfile(id);
  }
}
