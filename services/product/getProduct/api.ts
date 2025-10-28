import api from "@/config/axios";
import { GetAllProductAdminResponse } from "./type";

export async function getAllProductAdmin(): Promise<GetAllProductAdminResponse> {
  const { data } = await api.get<GetAllProductAdminResponse>("/products");
  return data;
}
