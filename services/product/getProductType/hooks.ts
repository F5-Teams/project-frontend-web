import { useQuery } from "@tanstack/react-query";
import { allProductType } from "./api";

export const ALL_PRODUCT_TYPE_QUERY_KEY = ["allType"];

export function useAllProductType() {
  return useQuery({
    queryKey: ALL_PRODUCT_TYPE_QUERY_KEY,
    queryFn: allProductType,
  });
}
