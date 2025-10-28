"use client";


// Helper functions to replace mock data
const calculateDeposit = (totalPrice: number, percentage: number = 0.5): number => {
  return Math.round(totalPrice * percentage);
};

const applyWeekendSurcharge = (price: number, isWeekend: boolean = false): number => {
  return isWeekend ? Math.round(price * 1.1) : price;
};

const calculateRoomPrice = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};

const calculateCustomComboPrice = (serviceIds: string[], services: any[]): number => {
  return serviceIds.reduce((total, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
};

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Calendar,
  Clock,
  User,
  Home,
  Package,
} from "lucide-react";
import { CartDrawer, CheckoutModal, SuccessScreen } from "@/components/cart";
import {
  SelectPetsModal,
  SingleServiceBookingModal,
  ComboBookingModal,
  CustomComboBookingModal,
  RoomBookingModal,
} from "@/components/modals";
import { useCartStore } from "@/stores/cart.store";
import { CartItemType } from "@/types/cart";

export const BookingExample: React.FC = () => {
  const { addItem } = useCartStore();
  const [showSelectPets, setShowSelectPets] = useState(false);
  const [showSingleService, setShowSingleService] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [showCustomCombo, setShowCustomCombo] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [currentBookingData, setCurrentBookingData] = useState<{
    type: CartItemType;
    serviceId?: string;
    comboId?: string;
    roomId?: string;
  } | null>(null);
  const [successData, setSuccessData] = useState<{
    bookingId: string;
    totalPrice: number;
    depositAmount: number;
  } | null>(null);

  const handleBookService = (
    type: CartItemType,
    serviceId?: string,
    comboId?: string,
    roomId?: string
  ) => {
    setCurrentBookingData({ type, serviceId, comboId, roomId });
    setShowSelectPets(true);
  };

  const handlePetsSelected = (petIds: string[]) => {
    setSelectedPetIds(petIds);
    setShowSelectPets(false);

    // Open appropriate booking modal based on type
    if (currentBookingData) {
      switch (currentBookingData.type) {
        case "single":
          setShowSingleService(true);
          break;
        case "combo":
          setShowCombo(true);
          break;
        case "custom":
          setShowCustomCombo(true);
          break;
        case "room":
          setShowRoom(true);
          break;
      }
    }
  };

  const handleBookingConfirm = async (item: any) => {
    const result = await addItem(item);
    if (result.success) {
      // Close current modal
      setShowSingleService(false);
      setShowCombo(false);
      setShowCustomCombo(false);
      setShowRoom(false);

      // Reset state
      setCurrentBookingData(null);
      setSelectedPetIds([]);
    }
  };

  const handleCheckoutSuccess = (bookingId: string) => {
    setSuccessData({
      bookingId,
      totalPrice: 0, // Would be calculated from cart
      depositAmount: 0, // Would be calculated from cart
    });
    setShowCheckout(false);
    setShowSuccess(true);
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setSuccessData(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pet Booking System Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Click on any service below to see the complete booking flow in
            action
          </p>

          {/* Cart Drawer Trigger */}
          <CartDrawer>
            <Button className="mb-6">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Cart
            </Button>
          </CartDrawer>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Single Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Single Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockServices.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {service.duration}min
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${service.price}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBookService("single", service.id)}
                      className="mt-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Combos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Combo Packages</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCombos.map((combo) => (
                <div
                  key={combo.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{combo.name}</h4>
                    <p className="text-sm text-gray-600">
                      {combo.benefits.join(", ")}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {combo.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${combo.price}
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleBookService("combo", undefined, combo.id)
                      }
                      className="mt-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Hotel Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Hotel Rooms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRooms.slice(0, 2).map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-gray-600">
                      Capacity: {room.capacity} pet
                      {room.capacity > 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {room.amenities.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${room.pricePerNight}/night
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleBookService("room", undefined, undefined, room.id)
                      }
                      className="mt-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Custom Combo Button */}
        <div className="text-center mb-8">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleBookService("custom")}
            className="min-w-[200px]"
          >
            <Package className="mr-2 h-4 w-4" />
            Create Custom Combo
          </Button>
        </div>

        {/* Demo Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Demo Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Click "Book" on any service above to start the booking process
              </li>
              <li>Select pets for the service in the modal that appears</li>
              <li>Fill in the booking details (groomer, time, dates, etc.)</li>
              <li>Add the item to your cart</li>
              <li>Click "View Cart" to see your items</li>
              <li>Proceed to checkout to complete the booking</li>
              <li>View the success screen with booking confirmation</li>
            </ol>
            <p className="mt-4 font-medium">
              All data is mocked and persisted in localStorage for demonstration
              purposes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SelectPetsModal
        isOpen={showSelectPets}
        onClose={() => setShowSelectPets(false)}
        onConfirm={handlePetsSelected}
        serviceId={currentBookingData?.serviceId}
        maxPets={
          currentBookingData?.serviceId
            ? mockServices.find((s) => s.id === currentBookingData.serviceId)
                ?.maxPets
            : undefined
        }
        title="Select Pets"
        description="Choose which pets will receive this service"
      />

      <SingleServiceBookingModal
        isOpen={showSingleService}
        onClose={() => setShowSingleService(false)}
        onConfirm={handleBookingConfirm}
        serviceId={currentBookingData?.serviceId || ""}
        selectedPetIds={selectedPetIds}
      />

      <ComboBookingModal
        isOpen={showCombo}
        onClose={() => setShowCombo(false)}
        onConfirm={handleBookingConfirm}
        comboId={currentBookingData?.comboId || ""}
        selectedPetIds={selectedPetIds}
      />

      <CustomComboBookingModal
        isOpen={showCustomCombo}
        onClose={() => setShowCustomCombo(false)}
        onConfirm={handleBookingConfirm}
        selectedPetIds={selectedPetIds}
      />

      <RoomBookingModal
        isOpen={showRoom}
        onClose={() => setShowRoom(false)}
        onConfirm={handleBookingConfirm}
        roomId={currentBookingData?.roomId || ""}
        selectedPetIds={selectedPetIds}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {showSuccess && successData && (
        <SuccessScreen
          bookingId={successData.bookingId}
          totalPrice={successData.totalPrice}
          depositAmount={successData.depositAmount}
          onContinueShopping={handleContinueShopping}
        />
      )}
    </div>
  );
};

export default BookingExample;
