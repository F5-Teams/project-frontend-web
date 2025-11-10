import api from "@/config/axios";

export async function postOrderCancel(id: number) {
  const { data } = await api.post(`/orders/${id}/cancel`);
  return data;
}
