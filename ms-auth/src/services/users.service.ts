import { EntityCrudService } from '@jikaheimo/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService extends EntityCrudService<User> {
  constructor(
    @InjectRepository(User)
    readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  /**
   * Returns the user with the given email.
   */
  async findByEmail(email: User['email']): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ?? null;
  }
}
