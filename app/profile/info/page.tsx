/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ArrowLeft, ChevronRight, Bell, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMe } from "@/services/profile/hooks";
import { useInitials } from "@/utils/useInitials";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { MiniCalendar } from "@/components/profile/MiniCalendar";

import { useBookings } from "@/services/profile/profile-schedule/hooks";
import { mapApiToBookings } from "@/components/profile/schedule/mapApiBookings";
import { WeeklySchedule } from "@/components/profile/schedule/WeeklySchedule";
import { Booking } from "@/types/scheduleType";
import { useUserPets } from "@/services/profile/profile-pet/hooks";
import { PetCard } from "@/components/profile/PetCard";

export default function InfoPage() {
  const { data: user, isLoading, error, refetch } = useMe();
  // ADD: fetch user pets
  const { data: pets } = useUserPets(user?.id);
  const { data: apiBookings, isLoading: isBookingLoading } = useBookings();
  const [timeZone, setTimeZone] = useState<string>();
  const [today, setToday] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const initials = useInitials({
    firstName: user?.firstName,
    lastName: user?.lastName,
    userName: user?.userName,
  });

  const dayStartHour = 7;
  const dayEndHour = 18;

  const bookings: Booking[] = useMemo(() => {
    if (!apiBookings) return [];
    return mapApiToBookings(apiBookings, {
      dayStartHour,
      dayEndHour,
      defaultDuration: 60,
    });
  }, [apiBookings]);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(tz);

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ); // 00:00 local
    setToday(todayStart);
    setCurrentMonth(
      new Date(todayStart.getFullYear(), todayStart.getMonth(), 1)
    );
    setSelectedDate(todayStart);
  }, []);

  return (
    <div
      className="
      mx-auto w-full
      md:py-2 lg:py-4
      sm:max-w-screen-sm md:max-w-3xl
      lg:max-w-5xl xl:max-w-7xl
    "
    >
      <div
        className="
        grid gap-4 lg:gap-6
        grid-cols-1
        lg:grid-cols-[minmax(0,1fr)_20rem]
        xl:grid-cols-[minmax(0,1fr)_22rem]
        items-start
      "
      >
        {/* Left Section */}
        <section className="min-w-0 space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Link
                href="/"
                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
              <h1 className="font-poppins-regular text-xl lg:text-2xl text-gray-900">
                Thông tin người dùng
              </h1>
            </div>

            {/* <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
              <button className="hidden md:block text-sm lg:text-base text-blue-500 hover:text-blue-600 font-medium">
                Appointments history
              </button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-6 text-sm lg:text-base">
                <span className="hidden sm:inline">+ New Patient</span>
                <span className="sm:hidden">+ Patient</span>
              </Button>
              <button className="relative hidden sm:block">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full" />
              </button>
            </div> */}
          </div>

          {/* Thông tin người dùng */}
          <UserInfoCard user={user} />

          {/* Weekly Schedule */}
          <div className="flex-1 space-y-4 lg:space-y-6">
            <WeeklySchedule
              enableWeekNav={false}
              bookings={bookings}
              dayStartHour={dayStartHour}
              dayEndHour={dayEndHour}
              slotMinutes={60}
            />
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="min-w-0 lg:space-y-2">
          <MiniCalendar
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={selectedDate}
            onSelect={setSelectedDate}
            timeZone={timeZone}
            today={today}
            className="w-full"
          />

          <div className="bg-[#1849A9] text-white rounded-2xl lg:rounded-3xl p-2 lg:p-4 shadow-lg overflow-hidden">
            <div className="rounded-xl border-2 border-dashed border-white/30 p-3">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <h3 className="text-sm lg:text-base font-poppins-medium text-white">
                  Boss yêu của bạn
                </h3>
                <Link
                  href="/profile-pet/information-pets"
                  className="inline-flex items-center px-3 py-1 rounded-2xl text-xs text-white/90 bg-white/6 hover:bg-white/10 transition"
                >
                  Xem chi tiết{"  "}
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-white/90" />
                </Link>
              </div>

              <div className="space-y-2.5 lg:space-y-3">
                {pets && pets.length > 0 ? (
                  pets
                    .slice(0, 4)
                    .map((pet) => <PetCard key={pet.id} pet={pet} />)
                ) : (
                  <div className="text-xs text-white/80">
                    Chưa có thú cưng nào.
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 
          Write Prescription Card
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl lg:rounded-3xl p-4 lg:p-6 relative overflow-hidden">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
              Write Prescription
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
              to patient
            </p>

            <button className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center text-white transition-colors relative z-10">
              <Edit3 className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            <div className="absolute bottom-0 right-0 w-24 h-24 lg:w-32 lg:h-32 opacity-60">
              <div className="relative w-full h-full">
                <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 w-16 h-20 lg:w-20 lg:h-24 bg-white rounded-lg shadow-lg transform rotate-12"></div>
                <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-12 h-16 lg:w-16 lg:h-20 bg-blue-200 rounded-lg transform -rotate-6"></div>
              </div>
            </div>
          </div> */}
        </aside>
      </div>
    </div>
  );
}
