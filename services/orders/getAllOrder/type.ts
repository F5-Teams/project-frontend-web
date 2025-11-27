export interface Order {
  id: number;
  status:
    | "PAID"
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "COMPLETED"
    | "APPROVED"
    | "CANCELLED"
    | "REFUND"
    | "REFUND_DONE"
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

export interface ProductImage {
  id: number;
  imageUrl: string;
  type: string | null;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  weight: string;
  images: ProductImage[];
}

export interface Shipping {
  id: number;
  createdAt: string;
  updatedAt: string;
  provider?: string;
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
  deliveryProofImage: string | null;
  deliveredAt: string | null;
  failureReason: string | null;
  status: "PENDING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  orderId: number;
}

export interface Payment {
  id: number;
  paymentMethod: "CASH" | "BANK" | "MOMO" | "ZALOPAY" | "TRANSFER" | "VNPAY";
  amount: string;
  totalAmount: string;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  orderId: number;
  vnpTxnRef?: string | null;
  momoRequestId?: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllOrderResponse {
  data: Order[];
  pagination: Pagination;
}
