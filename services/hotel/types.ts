export interface HotelRoom {
  id: number;
  name: string;
  class: string;
  price: string;
  status: string; // AVAILABLE, MAINTENANCE, etc.
  description?: string;
  size?: string; // S, M, L
  images?: Array<{
    id: number;
    imageUrl: string;
  }>;
  availabilityStatus?: "AVAILABLE" | "UNAVAILABLE"; // From date-based availability check
  // Additional fields that might be needed
  pricePerNight?: number;
  image?: string;
  category?: string;
  isAvailable?: boolean; // Deprecated - use availabilityStatus instead
  capacity?: {
    maxAdult: number;
    maxChildren: number;
    standardAdult: number;
    standardChildren: number;
  };
  amenities?: string[];
  totalAvailableRooms?: number;
}

export interface HotelRoomResponse {
  success: boolean;
  data: HotelRoom[];
  message?: string;
}
