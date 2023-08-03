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
  async createUser(body: CreateUserDto): Promise<User> {
    let user = await this.userModel.findOne({ email: body?.email });
    if (!user) {
      return (await this.userModel.create(body)).populate('role');
    } else {
      return await user.populate('role');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).populate('role');
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User> {
    return await this.userModel.findOne({ refreshToken: refreshToken });
  }

  async updateUser(id: string, body: any): Promise<User> {
    const user: any = await this.userModel.findById(id);
    for (let key in body) {
      if (key === 'organization') {
        user[key] = user[key] ? [...user[key], body[key]] : [body[key]];
      } else if (key === 'role') {
        user[key] = user[key] ? [...user[key], body[key]] : [body[key]];
      } else user[key] = body[key];
    }
    return await user.save();
  }

  async getOrganizationByOwner(userId: string): Promise<any> {
    return await this.userModel
      .findById(userId)
      .populate('orginazations', '-__v -createdAt -updatedAt')
      .select('-organization -__v');
  }
}
