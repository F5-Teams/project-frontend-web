import { useQuery } from "@tanstack/react-query";
import { getVoucher } from "./api";

export const GET_VOUCHER_QUERY_KEY = ["getVoucher"] as const;

export function useGetVoucher() {
  return useQuery({
    queryKey: GET_VOUCHER_QUERY_KEY,
    queryFn: getVoucher,
  });
}
