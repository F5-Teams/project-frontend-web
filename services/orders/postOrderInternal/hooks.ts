import { useMutation } from "@tanstack/react-query";
import { postOrderInternal } from "./api";

export const POST_ORDER_INTERNAL_QUERY_KEY = ["createOrderInternal"] as const;

export function usePostOrderInternal() {
  return useMutation({
    mutationKey: POST_ORDER_INTERNAL_QUERY_KEY,
    mutationFn: postOrderInternal,
  });
}
