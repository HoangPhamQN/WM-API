import {
  Controller,
  Get,
  Res,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id/organizations')
  async create(@Res() res: Response, @Param('id') userId: string) {
    try {
      let organization = await this.userService.getOrganizationByOwner(userId);
      return res.status(201).json({ data: organization });
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException(
          'Lỗi trùng lặp dữ liệu, vui lòng kiểm tra lại!',
        );
      } else {
        throw new BadRequestException(
          'Không thể tạo mới Role, vui lòng kiểm tra lại!',
        );
      }
    }
  }
}
