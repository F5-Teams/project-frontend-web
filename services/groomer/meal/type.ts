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

export interface Room {
  id: number;
  name: string;
}

export interface BookingInfo {
  id: number;
  bookingDate: string;
  dropDownSlot: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: string;
  note: string;
  servicePrice: string;
  comboPrice: string | null;
  isPaid: boolean;
  createdAt: string;
  pickupPersonName: string | null;
  pickupPersonPhone: string | null;
  pickupPersonRelationship: string | null;
  verificationNotes: string | null;
  orderBookingId: number;
  scheduledStartDate: string | null;
  scheduledEndDate: string | null;
  scheduledTotalPrice: string | null;
  comboId: number | null;
  customerId: number;
  staffId: number | null;
  groomerId: number;
  petId: number;
  slotId: number;
  roomId: number;
  pet: Pet;
  Room: Room;
}

export interface GroomerInfo {
  id: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface FeedingSchedule {
  id: number;
  bookingId: number;
  scheduledDate: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  status: "PENDING" | "FED";
  foodItemId: number;
  fedAt: string | null;
  fedByGroomerId: number | null;
  notes: string | null;
  createdAt: string;
  booking?: BookingInfo;
  foodItem: FoodItem;
  fedByGroomer?: GroomerInfo | null;
}

export interface GetFeedingSchedulesByBookingParams {
  bookingId: number;
}

export type GetFeedingSchedulesByBookingResponse = FeedingSchedule[];

export interface GetPendingFeedingSchedulesParams {
  date?: string;
}

export type GetPendingFeedingSchedulesResponse = FeedingSchedule[];

export interface MarkFeedingScheduleAsFedParams {
  id: number;
  groomerId: number;
  quantity: string;
  notes?: string;
}

export interface MarkFeedingScheduleAsFedResponse {
  schedule: FeedingSchedule;
  message: string;
}
