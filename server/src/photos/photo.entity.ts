import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { Author } from './author.entity';
import { PhotoMetadata } from './photo-metadata.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('double')
  views: number;

  @Column()
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @ManyToOne(() => Author, (author) => author.photos)
  author: Author;

  @OneToOne(() => PhotoMetadata, (metadata) => metadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;

  @ManyToMany(() => Album, (album) => album.photos)
  albums: Album[];
}
