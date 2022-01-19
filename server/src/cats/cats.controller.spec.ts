import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { catMock, catsServiceMock } from './cats.service.mock';

describe('CatsController', () => {
  let controller: CatsController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    })
      .overrideProvider(CatsService)
      .useValue(catsServiceMock)
      .compile();

    controller = moduleRef.get(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      expect(await controller.findAll()).toEqual([catMock]);
    });
  });

  describe('create', () => {
    it('should return the created cat', async () => {
      expect(await controller.create(catMock)).toBe(catMock);
    });
  });

  describe('findOne', () => {
    it('should return the cat with the id', async () => {
      const id = randomUUID();
      expect(await controller.findOne(id)).toBe(catMock);
    });
  });

  describe('update', () => {
    it('should return the updated cat', async () => {
      const id = randomUUID();
      expect(await controller.update(id, catMock)).toBe(catMock);
    });
  });

  describe('remove', () => {
    it('should return undefined after deleting a cat', async () => {
      const id = randomUUID();
      expect(await controller.remove(id)).toBe(undefined);
    });
  });
});
