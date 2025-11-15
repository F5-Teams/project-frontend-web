import { useMutation } from "@tanstack/react-query";
import { Address } from "./type";
import { patchAddress } from "./api";

export const PATCH_ADDRESS_QUERY_KEY = ["patchAddress"] as const;

export function usePatchAddress() {
  return useMutation<Address>({
    mutationKey: PATCH_ADDRESS_QUERY_KEY,
    mutationFn: (params: PatchAddressParams) => patchAddress(params),
  });
}
