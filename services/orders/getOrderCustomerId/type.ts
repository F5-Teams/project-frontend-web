export interface OrderCustomer {
  id: number;
  status:
    | "PENDING"
    | "PAID"
    | "APPROVED"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUND"
    | "REFUND_DONE"
    | "FAILED"
    | "COMPLETED";
  totalPrice: string;
  note: string | null;
  createdAt: string;
  customerId: number;
  customer: Customer;
  orderDetails: OrderDetail[];
  shipping: Shipping;
  payment: Payment;
  voucherPercent?: number | null;
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
  weight: string;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  type: string | null;
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
  note: string | null;
  status: string;
  orderId: number;
  failureReason: string;
}

export interface Payment {
  id: number;
  paymentMethod: PaymentMethod; // CASH / VNPAY / MOMO ...
  amount: string;
  totalAmount: string;
  status: string; // PENDING / PAID / FAILED ...
  createdAt: string;
  orderId: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
}
