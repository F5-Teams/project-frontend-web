import api from "@/config/axios";

interface PutGhnStatusParams {
  id: number;
  body: {
    status: string;
    failureReason?: string;
  };
}
export async function putGhnStatus({ id, body }: PutGhnStatusParams) {
  const { data } = await api.put(`/ghn/simulate/${id}/status`, body);
  return data;
}
