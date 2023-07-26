import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async createOrUpdateUser(body: CreateUserDto): Promise<User> {
    let user = await this.userModel.findOne({ email: body?.email });
    if (!user) {
      return (await this.userModel.create(body)).populate('role');
    } else {
      user.refreshToken = body?.refreshToken;
      return (await user.save()).populate('role');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User> {
    return await this.userModel.findOne({ refreshToken: refreshToken });
  }
}
