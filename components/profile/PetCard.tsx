import React from "react";
import type { Pet } from "@/services/profile/profile-pet/types";
import Image from "next/image";
import { Heart } from "lucide-react";

type Props = {
  pet: Pet;
};

export function PetCard({ pet }: Props) {
  const img = pet.images?.[0]?.imageUrl ?? "/images/pet-placeholder.png";

  return (
    <div className="rounded-2xl overflow-hidden" role="group">
      {/* Outer solid background */}
      <div className="bg-white/10 text-white p-3 rounded-2xl shadow-md">
        {/* Inner dashed border */}

        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5">
            <Image
              src={img}
              alt={pet.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="font-poppins-medium text-sm text-white truncate">
                {pet.name}
              </div>
              <div className="text-xs text-white/80">{pet.species}</div>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <div className="text-xs text-white/80 truncate">{pet.breed}</div>
              <div className="ml-auto">
                <button
                  aria-label={`Like ${pet.name}`}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-none transition"
                  title="Like"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
