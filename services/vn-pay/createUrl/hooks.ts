import { useMutation } from "@tanstack/react-query";
import { createVnpay } from "./api";

export const CREATE_URL_QUERY_KEY = ["createUrl"] as const;

export function useCreateVnpay() {
  return useMutation({
    mutationKey: CREATE_URL_QUERY_KEY,
    mutationFn: createVnpay,
  });
}
