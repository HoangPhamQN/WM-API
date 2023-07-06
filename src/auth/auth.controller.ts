import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth/google')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    const url = this.authService.getAuthorizationUrl();
    res.status(200).json({
      redirectUrl: url,
    });
  }

  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const { refreshToken, idToken } = await this.authService.getIdTokenFromCode(
      code,
    );
    const userInfor = await this.authService.getUserInfo(idToken);
    await this.userService.createUser({ refreshToken, email: userInfor.email });
    res.status(200).json({ userInfor, idToken });
  }
}
