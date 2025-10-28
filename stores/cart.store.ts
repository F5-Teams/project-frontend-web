import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BookingDraft,
  CartSummary,
  ValidationError,
  SlotConflict,
} from "../types/cart";
import { validateBookingDraft, generateTempId } from "../utils/booking";
import { spaApi, Service, SpaCombo } from "../services/spa/api";
import { hotelApi, HotelRoom } from "../services/hotel/api";

// Helper functions to replace mock data functions
const calculateDeposit = (
  totalPrice: number,
  percentage: number = 0.5
): number => {
  return Math.round(totalPrice * percentage);
};

const applyWeekendSurcharge = (
  price: number,
  isWeekend: boolean = false
): number => {
  return isWeekend ? Math.round(price * 1.1) : price;
};

// Helper function to calculate booking item price
const calculateBookingItemPrice = async (
  item: BookingDraft
): Promise<{ price: number; deposit: number }> => {
  let totalPrice = 0;

  try {
    // For SPA COMBO - ưu tiên kiểm tra comboId trước
    if (item.comboId) {
      console.log("💰 Calculating price for combo ID:", item.comboId);
      // Đây là booking combo spa - lấy giá của combo
      const combo = await spaApi.getComboById(item.comboId.toString());
      console.log("📦 Combo data received:", combo);
      totalPrice = parseFloat(combo.price) || 0;
      console.log("💵 Combo price parsed:", totalPrice);
    }
    // For SPA services (custom combo - nhiều dịch vụ riêng lẻ)
    else if (item.serviceIds && item.serviceIds.length > 0) {
      // Get all spa combos to find matching services
      const combos = await spaApi.getAvailableCombos();

      // First, try to find a matching combo (exact match)
      const matchingCombo = combos.find((combo) => {
        const comboServiceIds = combo.serviceLinks.map(
          (link) => link.serviceId
        );
        // Check if both arrays have the same length and all serviceIds match
        if (comboServiceIds.length !== item.serviceIds!.length) {
          return false;
        }
        // Check if all serviceIds in the item are present in this combo
        return item.serviceIds!.every((serviceId) =>
          comboServiceIds.includes(serviceId)
        );
      });

      if (matchingCombo) {
        // Use combo price if exact match found
        totalPrice = parseFloat(matchingCombo.price) || 0;
      } else {
        // Fallback: calculate price for each service in the custom combo
        for (const serviceId of item.serviceIds) {
          // Find service in any combo
          for (const combo of combos) {
            const serviceLink = combo.serviceLinks.find(
              (link) => link.serviceId === serviceId
            );
            if (serviceLink) {
              const servicePrice = parseFloat(serviceLink.service.price) || 0;
              totalPrice += servicePrice;
              break; // Found the service, no need to continue searching
            }
          }
        }
      }
    }

    // For HOTEL bookings
    if (item.roomId && item.startDate && item.endDate) {
      const room = await hotelApi.getRoomById(item.roomId.toString());
      const roomPricePerNight = parseFloat(room.price) || 0;

      // Calculate number of nights
      const checkIn = new Date(item.startDate);
      const checkOut = new Date(item.endDate);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      totalPrice = roomPricePerNight * nights;
    }

    // Apply weekend surcharge if applicable
    const isWeekend = item.bookingDate
      ? new Date(item.bookingDate).getDay() === 0 ||
        new Date(item.bookingDate).getDay() === 6
      : false;
    totalPrice = applyWeekendSurcharge(totalPrice, isWeekend);

    const deposit = calculateDeposit(totalPrice);

    console.log("💰 Final calculated price:", totalPrice, "deposit:", deposit);
    return { price: totalPrice, deposit };
  } catch (error) {
    console.error("❌ Error calculating booking item price:", error);
    // Return default values if calculation fails
    return { price: 0, deposit: 0 };
  }
};

interface CartState {
  items: BookingDraft[];
  itemPrices: Map<string, { price: number; deposit: number }>; // Cache prices by tempId
  isCartOpen: boolean;
  isLoading: boolean;
  errors: ValidationError[];
  conflicts: SlotConflict[];
}

interface CartActions {
  addItem: (
    item: BookingDraft
  ) => Promise<{ success: boolean; error?: string }>;
  addItems: (
    items: BookingDraft[]
  ) => Promise<{ success: boolean; error?: string }>;
  updateItem: (
    tempId: string,
    updates: Partial<BookingDraft>
  ) => Promise<{ success: boolean; error?: string }>;
  removeItem: (tempId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  validateCart: () => ValidationError[];
  checkConflicts: () => SlotConflict[];
  calculateSummary: () => Promise<CartSummary>;
  calculateItemPrice: (
    tempId: string
  ) => Promise<{ price: number; deposit: number }>;
  setLoading: (loading: boolean) => void;
  clearErrors: () => void;
  recalculateAllPrices: () => Promise<void>;
}

type CartStore = CartState & CartActions;

const validateBookingDraftItem = (item: BookingDraft): ValidationError[] => {
  const errors = validateBookingDraft(item);
  return errors.map((error) => ({
    field: "general",
    message: error,
  }));
};

const checkSlotConflicts = (items: BookingDraft[]): SlotConflict[] => {
  const conflicts: SlotConflict[] = [];
  const groomerSlots = new Map<string, Set<string>>();
  const timeSlots = new Map<string, Set<string>>();
  const roomDates = new Map<string, Set<string>>();

  items.forEach((item) => {
    const itemId = item.tempId;

    // Check groomer conflicts for spa services
    if (item.groomerId && item.bookingDate) {
      const slotKey = `${item.groomerId}-${item.bookingDate}-${item.dropDownSlot}`;

      if (groomerSlots.has(slotKey)) {
        const conflictingItems = Array.from(groomerSlots.get(slotKey)!);
        conflicts.push({
          type: "groomer",
          message: "Groomer is already booked at this time",
          conflictingItems: [...conflictingItems, itemId],
        });
      } else {
        groomerSlots.set(slotKey, new Set([itemId]));
      }
    }

    // Check time slot conflicts for spa services
    if (item.serviceIds && item.bookingDate) {
      const timeKey = `${item.bookingDate}-${item.dropDownSlot}`;

      if (timeSlots.has(timeKey)) {
        const conflictingItems = Array.from(timeSlots.get(timeKey)!);
        conflicts.push({
          type: "time",
          message: "Time slot is already booked",
          conflictingItems: [...conflictingItems, itemId],
        });
      } else {
        timeSlots.set(timeKey, new Set([itemId]));
      }
    }

    // Check room conflicts
    if (item.roomId && item.startDate && item.endDate) {
      const checkIn = new Date(item.startDate);
      const checkOut = new Date(item.endDate);

      for (
        let d = new Date(checkIn);
        d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateKey = `${item.roomId}-${d.toISOString().split("T")[0]}`;

        if (roomDates.has(dateKey)) {
          const conflictingItems = Array.from(roomDates.get(dateKey)!);
          conflicts.push({
            type: "room",
            message: "Room is already booked for these dates",
            conflictingItems: [...conflictingItems, itemId],
          });
        } else {
          roomDates.set(dateKey, new Set([itemId]));
        }
      }
    }
  });

  return conflicts;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      itemPrices: new Map(),
      isCartOpen: false,
      isLoading: false,
      errors: [],
      conflicts: [],

      // Actions
      addItem: async (item: BookingDraft) => {
        console.log("🛒 Adding item to cart:", item);
        set({ isLoading: true, errors: [] });

        // Generate tempId if not provided
        if (!item.tempId) {
          item.tempId = generateTempId();
        }
        console.log("🆔 Item tempId:", item.tempId);

        // Validate the item
        const validationErrors = validateBookingDraftItem(item);
        if (validationErrors.length > 0) {
          console.error("❌ Validation failed:", validationErrors);
          set({ errors: validationErrors, isLoading: false });
          return { success: false, error: "Validation failed" };
        }

        // Calculate price for the item
        console.log("💰 Calculating price for item...");
        const pricing = await calculateBookingItemPrice(item);
        console.log("💵 Pricing result:", pricing);

        // Add to cart
        set((state) => {
          const newItems = [...state.items, item];
          const newItemPrices = new Map(state.itemPrices);
          newItemPrices.set(item.tempId, pricing);
          console.log("💾 Saving pricing to cache:", item.tempId, pricing);
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            itemPrices: newItemPrices,
            conflicts,
            isLoading: false,
          };
        });

        console.log("✅ Item added successfully");
        return { success: true };
      },

      addItems: async (items: BookingDraft[]) => {
        set({ isLoading: true, errors: [] });

        // Generate tempId for items that don't have one
        const itemsWithIds = items.map((item) => ({
          ...item,
          tempId: item.tempId || generateTempId(),
        }));

        // Validate all items
        const allErrors: ValidationError[] = [];
        itemsWithIds.forEach((item) => {
          const errors = validateBookingDraftItem(item);
          allErrors.push(...errors);
        });

        if (allErrors.length > 0) {
          set({ errors: allErrors, isLoading: false });
          return { success: false, error: "Validation failed" };
        }

        // Calculate prices for all items
        const pricingPromises = itemsWithIds.map((item) =>
          calculateBookingItemPrice(item)
        );
        const pricingResults = await Promise.all(pricingPromises);

        // Add all items to cart
        set((state) => {
          const newItems = [...state.items, ...itemsWithIds];
          const newItemPrices = new Map(state.itemPrices);

          // Add pricing for each item
          itemsWithIds.forEach((item, index) => {
            newItemPrices.set(item.tempId, pricingResults[index]);
          });

          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            itemPrices: newItemPrices,
            conflicts,
            isLoading: false,
          };
        });

        return { success: true };
      },

      updateItem: async (tempId: string, updates: Partial<BookingDraft>) => {
        set({ isLoading: true, errors: [] });

        const state = get();
        const itemIndex = state.items.findIndex(
          (item) => item.tempId === tempId
        );

        if (itemIndex === -1) {
          set({ isLoading: false });
          return { success: false, error: "Item not found" };
        }

        const updatedItem = { ...state.items[itemIndex], ...updates };

        // Validate the updated item
        const validationErrors = validateBookingDraftItem(updatedItem);
        if (validationErrors.length > 0) {
          set({ errors: validationErrors, isLoading: false });
          return { success: false, error: "Validation failed" };
        }

        // Recalculate price for the updated item
        const pricing = await calculateBookingItemPrice(updatedItem);

        // Update the item
        set((state) => {
          const newItems = [...state.items];
          newItems[itemIndex] = updatedItem;
          const newItemPrices = new Map(state.itemPrices);
          newItemPrices.set(tempId, pricing);
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            itemPrices: newItemPrices,
            conflicts,
            isLoading: false,
          };
        });

        return { success: true };
      },

      removeItem: (tempId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.tempId !== tempId);
          const newItemPrices = new Map(state.itemPrices);
          newItemPrices.delete(tempId);
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            itemPrices: newItemPrices,
            conflicts,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemPrices: new Map(),
          errors: [],
          conflicts: [],
        });
      },

      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isCartOpen: isOpen });
      },

      validateCart: () => {
        const state = get();
        const allErrors: ValidationError[] = [];

        state.items.forEach((item) => {
          const itemErrors = validateBookingDraftItem(item);
          allErrors.push(...itemErrors);
        });

        set({ errors: allErrors });
        return allErrors;
      },

      checkConflicts: () => {
        const state = get();
        const conflicts = checkSlotConflicts(state.items);
        set({ conflicts });
        return conflicts;
      },

      calculateSummary: async () => {
        const state = get();
        let totalPrice = 0;
        let totalDeposit = 0;

        // Calculate totals from cached prices
        state.items.forEach((item) => {
          const pricing = state.itemPrices.get(item.tempId);
          if (pricing) {
            totalPrice += pricing.price;
            totalDeposit += pricing.deposit;
          }
        });

        return {
          totalItems: state.items.length,
          totalPrice,
          totalDeposit,
          items: state.items,
        };
      },

      calculateItemPrice: async (tempId: string) => {
        const state = get();
        const item = state.items.find((item) => item.tempId === tempId);

        if (!item) {
          return { price: 0, deposit: 0 };
        }

        const pricing = await calculateBookingItemPrice(item);

        // Update cache
        set((state) => {
          const newItemPrices = new Map(state.itemPrices);
          newItemPrices.set(tempId, pricing);
          return { itemPrices: newItemPrices };
        });

        return pricing;
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearErrors: () => {
        set({ errors: [], conflicts: [] });
      },

      // Recalculate all item prices (called after hydration)
      recalculateAllPrices: async () => {
        const state = get();
        console.log("🔄 Recalculating prices for all items...");

        if (state.items.length === 0) {
          console.log("📭 No items in cart, skipping recalculation");
          return;
        }

        const pricingPromises = state.items.map((item) =>
          calculateBookingItemPrice(item)
        );
        const pricingResults = await Promise.all(pricingPromises);

        set((state) => {
          const newItemPrices = new Map(state.itemPrices);
          state.items.forEach((item, index) => {
            newItemPrices.set(item.tempId, pricingResults[index]);
            console.log(
              "💾 Updated price for",
              item.tempId,
              ":",
              pricingResults[index]
            );
          });

          return { itemPrices: newItemPrices };
        });

        console.log("✅ All prices recalculated");
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        // Note: itemPrices is not persisted as Map doesn't serialize well
        // Prices will be recalculated on app restart
      }),
      onRehydrateStorage: () => (state) => {
        console.log("💧 Cart hydrated from storage");
        if (state && state.items.length > 0) {
          console.log("🔄 Triggering price recalculation after hydration...");
          // Recalculate prices after a short delay to ensure app is ready
          setTimeout(() => {
            (state as any).recalculateAllPrices?.();
          }, 100);
        }
      },
    }
  )
);

// Selectors for easier access
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartSummary = () => {
  const items = useCartStore((state) => state.items);
  const itemPrices = useCartStore((state) => state.itemPrices);

  let totalPrice = 0;
  let totalDeposit = 0;

  // Calculate totals from cached prices
  items.forEach((item) => {
    const pricing = itemPrices.get(item.tempId);
    if (pricing) {
      totalPrice += pricing.price;
      totalDeposit += pricing.deposit;
    }
  });

  return {
    totalItems: items.length,
    totalPrice,
    totalDeposit,
    items,
  };
};
export const useCartErrors = () => useCartStore((state) => state.errors);
export const useCartConflicts = () => useCartStore((state) => state.conflicts);
export const useIsCartOpen = () => useCartStore((state) => state.isCartOpen);
export const useIsCartLoading = () => useCartStore((state) => state.isLoading);
// Default pricing object to avoid creating new objects on each render
const DEFAULT_PRICING = { price: 0, deposit: 0 };

export const useCartItemPrice = (tempId: string) => {
  return useCartStore((state) => {
    const pricing = state.itemPrices.get(tempId);
    return pricing || DEFAULT_PRICING;
  });
};
