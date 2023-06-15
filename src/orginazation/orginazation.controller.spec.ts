import { Test, TestingModule } from '@nestjs/testing';
import { OrginazationController } from './orginazation.controller';

describe('OrginazationController', () => {
  let controller: OrginazationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrginazationController],
    }).compile();

    controller = module.get<OrginazationController>(OrginazationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
