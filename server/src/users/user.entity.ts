import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Photo } from '../photos/photo.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  username: string;

  @Column('simple-array')
  names: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'set',
    enum: UserRole,
    default: [UserRole.GHOST, UserRole.EDITOR],
  })
  roles: UserRole[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
