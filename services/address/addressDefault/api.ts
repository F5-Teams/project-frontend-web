import api from "@/config/axios";

export async function patchAddressDefault(id: number) {
  const { data } = await api.patch(`/addresses/${id}/default`);
  return data;
}
