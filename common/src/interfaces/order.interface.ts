import { IBase } from "./base.interface";
import { ITicket } from "./ticket.interface";
import { IUser } from "./user.interface";

export interface IOrder extends IBase {
  ticketId: ITicket["id"];
  userId: IUser["id"];
}
