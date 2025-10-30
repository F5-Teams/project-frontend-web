import api from "@/config/axios";
import { Province } from "./type";

export async function getProvince(): Promise<Province> {
  const { data } = await api.get("/ghn/provinces");
  return data;
}
