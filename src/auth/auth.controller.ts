import {
  Body,
  Controller,
  ForbiddenException,
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
    const { idToken } = await this.authService.getIdTokenFromCode(code);
    let userInfor = await this.authService.getUserInfo(idToken);
    const userBody: CreateUserDto = {
      role: [process.env.COMMON_USER],
      organization: null,
      name: userInfor?.name,
      email: userInfor?.email,
      avtUrl: userInfor?.picture,
    };
    userInfor = await this.userService.createUser(userBody);
    const accessToken = this.authService.createAccessToken({
      sub: userInfor._id,
      username: userInfor.name,
    });
    const refreshToken = this.authService.createRefreshToken({
      sub: userInfor._id,
      username: userInfor.name,
    });
    res.status(200).json({ userInfor, accessToken, refreshToken });
  }

  @Post('refresh')
  async refreshIdToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body('refresh-token') refreshToken: string,
  ) {
    if (!this.authService.validateCanRenewToken(refreshToken)) {
      // Kiểm tra nếu thời gian hiện tại không được phép yêu cầu token mới thì thông báo lỗi ra cho người dùng
      throw new ForbiddenException(
        'Access token is still valid, can not renew now!',
      );
    }
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      this.authService.removeToken(refreshToken);
      const newAccessTokenExpireIn = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
      this.authService.storeToken(refreshToken, newAccessTokenExpireIn);
      res.status(200).json({ accessToken });
    }
  }
}
