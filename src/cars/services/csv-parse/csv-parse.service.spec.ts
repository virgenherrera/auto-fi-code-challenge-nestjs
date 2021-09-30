import { Test, TestingModule } from '@nestjs/testing';
import { CsvParseService } from './csv-parse.service';

describe('CsvParseService', () => {
  let service: CsvParseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvParseService],
    }).compile();

    service = module.get<CsvParseService>(CsvParseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
