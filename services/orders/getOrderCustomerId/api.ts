import api from "@/config/axios";
import { OrderCustomer } from "./type";

export async function getOrderCustomerId({
  id,
}: {
  id: number;
}): Promise<OrderCustomer[]> {
  const { data } = await api.get<OrderCustomer[]>(`/orders/customer/${id}`);
  return data;
}
