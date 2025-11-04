import api from "@/config/axios";

export interface DepositResponse {
  paymentUrl: string;
  vnpTxnRef: string;
  transactionId: number;
}

export interface DepositStatusResponse {
  status: "SUCCESS" | "PENDING" | "FAILED";
  message: string;
  transactionId?: number;
}

export const createDepositUrl = async (
  amount: number
): Promise<DepositResponse> => {
  const response = await api.post("/wallets/deposit/vnpay/create-url", {
    amount,
  });
  return response.data;
};

export const checkDepositStatus = async (
  vnpTxnRef: string
): Promise<DepositStatusResponse> => {
  const response = await api.get(`/wallets/deposit/vnpay/status/${vnpTxnRef}`);
  return response.data;
};
