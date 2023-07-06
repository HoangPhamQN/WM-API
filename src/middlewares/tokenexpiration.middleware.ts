import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenExpirationMiddleware implements NestMiddleware {
  constructor(private readonly googleAuthService: AuthService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const idToken = req.user?.idToken;
    if (!idToken) {
      res.status(403).json({ message: 'Vui lòng đăng nhập!' });
    }

    if (idToken && (await this.googleAuthService.isIdTokenExpired(idToken))) {
      const refreshToken = req.user?.refreshToken;
      const newIdToken = await this.googleAuthService.refreshAccessToken(
        refreshToken,
      );

      // Cập nhật access token mới trong req.user để sử dụng trong các request tiếp theo
      req.user.accessToken = newIdToken;
    }

    next();
  }
}
