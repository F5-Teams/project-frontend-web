import api from "@/config/axios";
import { GetMeResponse, UpdateUserPayload, UpdateUserResponse } from "./types";

export async function getMe(): Promise<GetMeResponse> {
  const { data } = await api.get<GetMeResponse>("/user/me");
  return data;
}

export async function updateMe(
  payload: UpdateUserPayload
): Promise<UpdateUserResponse> {
  const { data } = await api.patch<UpdateUserResponse>("/user", payload);
  return data;
}
