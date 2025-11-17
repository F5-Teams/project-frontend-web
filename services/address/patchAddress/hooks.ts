import { useMutation } from "@tanstack/react-query";
import { Address } from "./type";
import { patchAddress, PatchAddressParams } from "./api";

export const PATCH_ADDRESS_QUERY_KEY = ["patchAddress"] as const;

export function usePatchAddress() {
  return useMutation<Address, unknown, PatchAddressParams>({
    mutationKey: PATCH_ADDRESS_QUERY_KEY,
    mutationFn: (params: PatchAddressParams) => patchAddress(params),
  });
}
