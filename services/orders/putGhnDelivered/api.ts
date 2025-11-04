import api from "@/config/axios";
type PutGhnDeliveredParams = {
  id: number | string;
  body: Record<string, any>;
};

export async function putGhnDelivered({
  id,
  body,
}: PutGhnDeliveredParams): Promise<PutGhnDeliveredParams> {
  const { data } = await api.put(`/ghn/simulate/${id}/delivered`, body);
  return data;
}
