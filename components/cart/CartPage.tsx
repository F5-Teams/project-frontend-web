"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Trash2,
  Edit,
  Calendar,
  Clock,
  User,
  Home,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  useCartStore,
  useCartSummary,
  useCartErrors,
  useCartConflicts,
} from "@/stores/cart.store";
import { CartItem } from "@/types/cart";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import {
  getPetById,
  getServiceById,
  getComboById,
  getRoomById,
  getGroomerById,
} from "@/mock/api";

// Helper functions to replace mock data functions
const calculateItemPrice = (item: any): number => {
  // Basic price calculation - can be enhanced based on actual API data
  return item.price || 0;
};

const calculateDeposit = (
  totalPrice: number,
  percentage: number = 0.5
): number => {
  return Math.round(totalPrice * percentage);
};

export const CartPage: React.FC = () => {
  const { items, removeItem, clearCart, validateCart, checkConflicts } =
    useCartStore();
  const summary = useCartSummary();
  const errors = useCartErrors();
  const conflicts = useCartConflicts();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(
    null
  );
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const formatAppointmentTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getItemIcon = (type: CartItem["type"]) => {
    switch (type) {
      case "single":
        return <User className="h-4 w-4" />;
      case "combo":
        return <Package className="h-4 w-4" />;
      case "custom":
        return <Package className="h-4 w-4" />;
      case "room":
        return <Home className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getItemTitle = (item: CartItem) => {
    switch (item.type) {
      case "single": {
        const service = getServiceById(item.payload.serviceId);
        return service?.name || "Service";
      }
      case "combo": {
        const combo = getComboById(item.payload.comboId);
        return combo?.name || "Combo";
      }
      case "custom":
        return "Custom Combo";
      case "room": {
        const room = getRoomById(item.payload.roomId);
        return room?.name || "Room";
      }
      default:
        return "Unknown Item";
    }
  };

  const getItemDescription = (item: CartItem) => {
    switch (item.type) {
      case "single": {
        const service = getServiceById(item.payload.serviceId);
        const groomer = getGroomerById(item.payload.groomerId);
        return `${service?.description || ""} • ${
          groomer?.name || "Unknown Groomer"
        }`;
      }
      case "combo": {
        const combo = getComboById(item.payload.comboId);
        return combo?.benefits.join(", ") || "";
      }
      case "custom": {
        const serviceNames = item.payload.selectedServiceIds
          .map((id) => getServiceById(id)?.name)
          .filter(Boolean)
          .join(", ");
        return `Custom combination: ${serviceNames}`;
      }
      case "room": {
        const room = getRoomById(item.payload.roomId);
        return `${room?.amenities.slice(0, 2).join(", ") || ""} • ${
          item.payload.nights
        } night${item.payload.nights > 1 ? "s" : ""}`;
      }
      default:
        return "";
    }
  };

  const getPetNames = (petIds: string[]) => {
    return petIds.map((id) => getPetById(id)?.name || "Unknown Pet").join(", ");
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    setShowRemoveConfirm(null);
  };

  const handleValidateCart = () => {
    validateCart();
    checkConflicts();
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">
            Add some services or rooms to get started!
          </p>
          <Button onClick={() => window.history.back()}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {summary.totalItems} item{summary.totalItems > 1 ? "s" : ""} in
              your cart
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleValidateCart}>
              Validate Cart
            </Button>
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">
                Please fix the following errors:
              </div>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">
                Scheduling conflicts detected:
              </div>
              <ul className="list-disc list-inside space-y-1">
                {conflicts.map((conflict, index) => (
                  <li key={index}>{conflict.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getItemIcon(item.type)}
                          <h3 className="font-semibold text-lg">
                            {getItemTitle(item)}
                          </h3>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRemoveConfirm(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>{getItemDescription(item)}</p>
                        <p>
                          <span className="font-medium">Pets:</span>{" "}
                          {getPetNames(item.petIds)}
                        </p>

                        {/* Item-specific details */}
                        {item.type === "single" && (
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatAppointmentTime(
                                  item.payload.appointmentTime
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {item.type === "combo" &&
                          item.payload.appointmentTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatAppointmentTime(
                                  item.payload.appointmentTime
                                )}
                              </span>
                            </div>
                          )}

                        {item.type === "custom" &&
                          item.payload.appointmentTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatAppointmentTime(
                                  item.payload.appointmentTime
                                )}
                              </span>
                            </div>
                          )}

                        {item.type === "room" && (
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Check-in:{" "}
                                {format(
                                  new Date(item.payload.checkIn),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Check-out:{" "}
                                {format(
                                  new Date(item.payload.checkOut),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {item.payload.notes && (
                          <p>
                            <span className="font-medium">Notes:</span>{" "}
                            {item.payload.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          Deposit: ${item.deposit}
                        </div>
                        <div className="font-bold text-lg text-green-600">
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items ({summary.totalItems}):</span>
                    <span>${summary.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Deposit:</span>
                    <span>${summary.totalDeposit}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${summary.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsCheckoutModalOpen(true)}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center pt-4 border-t">
                  <p>You will be charged the deposit amount now.</p>
                  <p>
                    The remaining balance will be charged after service
                    completion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={!!showRemoveConfirm}
        onOpenChange={() => setShowRemoveConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  showRemoveConfirm && handleRemoveItem(showRemoveConfirm)
                }
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSuccess={(bookingId) => {
          console.log("Booking successful:", bookingId);
          setIsCheckoutModalOpen(false);
        }}
      />
    </div>
  );
};

export default CartPage;
