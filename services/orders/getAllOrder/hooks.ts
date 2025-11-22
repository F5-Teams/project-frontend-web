import { useQuery } from "@tanstack/react-query";
import { getAllOrder } from "./api";
import { GetAllOrderResponse } from "./type";

export const GET_ALL_ORDER_QUERY_KEY = ["getAllOrder"] as const;

export function useGetAllOrder() {
  return useQuery<GetAllOrderResponse>({
    queryKey: GET_ALL_ORDER_QUERY_KEY,
    queryFn: getAllOrder,
  });
}
