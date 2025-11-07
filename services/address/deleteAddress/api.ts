import api from "@/config/axios";
export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}
export async function deleteAddress(
  id: number
): Promise<DeleteAddressResponse> {
  const { data } = await api.delete(`/addresses/${id}`);
  return data;
}
