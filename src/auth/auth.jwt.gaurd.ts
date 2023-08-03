import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from 'src/decorator/role.decorator';
import { RoleEnum } from 'src/enum/role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      throw new UnauthorizedException('Unauthorized!');
    }
    const accessToken = bearerToken.replace('Bearer ', '');
    try {
      const decodedToken: any = jwt.verify(accessToken, process.env.JWT_SECRET);
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      const currentUser = await this.userService.getUserById(decodedToken.sub);
      const userRole = currentUser.role.map((item) => item.name);
      const hasRequiredRole = userRole.some((role) =>
        requiredRoles.includes(role),
      );
      if (!hasRequiredRole) {
        return false;
      }
      return true;
    } catch (error) {
      // hàm verify bên trên sẽ bắn ra error nếu token hết hạn, kiểm tra nếu lỗi do token hết hạn
      // thì lấy lại token bằng refresh token thông qua api resfresh accessToken
      return false;
    }
  }
}
