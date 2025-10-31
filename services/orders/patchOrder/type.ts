export interface CreateOrderRequest {
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  note: string;
  customerId: number;
  shipping: ShippingRequest;
  paymentMethod: "CASH" | "BANK" | "MOMO" | "ZALOPAY";
  orderDetails: OrderDetailRequest[];
  shippingStatus: "PENDING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
}

export interface ShippingRequest {
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

export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}

export interface PatchOrder {
  id: number;
  body: CreateOrderRequest;
}
