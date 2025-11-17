import api from "@/config/axios";
import { CreateOrderResponse, Orders } from "./type";

export async function postOrder(body: Orders): Promise<CreateOrderResponse> {
  const { data } = await api.post<CreateOrderResponse>("/orders", body);
  return data;
}
