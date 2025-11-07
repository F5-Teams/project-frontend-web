import { useQuery } from "@tanstack/react-query";
import { getWallet } from "./index";

export const useGetWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
