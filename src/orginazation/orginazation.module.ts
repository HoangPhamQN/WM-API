import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import { OrginazationController } from './orginazation.controller';
import { OrginazationService } from './orginazation.service';
import {
  Orginazation,
  OrginazationSchema,
} from './schemas/orginazation.schema';
import { JwtAuthGuard } from 'src/auth/auth.jwt.gaurd';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orginazation.name, schema: OrginazationSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [OrginazationController],
  providers: [OrginazationService],
})
export class OrginazationModule {}
