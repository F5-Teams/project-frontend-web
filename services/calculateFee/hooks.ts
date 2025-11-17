import { useMutation } from "@tanstack/react-query";
import { calculateFee } from "./api";
import {
  ShippingFeePayload,
  ShippingFeeResponse,
} from "./type";

export const CALCULATE_FEE_QUERY_KEY = ["feeShipping"] as const;

export function useCalculateFee() {
  return useMutation<ShippingFeeResponse, Error, ShippingFeePayload>({
    mutationKey: CALCULATE_FEE_QUERY_KEY,
    mutationFn: calculateFee,
  });
}
