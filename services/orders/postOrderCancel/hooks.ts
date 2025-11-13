import { useMutation } from "@tanstack/react-query";
import { postOrderCancel } from "./api";

export const POST_ORDER_CANCEL_QUERY_KEY = ["orderCancel"] as const;

export function usePostOrderCancel() {
  return useMutation({
    mutationKey: POST_ORDER_CANCEL_QUERY_KEY,
    mutationFn: postOrderCancel,
  });
}
