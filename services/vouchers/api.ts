import api from "@/config/axios";
import { Voucher } from "./type";

export async function getVoucher(): Promise<Voucher> {
  const { data } = await api.get("/vouchers");
  return data;
}
