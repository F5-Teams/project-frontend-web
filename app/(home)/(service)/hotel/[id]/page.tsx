"use client";

import { hotelServices } from "@/constants";
import { ArrowLeftFromLine, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const PetHotelDetailPage = () => {
  const { id } = useParams();
  const category = hotelServices.find((item) => item.id === id);
  const router = useRouter();

  if (!category) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        ❌ Khách sạn không tồn tại
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-6">
      <ArrowLeftFromLine
        size={36}
        className="cursor-pointer mb-6 border-b-2 border-transparent hover:border-black transition-all"
        onClick={() => router.push("/hotel")}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-pink-600">
          {category.title}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="relative w-full md:w-1/2 h-[400px] rounded-xl overflow-hidden">
          <Image
            src={category.img}
            alt={category.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">Chi tiết phòng</h2>
          <p className="text-gray-600 mt-2">{category.subtitle}</p>

          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Diện tích:</strong> {category.details.size}
            </li>
            <li>
              <strong>Giường:</strong> {category.details.bed}
            </li>
            <li>
              <strong>View:</strong> {category.details.view}
            </li>
            <li>
              <strong>Sức chứa tối đa:</strong> {category.details.maxGuests} bé
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-pink-600 mt-6">
            Tiện nghi
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {category.details.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-pink-500 mt-1">
              {category.price}
            </p>

            <button className="flex items-center gap-2 mt-4 px-4 py-2 cursor-pointer rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition">
              <ShoppingCart className="w-5 h-5" />
              <p>Đặt ngay</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PetHotelDetailPage;
