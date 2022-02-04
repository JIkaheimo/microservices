import { ConfigModule, DatabaseModule } from '@jikaheimo/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersModule', () => {
  let controller: UsersController;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule.forRootAsync(),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = await moduleFixture.resolve(UsersController);
    usersRepository = getRepository(User);
  });

  describe('create() - Create a new user inside database', () => {
    const userData = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('Create a new user with the correct properties', async () => {
      await controller.create(userData);
      const users = await usersRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email);
    });
  });
});
