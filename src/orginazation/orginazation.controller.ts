import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Orginazation } from './schemas/orginazation.schema';
import { OrginazationService } from './orginazation.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt.gaurd';
import { Request, Response } from 'express';

@Controller('orginazation')
export class OrginazationController {
  constructor(private organazationService: OrginazationService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any, @Res() res: Response) {
    const orginazation = await this.organazationService.findAll();
    if (req.newIdToken) {
      res.status(200).json({ orginazation, idToken: req.newIdToken });
    } else {
      res.status(200).json({ orginazation });
    }
  }
}
