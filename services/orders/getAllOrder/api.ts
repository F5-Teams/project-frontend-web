import api from "@/config/axios";
import { GetAllOrderResponse } from "./type";

export interface GetAllOrderParams {
  page?: number;
  limit?: number;
  status?: string;
}

export async function getAllOrder(
  params?: GetAllOrderParams
): Promise<GetAllOrderResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(params?.page || 1));
  queryParams.append("limit", String(params?.limit || 10));
  if (params?.status) {
    queryParams.append("status", params.status);
  }

  const { data } = await api.get<GetAllOrderResponse>(
    `/orders?${queryParams.toString()}`
  );
  return data;
}
