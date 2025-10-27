"use client";
import { motion, AnimatePresence } from "framer-motion";

// Helper functions to replace mock data
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

const calculateRoomPrice = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};

const calculateCustomComboPrice = (
  serviceIds: string[],
  services: any[]
): number => {
  return serviceIds.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
};

// Temporary helper functions - these should be moved to a proper API service
const getPetById = (id: string) => {
  // This is a temporary implementation
  // In a real app, this would fetch from an API or cache
  return {
    id,
    name: `Pet ${id}`,
    type: "dog",
    avatar: "",
    age: 2,
    notes: "",
  };
};

const getServiceById = (id: string) => {
  // This is a temporary implementation
  return {
    id,
    name: `Service ${id}`,
    price: 100,
    duration: 60,
    description: "Service description",
  };
};

const getComboById = (id: string) => {
  // This is a temporary implementation
  return {
    id,
    name: `Combo ${id}`,
    price: 200,
    duration: 120,
    description: "Combo description",
    serviceIds: [],
  };
};

const getRoomById = (id: string) => {
  // This is a temporary implementation
  return {
    id,
    name: `Room ${id}`,
    pricePerNight: 50,
    capacity: 2,
    amenities: [],
    photos: [],
  };
};

const getGroomerById = (id: string) => {
  // This is a temporary implementation
  return {
    id,
    name: `Groomer ${id}`,
    rating: 4.5,
    specialties: [],
    availableSlots: [],
  };
};

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Edit,
  Calendar,
  Clock,
  User,
  Home,
  Package,
  X,
} from "lucide-react";
import { format } from "date-fns";
import {
  useCartStore,
  useCartSummary,
  useIsCartOpen,
} from "@/stores/cart.store";
import { CartItem, BookingDraft } from "@/types/cart";
import { CheckoutModal } from "@/components/cart/CheckoutModal";

// Union type to handle both CartItem and BookingDraft
type CartItemOrBookingDraft = CartItem | BookingDraft;

interface CartDrawerProps {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { items, removeItem, setCartOpen, toggleCart } = useCartStore();
  const summary = useCartSummary();
  const isOpen = useIsCartOpen();

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Manage body class for layout adjustments
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("cart-drawer-open");
    } else {
      document.body.classList.remove("cart-drawer-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("cart-drawer-open");
    };
  }, [isOpen]);

  const formatAppointmentTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getItemIcon = (item: CartItemOrBookingDraft) => {
    if ((item as any).roomId) {
      return <Home className="h-4 w-4" />;
    } else if ((item as any).serviceIds) {
      return <Package className="h-4 w-4" />;
    } else {
      return <User className="h-4 w-4" />;
    }
  };

  const getItemTitle = (item: CartItemOrBookingDraft) => {
    // For BookingDraft items, determine type based on available fields
    const itemType =
      (item as any).type ||
      (item.roomId ? "room" : item.serviceIds ? "custom" : "single");

    switch (itemType) {
      case "single": {
        const serviceId =
          (item as any).serviceId || (item as any).payload?.serviceId;
        const service = getServiceById(serviceId?.toString());
        return service?.name || "Service";
      }
      case "combo": {
        const comboId = (item as any).comboId || (item as any).payload?.comboId;
        const combo = getComboById(comboId?.toString());
        return combo?.name || "Combo";
      }
      case "custom":
        return "Custom Combo";
      case "room": {
        const roomId = (item as any).roomId || (item as any).payload?.roomId;
        const room = getRoomById(roomId?.toString());
        return room?.name || "Room";
      }
      default:
        return "Unknown Item";
    }
  };

  const getItemDetails = (item: CartItemOrBookingDraft) => {
    const details = [];

    // For SPA services
    if (item.serviceIds && item.serviceIds.length > 0) {
      if (item.bookingDate) {
        details.push(
          `Date: ${format(new Date(item.bookingDate), "MMM dd, yyyy")}`
        );
      }
      if (item.dropDownSlot) {
        details.push(`Time: ${item.dropDownSlot}`);
      }
      if (item.groomerId) {
        const groomer = getGroomerById(item.groomerId.toString());
        if (groomer) {
          details.push(`Groomer: ${groomer.name}`);
        }
      }
    }

    // For HOTEL bookings
    if (item.roomId) {
      if (item.startDate) {
        details.push(
          `Check-in: ${format(new Date(item.startDate), "MMM dd, yyyy")}`
        );
      }
      if (item.endDate) {
        details.push(
          `Check-out: ${format(new Date(item.endDate), "MMM dd, yyyy")}`
        );
      }
      if (item.startDate && item.endDate) {
        const nights = Math.ceil(
          (new Date(item.endDate).getTime() -
            new Date(item.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (nights > 0) {
          details.push(`${nights} night${nights > 1 ? "s" : ""}`);
        }
      }
    }

    return details;
  };

  const getPetNames = (item: any) => {
    // For BookingDraft, petId is a single number
    if (item.petId) {
      return getPetById(item.petId)?.name || "Unknown Pet";
    }
    return "Unknown Pet";
  };

  return (
    <>
      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-semibold">
                    Shopping Cart ({summary.totalItems})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Add some services or rooms to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Card key={item.tempId} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getItemIcon(item)}
                              <CardTitle className="text-sm">
                                {getItemTitle(item)}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {item.roomId ? "HOTEL" : "SPA"}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.tempId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          {/* Pet info */}
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Pet:</span>{" "}
                            {getPetNames(item)}
                          </div>

                          {/* Item details */}
                          {getItemDetails(item).length > 0 && (
                            <div className="space-y-1">
                              {getItemDetails(item).map((detail, index) => (
                                <div
                                  key={index}
                                  className="text-xs text-gray-600 flex items-center space-x-1"
                                >
                                  {detail.includes("Time:") && (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  {detail.includes("Check-in:") ||
                                    (detail.includes("Check-out:") && (
                                      <Calendar className="h-3 w-3" />
                                    ))}
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Notes */}
                          {((item as any).note ||
                            (item as any).payload?.notes) && (
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Notes:</span>{" "}
                              {(item as any).note ||
                                (item as any).payload?.notes}
                            </div>
                          )}

                          {/* Price - temporarily hidden for BookingDraft items */}
                          {(item as any).price && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-xs text-gray-500">
                                Deposit: ${(item as any).deposit || 0}
                              </div>
                              <div className="font-bold text-sm text-green-600">
                                ${(item as any).price}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              {items.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Items ({summary.totalItems}):</span>
                        <span>${summary.totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Deposit:</span>
                        <span>${summary.totalDeposit}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total:</span>
                        <span className="text-green-600">
                          ${summary.totalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="outline"
                        className="flex-1 text-sm"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        className="flex-1 text-sm"
                        onClick={() => setIsCheckoutModalOpen(true)}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      {children && <div onClick={() => setCartOpen(true)}>{children}</div>}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSuccess={(bookingId) => {
          console.log("Booking successful:", bookingId);
          setIsCheckoutModalOpen(false);
        }}
      />
    </>
  );
};

export default CartDrawer;
