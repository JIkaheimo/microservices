import { OrderStatus } from "../enums";
import { IBase } from "./base.interface";
import { ITicket } from "./ticket.interface";
import { IUser } from "./user.interface";

export interface IOrder extends IBase {
  status: OrderStatus;
  expiresAt: Date;
  ticketId: ITicket["id"];
  userId: IUser["id"];
  isReserved: boolean;
}
