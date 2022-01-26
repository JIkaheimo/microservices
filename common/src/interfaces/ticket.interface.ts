import { IBase } from "./base.interface";
import { IUser } from "./user.interface";

export interface ITicket extends IBase {
  title: string;
  price: number;
  userId: IUser["id"];
}
