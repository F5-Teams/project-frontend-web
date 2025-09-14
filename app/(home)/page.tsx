/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Heart, Users, Shield, Clock, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-100 via-white to-blue-100 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Find Your Perfect
              <span className="text-pink-500"> Furry Friend</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Connect with loving pets looking for homes and discover
              professional pet services near you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/adoption"
                className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition inline-flex items-center justify-center shadow-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Adopt a Pet
              </Link>
              <Link
                href="/services"
                className="border border-pink-500 text-pink-500 px-6 py-3 rounded-xl hover:bg-pink-50 transition inline-flex items-center justify-center"
              >
                Book Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://i.pinimg.com/736x/a3/06/f6/a306f65ef8db5a057355a69029245258.jpg"
              alt="Happy Pet"
              width={600}
              height={500}
              className="rounded-3xl shadow-2xl object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg">
              <p className="text-pink-500 font-bold">5k+ Adoptions</p>
              <p className="text-sm text-gray-600">and counting...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose PetHub?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Your trusted platform for pet adoption and professional services
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Shield className="h-8 w-8 text-pink-500" />,
                title: "Verified Providers",
                desc: "All our service providers and pet givers are thoroughly verified for your peace of mind.",
                bg: "bg-pink-100",
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: "Trusted Community",
                desc: "Join thousands of pet lovers who trust PetHub for adoption and services.",
                bg: "bg-blue-100",
              },
              {
                icon: <Clock className="h-8 w-8 text-green-500" />,
                title: "24/7 Support",
                desc: "Our dedicated support team is here to help you every step of the way.",
                bg: "bg-green-100",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-8 text-center"
              >
                <div
                  className={`${f.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Pets Looking for Homes
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Meet some of our adorable pets waiting for their forever families
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Buddy",
                breed: "Golden Retriever",
                age: "2 years",
                location: "San Francisco, CA",
                image:
                  "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
              },
              {
                name: "Luna",
                breed: "Persian Cat",
                age: "1 year",
                location: "Los Angeles, CA",
                image:
                  "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
              },
              {
                name: "Max",
                breed: "German Shepherd",
                age: "3 years",
                location: "New York, NY",
                image:
                  "https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg",
              },
            ].map((pet, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pet.name}
                  </h3>
                  <p className="text-gray-600">
                    {pet.breed} • {pet.age}
                  </p>
                  <p className="text-gray-500 text-sm">{pet.location}</p>
                  <Link
                    href="/adoption"
                    className="mt-4 inline-flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Professional Pet Services
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            From grooming to veterinary care, find trusted professionals near
            you
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                name: "Pet Grooming",
                rating: 4.8,
                price: "$50",
                image:
                  "https://images.pexels.com/photos/6130236/pexels-photo-6130236.jpeg",
              },
              {
                name: "Dog Walking",
                rating: 4.9,
                price: "$25",
                image:
                  "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
              },
              {
                name: "Pet Sitting",
                rating: 4.7,
                price: "$30",
                image:
                  "https://images.pexels.com/photos/4498621/pexels-photo-4498621.jpeg",
              },
              {
                name: "Veterinary Care",
                rating: 4.9,
                price: "$75",
                image:
                  "https://images.pexels.com/photos/6235667/pexels-photo-6235667.jpeg",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  width={400}
                  height={250}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {service.rating}
                      </span>
                    </div>
                    <span className="text-pink-500 font-semibold">
                      from {service.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-pink-500 to-blue-500">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-pink-100 mb-8">
            Join PetHub today and discover the joy of pet companionship
          </p>
          <Link
            href="/register"
            className="bg-white text-pink-600 px-8 py-3 rounded-xl hover:bg-gray-50 font-semibold inline-flex items-center"
          >
            Join PetHub Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
