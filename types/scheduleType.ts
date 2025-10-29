export type BookingType =
  | "Consultation"
  | "Analysis"
  | "Operation"
  | "Rehabilitation"
  | string;

export interface BookingMeta {
  bookingDate?: string;
  slotStart?: string;
  slotEnd?: string;
  [key: string]: string | number | null | undefined;
}

export interface Booking {
  id: string | number;
  type: BookingType;
  start: string | Date;
  durationMinutes: number;
  colorClass?: string;
  meta?: BookingMeta;
}

export interface WeeklyScheduleProps {
  timeZone?: string;
  anchorDate?: Date | string;
  dayStartHour?: number;
  dayEndHour?: number;
  slotMinutes?: number;
  enableWeekNav?: boolean;
  onWeekChange?: (viewStart: Date, viewEnd: Date, offsetWeeks: number) => void;
  bookings?: Booking[];
  showTimeColumn?: boolean;
  className?: string;
}
