import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  SetMetadata,
} from '@nestjs/common';
import { Multer } from 'multer';
import { Request, Response } from 'express';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrginazationService } from './orginazation.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt.gaurd';
import { FirebaseService } from 'src/utils/upload';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/decorator/role.decorator';
import { RoleEnum } from 'src/enum/role.enum';

@Controller('orginazation')
export class OrginazationController {
  constructor(
    private organazationService: OrginazationService,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.OrganizationAdmin)
  async findAll(@Req() req: any, @Res() res: Response) {
    const orginazation = await this.organazationService.findAll();
    if (req.newIdToken) {
      res.status(200).json({ orginazation, idToken: req.newIdToken });
    } else {
      res.status(200).json({ orginazation });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Multer.File,
    @Body() body: CreateOrganizationDto,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const imageUrl = await this.firebaseService.uploadImage(file);
        body.avtUrl = imageUrl;
      } else {
        body.avtUrl = null;
      }
      body.isDeleted = false;
      const organization = await this.organazationService.create(body);
      await this.userService.updateUser(body?.createdBy, {
        role: process.env.ORGANIZATION_ADMIN,
        organization: organization?._id,
      });
      res.status(201).json({ organization });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string, @Res() res: Response) {
    await this.organazationService.deleteOrganization(id);
    res.status(204).json();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string, @Res() res: Response) {
    const organization = await this.organazationService.getById(id);
    res.status(200).json({ organization });
  }
}
