import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
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
    console.log(3333, tokens);
    const idToken = tokens.id_token;

    return { idToken };
  }

  async getUserInfo(idToken: string): Promise<any> {
    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: this.clientId, // Thay thế CLIENT_ID bằng Client ID của ứng dụng Google
    });

    const payload = ticket.getPayload();
    return payload;
  }

  async isIdTokenExpired(idToken: string): Promise<boolean> {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: idToken,
        audience: this.clientId, // Thay thế CLIENT_ID bằng Client ID của ứng dụng Google
      });

      const payload = ticket.getPayload();
      const currentTime = Math.floor(Date.now() / 1000);

      return currentTime >= payload.exp;
    } catch (error) {
      // Token verification failed or token is malformed
      return true;
    }
  }

  async refreshIdToken(refreshToken: string): Promise<string> {
    const clientId = this.clientId;
    const clientSecret = this.clientSecret;
    const user = await this.userService.getUserByRefreshToken(refreshToken);
    if (!user) {
      return null;
    }
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    });
    return response?.data?.id_token ? response?.data?.id_token : null;
  }

  public createAccessToken(payload: any): string {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  public createRefreshToken(payload: any): string {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRE;
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }
}
