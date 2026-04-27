import { Test, TestingModule } from '@nestjs/testing';
import { ProgramInfoController } from './program-info.controller';

describe('ProgramInfoController', () => {
  let controller: ProgramInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramInfoController],
    }).compile();

    controller = module.get<ProgramInfoController>(ProgramInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
