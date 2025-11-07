import api from "@/config/axios";
import { District } from "./type";

export async function getDistrict(id: number): Promise<District[]> {
  const { data } = await api.get(`/ghn/districts/${id}`);
  return data;
}
