import {
  HeroSection,
  HowItWorksSection,
  InformationSection,
  OurHappyClientsSection,
  OurServicesSection,
} from "@/components/home";

export default function LandingPage() {
  return (
    <div className="w-full max-w-none mx-auto">
      <div className="flex flex-col w-full">
        <HeroSection />
        <InformationSection />
        <OurServicesSection />
        <HowItWorksSection />
        <OurHappyClientsSection />
      </div>
    </div>
  );
}
