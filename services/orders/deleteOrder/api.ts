import api from "@/config/axios";

export async function deleteOrder(id: number): Promise<number> {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
}
