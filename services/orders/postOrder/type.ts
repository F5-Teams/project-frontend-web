export interface OrderDetails {
  productId: number;
  quantity: number;
}

export interface Orders {
  status: string;
  note: string;
  customerId?: number;
  orderDetails: OrderDetails[];
  addressId: number;
  paymentMethod: "CASH" | "TRANSFER" | "VNPAY";
  voucherCode?: string;
}

export interface CreateOrderResponse {
  vnpUrl: string;
}
