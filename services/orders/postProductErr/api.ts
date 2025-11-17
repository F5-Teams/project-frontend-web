import api from "@/config/axios";

interface DataProps {
  body: {
    orderId: number;
    customerId: number;
    description: string;
  };
}

export async function postProductErr({ body }: DataProps): Promise<DataProps> {
  const { data } = await api.post(`/product-issue-reports`, body);
  return data;
}
