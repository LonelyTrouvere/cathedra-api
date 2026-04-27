import { Test, TestingModule } from '@nestjs/testing';
import { ProgramInfoService } from './program-info.service';

describe('ProgramInfoService', () => {
  let service: ProgramInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramInfoService],
    }).compile();

    service = module.get<ProgramInfoService>(ProgramInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
