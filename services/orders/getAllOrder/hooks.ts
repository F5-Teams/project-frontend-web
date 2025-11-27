import { useQuery } from "@tanstack/react-query";
import { getAllOrder, GetAllOrderParams } from "./api";
import { GetAllOrderResponse } from "./type";

export const GET_ALL_ORDER_QUERY_KEY = ["getAllOrder"] as const;

export function useGetAllOrder(params?: GetAllOrderParams) {
  return useQuery<GetAllOrderResponse>({
    queryKey: [...GET_ALL_ORDER_QUERY_KEY, params],
    queryFn: () => getAllOrder(params),
  });
}
