import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, ChevronDown, ChevronUp } from "lucide-react";
import { FeedingSchedule } from "@/services/groomer/meal/type";
import { MealScheduleCard } from "./MealScheduleCard";

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
  const firstSchedule = schedules[0];
  const petName = firstSchedule.booking?.pet.name || "Unknown Pet";
  const petSpecies = firstSchedule.booking?.pet.species || "";
  const pendingCount = schedules.filter((s) => s.status === "PENDING").length;
  const fedCount = schedules.filter((s) => s.status === "FED").length;

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

      {isExpanded && (
        <div className="mt-3 ml-8 space-y-3">
          {schedules.map((schedule) => (
            <MealScheduleCard
              key={schedule.id}
              schedule={schedule}
              onMarkAsFed={onMarkAsFed}
              isMarking={isMarking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
