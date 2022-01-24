import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/config';
import { getConnection } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Users Module Integration', () => {
  let controller: UsersController;

  beforeAll(async () => {
    const usersModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = usersModule.get(UsersController);
  });

  const getOneUserFromDb = async () => {
    return await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .getOne();
  };

  const initDatabase = async () => {
    const connection = await getConnection();

    await connection.createQueryBuilder().delete().from(User).execute();

    return connection;
  };

  afterAll(async () => {
    const connection = await initDatabase();
    await connection.close();
  });

  describe('create() - Create a new user inside database', () => {
    const userData = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('Create a new user with the correct properties', async () => {
      await controller.create(userData);
      const user = await getOneUserFromDb();
      expect(user.email).toBe(user.email);
    });
  });
});
