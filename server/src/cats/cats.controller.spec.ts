import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

const cat = { age: 1, breed: 'Tabby', name: 'Viljo' };

const catsServiceMock = {
  findAll: async () => [cat],
  create: async () => cat,
  findOne: async () => cat,
  update: async () => cat,
  remove: async () => {
    return;
  },
};

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
      expect(await controller.findAll()).toStrictEqual([cat]);
    });
  });

  describe('create', () => {
    it('should return the created cat', async () => {
      expect(await controller.create(cat)).toBe(cat);
    });
  });

  describe('findOne', () => {
    it('should return the cat with the id', async () => {
      const id = randomUUID();
      expect(await controller.findOne(id)).toBe(cat);
    });
  });

  describe('update', () => {
    it('should return the updated cat', async () => {
      const id = randomUUID();
      expect(await controller.update(id, cat)).toBe(cat);
    });
  });

  describe('remove', () => {
    it('should return undefined after deleting a cat', async () => {
      const id = randomUUID();
      expect(await controller.remove(id)).toBe(undefined);
    });
  });
});
