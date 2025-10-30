import api from "@/config/axios";
import { GetPetsByUserResponse } from "./types";

export async function getPetsByUser(
  userId: string | number
): Promise<GetPetsByUserResponse> {
  const { data } = await api.get<GetPetsByUserResponse>(`/pet/user/${userId}`);
  return data;
}
