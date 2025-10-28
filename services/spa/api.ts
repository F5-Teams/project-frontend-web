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
      console.log("📡 API: Making request to /combos/available...");
      const response = await api.get("/combos/available");
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
    console.log("🌐 API: Starting getComboById call for ID:", id);
    try {
      console.log("📡 API: Making request to /combos/" + id);
      const response = await api.get(`/combos/${id}`);
      console.log("✅ API: Response received:", response.data);
      // API có thể trả về response.data hoặc response.data.data
      return response.data.data || response.data;
    } catch (error: unknown) {
      console.error("❌ API: Error fetching spa combo:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Không thể tải thông tin combo spa";
      console.log("🚨 API: Throwing error:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
