import api from "@/config/axios";
import { Wallet } from "./type";

export const getWallet = async (): Promise<Wallet> => {
  const response = await api.get("/wallets/me");
  return response.data;
};
