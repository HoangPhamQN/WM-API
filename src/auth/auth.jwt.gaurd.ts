import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly oAuth2Client: OAuth2Client;

  constructor() {
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.redirectUri = process.env.REDIRECT_URI;
    this.oAuth2Client = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    });
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      return false; // Nếu không có Bearer Token, từ chối yêu cầu
    }
    const accessToken = bearerToken.replace('Bearer ', '');
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      // hàm verify bên trên sẽ bắn ra error nếu token hết hạn, kiểm tra nếu lỗi do token hết hạn
      // thì lấy lại token bằng refresh token thông qua api resfresh accessToken
      return false;
    }
  }
}
