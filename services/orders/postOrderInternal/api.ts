import api from "@/config/axios";
import { Orders } from "./type";

export async function postOrderInternal(body: Orders): Promise<Orders> {
  const { data } = await api.post<Orders>("/orders/internal", body);
  return data;
}
