export interface Order {
  id: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED"
    | "FAILED";
  totalPrice: string;
  note: string;
  createdAt: string;
  customerId: number;
  customer: Customer;
  orderDetails: OrderDetail[];
  shipping: Shipping;
  payment: Payment;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface OrderDetail {
  id: number;
  quantity: number;
  orderId: number;
  productId: number;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  price: string;
}

export interface Shipping {
  id: number;
  createdAt: string;
  updatedAt: string;
  ghnOrderCode: string | null;
  ghnStatus: string | null;
  ghnExpectedDelivery: string | null;
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
  weight: number;
  length: number;
  width: number;
  height: number;
  codAmount: string;
  insuranceValue: string;
  shippingFee: string;
  note: string;
  deliveryProofImage: string;
  status: "PENDING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  orderId: number;
}

export interface Payment {
  id: number;
  paymentMethod: "CASH" | "BANK" | "MOMO" | "ZALOPAY";
  amount: string;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  orderId: number;
}
