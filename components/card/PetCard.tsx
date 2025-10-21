"use client";

import Image from "next/image";
import type { Pet } from "@/components/models/pet";
import { Trash2 } from "lucide-react";

export default function PetCard({
  pet,
  onClick,
  onDelete,
  className = "",
}: {
  pet: Pet;
  onClick?: () => void;
  onDelete?: (id: number) => void;
  className?: string;
}) {
  const firstImg = pet.images?.[0]?.imageUrl;

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer border bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
    >
      {/* Image area with gradient overlay */}
      <div className="relative w-full h-64 sm:h-56 md:h-48 lg:h-64 overflow-hidden bg-slate-100 rounded-t-2xl">
        {firstImg ? (
          <Image
            src={firstImg}
            alt={pet.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Không có ảnh
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute left-4 bottom-4 text-white">
          <h3 className="font-bold text-lg drop-shadow-md">{pet.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
              {pet.species}
            </span>
            {pet.breed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                {pet.breed}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details area */}
      <div className="p-4 bg-white/60 rounded-b-xl border-t border-pink-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">
                Giống: <span className="font-medium">{pet.breed || "—"}</span>
              </div>
              <div className="text-sm text-slate-700">
                Tuổi: <span className="font-medium">{pet.age ?? "—"}</span>
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Cân nặng:{" "}
              <span className="font-medium">{pet.weight ?? "—"} kg</span> · Cao:{" "}
              <span className="font-medium">{pet.height ?? "—"} cm</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {pet.species}
            </span>
            {pet.note ? (
              <span className="text-[10px] text-muted-foreground mt-2 max-w-xs line-clamp-2">
                {pet.note}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Delete button (floating) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(Number(pet.id));
          }}
          aria-label={`Xóa ${pet.name}`}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full p-1.5 shadow transition"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
