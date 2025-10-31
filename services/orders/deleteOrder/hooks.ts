import { useMutation } from "@tanstack/react-query";
import { deleteOrder } from "./api";

export const DELETE_ORDER_QUERY_KEY = ["deleteOrder"] as const;

export function useDeleteOrder() {
  return useMutation({
    mutationKey: DELETE_ORDER_QUERY_KEY,
    mutationFn: deleteOrder,
  });
}
