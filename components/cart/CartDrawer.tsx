"use client";
import { motion, AnimatePresence } from "framer-motion";
import { hotelApi } from "@/services/hotel/api";

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

const getRoomById = async (id: string) => {
  try {
    const room = await hotelApi.getRoomById(id);
    return room;
  } catch (error) {
    console.error("Error fetching room:", error);
    return {
      id,
      name: `Room ${id}`,
      pricePerNight: 50,
      capacity: 2,
      amenities: [],
      photos: [],
    };
  }
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
  Calendar,
  Clock,
  User,
  Home,
  Package,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/currency";
import {
  useCartStore,
  useCartSummary,
  useIsCartOpen,
  useCartItemPrice,
} from "@/stores/cart.store";
import { CartItem, BookingDraft } from "@/types/cart";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import {
  useCombos,
  findComboByServiceIds,
  getServiceNamesByServiceIds,
} from "@/hooks/useCombos";

// Type guards to check item types
const isBookingDraft = (
  item: CartItem | BookingDraft
): item is BookingDraft => {
  return "tempId" in item && "petId" in item;
};

// Component to display item price
const ItemPriceDisplay: React.FC<{ tempId: string }> = ({ tempId }) => {
  const pricing = useCartItemPrice(tempId);

  // Show loading state if price is 0
  if (pricing.price === 0) {
    return (
      <div className="flex items-center justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t">
        <div className="text-[10px] sm:text-xs text-gray-500">
          Calculating...
        </div>
        <div className="font-bold text-xs sm:text-sm text-gray-400 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t">
      <div className="text-[10px] sm:text-xs text-gray-500">
        Deposit: {formatCurrency(pricing.deposit)}
      </div>
      <div className="font-bold text-xs sm:text-sm text-green-600">
        {formatCurrency(pricing.price)}
      </div>
    </div>
  );
};

interface CartDrawerProps {
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { items, removeItem, setCartOpen, recalculateAllPrices } =
    useCartStore();
  const summary = useCartSummary();
  const isOpen = useIsCartOpen();
  const { combos } = useCombos(); // ✅ Fetch combos once and cache

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [hasRecalculated, setHasRecalculated] = useState(false);

  // Recalculate prices once when cart opens with items
  useEffect(() => {
    if (isOpen && items.length > 0 && !hasRecalculated) {
      console.log("🔄 Cart opened, checking if prices need recalculation");
      // Check if any item has 0 price
      const needsRecalculation = items.some((item) => {
        const pricing = useCartStore.getState().itemPrices.get(item.tempId);
        return !pricing || pricing.price === 0;
      });

      if (needsRecalculation) {
        console.log("⚠️ Some prices are missing, recalculating...");
        recalculateAllPrices().then(() => {
          setHasRecalculated(true);
        });
      } else {
        setHasRecalculated(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, items.length, hasRecalculated]);

  // Note: Body overflow is managed by PushLayout component

  const formatAppointmentTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getItemIcon = (item: CartItem | BookingDraft) => {
    if (isBookingDraft(item)) {
      if (item.roomId) {
        return <Home className="h-4 w-4" />;
      } else if (item.comboId || item.serviceIds) {
        return <Package className="h-4 w-4" />;
      } else {
        return <User className="h-4 w-4" />;
      }
    } else {
      // For CartItem
      return <User className="h-4 w-4" />;
    }
  };

  // Component to display item title with cached data
  const ItemTitleDisplay: React.FC<{ item: CartItem | BookingDraft }> = ({
    item,
  }) => {
    const [title, setTitle] = useState<string>("Loading...");

    useEffect(() => {
      const loadTitle = async () => {
        if (isBookingDraft(item)) {
          // ✅ Priority 1: Check for comboId (SPA Combo)
          if (item.comboId) {
            // Use customName if available, otherwise find in combos
            if (item.customName) {
              setTitle(item.customName);
            } else if (combos.length > 0) {
              const matchingCombo = combos.find(
                (combo) => combo.id === item.comboId
              );
              setTitle(matchingCombo?.name || `Combo ${item.comboId}`);
            } else {
              setTitle("Loading...");
            }
          }
          // Priority 2: Check for serviceIds (Custom combo)
          else if (item.serviceIds && item.serviceIds.length > 0) {
            // For SPA services, use cached combos
            if (combos.length > 0) {
              // Find the combo that contains all the serviceIds
              const matchingCombo = findComboByServiceIds(
                item.serviceIds,
                combos
              );

              if (matchingCombo) {
                setTitle(matchingCombo.name);
              } else {
                // If no exact combo match, show individual service names
                const serviceNames = getServiceNamesByServiceIds(
                  item.serviceIds,
                  combos
                );
                if (serviceNames.length > 0) {
                  setTitle(serviceNames.join(" + "));
                } else {
                  setTitle("Custom Combo");
                }
              }
            } else {
              setTitle("Loading...");
            }
          }
          // Priority 3: Check for roomId (Hotel booking)
          else if (item.roomId) {
            try {
              const room = await getRoomById(item.roomId.toString());
              setTitle(room?.name || `Room ${item.roomId}`);
            } catch (error) {
              console.error("Error fetching room name:", error);
              setTitle(`Room ${item.roomId}`);
            }
          } else {
            setTitle("Service");
          }
        } else {
          // For CartItem
          switch (item.type) {
            case "single": {
              const service = getServiceById(item.payload.serviceId);
              setTitle(service?.name || "Service");
              break;
            }
            case "combo": {
              const combo = getComboById(item.payload.comboId);
              setTitle(combo?.name || "Combo");
              break;
            }
            case "custom":
              setTitle("Custom Combo");
              break;
            case "room": {
              try {
                const room = await getRoomById(item.payload.roomId);
                setTitle(room?.name || "Room");
              } catch (error) {
                console.error("Error fetching room name:", error);
                setTitle("Room");
              }
              break;
            }
            default:
              setTitle("Unknown Item");
          }
        }
      };

      loadTitle();
    }, [item]); // ✅ combos is stable from useCombos hook

    return <span>{title}</span>;
  };

  const getItemDetails = (item: CartItem | BookingDraft) => {
    const details = [];

    if (isBookingDraft(item)) {
      // For SPA services (combo or custom)
      if (item.comboId || (item.serviceIds && item.serviceIds.length > 0)) {
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
    } else {
      // For CartItem - handle different types
      switch (item.type) {
        case "single":
        case "custom":
          if (item.payload.appointmentTime) {
            details.push(
              `Time: ${formatAppointmentTime(item.payload.appointmentTime)}`
            );
          }
          break;
        case "room":
          if (item.payload.checkIn) {
            details.push(`Check-in: ${item.payload.checkIn}`);
          }
          if (item.payload.checkOut) {
            details.push(`Check-out: ${item.payload.checkOut}`);
          }
          if (item.payload.nights) {
            details.push(
              `${item.payload.nights} night${
                item.payload.nights > 1 ? "s" : ""
              }`
            );
          }
          break;
      }
    }

    return details;
  };

  const getPetNames = (item: CartItem | BookingDraft) => {
    if (isBookingDraft(item)) {
      // For BookingDraft, petId is a single number
      return getPetById(item.petId.toString())?.name || "Unknown Pet";
    } else {
      // For CartItem, petIds is an array
      return item.petIds
        .map((petId) => getPetById(petId)?.name || "Unknown Pet")
        .join(", ");
    }
  };

  return (
    <>
      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - only visible on mobile/tablet */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setCartOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                  <span className="font-semibold text-sm sm:text-base">
                    Shopping Cart ({summary.totalItems})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                  className="p-1 h-8 w-8 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
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
                  <div className="space-y-2 sm:space-y-3">
                    {items.map((item) => (
                      <Card key={item.tempId} className="relative shadow-sm">
                        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {getItemIcon(item)}
                              <CardTitle className="text-xs sm:text-sm truncate">
                                <ItemTitleDisplay item={item} />
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs flex-shrink-0"
                              >
                                {(() => {
                                  if (isBookingDraft(item)) {
                                    return item.roomId ? "HOTEL" : "SPA";
                                  } else {
                                    const cartItem = item as CartItem;
                                    return cartItem.type === "room"
                                      ? "HOTEL"
                                      : "SPA";
                                  }
                                })()}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.tempId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-7 w-7 flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 pt-0">
                          {/* Pet info */}
                          <div className="text-[11px] sm:text-xs text-gray-600">
                            <span className="font-medium">Pet:</span>{" "}
                            {getPetNames(item)}
                          </div>

                          {/* Item details */}
                          {getItemDetails(item).length > 0 && (
                            <div className="space-y-0.5 sm:space-y-1">
                              {getItemDetails(item).map((detail, index) => (
                                <div
                                  key={index}
                                  className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-1"
                                >
                                  {detail.includes("Time:") && (
                                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  )}
                                  {detail.includes("Check-in:") ||
                                    (detail.includes("Check-out:") && (
                                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    ))}
                                  <span className="truncate">{detail}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Notes */}
                          {(() => {
                            if (isBookingDraft(item)) {
                              return (
                                item.note && (
                                  <div className="text-[11px] sm:text-xs text-gray-600">
                                    <span className="font-medium">Notes:</span>{" "}
                                    <span className="line-clamp-2">
                                      {item.note}
                                    </span>
                                  </div>
                                )
                              );
                            } else {
                              const cartItem = item as CartItem;
                              return (
                                cartItem.payload.notes && (
                                  <div className="text-[11px] sm:text-xs text-gray-600">
                                    <span className="font-medium">Notes:</span>{" "}
                                    <span className="line-clamp-2">
                                      {cartItem.payload.notes}
                                    </span>
                                  </div>
                                )
                              );
                            }
                          })()}

                          {/* Price - now showing for BookingDraft items */}
                          <ItemPriceDisplay tempId={item.tempId} />
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
                  <div className="p-3 sm:p-4 bg-gray-50 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Items ({summary.totalItems}):</span>
                        <span className="font-medium">
                          {formatCurrency(summary.totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Total Deposit:</span>
                        <span className="font-medium">
                          {formatCurrency(summary.totalDeposit)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-sm sm:text-base">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {formatCurrency(summary.totalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        className="flex-1 text-xs sm:text-sm h-9 sm:h-10 bg-pink-500 hover:bg-pink-600"
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
