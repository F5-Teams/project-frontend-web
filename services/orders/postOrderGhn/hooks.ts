import { useMutation } from "@tanstack/react-query";
import { postOrderGhn } from "./api";

export const POST_ORDER_GHN_QUERY_KEY = ["postOrderGhn"] as const;

export function usePostOrderGhn() {
  return useMutation({
    mutationKey: POST_ORDER_GHN_QUERY_KEY,
    mutationFn: postOrderGhn,
  });
}
