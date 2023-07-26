import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find();
  }

  async create(roleBody: CreateRoleDto): Promise<Role> {
    return await this.roleModel.create(roleBody);
  }

  async findByName(name: string): Promise<Role> {
    return await this.roleModel.findOne({ name: name });
  }
}
