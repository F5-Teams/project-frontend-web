import { useQuery } from "@tanstack/react-query";
import { getAllOrder } from "./api";

export const GET_ALL_ORDER_QUERY_KEY = ["allOrder"] as const;

export function useGetAllOrder() {
  return useQuery({
    queryKey: GET_ALL_ORDER_QUERY_KEY,
    queryFn: getAllOrder,
  });
}
