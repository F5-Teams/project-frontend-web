import api from "@/config/axios";
import { OrderGhn } from "./type";

export async function postOrderGhn(id: number): Promise<OrderGhn> {
  const { data } = await api.post<OrderGhn>(`/orders/${id}/ghn/create`);
  return data;
}
