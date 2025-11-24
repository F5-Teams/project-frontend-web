import { useMutation } from "@tanstack/react-query";
import { patchAddressDefault } from "./api";

export const PATCH_ADDRESS_DEFAULT_QUERY_KEY = ["addressDefault"] as const;
export function usePatchAddressDefault() {
  return useMutation({
    mutationKey: PATCH_ADDRESS_DEFAULT_QUERY_KEY,
    mutationFn: patchAddressDefault,
  });
}
