import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async createUser(body: any): Promise<User> {
    return await this.userModel.create(body);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User> {
    return await this.userModel.findOne({ refreshToken: refreshToken });
  }
}
