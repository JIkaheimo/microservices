import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { catMock } from './cats.service.mock';
describe('CatsService', () => {
  let service: CatsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = moduleRef.get(CatsService);
  });

  describe('findAll', () => {
    it('should return empty array if there is no cats', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should return an array of cats if there is some', async () => {
      await service.create(catMock);
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });
});
