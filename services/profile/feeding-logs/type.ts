export interface FoodItemImage {
  id: number;
  url: string;
  foodItemId: number;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: "DOG_FOOD" | "CAT_FOOD" | "SPECIAL_DIET" | "PREMIUM";
  isActive: boolean;
  createdAt: string;
  images: FoodItemImage[];
}

export interface Pet {
  id: number;
  name: string;
  species: "Dog" | "Cat";
}

export interface GroomerInfo {
  id: number;
  userName: string;
  firstName?: string;
  lastName?: string;
}

export interface FeedingLog {
  id: number;
  bookingId: number;
  petId: number;
  foodItemId: number;
  fedAt: string;
  fedByGroomerId: number;
  quantity: string;
  notes: string | null;
  foodItem: FoodItem;
  pet: Pet;
  fedByGroomer: GroomerInfo;
}

export type GetFeedingLogsByBookingResponse = FeedingLog[];
