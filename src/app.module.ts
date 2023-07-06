import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrginazationModule } from './orginazation/orginazation.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenExpirationMiddleware } from './middlewares/tokenexpiration.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), // Import ConfigModule to access environment variables
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_URI,
      }),
    }),
    OrginazationModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(TokenExpirationMiddleware)
  //     .exclude(
  //       { path: 'auth/google/login', method: RequestMethod.GET },
  //       { path: 'auth/google/callback', method: RequestMethod.GET },
  //     )
  //     .forRoutes('*');
  // }
}
