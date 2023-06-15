import { Controller, Get } from '@nestjs/common';
import { Orginazation } from './schemas/orginazation.schema';
import { OrginazationService } from './orginazation.service';

@Controller('orginazation')
export class OrginazationController {
  constructor(private organazationService: OrginazationService) {}
  @Get()
  findAll(): Promise<Orginazation[]> {
    return this.organazationService.findAll();
  }
}
