import api from "@/config/axios";
import { Address } from "./type";
import { number } from "framer-motion";

export interface PatchAddressParams {
  body: Address;
  id: number;
}

export async function patchAddress({
  body,
  id,
}: PatchAddressParams): Promise<Address> {
  const { data } = await api.patch(`/addresses/${id}`, body);
  return data;
}
