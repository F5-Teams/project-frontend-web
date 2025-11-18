// models/booking.ts

export type ID = number;

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ON_SERVICE"
  | "CANCELLED"
  | "COMPLETED";

export type DropDownSlot = "MORNING" | "AFTERNOON" | "EVENING";

export interface Service {
  id: ID;
  name: string;
  price: string | number;
  duration: number;
  description: string;
  isActive: boolean;
}

export interface ServiceLink {
  id: ID;
  comboId: ID;
  serviceId: ID;
  service: Service;
}

export interface Combo {
  id: ID;
  name: string;
  price: string | number;
  duration: number;
  description: string;
  isActive: boolean;
  serviceLinks: ServiceLink[];
}

export interface Pet {
  id: ID;
  name: string;
  species: string;
  breed: string;
}

export interface Customer {
  id: ID;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Staff {
  id: ID;
  firstName: string;
  lastName: string;
}

export interface Groomer {
  id: ID;
  firstName: string;
  lastName: string;
}

export interface Room {
  id: ID;
  name: string;
  class: string;
  price: string;
  status: string;
  description: string;
  size: string;
}

export interface Slot {
  id: ID;
  startDate: string | null;
  endDate: string | null;
}

export interface Booking {
  id: ID;
  bookingDate: string;
  dropDownSlot: DropDownSlot;
  checkInDate: string | null;
  checkOutDate: string | null;
  status: BookingStatus;
  note: string;
  servicePrice: string | number | null;
  comboPrice: string | number | null;
  createdAt: string;

  comboId: ID | null;
  customerId: ID;
  staffId: ID | null;
  groomerId: ID | null;
  petId: ID | null;
  slotId: ID | null;
  roomId: ID | null;

  pet: Pet;
  combo: Combo | null;
  Room: Room | null;
  slot: Slot | null;
  customer: Customer;
  staff: Staff | null;
  groomer: Groomer | null;

  pickupPersonName?: string | null;
  pickupPersonPhone?: string | null;
  pickupPersonRelationship?: string | null;
  verificationNotes?: string | null;
}
