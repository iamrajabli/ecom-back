import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
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

  @Post('token')
  async token(@Body('refreshToken') refreshToken: string) {
    return this.authService.generateNewTokens(refreshToken);
  }
}
