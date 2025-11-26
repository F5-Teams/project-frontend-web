"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/currency";
import { useCartItemPrice } from "@/stores/cart.store";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { bookingApi } from "@/services/booking/api";
import { BookingDraft } from "@/types/cart";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { GET_USER_QUERY_KEY } from "@/services/users/hooks";
import api from "@/config/axios";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
  bookings: BookingDraft[];
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookings = [],
}) => {
  const { clearCart, setCartOpen } = useCartStore();
  const queryClient = useQueryClient();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [petNames, setPetNames] = useState<Record<number, string>>({});

  // Helper functions to display item details like in cart
  const getItemIcon = (item: BookingDraft) => {
    if (item.roomId) {
      return <Home className="h-4 w-4" />;
    } else if (item.comboId || item.serviceIds) {
      return <Package className="h-4 w-4" />;
    } else {
      return <Package className="h-4 w-4" />;
    }
  };

  const getItemTitle = (item: BookingDraft) => {
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

  const getItemDetails = (item: BookingDraft) => {
    const details = [];

    // For SPA services or combos
    if ((item.serviceIds && item.serviceIds.length > 0) || item.comboId) {
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
    }

    return details;
  };

  const getPetName = (petId: number) => {
    return petNames[petId] || `Pet ${petId}`;
  };

  // Component to display item price
  const ItemPriceDisplay: React.FC<{ tempId: string }> = ({ tempId }) => {
    const pricing = useCartItemPrice(tempId);
    return (
      <div className="text-right">
        <div className="font-poppins-regular text-[16px] text-green-600">
          {formatCurrency(pricing.price)}
        </div>
      </div>
    );
  };

  // Reset state when modal opens and close cart
  React.useEffect(() => {
    if (isOpen) {
      setCustomerNotes("");
      setError("");
      setIsProcessing(false);
      // Close cart when checkout modal opens
      setCartOpen(false);
    }
  }, [isOpen, setCartOpen]);

  // Fetch pet names for display in summary
  useEffect(() => {
    const fetchPetNames = async () => {
      if (!isOpen) return;
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) return;

        const response = await api.get(`/pet/user/${user.id}`);
        const petList = response.data || [];
        const map: Record<number, string> = {};
        petList.forEach((pet: { id: number; name?: string }) => {
          map[pet.id] = pet.name || `Pet ${pet.id}`;
        });
        setPetNames(map);
      } catch (err) {
        console.error("Không thể tải tên thú cưng:", err);
      }
    };

    fetchPetNames();
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Map payment method selection to API format
      const paymentMethodMap: {
        [key: string]: "WALLET" | "VNPAY" | "MOMO" | "CASH";
      } = {
        wallet: "WALLET", // Ví điện tử
        vnpay: "VNPAY", // Thanh toán qua VNPay
        momo: "MOMO", // Thanh toán qua MoMo
        cash: "CASH", // Tiền mặt tại quầy lễ tân
      };

      // Convert cart items to bulk booking format for /bookings/bulk API
      const bulkBookings = {
        paymentMethod: paymentMethodMap[selectedPaymentMethod] || "WALLET",
        bookings: bookings.map((item) => {
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

      if (response.success) {
        // Check if payment method requires redirection (VNPAY or MOMO)
        if (
          response.paymentUrl &&
          (response.paymentMethod === "VNPAY" ||
            response.paymentMethod === "MOMO")
        ) {
          setIsRedirecting(true);
          toast.info(
            `Đang chuyển đến trang thanh toán ${response.paymentMethod}...`,
            {
              duration: 3000,
            }
          );

          // Store booking info for callback verification
          if (response.orderBookingId) {
            localStorage.setItem(
              "pendingBookingId",
              response.orderBookingId.toString()
            );
            localStorage.setItem(
              "pendingPaymentMethod",
              response.paymentMethod
            );

            // Store hotel booking dates if there's a hotel booking
            const hasHotelBooking = bookings.some((booking) => booking.roomId);
            if (hasHotelBooking) {
              const hotelBooking = bookings.find((booking) => booking.roomId);
              if (hotelBooking?.startDate && hotelBooking?.endDate) {
                localStorage.setItem(
                  "pendingHotelCheckIn",
                  hotelBooking.startDate
                );
                localStorage.setItem(
                  "pendingHotelCheckOut",
                  hotelBooking.endDate
                );
              }
            }
          }

          // Redirect to payment gateway
          window.location.href = response.paymentUrl;
          return;
        }

        // For WALLET payment, handle normally
        // Show error toasts for each error message first
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((errorMsg) => {
            toast.error(errorMsg, {
              duration: 6000,
            });
          });
        }

        // Show success toast only if there are NO errors and bookings were created
        if (
          response.createdCount &&
          response.createdCount > 0 &&
          (!response.errors || response.errors.length === 0)
        ) {
          toast.success(`Đã tạo ${response.createdCount} đơn đặt thành công!`, {
            duration: 5000,
          });
        }

        // Clear cart if at least one booking was created
        if (response.bookingIds && response.bookingIds.length > 0) {
          clearCart();
          // Invalidate user query to refresh wallet balance
          await queryClient.invalidateQueries({
            queryKey: GET_USER_QUERY_KEY,
          });

          // Invalidate hotel rooms cache to refresh room availability status
          // Check if any booking is a hotel booking
          const hasHotelBooking = bookings.some((booking) => booking.roomId);
          if (hasHotelBooking) {
            // Invalidate all hotel-related queries to refresh room status
            await queryClient.invalidateQueries({
              predicate: (query) => {
                const queryKey = query.queryKey as string[];
                return queryKey[0] === "hotel" || queryKey[0] === "rooms";
              },
              refetchType: "active",
            });

            // Also trigger a full page refetch if on hotel page
            if (
              typeof window !== "undefined" &&
              window.location.pathname.includes("/hotel")
            ) {
              // Small delay to ensure backend has processed the booking
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          }

          onSuccess(response.bookingIds[0].toString());
        }
        onClose();
      } else {
        const errorMsg = response.error || "Checkout failed. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          duration: 5000,
        });
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 5000,
      });
      console.error("Checkout error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper methods for future use (kept for reference)
  /*
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
  */

  // Tổng tiền:
  const selectedItemPrices = useCartStore((state) => state.itemPrices);
  const totalPrice = bookings.reduce(
    (sum, item) => sum + (selectedItemPrices.get(item.tempId)?.price || 0),
    0
  );
  // Thay ở các vị trí render/submit dùng summary.items thành bookings
  // const totalDeposit = bookings.reduce(
  //   (sum, item) => sum + (selectedItemPrices.get(item.tempId)?.deposit || 0),
  //   0
  // );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1100px] max-h-[95vh] overflow-y-auto bg-white text-sm sm:!max-w-none lg:!max-w-[1100px] xl:!max-w-[1100px]">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-lg font-poppins-light">
            Thanh toán
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
            {/* Order Summary */}
            <Card className="bg-white p-3">
              <CardHeader>
                <CardTitle className="text-base font-poppins-regular">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                  {bookings.length === 0 ? (
                    <p className="text-center font-poppins-light text-gray-500">
                      Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào
                      giỏ hàng.
                    </p>
                  ) : (
                    bookings.map((item) => (
                      <div
                        key={item.tempId}
                        className="rounded-lg border bg-gray-50 p-3"
                      >
                        <div className="mb-1.5 flex items-start justify-between">
                          <div className="flex items-center space-x-1.5">
                            {getItemIcon(item)}
                            <span className="text-sm font-poppins-light">
                              {getItemTitle(item)}
                            </span>
                            <Badge
                              variant="outline"
                              className="rounded-sm bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                            >
                              {item.roomId ? "HOTEL" : "SPA"}
                            </Badge>
                          </div>
                          <ItemPriceDisplay tempId={item.tempId} />
                        </div>

                        <div className="mb-1.5 text-[12px] text-gray-600">
                          <span className="font-poppins-regular">
                            Thú cưng:
                          </span>{" "}
                          “{getPetName(item.petId)}”
                        </div>

                        {getItemDetails(item).length > 0 && (
                          <div className="space-y-0.5 text-[11px]">
                            {getItemDetails(item).map((detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                className="flex items-center space-x-1 text-gray-600"
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
                          <div className="mt-1.5 text-[12px] text-gray-600">
                            <span className="font-poppins-light">Ghi chú:</span>{" "}
                            {item.note}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between border-t pt-1.5 text-base">
                  <span className="font-poppins-regular">Tổng cộng:</span>
                  <span className="text-green-600 font-poppins-regular">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              {/* Payment Method Selection */}
              <Card className="bg-white p-3">
                <CardHeader>
                  <CardTitle className="text-base font-poppins-regular">
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                  >
                    {/* Option 1: Ví điện tử */}
                    <div className="flex items-center space-x-2.5 rounded-lg border p-1 hover:bg-gray-50">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <div className="flex items-center space-x-2">
                        {/* Icon wallet */}
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-wallet"
                        >
                          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3V7Z" />
                          <path d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2Z" />
                        </svg>
                        <Label
                          htmlFor="wallet"
                          className="cursor-pointer font-poppins-regular"
                        >
                          Ví điện tử
                        </Label>
                      </div>
                    </div>
                    {/* Option 2: VNPay */}
                    <div className="flex items-center space-x-2.5 rounded-lg border p-1 hover:bg-gray-50">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <div className="flex items-center space-x-2">
                        {/* Icon credit card for VNPay */}
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-credit-card"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        <Label
                          htmlFor="vnpay"
                          className="cursor-pointer font-poppins-regular"
                        >
                          VNPay
                        </Label>
                      </div>
                    </div>
                    {/* Option 3: MoMo */}
                    <div className="flex items-center space-x-2.5 rounded-lg border p-1 hover:bg-gray-50">
                      <RadioGroupItem value="momo" id="momo" />
                      <div className="flex items-center space-x-2">
                        {/* Icon smartphone for MoMo */}
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-smartphone"
                        >
                          <rect
                            width="14"
                            height="20"
                            x="5"
                            y="2"
                            rx="2"
                            ry="2"
                          />
                          <path d="M12 18h.01" />
                        </svg>
                        <Label
                          htmlFor="momo"
                          className="cursor-pointer font-poppins-regular"
                        >
                          MoMo
                        </Label>
                      </div>
                    </div>
                    {/* Option 4: Tiền mặt */}
                    <div className="flex items-center space-x-2.5 rounded-lg border p-1 hover:bg-gray-50">
                      <RadioGroupItem value="cash" id="cash" />
                      <div className="flex items-center space-x-2">
                        {/* Icon banknote for Cash */}
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-banknote"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="2" />
                          <circle cx="12" cy="12" r="2" />
                          <path d="M6 12h.01M18 12h.01" />
                        </svg>
                        <Label
                          htmlFor="cash"
                          className="cursor-pointer font-poppins-regular"
                        >
                          Tiền mặt tại quầy lễ tân
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Customer Notes */}
              <Card className="flex h-full flex-col bg-white p-3">
                <CardHeader>
                  <CardTitle className="text-base">Ghi chú thêm</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 p-3 font-poppins-light">
                  <Textarea
                    placeholder="Bạn có yêu cầu hoặc lưu ý thêm nào cho đơn này không..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={4}
                  />
                  <Alert>
                    <AlertDescription>
                      <div className="space-y-1.5 text-[13px] leading-relaxed text-gray-500">
                        <div className="flex items-start">
                          <span className="mr-2 mt-[5px] inline-block h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                          <span>
                            Vui lòng đảm bảo thú cưng đã tiêm phòng đầy đủ và
                            trong tình trạng sức khỏe ổn định.
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-2 mt-[5px] inline-block h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                          <span>
                            Đơn đặt sẽ được xác nhận trong vòng 3 giờ sau khi
                            thanh toán hoặc đặt lịch.
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-3 lg:flex-row lg:items-start lg:justify-end">
            <div className="flex flex-col gap-2.5 lg:min-w-[260px] lg:items-end">
              {error && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Đã có lỗi xảy ra, vui lòng thử lại!
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end gap-2.5 ">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Huỷ
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={
                    isProcessing || isRedirecting || !selectedPaymentMethod
                  }
                  className="min-w-[130px]"
                >
                  {isProcessing || isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                      {isRedirecting ? "Đang chuyển hướng..." : "Đang xử lý..."}
                    </>
                  ) : (
                    `Thanh toán ${formatCurrency(totalPrice)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
