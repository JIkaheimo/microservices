import { IOrder } from "src/interfaces";

export interface OrderCreated {
  id: IOrder["id"];
  status: IOrder["status"];
  userId: IOrder["userId"];
  expiresAt: IOrder["expiresAt"];
}
