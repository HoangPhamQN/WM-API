import { Test, TestingModule } from '@nestjs/testing';
import { OrginazationService } from './orginazation.service';

describe('OrginazationService', () => {
  let service: OrginazationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrginazationService],
    }).compile();

    service = module.get<OrginazationService>(OrginazationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
