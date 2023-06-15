import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Orginazation } from './schemas/orginazation.schema';

@Injectable()
export class OrginazationService {
  constructor(
    @InjectModel(Orginazation.name)
    private orginazationModel: Model<Orginazation>,
  ) {}

  async findAll(): Promise<Orginazation[]> {
    return await this.orginazationModel.find();
  }
}
