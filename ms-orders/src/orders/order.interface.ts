import { IBase, ITicket, IUser } from '@jikaheimo/common';

export interface IOrder extends IBase {
  ticketId: ITicket['id'];
  userId: IUser['id'];
}
