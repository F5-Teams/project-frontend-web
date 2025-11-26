"use client";

import React, { useState, useEffect } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pet } from "@/types/cart";
import { AlertCircle, CheckCircle, Loader2, Plus } from "lucide-react";
import api from "@/config/axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { useCartStore } from "@/stores/cart.store";

interface SelectPetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedPetIds: string[]) => void;
  serviceId?: string;
  maxPets?: number;
  title?: string;
  description?: string;
  roomSize?: "S" | "M" | "L"; // Add room size prop for hotel bookings
  bookingType?: "spa" | "hotel";
  spaDate?: Date | null;
  hotelStartDate?: Date | null;
  hotelEndDate?: Date | null;
}

export const SelectPetsModal: React.FC<SelectPetsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  maxPets,
  title = "Chọn thú cưng",
  description = "Chọn thú cưng sẽ nhận dịch vụ này",
  roomSize, // Add roomSize prop
  bookingType,
  spaDate,
  hotelStartDate,
  hotelEndDate,
}) => {
  const router = useRouter();
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { items: cartItems } = useCartStore();

  // Calculate pet size based on weight
  // Pet size S: < 5kg, M: 5kg - 15kg, L: > 15kg
  const getPetSize = (weight?: number): "S" | "M" | "L" => {
    if (!weight) return "S"; // Default to S if weight not provided
    if (weight < 5) return "S";
    if (weight <= 15) return "M";
    return "L";
  };

  // Check if pet can fit in room based on size
  const canPetFitInRoom = (petWeight?: number): boolean => {
    if (!roomSize) return true; // If no room size specified, allow all pets

    const petSize = getPetSize(petWeight);
    const sizeOrder = { S: 1, M: 2, L: 3 };

    // Pet can fit if pet size <= room size (e.g., S pet can fit in M or L room)
    return sizeOrder[petSize] <= sizeOrder[roomSize];
  };

  // Get size label for display
  const getSizeLabel = (weight?: number): string => {
    const size = getPetSize(weight);
    return `Size ${size} (${weight || 0}kg)`;
  };

  // Chuẩn hóa loại thú cưng về 1 trong các giá trị: dog | cat | bird | rabbit | other
  const normalizePetType = (raw?: string) => {
    const v = (raw || "").toString().trim().toLowerCase();
    if (["dog", "chó", "cho"].includes(v)) return "dog" as const;
    if (["cat", "mèo", "meo"].includes(v)) return "cat" as const;
    if (["bird", "chim"].includes(v)) return "bird" as const;
    if (["rabbit", "thỏ", "tho"].includes(v)) return "rabbit" as const;
    return "other" as const;
  };

  // Nhãn hiển thị tiếng Việt cho loại thú cưng
  const getPetTypeLabel = (type: string | undefined) => {
    const t = normalizePetType(type);
    const labels = {
      dog: "Chó",
      cat: "Mèo",
      bird: "Chim",
      rabbit: "Thỏ",
      other: "Khác",
    } as const;
    return labels[t];
  };

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      if (!isOpen) return;

      setErrors([]);

      // Basic auth check
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?.id) {
        setErrors(["Vui lòng đăng nhập để xem thú cưng của bạn"]);
        setPets([]);
        setLoading(false);
        return;
      }

      // Validate required dates for availability endpoints
      if (bookingType === "spa" && !spaDate) {
        setErrors([
          "Vui lòng chọn ngày Spa trước khi tìm thú cưng khả dụng.",
        ]);
        setPets([]);
        setLoading(false);
        return;
      }

      if (bookingType === "hotel" && (!hotelStartDate || !hotelEndDate)) {
        setErrors([
          "Vui lòng chọn ngày nhận/trả phòng để kiểm tra thú cưng khả dụng.",
        ]);
        setPets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        interface ApiPet {
          id: number | string;
          name?: string;
          species?: string;
          age?: number;
          note?: string;
          images?: Array<{ imageUrl: string }>;
          breed?: string;
          gender?: string | boolean;
          weight?: number | string;
          height?: number | string;
          notes?: string;
          isAvailable?: boolean;
        }

        let petsData: ApiPet[] = [];

        if (bookingType === "spa") {
          const response = await api.get(`/pet/available/spa`, {
            params: {
              date: spaDate ? format(spaDate, "yyyy-MM-dd") : undefined,
            },
          });
          petsData = (response.data?.pets || []) as ApiPet[];
        } else if (bookingType === "hotel") {
          const response = await api.get(`/pet/available/hotel`, {
            params: {
              startDate: hotelStartDate?.toISOString(),
              endDate: hotelEndDate?.toISOString(),
            },
          });
          petsData = (response.data?.pets || []) as ApiPet[];
        } else {
          const response = await api.get(`/pet/user/${user.id}`);
          petsData = (response.data || []) as ApiPet[];
        }

        const parseNumberValue = (value?: number | string) => {
          if (value === null || value === undefined) return undefined;
          const num = Number(value);
          return Number.isFinite(num) ? num : undefined;
        };

        // Transform API data to match component expectations
        const validPets: Pet[] = petsData.map((pet: ApiPet) => ({
          id: pet.id.toString(),
          name: pet.name || "Chưa đặt tên",
          // Map species sang type chuẩn hóa để hiển thị tiếng Việt
          type: normalizePetType(pet.species),
          avatar: pet.images?.[0]?.imageUrl || "", // Use first image as avatar
          age: pet.age || 0,
          notes: pet.note || pet.notes || "", // Map note to notes
          // Keep additional API fields for reference
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          weight: parseNumberValue(pet.weight),
          height: parseNumberValue(pet.height),
          images: pet.images || [],
          isAvailable: pet.isAvailable,
        }));

        setPets(validPets);
      } catch (error: unknown) {
        console.error("Error fetching pets:", error);
        setErrors(["Không thể tải danh sách thú cưng. Vui lòng thử lại."]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [isOpen, bookingType, spaDate, hotelStartDate, hotelEndDate]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedPetIds([]);
      setErrors([]);
    }
  }, [isOpen]);

  const handlePetToggle = (petId: string) => {
    setSelectedPetIds((prev) => {
      const isSelected = prev.includes(petId);

      if (isSelected) {
        // Unselect the pet
        return prev.filter((id) => id !== petId);
      } else {
        // Check pet size compatibility with room
        const pet = pets.find((p) => p.id === petId);
        if (roomSize && pet && !canPetFitInRoom(pet.weight)) {
          const petSize = getPetSize(pet.weight);
          setErrors([
            `Thú cưng "${pet.name}" (Size ${petSize}, ${pet.weight}kg) quá lớn cho phòng Size ${roomSize}. Vui lòng chọn phòng lớn hơn.`,
          ]);
          return prev;
        }

        // Check if maxPets is 1 (hotel case - only 1 pet per room)
        if (maxPets === 1) {
          // Replace the current selection with the new pet
          setErrors([]);
          return [petId];
        }

        // Check max pets limit for other services
        if (maxPets && prev.length >= maxPets) {
          setErrors([
            `Chỉ được chọn tối đa ${maxPets} thú cưng cho dịch vụ này`,
          ]);
          return prev;
        }

        setErrors([]);
        return [...prev, petId];
      }
    });
  };

  const handleConfirm = () => {
    const validationErrors: string[] = [];

    if (selectedPetIds.length === 0) {
      validationErrors.push("Vui lòng chọn ít nhất một thú cưng");
    }

    if (maxPets && selectedPetIds.length > maxPets) {
      validationErrors.push(`Chỉ được chọn tối đa ${maxPets} thú cưng`);
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onConfirm(selectedPetIds);
    onClose();
  };

  const getPetTypeColor = (type: string | undefined) => {
    const colors = {
      dog: "bg-blue-100 text-blue-800",
      cat: "bg-purple-100 text-purple-800",
      bird: "bg-green-100 text-green-800",
      rabbit: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    } as const;
    const t = normalizePetType(type);
    return colors[t];
  };

  const getPetTypeIcon = (type: string | undefined) => {
    // Có thể thay bằng icon thật nếu muốn
    const icons = {
      dog: "🐕",
      cat: "🐱",
      bird: "🐦",
      rabbit: "🐰",
      other: "🐾",
    } as const;
    const t = normalizePetType(type);
    return icons[t];
  };

  const spaDateString = spaDate ? format(spaDate, "yyyy-MM-dd") : undefined;
  const hotelStartString = hotelStartDate
    ? format(hotelStartDate, "yyyy-MM-dd")
    : undefined;
  const hotelEndString = hotelEndDate
    ? format(hotelEndDate, "yyyy-MM-dd")
    : undefined;

  const isHotelRangeOverlap = (
    startA?: string,
    endA?: string,
    startB?: string,
    endB?: string
  ) => {
    if (!startA || !endA || !startB || !endB) return false;
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();
    return aStart <= bEnd && bStart <= aEnd;
  };

  const isPetInCartSameSchedule = (petId: string) => {
    const pid = parseInt(petId, 10);
    return cartItems.some((item) => {
      if (item.petId !== pid) return false;
      if (bookingType === "spa" && spaDateString) {
        return item.bookingDate === spaDateString;
      }
      if (
        bookingType === "hotel" &&
        hotelStartString &&
        hotelEndString &&
        item.startDate &&
        item.endDate
      ) {
        return isHotelRangeOverlap(
          hotelStartString,
          hotelEndString,
          item.startDate,
          item.endDate
        );
      }
      return false;
    });
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-4xl"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        {/* Description */}
        {description && (
          <p className="text-sm font-poppins-light text-gray-600">
            {description}
          </p>
        )}

        {bookingType === "spa" && spaDate && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              Hiển thị thú cưng khả dụng cho ngày{" "}
              {format(spaDate, "dd/MM/yyyy")}.
            </AlertDescription>
          </Alert>
        )}

        {bookingType === "hotel" && hotelStartDate && hotelEndDate && (
          <Alert className="bg-indigo-50 border-indigo-200">
            <AlertCircle className="h-4 w-4 text-indigo-700" />
            <AlertDescription className="text-indigo-800">
              Hiển thị thú cưng khả dụng cho kỳ nghỉ từ{" "}
              {format(hotelStartDate, "dd/MM/yyyy")} đến{" "}
              {format(hotelEndDate, "dd/MM/yyyy")}.
            </AlertDescription>
          </Alert>
        )}

        {/* Room size info */}
        {roomSize && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Phòng Size {roomSize} - Chỉ phù hợp với thú cưng:{" "}
              {roomSize === "S" && "< 5kg (Size S)"}
              {roomSize === "M" && "< 15kg (Size S, M)"}
              {roomSize === "L" && "Tất cả (Size S, M, L)"}
            </AlertDescription>
          </Alert>
        )}

        {/* Validation errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 font-poppins-light">
              Đang tải...
            </span>
          </div>
        )}

        {/* Pets grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pets.map((pet) => {
              const isSelected = selectedPetIds.includes(pet.id);
              const canFitInRoom = canPetFitInRoom(pet.weight);
              const isUnavailable = pet.isAvailable === false;
              const isCartConflict = isPetInCartSameSchedule(pet.id);
              const isDisabled =
                (!!maxPets &&
                  selectedPetIds.length >= maxPets &&
                  !isSelected) ||
                (roomSize && !canFitInRoom) ||
                isCartConflict ||
                isUnavailable;

              return (
                <div className="p-2" key={pet.id}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : isDisabled
                        ? isUnavailable
                          ? "opacity-60 cursor-not-allowed bg-red-50"
                          : "opacity-50 cursor-not-allowed bg-gray-100"
                        : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
                    }`}
                    onClick={() => !isDisabled && handlePetToggle(pet.id)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handlePetToggle(pet.id)}
                          disabled={isDisabled}
                          className="mt-1"
                        />

                        {/* Pet Image */}
                        {pet.avatar && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={pet.avatar}
                              alt={pet.name}
                              width={80}
                              height={80}
                              className="h-20 w-20 object-cover"
                              onError={(e) => {
                                // next/image doesn't support onError to hide easily; fallback by swapping to a transparent data URI
                                (e.currentTarget as HTMLImageElement).src =
                                  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                              }}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getPetTypeIcon(pet.type)}
                              </span>
                              <h3 className="font-poppins-regular text-gray-900 truncate">
                                {pet.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPetTypeColor(pet.type)}>
                                {getPetTypeLabel(pet.type)}
                              </Badge>
                              {isUnavailable && (
                                <Badge
                                  variant="destructive"
                                  className="bg-red-100 text-red-700 border-red-200"
                                >
                                  Trùng lịch
                                </Badge>
                              )}
                              {isCartConflict && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-700 bg-orange-50"
                                >
                                  Đã có trong giỏ hàng
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Tuổi: {pet.age || 0} năm</p>
                            {pet.weight && (
                              <p className="text-xs">
                                <span
                                  className={`font-medium ${
                                    !canFitInRoom
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {getSizeLabel(pet.weight)}
                                </span>
                                {roomSize && !canFitInRoom && (
                                  <span className="text-red-600 ml-1">
                                    (Không phù hợp)
                                  </span>
                                )}
                              </p>
                            )}
                            {pet.notes && (
                              <p className="text-xs text-gray-500 truncate">
                                Ghi chú: {pet.notes}
                              </p>
                            )}
                            {isCartConflict && (
                              <p className="text-xs text-orange-700">
                                Thú cưng này đã có lịch trong giỏ hàng cho ngày
                                chọn.
                              </p>
                            )}
                            {isUnavailable && (
                              <p className="text-xs text-red-600">
                                Thú cưng này đã có lịch trùng.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-500 font-poppins-light">
              Không tìm thấy thú cưng. Vui lòng thêm thú cưng trước.
            </p>
            <Button
              onClick={() => {
                onClose();
                router.push("/profile-pet/create-pet");
              }}
              className="mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thú cưng
            </Button>
          </div>
        )}

        {/* Selection summary */}
        {selectedPetIds.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-poppins-regular text-green-800 ">
                {selectedPetIds.length} thú cưng đã chọn
              </span>
            </div>
            <div className="mt-2 text-sm text-green-700">
              {selectedPetIds
                .map((petId) => {
                  const pet = pets.find((p) => p.id === petId);
                  return pet?.name;
                })
                .join(", ")}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t ">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedPetIds.length === 0}
            className="min-w-[100px]"
          >
            Xác nhận ({selectedPetIds.length})
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default SelectPetsModal;
