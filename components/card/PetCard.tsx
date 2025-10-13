"use client";

import Image from "next/image";
import type { Pet } from "@/components/models/pet";

export default function PetCard({
  pet,
  onClick,
  className = "",
}: {
  pet: Pet;
  onClick?: () => void;
  className?: string;
}) {
  const firstImg = pet.images?.[0]?.imageUrl;
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer border bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="relative w-full h-40 bg-gradient-to-br from-sky-100 to-teal-100">
        {firstImg ? (
          <Image
            src={firstImg}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Không có ảnh
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{pet.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
            {pet.species}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Giống: {pet.breed || "—"} · Tuổi: {pet.age ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">
          Cân nặng: {pet.weight ?? "—"}kg · Cao: {pet.height ?? "—"}cm
        </p>
        {pet.note ? (
          <p className="text-sm line-clamp-2 mt-1 text-slate-600">{pet.note}</p>
        ) : null}
      </div>
    </div>
  );
}
