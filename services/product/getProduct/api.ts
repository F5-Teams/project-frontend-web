import api from "@/config/axios";
import { GetAllProductAdminResponse, ProductAdmin } from "./type";

export async function getAllProductAdmin(): Promise<ProductAdmin[]> {
  const { data } = await api.get<GetAllProductAdminResponse>("/products");
  return data.data;
}
