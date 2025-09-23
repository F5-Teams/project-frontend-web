"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { servicesSpa } from "@/constants";
import { ArrowLeftFromLine } from "lucide-react";

const PetCareCategoryPage = () => {
  const { id } = useParams();
  const category = servicesSpa.find((s) => s.id === id);

  const router = useRouter();
  if (!category) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        ❌ Dịch vụ không tồn tại
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-6">
      <ArrowLeftFromLine
        size={36}
        className="cursor-pointer border-b-2 border-transparent hover:border-black transition-all"
        onClick={() => router.push("/spa")}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800">
          {category.title}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.details.map((detail) => (
          <div
            key={detail.id}
            className="group border rounded-2xl bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="relative w-full h-56">
              <Image
                src={detail.img}
                alt={detail.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 text-center">
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                {detail.name}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {detail.description}
              </p>
              <div className="mt-4 space-y-1">
                <p className="text-pink-600 font-bold">{detail.price}</p>
                <p className="text-xs text-gray-500">
                  ⏳ Thời gian: {detail.duration}
                </p>
              </div>
              <button className="mt-4 px-4 py-2 cursor-pointer rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition">
                Đặt ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PetCareCategoryPage;
