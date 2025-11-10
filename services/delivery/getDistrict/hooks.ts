import { useQuery } from "@tanstack/react-query";
import { getDistrict } from "./api";
import { District } from "./type";

export const GET_DISTRICT_QUERY_KEY = ["getDistrict"] as const;

export function useGetDistrict(id?: number) {
  return useQuery<District[]>({
    queryKey: [...GET_DISTRICT_QUERY_KEY, id],
    queryFn: () => getDistrict(id!),
    enabled: !!id,
  });
}
