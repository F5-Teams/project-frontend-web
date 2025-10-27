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
import { useCartStore, useCartSummary } from "@/stores/cart.store";
import { PaymentMethod, CheckoutData } from "@/types/cart";
import { mockApi, mockPaymentMethods, BulkBookingRequest } from "@/mock/api";

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
  const { items, clearCart } = useCartStore();
  const summary = useCartSummary();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const defaultPaymentMethod = mockPaymentMethods.find(
    (method) => method.isDefault
  );
  const initialPaymentMethod =
    defaultPaymentMethod?.id || mockPaymentMethods[0]?.id || "";

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedPaymentMethod(initialPaymentMethod);
      setCustomerNotes("");
      setError("");
      setIsProcessing(false);
    }
  }, [isOpen, initialPaymentMethod]);

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

      // Convert cart items to bulk booking format
      const bulkBookings: BulkBookingRequest = {
        bookings: items.map((item) => {
          const baseBooking = {
            petId: item.petId,
            note: customerNotes.trim() || item.note || undefined,
          };

          // Add service-specific fields based on item properties
          if (item.serviceIds && item.serviceIds.length > 0) {
            // This is a SPA service booking
            return {
              ...baseBooking,
              type: "SPA",
              bookingDate: item.bookingDate,
              slot: item.dropDownSlot,
              comboId: item.serviceIds[0], // Use first service ID
            };
          } else if (item.roomId) {
            // This is a HOTEL booking
            return {
              ...baseBooking,
              type: "HOTEL",
              startDate: item.startDate,
              endDate: item.endDate,
              roomId: item.roomId,
            };
          }

          // Fallback for unknown booking types
          return baseBooking;
        }),
      };

      const response = await mockApi.bulkBooking(bulkBookings);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {item.roomId ? "HOTEL" : "SPA"}
                      </Badge>
                      <span className="text-sm">Pet ID: {item.petId}</span>
                      {item.roomId && (
                        <span className="text-xs text-gray-500">
                          Room: {item.roomId}
                        </span>
                      )}
                      {item.serviceIds && item.serviceIds.length > 0 && (
                        <span className="text-xs text-gray-500">
                          Service: {item.serviceIds[0]}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">$0</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deposit (50%):</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">$0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
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
          <Card>
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
                `Pay $0 Deposit`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
