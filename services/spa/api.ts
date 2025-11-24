import api from "@/config/axios";

export interface ServiceImage {
  id: number;
  imageUrl: string;
}

export interface Service {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  images: ServiceImage[];
}

export interface ServiceLink {
  id: number;
  comboId: number;
  serviceId: number;
  service: Service;
}

export interface SpaCombo {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  serviceLinks: ServiceLink[];
}

export interface SpaComboResponse {
  success: boolean;
  data: SpaCombo[];
  message?: string;
}

export const spaApi = {
  // Get available spa combos
  getAvailableCombos: async (): Promise<SpaCombo[]> => {
    try {
      const response = await api.get("/combos/available");
      // Normalize response: API should return an array directly, or
      // { data: SpaCombo[] } in some cases. Validate to avoid returning
      // an HTML string or other unexpected payload which breaks callers.
      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload;
      }

      if (payload && Array.isArray(payload.data)) {
        return payload.data;
      }

      // Unexpected shape (e.g. HTML string when backend redirected to login).
      const receivedType = typeof payload;
      console.error(
        "spaApi.getAvailableCombos: unexpected response shape:",
        receivedType,
        payload
      );
      throw new Error("Không thể tải danh sách combo spa (invalid response)");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Không thể tải danh sách combo spa";
      throw new Error(errorMessage);
    }
  },

  // Get spa combo by ID
  getComboById: async (id: string): Promise<SpaCombo> => {
    try {
      const response = await api.get(`/combos/${id}`);
      // API có thể trả về response.data hoặc response.data.data
      return response.data.data || response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Không thể tải thông tin combo spa";
      throw new Error(errorMessage);
    }
  },
};
