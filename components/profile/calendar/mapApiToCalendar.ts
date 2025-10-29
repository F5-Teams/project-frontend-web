import { ApiBooking } from "@/services/profile/profile-schedule/types";
import { CalendarBooking } from "@/types/calendarType";

function getString(
  obj: Record<string, unknown> | null,
  key: string
): string | undefined | null {
  if (!obj || !(key in obj)) return undefined;
  const v = obj[key];
  if (v === null) return null;
  return typeof v === "string" ? v : String(v);
}
function getNumber(
  obj: Record<string, unknown> | null,
  key: string
): number | undefined {
  if (!obj || !(key in obj)) return undefined;
  const v = obj[key];
  return typeof v === "number"
    ? v
    : typeof v === "string" && v !== ""
    ? Number(v)
    : undefined;
}
function getArray(
  obj: Record<string, unknown> | null,
  key: string
): unknown[] | undefined {
  if (!obj || !(key in obj)) return undefined;
  const v = obj[key];
  return Array.isArray(v) ? v : undefined;
}

export function mapApiToCalendar(b: ApiBooking): CalendarBooking {
  const rangeS = b.slot?.startDate ?? b.checkInDate ?? undefined;
  const rangeE = b.slot?.endDate ?? b.checkOutDate ?? undefined;

  const rawRoom =
    (b as unknown as Record<string, unknown>).room ??
    (b as unknown as Record<string, unknown>).Room ??
    null;
  const sourceRoom =
    rawRoom && typeof rawRoom === "object"
      ? (rawRoom as Record<string, unknown>)
      : null;

  const rawCombo = (b as unknown as Record<string, unknown>).combo ?? null;
  const sourceCombo =
    rawCombo && typeof rawCombo === "object"
      ? (rawCombo as Record<string, unknown>)
      : null;

  const servicesArr =
    getArray(sourceCombo, "serviceLinks") ??
    getArray(sourceCombo, "services") ??
    [];

  const mappedServiceLinks =
    servicesArr.length > 0
      ? servicesArr.map((s) => {
          const si =
            typeof s === "object" && s !== null
              ? (s as Record<string, unknown>)
              : {};
          return {
            id: getNumber(si, "id"),
            comboId: getNumber(sourceCombo, "id"),
            serviceId: getNumber(si, "id"),
            service: {
              id: getNumber(si, "id"),
              name: getString(si, "name") ?? undefined,
              imageUrl: getString(si, "imageUrl") ?? undefined, // giữ ảnh service
            },
          };
        })
      : [];

  const title =
    getString(sourceCombo, "name") ??
    getString(sourceRoom, "name") ??
    (rangeS ? "Đặt phòng" : "Booking");

  const roomClass = getString(sourceRoom, "class") ?? "";
  const color = roomClass.toLowerCase().includes("executive")
    ? "bg-violet-500"
    : sourceCombo
    ? "bg-teal-500"
    : "bg-amber-500";

  const mappedRoom = sourceRoom
    ? {
        id: getNumber(sourceRoom, "id"),
        name: getString(sourceRoom, "name") ?? undefined,
        class: getString(sourceRoom, "class") ?? undefined,
        price: getString(sourceRoom, "price") ?? undefined,
        status: getString(sourceRoom, "status") ?? undefined,
        description: getString(sourceRoom, "description") ?? null,
        imageUrl: getString(sourceRoom, "imageUrl") ?? null,
      }
    : null;

  const mappedPet = b.pet
    ? {
        id: b.pet.id,
        name: b.pet.name ?? undefined,
        imageUrl: b.pet.imageUrl ?? null,
      }
    : null;

  const mappedCombo = sourceCombo
    ? {
        id: getNumber(sourceCombo, "id"),
        name: getString(sourceCombo, "name") ?? undefined,
        price: getString(sourceCombo, "price") ?? undefined,
        duration: getNumber(sourceCombo, "duration") ?? null,
        description: getString(sourceCombo, "description") ?? null,
        serviceLinks: mappedServiceLinks,
        imageUrl:
          getString(sourceCombo, "imageUrl") ??
          // fallback: lấy ảnh từ service đầu tiên nếu combo không có imageUrl
          (mappedServiceLinks.length > 0
            ? mappedServiceLinks[0].service?.imageUrl ?? null
            : null),
      }
    : null;

  const slotRec = b.slot
    ? (b.slot as unknown as Record<string, unknown>)
    : null;

  return {
    id: b.id,
    title,
    color,
    status: b.status ?? null,
    startDate: rangeS ?? b.bookingDate ?? null,
    endDate: rangeE ?? null,
    slot: b.slot
      ? {
          id: getNumber(slotRec, "id"),
          startDate: b.slot.startDate ?? null,
          endDate: b.slot.endDate ?? null,
          totalPrice: getString(slotRec, "totalPrice") ?? null,
          roomId: getNumber(slotRec, "roomId") ?? null,
        }
      : null,
    pet: mappedPet,
    room: mappedRoom,
    Room: mappedRoom,
    combo: mappedCombo,
    meta: {
      pet: b.pet?.name ?? null,
      room: getString(sourceRoom, "name") ?? null,
      bookingDate: !rangeS ? b.bookingDate ?? null : null,
      startDate: rangeS ?? null,
      endDate: rangeE ?? null,
    },
  };
}

export const mapApiListToCalendar = (arr: ApiBooking[]) =>
  arr.map(mapApiToCalendar);
