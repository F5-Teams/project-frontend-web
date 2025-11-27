import { useQuery } from "@tanstack/react-query";
import { getOrderCustomerId } from "./api";
import { OrderCustomer } from "./type";

export const ORDER_CUSTOMER_ID_QUERYKEY = ["orderCustomerId"] as const;

export function useOrderCustomer(id?: number) {
  return useQuery<OrderCustomer[]>({
    queryKey: [...ORDER_CUSTOMER_ID_QUERYKEY, id],
    queryFn: () => getOrderCustomerId({ id: id! }),
    enabled: !!id,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
