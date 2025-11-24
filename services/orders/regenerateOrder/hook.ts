import { useMutation } from "@tanstack/react-query";
import { postRegenerateOrder } from "./api";

export const POST_REGENERATE_ORDER_QUERY_KEY = ["regenerateOrder"] as const;

export function usePostRegenerateOrder() {
  return useMutation({
    mutationKey: POST_REGENERATE_ORDER_QUERY_KEY,
    mutationFn: postRegenerateOrder,
  });
}
