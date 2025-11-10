import { useMutation } from "@tanstack/react-query";
import { putGhnStatus } from "./api";

export const PUT_GHN_STATUS_QUERY_KEY = ["deliverFail"] as const;

export function usePutGhnStatus() {
  return useMutation({
    mutationKey: PUT_GHN_STATUS_QUERY_KEY,
    mutationFn: putGhnStatus,
  });
}
