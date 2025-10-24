import { useQuery } from "@tanstack/react-query";
import { GetAllProductResponse } from "./type";
import { getAllProduct } from "./api";

export const ALL_PRODUCT_QUERY_KEY = ["allProduct"] as const;

export function useAllProduct() {
  return useQuery<GetAllProductResponse>({
    queryKey: ALL_PRODUCT_QUERY_KEY,
    queryFn: getAllProduct,
  });
}
