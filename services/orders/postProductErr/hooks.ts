import { useMutation } from "@tanstack/react-query";
import { postProductErr } from "./api";

export const POST_PRODUCT_ERR_QUERY_KEY = ["productErr"] as const;

export function usePostProductErr() {
  return useMutation({
    mutationKey: POST_PRODUCT_ERR_QUERY_KEY,
    mutationFn: postProductErr,
  });
}
