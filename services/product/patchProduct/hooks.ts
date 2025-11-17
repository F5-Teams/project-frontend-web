import { useMutation } from "@tanstack/react-query";
import { patchProduct } from "./api";
import { PatchProduct, PatchProductParams } from "./type";

export const PATCH_PRODUCT_QUERY_KEY = ["patchProduct"] as const;

export function usePatchProduct() {
  return useMutation<PatchProduct, Error, PatchProductParams>({
    mutationKey: PATCH_PRODUCT_QUERY_KEY,
    mutationFn: patchProduct,
  });
}
