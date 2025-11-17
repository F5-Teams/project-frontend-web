import api from "@/config/axios";
type PutGhnDeliveredParams = {
  id: number | string;
  body: FormData;
};

export async function putGhnDelivered({ id, body }: PutGhnDeliveredParams) {
  const { data } = await api.put(`/ghn/simulate/${id}/delivered`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
