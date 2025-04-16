import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<any>) {}

  async register(data: RegisterUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: data.email });
      if (existingUser) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User with this email already exists',
        };
      }

      const newUser = new this.userModel(data);
      const savedUser = await newUser.save();

      const { password, ...result } = savedUser.toJSON();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error registering user',
        error: error.message,
      };
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        };
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        };
      }

      const token = jwt.sign(
        { sub: user._id, email: user.email },
        'YOUR_SECRET_KEY', // Use environment variable in production
        { expiresIn: '1d' },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error during login',
        error: error.message,
      };
    }
  }
}
