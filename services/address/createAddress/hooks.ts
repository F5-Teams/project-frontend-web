import { useMutation } from "@tanstack/react-query";
import { Address } from "./type";
import { createAddress } from "./api";

export const CREATE__ADDRESS_QUERY_KEY = ["createAddress"] as const;

export function useCreateAddress() {
  return useMutation<Address, Error, Address>({
    mutationKey: CREATE__ADDRESS_QUERY_KEY,
    mutationFn: createAddress,
  });
}
