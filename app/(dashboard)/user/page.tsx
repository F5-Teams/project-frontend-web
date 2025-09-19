/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import {
  Heart,
  Scissors,
  Calendar,
  Star,
  ArrowRight,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RegisterFormData } from "@/components/models/register";

export default function DashboardPage() {
  const [user, setUser] = useState<RegisterFormData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const recentBookings = [
    {
      id: 1,
      service: "Pet Grooming",
      date: "2024-01-15",
      status: "Completed",
      provider: "Happy Paws Salon",
    },
    {
      id: 2,
      service: "Dog Walking",
      date: "2024-01-20",
      status: "Upcoming",
      provider: "WalkBuddy",
    },
  ];

  const adoptionRequests = [
    {
      id: 1,
      petName: "Buddy",
      breed: "Golden Retriever",
      status: "Pending",
      requestDate: "2024-01-10",
    },
    {
      id: 2,
      petName: "Luna",
      breed: "Persian Cat",
      status: "Approved",
      requestDate: "2024-01-05",
    },
  ];

  const featuredServices = [
    {
      name: "Pet Grooming",
      rating: 4.8,
      price: "$50",
      image:
        "https://i.pinimg.com/736x/53/a8/28/53a8286da006518615904b9fecadf8b0.jpg",
    },
    {
      name: "Pet Hotel",
      rating: 4.9,
      price: "$85",
      image:
        "https://images.pexels.com/photos/4498621/pexels-photo-4498621.jpeg",
    },
    {
      name: "Dog Walking",
      rating: 4.9,
      price: "$25",
      image:
        "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
    },
    {
      name: "Veterinary Care",
      rating: 4.9,
      price: "$75",
      image:
        "https://images.pexels.com/photos/6235667/pexels-photo-6235667.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins-medium text-slate-900">
            Xin chào,{" "}
            <span className="text-pink-500">
              {user && `${user.firstName} ${user.lastName}`}
            </span>
            !
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý các dịch vụ thú cưng, đặt chỗ và yêu cầu nhận nuôi của bạn
          </p>
        </div>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="#"
            className="group block rounded-xl p-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-poppins-semibold">
                  Book Pet Services
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  Find professional pet care services
                </p>
              </div>
              <Scissors className="w-10 h-10 opacity-90" />
            </div>
          </Link>

          <Link
            href="#"
            className="group block rounded-xl p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-poppins-semibold">Pet Hotels</h3>
                <p className="text-sm opacity-90 mt-1">
                  Luxury boarding for your pets
                </p>
              </div>
              <Home className="w-10 h-10 opacity-90" />
            </div>
          </Link>

          <Link
            href="#"
            className="group block rounded-xl p-6 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-poppins-semibold">Adopt a Pet</h3>
                <p className="text-sm opacity-90 mt-1">
                  Find your perfect furry companion
                </p>
              </div>
              <Heart className="w-10 h-10 opacity-90" />
            </div>
          </Link>
        </section>

        {/* Grid: Recent Bookings + Adoption Requests */}
        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins-semibold text-slate-900">
                  Recent Bookings
                </h2>
                <Link
                  href="#"
                  className="text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between bg-slate-50 rounded-md p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-md p-2 shadow">
                      <Calendar className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-poppins-medium text-slate-800">
                        {b.service}
                      </div>
                      <div className="text-sm text-slate-500">{b.provider}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">{b.date}</div>
                    <div
                      className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-poppins-medium ${
                        b.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {b.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adoption Requests */}
          <aside className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-poppins-semibold text-slate-900 mb-4">
              Adoption Requests
            </h3>
            <div className="space-y-3">
              {adoptionRequests.map((r) => (
                <div key={r.id} className="bg-slate-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-poppins-medium text-slate-800">
                        {r.petName}
                      </div>
                      <div className="text-sm text-slate-500">{r.breed}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        {r.requestDate}
                      </div>
                      <div
                        className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs ${
                          r.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Featured Services */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-poppins-semibold text-slate-900">
              Featured Services
            </h2>
            <Link href="#" className="text-indigo-600 hover:underline text-sm">
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredServices.map((s, i) => (
              <div
                key={i}
                className="border rounded-md overflow-hidden hover:shadow transition"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-poppins-medium text-sm text-slate-900">
                      {s.name}
                    </h3>
                    <div className="text-pink-500 font-poppins-semibold text-sm">
                      {s.price}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" /> {s.rating}
                    </div>
                    <Link
                      href="#"
                      className="text-indigo-600 flex items-center gap-1"
                    >
                      Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
