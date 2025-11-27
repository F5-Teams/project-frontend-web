import {
  HeroSection,
  HowItWorksSection,
  InformationSection,
  OurHappyClientsSection,
  OurServicesSection,
} from "@/components/home";
import { Background3D } from "@/components/home/Background3D";

export default function LandingPage() {
  return (
    <div className="w-full max-w-none mx-auto relative">
      {/* 3D Background */}
      <Background3D />

      <div className="flex flex-col w-full relative z-10">
        <HeroSection />
        <InformationSection />
        <OurServicesSection />
        <HowItWorksSection />
        <OurHappyClientsSection />
      </div>
      {/* Floating chat widget moved to global layout */}
    </div>
  );
}
