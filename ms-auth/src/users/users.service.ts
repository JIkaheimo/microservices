import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './entities/user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<IUser>,
  ) {}

  /**
   * Creates and returns a new user with the given user data.
   */
  async create(userData: IUser): Promise<IUser> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  /**
   * Returns the user with the given email.
   */
  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ?? null;
  }

  /**
   * Returns the user with the given id.
   *
   * @throws {EntityNotFound}
   */
  async findById(id: IUser['id'], options?: FindOneOptions<IUser>) {
    const user = await this.repository.findOne(id, options);
    if (!user) throw new EntityNotFound(this.repository);
    return user;
  }

  /**
   * Updates the user with the given id with given user data.
   */
  async update(id: User['id'], userData: QueryDeepPartialEntity<IUser>) {
    await this.repository.update(id, userData);
    return await this.findById(id);
  }

  /**
   * Deletes the user with the given id.
   */
  async delete(id: IUser['id']) {
    const { affected } = await this.repository.softDelete(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }

  async restore(id: IUser['id']) {
    const { affected } = await this.repository.restore(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }
}

export class EntityNotFound extends NotFoundException {
  constructor(repository: Repository<unknown>) {
    const { tableName } = repository.metadata;
    super(`${tableName} with the given id does not exist`);
  }
}
