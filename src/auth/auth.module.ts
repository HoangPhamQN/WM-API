import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './auth.jwt.gaurd';
import { OAuth2Client } from 'google-auth-library';
import { RoleModule } from 'src/role/role.module';
import { TokenService } from 'src/utils/token';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, OAuth2Client, TokenService],
  exports: [AuthService, JwtAuthGuard, OAuth2Client],
  imports: [UserModule, RoleModule],
})
export class AuthModule {}
