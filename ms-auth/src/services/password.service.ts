import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  static async hash(password: string) {
    return await hash(password, 10);
  }

  async compare(password: string, passwordHash: string) {
    return await compare(password, passwordHash);
  }
}
