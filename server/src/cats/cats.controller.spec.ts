import { Test, TestingModule } from '@nestjs/testing';
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
});
