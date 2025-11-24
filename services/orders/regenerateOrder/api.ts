import api from "@/config/axios";
import { RegenerateOrder } from "./type";

export async function postRegenerateOrder(
  id: number
): Promise<RegenerateOrder> {
  const { data } = await api.post(`/orders/${id}/regenerate-payment-url`);
  return data;
}
