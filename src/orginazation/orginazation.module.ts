import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrginazationController } from './orginazation.controller';
import { OrginazationService } from './orginazation.service';
import {
  Orginazation,
  OrginazationSchema,
} from './schemas/orginazation.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { FirebaseService } from 'src/utils/upload';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orginazation.name, schema: OrginazationSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [OrginazationController],
  providers: [OrginazationService, FirebaseService],
})
export class OrginazationModule {}
