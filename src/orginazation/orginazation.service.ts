import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Orginazation } from './schemas/orginazation.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrginazationService {
  constructor(
    @InjectModel(Orginazation.name)
    private orginazationModel: Model<Orginazation>,
  ) {}

  async findAll(): Promise<Orginazation[]> {
    return await this.orginazationModel.find();
  }

  async create(body: CreateOrganizationDto): Promise<Orginazation> {
    return await this.orginazationModel.create(body);
  }

  async deleteOrganization(id: string): Promise<void> {
    await this.orginazationModel.findByIdAndDelete(id);
  }

  async getById(id: string): Promise<Orginazation> {
    return await this.orginazationModel.findById(id);
  }
}
