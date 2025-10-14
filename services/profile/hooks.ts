import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetMeResponse, UpdateUserPayload, UpdateUserResponse } from "./types";
import { getMe, updateMe } from "./api";

export const ME_QUERY_KEY = ["me"] as const;

export function useMe() {
  return useQuery<GetMeResponse>({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();

  return useMutation<UpdateUserResponse, Error, UpdateUserPayload>({
    mutationKey: ["user", "updateMe"],
    mutationFn: updateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}
