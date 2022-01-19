import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Cat } from './interfaces';

@Injectable()
export class CatsService {
  private readonly cats: { [id: string]: Cat } = {};

  async create(cat: Cat): Promise<Cat> {
    const id = randomUUID();
    this.cats[id] = cat;
    return this.cats[id];
  }

  async findAll(): Promise<Cat[]> {
    return Object.values(this.cats);
  }

  async findOne(id: string): Promise<Cat> {
    return this.cats[id];
  }

  async update(id: string, cat: Cat): Promise<Cat> {
    this.cats[id] = cat;
    return this.cats[id];
  }

  async remove(id: string): Promise<void> {
    delete this.cats[id];
  }
}
