// "use client";
// import { useState } from "react";
// import { WeeklySchedule, BookingList, Booking } from "@/components/schedule/WeeklySchedule";

// export default function ScheduleDetailPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);

//   // giả lập fetch: bạn có thể call API dựa trên viewStart/viewEnd trong onWeekChange
//   const handleWeekChange = (viewStart: Date, viewEnd: Date) => {
//     // ví dụ: fetch(`/api/bookings?start=${viewStart.toISOString()}&end=${viewEnd.toISOString()}`)
//     // setBookings(await res.json())
//   };

//   return (
//     <div className="space-y-6">
//       <WeeklySchedule
//         enableWeekNav
//         bookings={bookings}
//         onWeekChange={(start, end) => handleWeekChange(start, end)}
//         dayStartHour={8}
//         dayEndHour={18}
//         slotMinutes={60}
//       />
//       <BookingList bookings={bookings} title="All bookings in view" />
//     </div>
//   );
// }
