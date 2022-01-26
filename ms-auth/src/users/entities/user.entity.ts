import { IUser } from '@jikaheimo/common';
import { Exclude } from 'class-transformer';
import { PasswordService } from 'src/authentication/password.service';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  readonly email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @Exclude()
  private _password?: string = null;

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
