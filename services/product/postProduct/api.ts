import api from "@/config/axios";
import { PostProduct } from "./type";

export async function postProduct(body: PostProduct): Promise<PostProduct> {
  const { data } = await api.post<PostProduct>("/products", body);
  return data;
}
