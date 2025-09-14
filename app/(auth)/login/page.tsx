"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Banner */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-500 text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back 🐶</h1>
          <p className="text-lg text-pink-100">
            Log in to connect with loving pets and access trusted pet services.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Login to PetHub ✨
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition shadow"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-pink-500 font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-pink-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
