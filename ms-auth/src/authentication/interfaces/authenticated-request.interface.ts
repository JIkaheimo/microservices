import { Request } from 'express';
import { IUser } from 'src/users/user.interface';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}