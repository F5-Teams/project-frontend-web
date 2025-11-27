import { useQuery } from "@tanstack/react-query";
import { getWallet } from "./index";
import { getTransactionHistory } from "./api";
import { TransactionHistoryParams } from "./type";

export const useGetWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTransactionHistory = (params?: TransactionHistoryParams) => {
  return useQuery({
    queryKey: ["transaction-history", params],
    queryFn: () => getTransactionHistory(params),
    staleTime: 1000 * 60 * 2,
  });
};
