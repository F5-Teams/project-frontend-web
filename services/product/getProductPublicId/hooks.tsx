import { useQuery } from "@tanstack/react-query";
import { getProductPublicId } from "./api";
import { ProductById } from "./type";

export const GET_PRODUCT_PUBLIC_ID_QUERY_KEY = ["getProductPublicId"];

export function useGetProductPublicId(id?: number) {
  return useQuery<ProductById>({
    queryKey: [...GET_PRODUCT_PUBLIC_ID_QUERY_KEY, id],
    queryFn: () => getProductPublicId({ id: id! }),
    enabled: !!id,
  });
}
