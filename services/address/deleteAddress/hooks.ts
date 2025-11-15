import { useMutation } from "@tanstack/react-query";
import { deleteAddress } from "./api";

export const DELETE_ADDRESS_QUERY_KEY = ["deleteAddress"] as const;

export function useDeleteAddress() {
  return useMutation({
    mutationKey: DELETE_ADDRESS_QUERY_KEY,
    mutationFn: deleteAddress,
  });
}
