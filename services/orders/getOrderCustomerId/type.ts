export interface OrderCustomer {
  id: number;
  status: "PENDING" | "APPROVED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  totalPrice: string;
  note: string | null;
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
  weight: string; // ✅ bổ sung đúng như data trả về
  images: ProductImage[]; // ✅ thêm danh sách hình ảnh
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
  paymentMethod: string; // CASH / VNPAY / MOMO ...
  amount: string;
  status: string; // PENDING / PAID / FAILED ...
  createdAt: string;
  orderId: number;
}
