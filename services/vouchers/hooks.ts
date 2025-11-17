import { useQuery } from "@tanstack/react-query";
import { getVoucher } from "./api";
import { Voucher } from "./type";

export const GET_VOUCHER_QUERY_KEY = ["getVoucher"] as const;

export function useGetVoucher() {
  return useQuery<Voucher[]>({
    queryKey: GET_VOUCHER_QUERY_KEY,
    queryFn: getVoucher,
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    retry: false,
  });
}
