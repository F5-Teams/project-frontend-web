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
