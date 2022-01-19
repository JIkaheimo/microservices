import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CatsController } from './cats.controller';

describe('CatsController', () => {
  let controller: CatsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CatsController],
    }).compile();

    controller = module.get(CatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return "This action returns all cats"', () => {
      expect(controller.findAll()).toBe('This action returns all cats');
    });
  });

  describe('create', () => {
    it('should return "This action adds a new cat"', () => {
      expect(controller.create()).toBe('This action adds a new cat');
    });
  });
  describe('findOne', () => {
    it('should return "This action returns a #{id} cat"', () => {
      const id = randomUUID();
      expect(controller.findOne(id)).toBe(`This action returns a #${id} cat`);
    });
  });

  describe('getDocs', () => {
    it('should return undefined when version is omitted', () => {
      expect(controller.getDocs()).toBeUndefined();
    });
    it('should return url when version is 5', () => {
      expect(controller.getDocs(5)).toHaveProperty(
        'url',
        'https://docs.nestjs.com/v5/',
      );
    });
  });
});
