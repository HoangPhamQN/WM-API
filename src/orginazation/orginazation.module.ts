import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrginazationController } from './orginazation.controller';
import { OrginazationService } from './orginazation.service';
import {
  Orginazation,
  OrginazationSchema,
} from './schemas/orginazation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orginazation.name, schema: OrginazationSchema },
    ]),
  ],
  controllers: [OrginazationController],
  providers: [OrginazationService],
})
export class OrginazationModule {}
