"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bell,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Link from "next/link";
import { useMe } from "@/services/profile/hooks";
import { useInitials } from "@/utils/useInitials";
import { UserInfoCard } from "@/components/profile/UserInfoCard";

export default function InfoPage() {
  const { data: user, isLoading, error, refetch } = useMe();
  const [currentDate, setCurrentDate] = useState(new Date(2020, 1, 1));

  const initials = useInitials({
    firstName: user?.firstName,
    lastName: user?.lastName,
    userName: user?.userName,
  });

  const appointments = [
    {
      id: 1,
      type: "Consultation",
      time: "8:00-9:15",
      day: 16,
      color: "bg-teal-50 border-teal-400",
      startHour: 8,
      duration: 1.25,
    },
    {
      id: 2,
      type: "Analysis",
      time: "11:00-12:00",
      day: 16,
      items: 6,
      color: "bg-teal-50 border-teal-400",
      startHour: 11,
      duration: 1,
    },
    {
      id: 3,
      type: "Consultation",
      time: "13:00-14:15",
      day: 17,
      color: "bg-teal-50 border-teal-400",
      startHour: 13,
      duration: 1.25,
    },
    {
      id: 4,
      type: "Operation",
      time: "9:00-11:40",
      day: 19,
      nurses: 3,
      color: "bg-yellow-50 border-yellow-400",
      startHour: 9,
      duration: 2.67,
    },
    {
      id: 5,
      type: "Analysis",
      time: "9:00-10:30",
      day: 21,
      color: "bg-teal-50 border-teal-400",
      startHour: 9,
      duration: 1.5,
    },
    {
      id: 6,
      type: "Consultation",
      time: "11:00-12:15",
      day: 22,
      color: "bg-teal-50 border-teal-400",
      startHour: 11,
      duration: 1.25,
    },
    {
      id: 7,
      type: "Rehabilitation",
      time: "12:00-13:30",
      day: 20,
      color: "bg-blue-50 border-blue-400",
      startHour: 12,
      duration: 1.5,
    },
    {
      id: 8,
      type: "Consultation",
      time: "14:00-15:15",
      day: 19,
      color: "bg-teal-50 border-teal-400",
      startHour: 14,
      duration: 1.25,
    },
    {
      id: 9,
      type: "Rehabilitation",
      time: "14:00-15:30",
      day: 21,
      color: "bg-blue-50 border-blue-400",
      startHour: 14,
      duration: 1.5,
    },
  ];

  const doctors = [
    { name: "Dr. Clarence Hamilton", role: "Therapist", color: "bg-teal-400" },
    { name: "Dr. Brett Hoffman", role: "Surgeon", color: "bg-yellow-400" },
    { name: "Dr. Miguel Leonard", role: "Hematologist", color: "bg-blue-400" },
    {
      name: "Dr. Mamie Holloway",
      role: "Rehabilitologist",
      color: "bg-blue-300",
    },
  ];

  const calendarDays = [
    [26, 27, 28, 29, 30, 31, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
  ];

  const weekDays = ["16", "17", "18", "19", "20", "21", "22"];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]; // sửa lại 'Sat' thay vì 'Sun' lần 2
  const timeSlots = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
      {/* Left Section */}
      <div className="flex-1 space-y-4 lg:space-y-6">
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

          <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
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
          </div>
        </div>

        {/* Thông tin người dùng */}
        <UserInfoCard user={user} />

        {/* Weekly Schedule */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 md:p-6 overflow-hidden">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[800px] px-4 md:px-0">
              {/* Day Headers */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 mb-4 lg:mb-6">
                <div />
                {weekDays.map((day, idx) => (
                  <div key={day} className="text-center">
                    <div
                      className={`text-lg md:text-xl lg:text-2xl font-semibold mb-1 ${
                        day === "19" ? "text-blue-500" : "text-gray-900"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="text-xs text-gray-500">{dayNames[idx]}</div>
                  </div>
                ))}
              </div>

              {/* Timeline Grid */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 relative">
                {/* Time Column */}
                <div className="relative h-[450px]">
                  {timeSlots.map((time, i) => (
                    <div
                      key={time}
                      className="absolute text-xs text-gray-500"
                      style={{ top: `${i * 56}px` }}
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="relative h-[450px] border-l border-gray-200"
                  >
                    {/* Hour Grid Lines */}
                    {timeSlots.map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full border-t border-gray-100"
                        style={{ top: `${i * 56}px` }}
                      />
                    ))}

                    {/* Appointments */}
                    {appointments
                      .filter((apt) => String(apt.day) === day)
                      .map((apt) => {
                        const topPosition = (apt.startHour - 8) * 56;
                        const height = apt.duration * 56;
                        return (
                          <div
                            key={apt.id}
                            className={`absolute ${apt.color} border-l-4 rounded-lg p-2 mx-1`}
                            style={{
                              top: `${topPosition}px`,
                              height: `${height}px`,
                              left: "4px",
                              right: "4px",
                            }}
                          >
                            <div className="text-xs font-semibold text-gray-900 leading-tight">
                              {apt.type}
                            </div>
                            {"items" in apt && apt.items && (
                              <div className="text-xs text-gray-600">
                                ({apt.items} items)
                              </div>
                            )}
                            <div className="text-xs text-gray-600">
                              {apt.time}
                            </div>
                            {"nurses" in apt && apt.nurses && (
                              <div className="text-xs text-yellow-600 mt-1">
                                +{apt.nurses} nurses
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-80 space-y-4 lg:space-y-6">
        {/* Mini Calendar */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900">
              February 2020
            </h3>
            <div className="flex space-x-2">
              <button className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <button className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 lg:gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
            {calendarDays.flat().map((day, idx) => (
              <div
                key={`${day}-${idx}`}
                className={`text-xs lg:text-sm py-1 lg:py-1.5 rounded-lg ${
                  day === 19
                    ? "bg-blue-500 text-white font-semibold"
                    : day < 10 && idx > 5
                    ? "text-gray-900 hover:bg-gray-100"
                    : idx < 6
                    ? "text-gray-400"
                    : "text-gray-900 hover:bg-gray-100"
                } cursor-pointer transition-colors`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900">
              Doctors
            </h3>
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
          </div>

          <div className="space-y-2.5 lg:space-y-3">
            {doctors.map((doctor, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2.5 lg:space-x-3"
              >
                <div
                  className={`w-9 h-9 lg:w-10 lg:h-10 ${doctor.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-xs lg:text-sm truncate">
                    {doctor.name}
                  </div>
                  <div className="text-xs text-gray-500">{doctor.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write Prescription Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl lg:rounded-3xl p-4 lg:p-6 relative overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
