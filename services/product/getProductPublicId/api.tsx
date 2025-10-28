import api from "@/config/axios";
import { ProductById } from "./type";

export interface getProductByIdParams {
  id: number;
}

export async function getProductPublicId({
  id,
}: getProductByIdParams): Promise<ProductById> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}
