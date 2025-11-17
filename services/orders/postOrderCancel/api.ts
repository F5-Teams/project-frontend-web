import api from "@/config/axios";

interface Data {
  id: number;

  customerId: number;
}
export async function postOrderCancel({ id, customerId }: Data) {
  const { data } = await api.post(`/orders/${id}/cancel`, { customerId });
  return data;
}
