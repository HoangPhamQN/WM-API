import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Role } from './schemas/role.schema';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get()
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Post()
  async create(@Body() roleBody: CreateRoleDto, @Res() res: Response) {
    try {
      let newRole = await this.roleService.create(roleBody);
      return res.status(201).json({ data: newRole });
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
