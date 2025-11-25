export interface Transaction {
  id: number;
  amount: string;
  type: "PAYMENT" | "REFUND" | "TOP_UP" | "WITHDRAWAL";
  balanceAfter: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  createdAt: string;
  payosOrderCode: string | null;
  vnpTxnRef: string | null;
  walletId: number;
  paymentId: number | null;
}

export interface Wallet {
  id: number;
  balance: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  createdAt: string;
  userId: number;
  transactions: Transaction[];
}

export type TransactionType =
  | "WALLET_PAYMENT"
  | "WALLET_REFUND"
  | "BOOKING_PAYMENT"
  | "ORDER_PAYMENT"
  | "WITHDRAW";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "WALLET"
  | "MOMO"
  | "VNPAY";

export interface TransactionHistoryItem {
  id: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  description: string;
  createdAt: string;
  bookingId?: number | null;
  bookingCode?: string | null;
  balanceAfter: number;
  orderId?: number | null;
}

export interface TransactionHistoryParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
