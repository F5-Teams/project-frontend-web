import api from "@/config/axios";
import { DeleteProductParams } from "./type";

export async function deleteProduct({
  id,
}: DeleteProductParams): Promise<void> {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
