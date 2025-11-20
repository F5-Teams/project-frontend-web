import { ApiBooking } from "@/services/profile/profile-schedule/types";
import { Booking } from "@/types/scheduleType";

const toDate = (iso: string) => new Date(iso);
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) =>
  new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + n,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  );

function splitMultiDay(
  start: Date,
  end: Date,
  dayStartHour: number,
  dayEndHour: number
): Array<{ start: Date; end: Date }> {
  const parts: Array<{ start: Date; end: Date }> = [];
  if (end <= start) return parts;

  let cur = new Date(start);
  while (cur < end) {
    const dayStart = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate(),
      dayStartHour,
      0,
      0,
      0
    );
    const dayEnd = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate(),
      dayEndHour,
      0,
      0,
      0
    );

    const rawStart = cur;
    const rawEnd = new Date(Math.min(end.getTime(), endOfDay(cur).getTime()));

    const segStart = new Date(Math.max(rawStart.getTime(), dayStart.getTime()));
    const segEnd = new Date(Math.min(rawEnd.getTime(), dayEnd.getTime()));
    if (segEnd > segStart) parts.push({ start: segStart, end: segEnd });

    const nextDay = startOfDay(addDays(cur, 1));
    cur = nextDay;
  }
  return parts;
}

function colorFor(b: ApiBooking): string {
  if (b.slot) return "bg-yellow-50 border-yellow-400";
  if (b.combo) return "bg-teal-50 border-teal-400";
  return "bg-blue-50 border-blue-400";
}

function typeFor(b: ApiBooking): string {
  if (b.slot) return b.Room?.name ? `Room • ${b.Room.name}` : "Room";
  if (b.combo) return b.combo.name || "Service";
  return "Booking";
}

function getSlotTime(
  bookingDate: string,
  dropDownSlot: string
): { hour: number; minute: number } {
  const slotMap: Record<
    string,
    { hour: number; minute: number; duration: number }
  > = {
    MORNING: { hour: 7, minute: 0, duration: 270 },
    AFTERNOON: { hour: 12, minute: 30, duration: 240 },
    EVENING: { hour: 17, minute: 0, duration: 120 },
  };

  const slot = slotMap[dropDownSlot] || { hour: 7, minute: 0, duration: 60 };
  return { hour: slot.hour, minute: slot.minute };
}

function getSlotDuration(dropDownSlot: string): number {
  const slotMap: Record<string, number> = {
    MORNING: 270,
    AFTERNOON: 240,
    EVENING: 120,
  };
  return slotMap[dropDownSlot] || 60;
}

export function mapApiToBookings(
  data: ApiBooking[],
  opts?: {
    defaultDuration?: number;
    dayStartHour?: number;
    dayEndHour?: number;
  }
): Booking[] {
  const dayStartHour = opts?.dayStartHour ?? 7;
  const dayEndHour = opts?.dayEndHour ?? 18;

  const out: Booking[] = [];

  for (const b of data) {
    const bookingDateIso = b.bookingDate;

    if (b.bookingDate && !b.slot) {
      const baseDate = toDate(b.bookingDate);
      const slotTime = getSlotTime(b.bookingDate, b.dropDownSlot);

      const start = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        slotTime.hour,
        slotTime.minute,
        0,
        0
      );

      const durationMinutes =
        b.combo?.duration ?? getSlotDuration(b.dropDownSlot);

      out.push({
        id: `B-${b.id}-book`,
        type: typeFor(b),
        start,
        durationMinutes,
        colorClass: colorFor(b),
        meta: {
          bookingDate: bookingDateIso,
          status: b.status,
          pet: b.pet?.name ?? null,
          price: b.comboPrice || b.servicePrice || null,
          dropDownSlot: b.dropDownSlot,
        },
      });
    }

    if (b.slot?.startDate && b.slot?.endDate) {
      const slotStart = toDate(b.slot.startDate);
      const slotEnd = toDate(b.slot.endDate);

      const segments = splitMultiDay(
        slotStart,
        slotEnd,
        dayStartHour,
        dayEndHour
      );
      segments.forEach((seg, idx) => {
        const durationMinutes = Math.round(
          (seg.end.getTime() - seg.start.getTime()) / 60000
        );
        out.push({
          id: `B-${b.id}-slot-${idx}`,
          type: typeFor(b),
          start: seg.start,
          durationMinutes,
          colorClass: colorFor(b),
          meta: {
            bookingDate: bookingDateIso,
            pet: b.pet?.name ?? null,
            room: b.Room?.name ?? null,
            stay: 1,
            slotStart: slotStart.toISOString(),
            slotEnd: slotEnd.toISOString(),
          },
        });
      });
    }
  }

  return out;
}
