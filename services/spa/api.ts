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
    console.log("🌐 API: Starting getAvailableCombos call...");
    try {
      console.log("📡 API: Making request to /bookings/combos/available...");
      const response = await api.get("/bookings/combos/available");
      console.log("✅ API: Response received:", response.data);
      return response.data || []; // API returns array directly
    } catch (error: unknown) {
      console.error("❌ API: Error fetching spa combos:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Không thể tải danh sách combo spa";
      console.log("🚨 API: Throwing error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get spa combo by ID
  getComboById: async (id: string): Promise<SpaCombo> => {
    try {
      const response = await api.get(`/bookings/combos/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching spa combo:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Không thể tải thông tin combo spa";
      throw new Error(errorMessage);
    }
  },
};
