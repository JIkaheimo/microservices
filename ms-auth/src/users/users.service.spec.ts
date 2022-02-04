import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegistrationData } from 'src/authentication/dto/registration-data.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const userData: RegistrationData = {
  email: 'test@test.com',
  password: '123123',
};

describe('UsersService', () => {
  let service: UsersService;
  let create: jest.Mock;
  let save: jest.Mock;

  beforeAll(async () => {
    create = jest.fn().mockResolvedValue(userData);
    save = jest.fn().mockResolvedValue(userData);

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create,
            save,
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() - It should save a new user with hashed password', async () => {
    const userData: RegistrationData = {
      email: 'test@test.com',
      password: '123123',
    };

    const createdUser = await service.create(userData);

    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(userData.email);
  });
});
