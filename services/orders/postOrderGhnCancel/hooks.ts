import { useMutation } from "@tanstack/react-query";
import { postOrderGhnCancel } from "./api";

export const POST_ORDER_GHN_CANCEL_QUERY_KEY = ["postOrderGhnCancel"] as const;

export function usePostOrderGhnCancel() {
  return useMutation({
    mutationKey: POST_ORDER_GHN_CANCEL_QUERY_KEY,
    mutationFn: postOrderGhnCancel,
  });
}
