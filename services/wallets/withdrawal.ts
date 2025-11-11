import api from "@/config/axios";

export interface WithdrawalRequest {
  id: number;
  transactionId: number | null;
  customerId: number;
  adminId: number | null;
  createdAt: string;
  updatedAt: string;
  amount: string;
  bankNumber: string;
  bankName: string;
  bankUserName: string;
  status: "PENDING" | "TRANSFERRED" | "FAILED";
  adminNote: string | null;
  customer: {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
  };
  admin: null | {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
  };
}

export interface UpdateWithdrawalStatusPayload {
  status: "TRANSFERRED" | "FAILED";
  adminNote?: string;
}

export const withdrawalService = {
  // Lấy danh sách yêu cầu rút tiền
  getWithdrawalRequests: async (
    status?: string
  ): Promise<WithdrawalRequest[]> => {
    const params = status ? { status } : {};
    const response = await api.get("/withdrawals", { params });
    return response.data;
  },

  // Cập nhật trạng thái yêu cầu rút tiền
  updateWithdrawalStatus: async (
    id: number,
    payload: UpdateWithdrawalStatusPayload
  ): Promise<WithdrawalRequest> => {
    const response = await api.patch(`/withdrawals/${id}/status`, payload);
    return response.data;
  },
};
