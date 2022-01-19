import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Author } from './author.entity';
import { PhotoMetadata } from './photo-metadata.entity';
import { Photo } from './photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, PhotoMetadata, Author, Album])],
  exports: [TypeOrmModule],
})
export class PhotosModule {}
