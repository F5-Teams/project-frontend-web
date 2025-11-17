import { useMutation } from "@tanstack/react-query";
import { postProduct } from "./api";

export const POST_PRODUCT_QUERY_KEY = ["postProduct"] as const;

export function usePostProduct() {
  return useMutation({
    mutationKey: POST_PRODUCT_QUERY_KEY,
    mutationFn: postProduct,
  });
}
