export enum OrderStatus {
  /**
   *  When the order has been created, but the ticket it is trying to order
   * has not been reserved.
   */
  Created = "created",

  /**
   * The ticket being ordered has been already reserved, or when the user
   * has cancelled the order.
   */
  Cancelled = "cancelled",

  /**
   * The order has successfully reserved the ticket.
   */
  AwaitingPayment = "awaiting-payment",

  /**
   * The order has reserved the ticket and the user has provided payment
   * successfully.
   */
  Complete = "complete",
}
