import api from "@/config/axios";
import { User } from "./type";

export async function getUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}
