import api from "@/config/axios";
import { Ward } from "./type";

export async function getWard(id: number): Promise<Ward[]> {
  const { data } = await api.get(`/ghn/wards/${id}`);
  return data;
}
