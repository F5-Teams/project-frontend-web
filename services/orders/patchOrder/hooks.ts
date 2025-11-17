import { useMutation } from "@tanstack/react-query";
import { patchOrder } from "./api";

export const PATCH_ORDER_QUERY_KEY = ["patchOrder"] as const;

export function usePatchOrder() {
  return useMutation({
    mutationKey: PATCH_ORDER_QUERY_KEY,
    mutationFn: patchOrder,
  });
}
