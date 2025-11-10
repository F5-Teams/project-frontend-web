import api from "@/config/axios";
import { Address } from "./type";

export async function createAddress(body: Address): Promise<Address> {
  const { data } = await api.post(`/addresses`, body);
  return data;
}
