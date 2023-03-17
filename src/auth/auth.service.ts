import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from 'bcrypt';
import { Document, Model, ObjectId } from 'mongoose';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IAuthService } from './interfaces/auth.service.interface';
import { User, UserDocument } from './schemas/user.schema';
import { AuthResponse, Tokens } from './types/auth.types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async auth(dto: AuthUserDto): Promise<AuthResponse> {
    try {
      const user = await this.validateUser(dto);

      if (user.isDisabled) {
        throw new HttpException(
          'This account is disabled. Сontact with support.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(dto: CreateUserDto): Promise<AuthResponse> {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: dto.email },
          { phone: dto.phone },
          { username: dto.username },
        ],
      });

      const uniqueFields = ['email', 'phone', 'username'];
      const messages = [];

      if (existingUser) {
        for (const value of uniqueFields) {
          if (existingUser[value] === dto[value]) {
            messages.push(`${value} already exists`);
          }
        }

        if (messages.length > 0) {
          throw new HttpException(messages.join(', '), HttpStatus.BAD_REQUEST);
        }
      }

      const salt = await genSalt(10);

      const hashedPassword = await hash(dto.password, salt);

      const newUser = await this.userModel.create({
        ...dto,
        password: hashedPassword,
      });

      const user = await this.userModel.findById(newUser.id);

      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(dto: AuthUserDto): Promise<User & Pick<Document, 'id'>> {
    const user = await this.userModel.findOne({
      $or: [{ email: dto.login }, { username: dto.login }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user as User & Pick<Document, 'id'>;
  }

  generateAuthFields(user: User): AuthResponse['user'] {
    const { email, name, phone, username } = user;
    return { email, name, phone, username };
  }

  generateTokens(id: ObjectId): Tokens {
    const data = { id };

    const accessToken = this.jwtService.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async generateNewTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const result = (await this.jwtService.verifyAsync(
        refreshToken,
      )) as Record<'id', ObjectId>;

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = await this.userModel.findById(result.id);
      return {
        user: this.generateAuthFields(user),
        tokens: this.generateTokens(user.id),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
