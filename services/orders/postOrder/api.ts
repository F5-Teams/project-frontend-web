import api from "@/config/axios";
import { Orders } from "./type";

export async function postOrder(body: Orders): Promise<Orders> {
  const { data } = await api.post<Orders>("/orders", body);
  return data;
}
