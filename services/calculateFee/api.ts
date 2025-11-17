import api from "@/config/axios";
import {
  ShippingFeeData,
  ShippingFeePayload,
  ShippingFeeResponse,
} from "./type";

export async function calculateFee(
  body: ShippingFeePayload
): Promise<ShippingFeeResponse> {
  const { data } = await api.post("/ghn/calculate-fee", body);
  return data;
}
