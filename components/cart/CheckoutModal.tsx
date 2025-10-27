"use client";

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

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/currency";
import { useCartSummary, useCartItemPrice } from "@/stores/cart.store";
import { format } from "date-fns";
import { Home, Package, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Building2,
  Banknote,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { PaymentMethod } from "@/types/cart";
import { mockPaymentMethods } from "@/mock/api";
import { bookingApi } from "@/services/booking/api";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { clearCart, setCartOpen } = useCartStore();
  const summary = useCartSummary();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const defaultPaymentMethod = mockPaymentMethods.find(
    (method) => method.isDefault
  );

  // Helper functions to display item details like in cart
  const getItemIcon = (item: any) => {
    if (item.roomId) {
      return <Home className="h-4 w-4" />;
    } else if (item.comboId || item.serviceIds) {
      return <Package className="h-4 w-4" />;
    } else {
      return <Package className="h-4 w-4" />;
    }
  };

  const getItemTitle = (item: any) => {
    // Priority 1: Check for comboId (SPA Combo)
    if (item.comboId) {
      return item.customName || `Combo ${item.comboId}`;
    }
    // Priority 2: Check for serviceIds (Custom combo)
    else if (item.serviceIds && item.serviceIds.length > 0) {
      return "Custom Combo";
    } else if (item.roomId) {
      return `Room ${item.roomId}`;
    } else {
      return "Service";
    }
  };

  const getItemDetails = (item: any) => {
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

  const getPetName = (petId: number) => {
    return `Pet ${petId}`;
  };

  // Component to display item price
  const ItemPriceDisplay: React.FC<{ tempId: string }> = ({ tempId }) => {
    const pricing = useCartItemPrice(tempId);

    return (
      <div className="text-right">
        <div className="font-bold text-sm text-green-600">
          {formatCurrency(pricing.price)}
        </div>
        <div className="text-xs text-gray-500">
          Deposit: {formatCurrency(pricing.deposit)}
        </div>
      </div>
    );
  };
  const initialPaymentMethod =
    defaultPaymentMethod?.id || mockPaymentMethods[0]?.id || "";

  // Reset state when modal opens and close cart
  React.useEffect(() => {
    if (isOpen) {
      setSelectedPaymentMethod(initialPaymentMethod);
      setCustomerNotes("");
      setError("");
      setIsProcessing(false);
      // Close cart when checkout modal opens
      setCartOpen(false);
    }
  }, [isOpen, initialPaymentMethod, setCartOpen]);

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const paymentMethod = mockPaymentMethods.find(
        (method) => method.id === selectedPaymentMethod
      );

      if (!paymentMethod) {
        throw new Error("Invalid payment method");
      }

      // Convert cart items to bulk booking format for /bookings/bulk API
      const bulkBookings = {
        bookings: summary.items.map((item) => {
          const baseBooking = {
            petId: item.petId,
            note: customerNotes.trim() || item.note || "",
          };

          // Add service-specific fields based on item properties
          // Priority 1: Check for comboId (SPA Combo)
          if (item.comboId) {
            return {
              ...baseBooking,
              type: "SPA" as const,
              bookingDate: item.bookingDate,
              dropDownSlot: item.dropDownSlot,
              comboId: item.comboId,
            };
          }
          // Priority 2: Check for serviceIds (Custom combo)
          else if (item.serviceIds && item.serviceIds.length > 0) {
            // This is a custom SPA service booking
            return {
              ...baseBooking,
              type: "SPA" as const,
              bookingDate: item.bookingDate,
              dropDownSlot: item.dropDownSlot,
              serviceIds: item.serviceIds,
            };
          }
          // Priority 3: Check for roomId (Hotel booking)
          else if (item.roomId) {
            // This is a HOTEL booking
            return {
              ...baseBooking,
              type: "HOTEL" as const,
              bookingDate: item.startDate || "", // Use startDate as bookingDate for HOTEL
              dropDownSlot: item.dropDownSlot || "MORNING", // Default to MORNING if not set
              roomId: item.roomId,
              startDate: item.startDate || "",
              endDate: item.endDate || "",
            };
          }

          // Fallback for unknown booking types - should not happen
          return {
            ...baseBooking,
            type: "SPA" as const,
            bookingDate: new Date().toISOString(),
            dropDownSlot: "MORNING",
          };
        }),
      };

      const response = await bookingApi.createBulkBookings(bulkBookings);

      if (response.success && response.data) {
        // Clear cart and show success
        clearCart();
        onSuccess(response.data.bookingIds[0]); // Return first booking ID for compatibility
        onClose();
      } else {
        setError(response.error || "Checkout failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "bank_transfer":
        return <Building2 className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodDescription = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return "Pay securely with your credit or debit card";
      case "bank_transfer":
        return "Transfer funds directly from your bank account";
      case "cash":
        return "Pay in cash when you arrive";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-xl font-semibold">Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.items.map((item, index) => (
                  <div
                    key={item.tempId}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getItemIcon(item)}
                        <span className="font-medium text-sm">
                          {getItemTitle(item)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.roomId ? "HOTEL" : "SPA"}
                        </Badge>
                      </div>
                      <ItemPriceDisplay tempId={item.tempId} />
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">Pet:</span>{" "}
                      {getPetName(item.petId)}
                    </div>

                    {getItemDetails(item).length > 0 && (
                      <div className="space-y-1">
                        {getItemDetails(item).map((detail, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="text-xs text-gray-600 flex items-center space-x-1"
                          >
                            {detail.includes("Time:") && (
                              <Clock className="h-3 w-3" />
                            )}
                            {(detail.includes("Check-in:") ||
                              detail.includes("Check-out:")) && (
                              <Calendar className="h-3 w-3" />
                            )}
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.note && (
                      <div className="text-xs text-gray-600 mt-2">
                        <span className="font-medium">Notes:</span> {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(summary.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deposit (50%):</span>
                  <span>{formatCurrency(summary.totalDeposit)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatCurrency(summary.totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3"
              >
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(method.type)}
                      <Label
                        htmlFor={method.id}
                        className="font-medium cursor-pointer"
                      >
                        {method.name}
                      </Label>
                    </div>
                    <div className="flex-1 text-sm text-gray-600">
                      {getPaymentMethodDescription(method.type)}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special instructions or notes for your booking..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Important Information */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Important Information:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>You will be charged a 50% deposit now</li>
                  <li>
                    The remaining balance will be charged after service
                    completion
                  </li>
                  <li>You will receive a confirmation email within 3 hours</li>
                  <li>All bookings are subject to availability confirmation</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing || !selectedPaymentMethod}
              className="min-w-[140px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(summary.totalDeposit)} Deposit`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
