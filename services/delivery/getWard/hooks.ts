import { useQuery } from "@tanstack/react-query";
import { Ward } from "./type";
import { getWard } from "./api";

export const GET_WARD_QUERY_KEY = ["getWard"] as const;

export function useGetWard(id?: number) {
  return useQuery<Ward[]>({
    queryKey: [...GET_WARD_QUERY_KEY, id],
    queryFn: () => {
      if (!id) return Promise.resolve([]);
      return getWard(id);
    },
    enabled: !!id,
  });
}
