import { useQuery } from "@tanstack/react-query";
import { GetAllProductAdminResponse } from "./type";
import { getAllProductAdmin } from "./api";

export const ALL_PRODUCT_ADMIN_QUERY_KEY = ["allProductAdmin"];

export function useAllProductAdmin() {
  return useQuery<GetAllProductAdminResponse>({
    queryKey: ALL_PRODUCT_ADMIN_QUERY_KEY,
    queryFn: getAllProductAdmin,
  });
}
