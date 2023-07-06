import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly oAuth2Client: OAuth2Client;

  constructor(private readonly userService: UserService) {
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.redirectUri = process.env.REDIRECT_URI;
    this.oAuth2Client = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const clientId = this.clientId;
    const clientSecret = this.clientSecret;

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    });

    const accessToken = response.data.id_token;
    return accessToken;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const bearerToken = request.headers.authorization;
    const userInfor = JSON.parse(request.headers.user);
    if (!bearerToken) {
      return false; // Nếu không có Bearer Token, từ chối yêu cầu
    }

    const idToken = bearerToken.replace('Bearer ', ''); // Loại bỏ tiền tố "Bearer " để chỉ lấy id_token
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: idToken,
        audience: this.clientId,
      });

      return true;
    } catch (error) {
      // hàm verifyIdToken bên trên sẽ bắn ra error nếu token hết hạn, kiểm tra nếu lỗi do token hết hạn
      // thì lấy lại token bằng refresh token
      if (error?.message?.includes('Token used too late')) {
        const user = await this.userService.getUserByEmail(userInfor.email);
        const newIdToken = await this.refreshAccessToken(user.refreshToken);
        // sau khi lấy được idToken mới từ refreshToken thì lưu nó vào request.newIdToken
        // ở các controller check nếu tồn tại newIdToken trong request thì lúc gửi data ra client gửi kèm theo idToken
        // để bên FE có thể lấy và sử dụng cho các request tiếp theo
        request.newIdToken = newIdToken;
        return true;
      }

      return false;
    }
  }
}
