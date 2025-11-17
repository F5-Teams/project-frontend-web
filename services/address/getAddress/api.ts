import api from "@/config/axios";
import { Address } from "./type";

export async function getAddress(): Promise<Address[]> {
  const { data } = await api.get("/addresses");
  return data;
}
