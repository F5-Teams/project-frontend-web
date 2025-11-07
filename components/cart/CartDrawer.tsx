"use client";
import { motion, AnimatePresence } from "framer-motion";
import { hotelApi } from "@/services/hotel/api";
import Image from "next/image";

const SPA_PLACEHOLDER = "/images/spa1.jpg";
const HOTEL_PLACEHOLDER = "/images/hotel1.jpg";
const DEFAULT_PLACEHOLDER = SPA_PLACEHOLDER;

type CachedRoom = Awaited<ReturnType<typeof hotelApi.getRoomById>>;
const roomCache = new Map<string, CachedRoom>();

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
    serviceLinks: [], // Added for image fetching
  };
};

const getRoomById = async (id: string) => {
  if (roomCache.has(id)) {
    return roomCache.get(id)!;
  }

  try {
    const room = await hotelApi.getRoomById(id);
    roomCache.set(id, room);
    return room;
  } catch (error) {
    console.error("Error fetching room:", error);
    const fallbackRoom: CachedRoom = {
      id: Number(id),
      name: `Room ${id}`,
      class: "",
      price: "0",
      images: [],
    };
    roomCache.set(id, fallbackRoom);
    return fallbackRoom;
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useUserPets } from "@/services/profile/profile-pet/hooks";

type ComboCollection = ReturnType<typeof useCombos>["combos"];
type ComboWithOptionalImages = ComboCollection[number] & {
  images?: Array<{ id: number; imageUrl: string }>;
};

// Type guards to check item types
const isBookingDraft = (
  item: CartItem | BookingDraft
): item is BookingDraft => {
  return "tempId" in item && "petId" in item;
};

const getComboPrimaryImage = (
  comboId: number | string | undefined,
  combos: ComboCollection
) => {
  if (!comboId || combos.length === 0) {
    return null;
  }

  const numericId = Number(comboId);
  const combo = combos.find((entry) => entry.id === numericId);
  if (!combo) {
    return null;
  }

  const comboWithImages = combo as ComboWithOptionalImages;
  const directImage = comboWithImages.images?.[0]?.imageUrl;
  if (directImage) {
    return directImage;
  }

  for (const link of combo.serviceLinks) {
    const serviceImage = link.service.images?.[0]?.imageUrl;
    if (serviceImage) {
      return serviceImage;
    }
  }

  return null;
};

const findImageForServiceId = (
  serviceId: number | string | undefined,
  combos: ComboCollection
) => {
  if (serviceId === undefined || serviceId === null) {
    return null;
  }

  const numericId = Number(serviceId);

  for (const combo of combos) {
    const link = combo.serviceLinks.find(
      (serviceLink) => serviceLink.serviceId === numericId
    );
    const image = link?.service.images?.[0]?.imageUrl;
    if (image) {
      return image;
    }
  }

  return null;
};

const findImageForServiceIds = (
  serviceIds: Array<number> | Array<string> | undefined,
  combos: ComboCollection
) => {
  if (!serviceIds || serviceIds.length === 0) {
    return null;
  }

  for (const serviceId of serviceIds) {
    const image = findImageForServiceId(serviceId, combos);
    if (image) {
      return image;
    }
  }

  return null;
};

const resolveRoomImage = async (roomId: number | string | undefined) => {
  if (!roomId) {
    return null;
  }

  try {
    const room = await getRoomById(roomId.toString());
    const image = room.images?.[0]?.imageUrl || room.image;
    if (image) {
      return image;
    }
  } catch (error) {
    console.error("Error resolving room image:", error);
  }

  return null;
};

// Component to display item price
const ItemPriceDisplay: React.FC<{ tempId: string }> = ({ tempId }) => {
  const pricing = useCartItemPrice(tempId);

  // Show loading state if price is 0
  if (pricing.price === 0) {
    return (
      <span className="text-xs sm:text-sm font-semibold text-gray-400 animate-pulse">
        Loading...
      </span>
    );
  }
  // Chỉ hiển thị tổng giá, bỏ deposit
  return (
    <span className="font-bold text-sm sm:text-base text-pink-500">
      {formatCurrency(pricing.price)}
    </span>
  );
};

const ItemImage: React.FC<{
  item: CartItem | BookingDraft;
  combos: ComboCollection;
}> = ({ item, combos }) => {
  const getDefaultPlaceholder = () => {
    if (isBookingDraft(item)) {
      return item.roomId ? HOTEL_PLACEHOLDER : DEFAULT_PLACEHOLDER;
    }
    return item.type === "room" ? HOTEL_PLACEHOLDER : DEFAULT_PLACEHOLDER;
  };

  const [imageSrc, setImageSrc] = useState<string>(getDefaultPlaceholder());

  useEffect(() => {
    let isCancelled = false;

    const loadImage = async () => {
      let resolvedImage: string | null = null;

      if (isBookingDraft(item)) {
        if (item.roomId) {
          resolvedImage = await resolveRoomImage(item.roomId);
        } else if (item.comboId) {
          resolvedImage = getComboPrimaryImage(item.comboId, combos);
        } else if (item.serviceIds && item.serviceIds.length > 0) {
          resolvedImage = findImageForServiceIds(item.serviceIds, combos);
        }
      } else {
        switch (item.type) {
          case "room":
            resolvedImage = await resolveRoomImage(item.payload.roomId);
            break;
          case "combo":
            resolvedImage = getComboPrimaryImage(item.payload.comboId, combos);
            break;
          case "custom":
            resolvedImage = findImageForServiceIds(
              item.payload.selectedServiceIds,
              combos
            );
            break;
          case "single":
            resolvedImage = findImageForServiceId(
              item.payload.serviceId,
              combos
            );
            break;
        }
      }

      if (!resolvedImage) {
        resolvedImage = getDefaultPlaceholder();
      }

      if (!isCancelled) {
        setImageSrc(resolvedImage);
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [item, combos]);

  return (
    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imageSrc}
        alt="Service image"
        fill
        sizes="96px"
        className="object-cover"
      />
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
  // ✅ Only fetch combos when drawer is actually open (lazy loading)
  const { combos } = useCombos(isOpen === false); // skipLoad=true when drawer is closed

  // State cho các booking được chọn để thanh toán
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [hasRecalculated, setHasRecalculated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      const detectedId =
        parsed?.id ?? parsed?.userId ?? parsed?.userID ?? parsed?.user?.id;
      if (detectedId !== undefined && detectedId !== null) {
        const numericId = Number(detectedId);
        if (!Number.isNaN(numericId)) {
          setUserId(numericId);
        }
      }
    } catch (error) {
      console.error("Failed to parse stored user", error);
    }
  }, []);

  const { data: userPets } = useUserPets(userId ?? undefined);

  const petNameMap = useMemo(() => {
    const map = new Map<string, string>();
    userPets?.forEach((pet) => {
      map.set(pet.id.toString(), pet.name);
    });
    return map;
  }, [userPets]);

  const getPetName = useCallback(
    (petId: string | number | undefined) => {
      if (petId === undefined || petId === null) {
        return "Unknown Pet";
      }
      return (
        petNameMap.get(petId.toString()) ||
        userPets?.find((pet) => pet.id === Number(petId))?.name ||
        `Pet ${petId}`
      );
    },
    [petNameMap, userPets]
  );

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

  // Khi mở cart: luôn chọn hết mặc định
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(items.map((item) => item.tempId));
    }
  }, [isOpen, items]);

  // Hàm chọn/bỏ từng booking
  const handleSelectBooking = (tempId: string) => {
    if (deleteError) {
      setDeleteError(null);
    }
    setSelectedIds((prev) =>
      prev.includes(tempId)
        ? prev.filter((id) => id !== tempId)
        : [...prev, tempId]
    );
  };

  // Khi remove booking khỏi cart -> loại khỏi mảng chọn
  const handleRemoveItem = (tempId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== tempId));
    removeItem(tempId);
  };

  const toggleSelectAll = (checked: CheckedState) => {
    if (deleteError) {
      setDeleteError(null);
    }
    if (checked === true) {
      setSelectedIds(items.map((item) => item.tempId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) {
      setDeleteError("Hãy chọn mục cần xoá");
      return;
    }

    setDeleteError(null);
    setDeleteTargets(selectedIds);
    setDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    deleteTargets.forEach((id) => {
      handleRemoveItem(id);
    });
    setDeleteDialogOpen(false);
    setDeleteTargets([]);
  };

  const handleCancelBulkDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTargets([]);
  };

  // Lọc các item được chọn
  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.tempId)
  );
  // Lấy tổng tiền từ selected items
  const selectedItemPrices = useCartStore((state) => state.itemPrices);
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + (selectedItemPrices.get(item.tempId)?.price || 0),
    0
  );
  const areAllSelected =
    items.length > 0 && selectedIds.length === items.length;
  const hasPartialSelection =
    selectedIds.length > 0 && selectedIds.length < items.length;
  const selectAllState: CheckedState = areAllSelected
    ? true
    : hasPartialSelection
    ? "indeterminate"
    : false;
  const deleteTargetItems = useMemo(
    () => items.filter((item) => deleteTargets.includes(item.tempId)),
    [items, deleteTargets]
  );

  const trigger = useMemo(() => {
    if (!children) {
      return null;
    }

    if (React.isValidElement(children)) {
      const originalOnClick = children.props
        .onClick as React.MouseEventHandler<any> | undefined;

      return React.cloneElement(children, {
        onClick: (event: React.MouseEvent<any>) => {
          if (typeof originalOnClick === "function") {
            originalOnClick(event);
          }

          if (!event.defaultPrevented) {
            setCartOpen(true);
          }
        },
      });
    }

    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => setCartOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setCartOpen(true);
          }
        }}
        className="inline-flex"
      >
        {children}
      </span>
    );
  }, [children, setCartOpen]);

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
            `Ngày: ${format(new Date(item.bookingDate), "MMM dd, yyyy")}`
          );
        }
        if (item.dropDownSlot) {
          details.push(`Thời gian: ${item.dropDownSlot}`);
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
            `Nhận phòng: ${format(new Date(item.startDate), "MMM dd, yyyy")}`
          );
        }
        if (item.endDate) {
          details.push(
            `Trả phòng: ${format(new Date(item.endDate), "MMM dd, yyyy")}`
          );
        }
        if (item.startDate && item.endDate) {
          const nights = Math.ceil(
            (new Date(item.endDate).getTime() -
              new Date(item.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (nights > 0) {
            details.push(`${nights} đêm${nights > 1 ? "s" : ""}`);
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
              `Thời gian: ${formatAppointmentTime(
                item.payload.appointmentTime
              )}`
            );
          }
          break;
        case "room":
          if (item.payload.checkIn) {
            details.push(`Nhận phòng: ${item.payload.checkIn}`);
          }
          if (item.payload.checkOut) {
            details.push(`Trả phòng: ${item.payload.checkOut}`);
          }
          if (item.payload.nights) {
            details.push(
              `${item.payload.nights} đêm${item.payload.nights > 1 ? "s" : ""}`
            );
          }
          break;
      }
    }

    return details;
  };

  const getPetNames = (item: CartItem | BookingDraft) => {
    if (isBookingDraft(item)) {
      return getPetName(item.petId);
    }

    if (!item.petIds || item.petIds.length === 0) {
      return "Unknown Pet";
    }

    return item.petIds.map((petId) => getPetName(petId)).join(", ");
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
              className="fixed top-0 right-0 h-full w-[560px] sm:w-[560px] lg:w-[560px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                  <span className="font-semibold text-sm sm:text-base">
                    Giỏ hàng ({summary.totalItems})
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

              {/* Body */}
              <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3">
                {items.length > 0 && (
                  <>
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs sm:text-sm text-gray-600 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectAllState}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Chọn tất cả booking"
                        />
                        <span className="font-medium text-gray-700">
                          Chọn tất cả ({items.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                          <span className="text-[11px] sm:text-xs text-gray-400">
                            Đã chọn {selectedIds.length}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={handleBulkDeleteClick}
                        >
                          Xoá
                        </Button>
                      </div>
                    </div>
                    {deleteError && (
                      <div className="px-1 text-xs text-red-500">{deleteError}</div>
                    )}
                  </>
                )}
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-sm text-gray-500">
                      Chưa có dịch vụ nào trong giỏ.
                    </CardContent>
                  </Card>
                ) : (
                  items.map((item) => {
                    const details = getItemDetails(item);
                    const petNames = getPetNames(item);
                    const checked = selectedIds.includes(item.tempId);
                    return (
                      <Card key={item.tempId}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-stretch gap-3 sm:gap-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() =>
                                  handleSelectBooking(item.tempId)
                                }
                                aria-label="Chọn booking"
                              />
                              <ItemImage item={item} combos={combos} />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {getItemIcon(item)}
                                  <CardTitle className="text-sm font-semibold">
                                    <ItemTitleDisplay item={item} />
                                  </CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ItemPriceDisplay tempId={item.tempId} />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveItem(item.tempId)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                  <div className="font-medium text-gray-700 dark:text-gray-100">
                                    Pet: {petNames}
                                  </div>
                                  {details.length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                      {details.map((d, i) => (
                                        <div key={i}>{d}</div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-3 sm:p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Đã chọn ({selectedIds.length})
                  </span>
                  <span className="font-semibold text-base">
                    {formatCurrency(selectedTotalPrice)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  disabled={selectedIds.length === 0 || selectedTotalPrice === 0}
                  onClick={() => setIsCheckoutModalOpen(true)}
                >
                  Thanh toán
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelBulkDelete();
          } else {
            setDeleteDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Xoá các mục đã chọn</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xoá các mục này chứ? Thao tác này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 space-y-2 overflow-auto pr-1">
            {deleteTargetItems.length === 0 ? (
              <p className="text-sm text-gray-500">
                Không có mục nào được chọn.
              </p>
            ) : (
              deleteTargetItems.map((item) => (
                <div
                  key={item.tempId}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {getItemIcon(item)}
                    <span className="font-medium">
                      <ItemTitleDisplay item={item} />
                    </span>
                  </div>
                  <ItemPriceDisplay tempId={item.tempId} />
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelBulkDelete}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleConfirmBulkDelete}
            >
              Xoá các mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal checkout */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSuccess={(bookingId: string) => {
          console.log("Checkout success:", bookingId);
          setIsCheckoutModalOpen(false);
        }}
        bookings={selectedItems}
      />

      {trigger}
    </>
  );
