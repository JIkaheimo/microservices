import { BaseEntity, IUser } from '@jikaheimo/common';
import { Exclude } from 'class-transformer';
import { PasswordService } from 'src/services/password.service';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
} from 'typeorm';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ nullable: false })
  @Index({ unique: true })
  readonly email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Exclude()
  private _password?: string = null;

  /**
   * Stashes the password hash after loading the entity to generate
   * a new hashed password if it has been changed.
   */
  @AfterLoad()
  stashPassword() {
    this._password = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password === this._password) {
      return;
    }
    this.password = await PasswordService.hash(this.password);
  }
}
