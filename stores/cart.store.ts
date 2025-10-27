import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BookingDraft,
  CartSummary,
  ValidationError,
  SlotConflict,
} from "../types/cart";
import { validateBookingDraft, generateTempId } from "../utils/booking";

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

interface CartState {
  items: BookingDraft[];
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
  calculateSummary: () => CartSummary;
  setLoading: (loading: boolean) => void;
  clearErrors: () => void;
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
      isCartOpen: false,
      isLoading: false,
      errors: [],
      conflicts: [],

      // Actions
      addItem: async (item: BookingDraft) => {
        set({ isLoading: true, errors: [] });

        // Generate tempId if not provided
        if (!item.tempId) {
          item.tempId = generateTempId();
        }

        // Validate the item
        const validationErrors = validateBookingDraftItem(item);
        if (validationErrors.length > 0) {
          set({ errors: validationErrors, isLoading: false });
          return { success: false, error: "Validation failed" };
        }

        // Add to cart
        set((state) => {
          const newItems = [...state.items, item];
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            conflicts,
            isLoading: false,
          };
        });

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

        // Add all items to cart
        set((state) => {
          const newItems = [...state.items, ...itemsWithIds];
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
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

        // Update the item
        set((state) => {
          const newItems = [...state.items];
          newItems[itemIndex] = updatedItem;
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            conflicts,
            isLoading: false,
          };
        });

        return { success: true };
      },

      removeItem: (tempId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.tempId !== tempId);
          const conflicts = checkSlotConflicts(newItems);

          return {
            items: newItems,
            conflicts,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
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

      calculateSummary: () => {
        const state = get();
        // Note: BookingDraft doesn't have price/deposit fields
        // These would need to be calculated based on service/room data
        const totalPrice = 0; // TODO: Calculate based on service/room pricing
        const totalDeposit = 0; // TODO: Calculate based on total price

        return {
          totalItems: state.items.length,
          totalPrice,
          totalDeposit,
          items: state.items,
        };
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearErrors: () => {
        set({ errors: [], conflicts: [] });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Selectors for easier access
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartSummary = () => {
  const items = useCartStore((state) => state.items);
  // Note: BookingDraft doesn't have price/deposit fields
  // These would need to be calculated based on service/room data
  const totalPrice = 0; // TODO: Calculate based on service/room pricing
  const totalDeposit = 0; // TODO: Calculate based on total price

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
