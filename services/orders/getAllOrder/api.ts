import api from "@/config/axios";
import { GetAllOrderResponse } from "./type";

export async function getAllOrder(): Promise<GetAllOrderResponse> {
  const { data } = await api.get<GetAllOrderResponse>("/orders");
  return data;
}
