import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth/google')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private roleService: RoleService,
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
    console.log(1111, refreshToken);
    let userInfor = await this.authService.getUserInfo(idToken);
    const userBody: CreateUserDto = {
      role: [process.env.COMMON_USER],
      organization: null,
      name: userInfor?.name,
      email: userInfor?.email,
      avtUrl: userInfor?.picture,
      refreshToken: refreshToken,
    };
    console.log(2222, userBody);
    userInfor = await this.userService.createOrUpdateUser(userBody);
    res.status(200).json({ userInfor, idToken, refreshToken });
  }

  @Post('refresh')
  async refreshIdToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body('refresh-token') refreshToken: string,
  ) {
    const idToken = await this.authService.refreshIdToken(refreshToken);
    if (!idToken) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(200).json({ idToken });
    }
  }
}
