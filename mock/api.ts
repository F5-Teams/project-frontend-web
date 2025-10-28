// Mock API for testing booking system
import { CheckoutData, ApiResponse, BookingConfirmation } from "@/types/cart";
import { MockApiConfig } from "@/types/cart";

const mockApiConfig: MockApiConfig = {
  delay: 1000,
  shouldFail: false,
  errorMessage: "Something went wrong",
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface BulkBookingRequest {
  bookings: Array<{
    type: "SPA" | "HOTEL";
    petId: number;
    bookingDate?: string; // For SPA bookings
    slot?: "MORNING" | "AFTERNOON" | "EVENING"; // For SPA bookings
    comboId?: number; // For SPA bookings
    startDate?: string; // For HOTEL bookings
    endDate?: string; // For HOTEL bookings
    roomId?: number; // For HOTEL bookings
    note?: string;
  }>;
}

export interface BulkBookingResponse {
  success: boolean;
  bookingIds: string[];
  message: string;
}

// Mock API functions
export const mockApi = {
  // Bulk booking API - gửi nhiều bookings cùng lúc
  bulkBooking: async (
    data: BulkBookingRequest
  ): Promise<ApiResponse<BulkBookingResponse>> => {
    await delay(mockApiConfig.delay);

    if (mockApiConfig.shouldFail) {
      return {
        success: false,
        error: mockApiConfig.errorMessage,
      };
    }

    // Simulate successful bulk booking
    const bookingIds = data.bookings.map(
      (_, index) => `booking_${Date.now()}_${index}`
    );

    return {
      success: true,
      data: {
        bookingIds,
        message: `Successfully created ${data.bookings.length} bookings`,
      },
    };
  },

  // Legacy single booking APIs (để tương thích ngược)
  bookSingleService: async (
    data: any
  ): Promise<ApiResponse<BookingConfirmation>> => {
    await delay(mockApiConfig.delay);

    if (mockApiConfig.shouldFail) {
      return {
        success: false,
        error: mockApiConfig.errorMessage,
      };
    }

    return {
      success: true,
      data: {
        bookingId: `booking_${Date.now()}`,
        status: "confirmed",
        items: [],
        totalPrice: 100,
        depositAmount: 50,
        createdAt: new Date().toISOString(),
        estimatedConfirmationTime: new Date(
          Date.now() + 3 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  },

  bookCombo: async (data: any): Promise<ApiResponse<BookingConfirmation>> => {
    await delay(mockApiConfig.delay);

    if (mockApiConfig.shouldFail) {
      return {
        success: false,
        error: mockApiConfig.errorMessage,
      };
    }

    return {
      success: true,
      data: {
        bookingId: `booking_${Date.now()}`,
        status: "confirmed",
        items: [],
        totalPrice: 150,
        depositAmount: 75,
        createdAt: new Date().toISOString(),
        estimatedConfirmationTime: new Date(
          Date.now() + 3 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  },

  bookRoom: async (data: any): Promise<ApiResponse<BookingConfirmation>> => {
    await delay(mockApiConfig.delay);

    if (mockApiConfig.shouldFail) {
      return {
        success: false,
        error: mockApiConfig.errorMessage,
      };
    }

    return {
      success: true,
      data: {
        bookingId: `booking_${Date.now()}`,
        status: "confirmed",
        items: [],
        totalPrice: 200,
        depositAmount: 100,
        createdAt: new Date().toISOString(),
        estimatedConfirmationTime: new Date(
          Date.now() + 3 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  },

  // Checkout cart - sẽ được cập nhật để sử dụng bulk booking
  checkoutCart: async (
    data: CheckoutData
  ): Promise<ApiResponse<BookingConfirmation>> => {
    await delay(mockApiConfig.delay);

    if (mockApiConfig.shouldFail) {
      return {
        success: false,
        error: mockApiConfig.errorMessage,
      };
    }

    return {
      success: true,
      data: {
        bookingId: `booking_${Date.now()}`,
        status: "confirmed",
        items: data.cartItems,
        totalPrice: data.totalPrice,
        depositAmount: data.totalDeposit,
        createdAt: new Date().toISOString(),
        estimatedConfirmationTime: new Date(
          Date.now() + 3 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  },
};

// Mock payment methods
export const mockPaymentMethods = [
  {
    id: "card_1",
    name: "Credit/Debit Card",
    type: "card" as const,
    isDefault: true,
  },
  {
    id: "bank_1",
    name: "Bank Transfer",
    type: "bank_transfer" as const,
    isDefault: false,
  },
  {
    id: "cash_1",
    name: "Cash on Arrival",
    type: "cash" as const,
    isDefault: false,
  },
];

export default mockApi;
