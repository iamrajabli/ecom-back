import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { RoleGuard } from '@/auth/guards/roles.guard';
import { User } from '@/auth/schemas/user.schema';
import {
  Body,
  Controller,
  Delete,
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
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@CurrentUser() user: User): Promise<ProfileResponse> {
    return user;
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
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

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return await this.userService.deleteUser(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('role/:id')
  async role(@Param('id') id: Types.ObjectId, @Body('role') role: Role) {
    return await this.userService.changeRole(id, role);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async users() {
    return await this.userService.getUsers();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async user(@Param('id') id: Types.ObjectId) {
    return await this.userService.getUser(id);
  }
}
