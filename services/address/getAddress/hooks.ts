import { useQuery } from "@tanstack/react-query";
import { Address } from "./type";
import { getAddress } from "./api";

export const GET_ADDRESS_QUERY_KEY = ["getAddress"] as const;

export function useGetAddress() {
  return useQuery<Address[]>({
    queryKey: GET_ADDRESS_QUERY_KEY,
    queryFn: getAddress,
  });
}
