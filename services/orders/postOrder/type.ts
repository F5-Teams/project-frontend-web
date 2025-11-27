export interface OrderDetails {
  productId: number;
  quantity: number;
}

export interface Shipping {
  toName: string;
  toPhone: string;
  toAddress: string;
  toWardCode: string;
  toDistrictId: number;
  toWardName: string;
  toDistrictName: string;
  toProvinceName: string;
  serviceTypeId: number;
  paymentTypeId: number;
  requiredNote: string;
  length: number;
  width: number;
  height: number;
  codAmount: number;
  insuranceValue: number;
  note: string;
}

export interface Orders {
  status: string;
  note: string;
  customerId?: number;
  orderDetails: OrderDetails[];
  shipping?: Shipping;
  paymentMethod: "CASH" | "WALLET" | "MOMO" | "VNPAY";
  addressId?: number;
  voucherCode?: string;
  vnpUrl?: string;
  momoUrl?: string;
  totalPrice?: number;
  shippingFee?: number;
}

export interface CreateOrderResponse {
  vnpUrl?: string;
  momoUrl?: string;
}
