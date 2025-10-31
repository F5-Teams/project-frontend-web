import api from "@/config/axios";
import { OrderGhnCancel } from "./type";

export async function postOrderGhnCancel(id: number): Promise<OrderGhnCancel> {
  const { data } = await api.post<OrderGhnCancel>(`/orders/${id}/ghn/cancel`);
  return data;
}
