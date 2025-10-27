import { BookingDraft } from "@/types/cart";

/**
 * Chuyển đổi BookingDraft thành payload để gửi lên backend
 * Loại bỏ tempId vì chỉ dùng để quản lý frontend
 */
export const buildBookingPayload = (items: BookingDraft[]) =>
  items.map(({ tempId, ...rest }) => rest);

/**
 * Validate BookingDraft trước khi thêm vào cart
 */
export const validateBookingDraft = (draft: BookingDraft): string[] => {
  const errors: string[] = [];

  if (!draft.petId) {
    errors.push("Pet ID is required");
  }

  if (!draft.bookingDate) {
    errors.push("Booking date is required");
  }

  if (!draft.dropDownSlot) {
    errors.push("Time slot is required");
  }

  // Kiểm tra có ít nhất một trong comboId, serviceIds, hoặc roomId
  if (!draft.comboId && !draft.serviceIds?.length && !draft.roomId) {
    errors.push("Either combo ID, service IDs, or room ID is required");
  }

  // Nếu có roomId thì cần startDate và endDate
  if (draft.roomId && (!draft.startDate || !draft.endDate)) {
    errors.push("Start date and end date are required for room booking");
  }

  return errors;
};

/**
 * Tạo tempId duy nhất cho BookingDraft
 */
export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format booking date cho display
 */
export const formatBookingDate = (
  date: string,
  slot: "MORNING" | "AFTERNOON" | "EVENING"
): string => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("vi-VN");

  const slotNames = {
    MORNING: "Sáng",
    AFTERNOON: "Chiều",
    EVENING: "Tối",
  };

  return `${formattedDate} - ${slotNames[slot]}`;
};
