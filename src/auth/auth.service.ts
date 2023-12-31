import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/utils/token';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly oAuth2Client: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    this.clientId = process.env.CLIENT_ID;
    this.clientSecret = process.env.CLIENT_SECRET;
    this.redirectUri = process.env.REDIRECT_URI;
    this.oAuth2Client = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    });
  }

  getAuthorizationUrl(): string {
    const scopes = ['email', 'profile']; // Add any additional scopes you need
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: process.env.ACCESS_TYPE,
      scope: scopes,
    });

    return authUrl;
  }

  async getIdTokenFromCode(code: string): Promise<any> {
    const { tokens } = await this.oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    return { idToken };
  }

  async getUserInfo(idToken: string): Promise<any> {
    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();
    return payload;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decodedToken: any = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
      );
      const payload = {
        sub: decodedToken.sub,
        username: decodedToken.username,
      };
      const expiresIn = process.env.ACCESS_TOKEN_EXPIRE;
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    } catch (error) {
      return null;
    }
  }

  public createAccessToken(payload: any): string {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE;
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });
    return accessToken;
  }

  public createRefreshToken(payload: any): string {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRE;
    const accessTokenExpiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });
    this.tokenService.storeToken(refreshToken, accessTokenExpiresIn);
    return refreshToken;
  }

  public validateCanRenewToken(token: string): boolean {
    // Kiểm tra xem thời gian hiện tại có được phép cấp token mới không
    return this.tokenService.canRenewToken(token);
  }

  public removeToken(token: string): void {
    this.tokenService.removeToken(token);
  }

  public storeToken(token: string, expiresIn: number): void {
    this.tokenService.storeToken(token, expiresIn);
  }
}
