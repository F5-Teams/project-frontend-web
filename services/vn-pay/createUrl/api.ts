import api from "@/config/axios";
import { CreateUrlRequest, CreateUrlResponse } from "./type";

export async function createVnpay(
  body: CreateUrlRequest
): Promise<CreateUrlResponse> {
  const { data } = await api.post(`/wallets/deposit/vnpay/create-url`, body);

  return data;
}
