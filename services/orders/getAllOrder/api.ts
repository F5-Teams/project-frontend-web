import api from "@/config/axios";
import { Order } from "./type";

export async function getAllOrder(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}
