import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, ChevronDown, ChevronUp } from "lucide-react";
import { FeedingSchedule } from "@/services/groomer/meal/type";
import { MealScheduleCard } from "./MealScheduleCard";
import { gsap } from "gsap";

interface BookingCardProps {
  bookingId: number;
  schedules: FeedingSchedule[];
  isExpanded: boolean;
  onToggle: () => void;
  onMarkAsFed: (scheduleId: number, quantity: string, notes?: string) => void;
  isMarking: boolean;
}

export function BookingCard({
  bookingId,
  schedules,
  isExpanded,
  onToggle,
  onMarkAsFed,
  isMarking,
}: BookingCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const firstSchedule = schedules[0];
  const petName = firstSchedule.booking?.pet.name || "Unknown Pet";
  const petSpecies = firstSchedule.booking?.pet.species || "";
  const pendingCount = schedules.filter((s) => s.status === "PENDING").length;
  const fedCount = schedules.filter((s) => s.status === "FED").length;

  useEffect(() => {
    if (!contentRef.current) return;

    if (isExpanded) {
      // Set initial state before animation
      gsap.set(contentRef.current, {
        height: "auto",
      });

      // Get actual height
      const actualHeight = contentRef.current.scrollHeight;

      // Animate from 0 to actual height
      gsap.fromTo(
        contentRef.current,
        {
          height: 0,
          opacity: 0,
        },
        {
          height: actualHeight,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            // Set to auto after animation completes
            if (contentRef.current) {
              gsap.set(contentRef.current, { height: "auto" });
            }
          },
        }
      );

      // Animate each meal card
      const cards = contentRef.current.querySelectorAll(".meal-card");
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: -15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    } else {
      // Get current height before collapsing
      const currentHeight = contentRef.current.scrollHeight;

      // Animate cards first (collapse up)
      const cards = contentRef.current.querySelectorAll(".meal-card");
      gsap.to(cards, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.in",
      });

      // Then animate container
      gsap.fromTo(
        contentRef.current,
        {
          height: currentHeight,
        },
        {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
          delay: 0.15,
        }
      );
    }
  }, [isExpanded]);

  return (
    <div className="relative">
      {!isExpanded && schedules.length > 1 && (
        <>
          <div className="absolute top-2 left-2 right-2 h-full bg-gray-100 rounded-lg -z-10" />
          <div className="absolute top-4 left-4 right-4 h-full bg-gray-50 rounded-lg -z-20" />
        </>
      )}

      <Card
        className="border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-shadow"
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PawPrint className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-poppins-regular text-lg">
                  Bé {petName}{" "}
                  <span className="text-sm font-poppins-light text-gray-500">
                    ({petSpecies})
                  </span>
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="font-poppins-light">
                    Booking #{bookingId}
                  </span>

                  {pendingCount > 0 && (
                    <span className="text-orange-600 font-poppins-meium">
                      • {pendingCount} bữa chưa cho ăn
                    </span>
                  )}
                  {fedCount > 0 && (
                    <span className="text-green-600 font-medium">
                      • {fedCount} bữa đã cho ăn
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        ref={contentRef}
        className="mt-3 ml-8 space-y-3 overflow-hidden"
        style={{ height: isExpanded ? "auto" : 0 }}
      >
        {schedules.map((schedule) => (
          <div key={schedule.id} className="meal-card">
            <MealScheduleCard
              schedule={schedule}
              onMarkAsFed={onMarkAsFed}
              isMarking={isMarking}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
