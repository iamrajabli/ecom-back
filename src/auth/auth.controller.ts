import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { IAuthController } from './interfaces/auth.controller.interface';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: AuthUserDto) {
    return this.authService.auth(dto);
  }

  @Post('admin')
  @UsePipes(new ValidationPipe())
  async admin(@Body() dto: AuthUserDto) {
    return this.authService.admin(dto);
  }

  @Post('send-reset')
  @UsePipes(new ValidationPipe())
  async sendReset(@Body('login') login: string) {
    return this.authService.reset(login);
  }

  @Post('reset')
  @UsePipes(new ValidationPipe())
  async reset(@Body() dto: ResetUserDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('reset/:token')
  @UsePipes(new ValidationPipe())
  async verifyReset(@Param('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('token')
  async token(@Body('refreshToken') refreshToken: string) {
    return this.authService.generateNewTokens(refreshToken);
  }
}
