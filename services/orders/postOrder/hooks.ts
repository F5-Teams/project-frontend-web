import { useMutation } from "@tanstack/react-query";
import { postOrder } from "./api";

export const POST_ORDER_QUERY_KEY = ["createOrder"] as const;

export function usePostOrder() {
  return useMutation({
    mutationKey: POST_ORDER_QUERY_KEY,
    mutationFn: postOrder,
  });
}
