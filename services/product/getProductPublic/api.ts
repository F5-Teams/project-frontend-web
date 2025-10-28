import api from "@/config/axios";
import { GetAllProductResponse } from "./type";

export async function getAllProduct(): Promise<GetAllProductResponse> {
  const { data } = await api.get<GetAllProductResponse>("/products/public");
  return data;
}
