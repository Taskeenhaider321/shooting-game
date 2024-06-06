/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  // sign up controller
  async signUp(signUpDto: SignUpDto) {
    const { username, name, password } = signUpDto;
    const userExists = await this.userModel.findOne({ username: username });
    if (userExists)
      throw new ConflictException(
        'User already exists. PLease try different email...',
      );
    const hashed = await bcrypt.hash(password, 5);
    await this.userModel.create({
      username,
      name,
      password: hashed,
    });
    return { success: 'User created' };
  }
  // login controller
  async logIn(logInDto: LogInDto) {
    const { username, password } = logInDto;
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new NotFoundException({
        message: 'Username does not found. Please Sign up first.',
      });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException({
        message: 'Password does not match. Please enter correct password.',
      });
    }

    const tokenn : any = this.jwtService.sign({ id: user._id })
    return { token: tokenn, User: user };
  }
}
