import { IUser } from '@jikaheimo/common';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
