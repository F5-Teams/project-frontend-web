import { useMutation } from "@tanstack/react-query";
import { putGhnDelivered } from "./api";

export const PUT_GHN_DELIVERED_QUERY_KEY = ["delivered"] as const;

export function usePutGhnDelivered() {
  return useMutation({
    mutationKey: PUT_GHN_DELIVERED_QUERY_KEY,
    mutationFn: putGhnDelivered,
  });
}
