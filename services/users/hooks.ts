import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";

export const GET_USER_QUERY_KEY = ["user"] as const;

export function useGetUser() {
  return useQuery({
    queryKey: GET_USER_QUERY_KEY,
    queryFn: getUser,
  });
}
