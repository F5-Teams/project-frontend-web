import api from "@/config/axios";
import { GetAllProductResponse } from "./types";

// Lấy toàn bộ sản phẩm
export async function getAllProduct(): Promise<GetAllProductResponse> {
  const { data } = await api.get<GetAllProductResponse>("/products");
  return data;
}
