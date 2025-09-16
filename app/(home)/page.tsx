"use client";

import HeroSection from "@/components/home/HeroSection";
import InformationSection from "@/components/home/InformationSection";

export default function LandingPage() {
  return (
    <div className="w-full max-w-none mx-auto">
      <div className="flex flex-col w-full">
        <HeroSection />
        <InformationSection />
      </div>
    </div>
  );
}
