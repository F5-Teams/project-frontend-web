import api from "@/config/axios";
import { ShippingFeeData, ShippingFeeResponse } from "./type";

export async function calculateFee(
  body: ShippingFeeData
): Promise<ShippingFeeResponse> {
  const { data } = await api.post("/ghn/calculate-fee", body);
  return data;
}
