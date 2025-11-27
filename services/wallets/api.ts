import api from "@/config/axios";
import { TransactionHistoryParams, TransactionHistoryResponse } from "./type";

export async function getTransactionHistory(
  params?: TransactionHistoryParams
): Promise<TransactionHistoryResponse> {
  const { data } = await api.get<TransactionHistoryResponse>(
    "/transactions/history/my",
    { params }
  );
  return data;
}
