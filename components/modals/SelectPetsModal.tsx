"use client";

import React, { useState, useEffect } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pet } from "@/types/cart";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import api from "@/config/axios";

interface SelectPetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedPetIds: string[]) => void;
  serviceId?: string;
  maxPets?: number;
  title?: string;
  description?: string;
}

export const SelectPetsModal: React.FC<SelectPetsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceId,
  maxPets,
  title = "Chọn thú cưng",
  description = "Chọn thú cưng sẽ nhận dịch vụ này",
}) => {
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) {
          setErrors(["Vui lòng đăng nhập để xem thú cưng của bạn"]);
          setLoading(false);
          return;
        }

        const response = await api.get(`/pet/user/${user.id}`);
        const petsData = response.data || [];

        // Transform API data to match component expectations
        const validPets = petsData.map((pet: any) => ({
          id: pet.id.toString(),
          name: pet.name || "Chưa đặt tên",
          type: pet.species?.toLowerCase() || "other", // Map species to type
          avatar: pet.images?.[0]?.imageUrl || "", // Use first image as avatar
          age: pet.age || 0,
          notes: pet.note || "", // Map note to notes
          // Keep additional API fields for reference
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          weight: pet.weight,
          height: pet.height,
          images: pet.images || [],
        }));

        setPets(validPets);
      } catch (error: any) {
        console.error("Error fetching pets:", error);
        setErrors(["Không thể tải danh sách thú cưng. Vui lòng thử lại."]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [isOpen]);

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
    };
    return colors[(type || "other") as keyof typeof colors] || colors.other;
  };

  const getPetTypeIcon = (type: string | undefined) => {
    // You can replace these with actual icons
    const icons = {
      dog: "🐕",
      cat: "🐱",
      bird: "🐦",
      rabbit: "🐰",
      other: "🐾",
    };
    return icons[(type || "other") as keyof typeof icons] || icons.other;
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
        {description && <p className="text-sm text-gray-600">{description}</p>}

        {/* Max pets warning */}
        {maxPets && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This service allows a maximum of {maxPets} pet
              {maxPets > 1 ? "s" : ""}.
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
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        )}

        {/* Pets grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet) => {
              const isSelected = selectedPetIds.includes(pet.id);
              const isDisabled =
                !!maxPets && selectedPetIds.length >= maxPets && !isSelected;

              return (
                <div className="p-3" key={pet.id}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
                    }`}
                    onClick={() => !isDisabled && handlePetToggle(pet.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handlePetToggle(pet.id)}
                          disabled={isDisabled}
                          className="mt-1"
                        />

                        {/* Pet Image */}
                        {pet.avatar && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={pet.avatar}
                              alt={pet.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
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
                              <h3 className="font-medium text-gray-900 truncate">
                                {pet.name}
                              </h3>
                            </div>
                            <Badge className={getPetTypeColor(pet.type)}>
                              {(pet.type || "other").charAt(0).toUpperCase() +
                                (pet.type || "other").slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Tuổi: {pet.age || 0} năm</p>
                            {pet.notes && (
                              <p className="text-xs text-gray-500 truncate">
                                Ghi chú: {pet.notes}
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
          <div className="text-center py-8">
            <p className="text-gray-500">
              Không tìm thấy thú cưng. Vui lòng thêm thú cưng trước.
            </p>
          </div>
        )}

        {/* Selection summary */}
        {selectedPetIds.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
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
        <div className="flex justify-end space-x-3 pt-4 border-t">
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
