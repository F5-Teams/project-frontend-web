import api from "@/config/axios";
import { PatchProduct, PatchProductParams } from "./type";

export async function patchProduct({
  id,
  body,
}: PatchProductParams): Promise<PatchProduct> {
  const { data } = await api.patch<PatchProduct>(`/products/${id}`, body);
  return data;
}
