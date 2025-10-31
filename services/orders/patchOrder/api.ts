import api from "@/config/axios";
import { CreateOrderRequest, PatchOrder } from "./type";

export async function patchOrder({
  id,
  body,
}: PatchOrder): Promise<CreateOrderRequest> {
  const { data } = await api.patch<CreateOrderRequest>(`/orders/${id}`, body);
  return data;
}
