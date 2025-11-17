import api from "@/config/axios";

export async function allProductType(): Promise<string[]> {
  const { data } = await api.get("/products/types");
  return data;
}
