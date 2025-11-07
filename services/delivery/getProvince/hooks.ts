import { useQuery } from "@tanstack/react-query";
import { getProvince } from "./api";
import { Province } from "./type";

export const GET_PROVINCE_QUERY_KEY = ["getProvince"] as const;

export function useGetProvince() {
  return useQuery<Province[]>({
    queryKey: GET_PROVINCE_QUERY_KEY,
    queryFn: getProvince,
  });
}
