import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "./api";

export const DELETE_PRODUCT_QUERY_KEY = ["deleteProduct"] as const;

export function useDeleteProduct() {
  return useMutation({
    mutationKey: DELETE_PRODUCT_QUERY_KEY,
    mutationFn: deleteProduct,
  });
}
