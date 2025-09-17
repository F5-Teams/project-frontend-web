"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();
  // Simple search handler (client-side demo)
  function onSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    alert(`Tìm kiếm: ${query}`);
    setQuery("");
  }

  const nav = [
    { href: "/", label: "Home" },
    { href: "/adoption", label: "Adoption" },
    { href: "/", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b dark:border-slate-800 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                P
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  PetHub
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300 -mt-0.5">
                  Find your furry friend
                </div>
              </div>
            </Link>
          </div>

          {/* Middle: Nav (desktop) + Search */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <nav className="flex items-center gap-6">
              {nav.map((n) => {
                return (
                  <div
                    key={n.href}
                    className="relative"
                    onMouseEnter={() => n.label === "Services" && setOpen(true)}
                    onMouseLeave={() =>
                      n.label === "Services" && setOpen(false)
                    }
                  >
                    <Link
                      href={n.href}
                      className="text-sm font-medium text-gray-700 hover:text-pink-500"
                    >
                      {n.label}
                    </Link>

                    {n.label === "Services" && open && (
                      <div className="absolute left-1/2 top-6 -translate-x-1/2 bg-white shadow-2xl z-30 rounded-2xl">
                        <div className="grid grid-cols-3 gap-6 p-8 min-w-[900px]">
                          <div
                            onClick={() => handleNavigate("/spa")}
                            className="flex flex-col items-center bg-gray-50 hover:bg-pink-50 border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              viewBox="0 0 56 56"
                            >
                              <path
                                fill="#dcb342"
                                fill-rule="evenodd"
                                d="M43.882 22.666c1.508-.66 2.652-1.778 3.725-2.9c1.223-1.279 1.239-2.882 1.239-3.721c0-1.334-1.253-2.386-3.29-2.435c-1.079-.026-1.738.243-2.637.898c-.644.468-2.153 2-1.48 3.253q.052.098.173.237a.52.52 0 0 1 .008.668a.47.47 0 0 1-.651.073l-.106-.082c-1.33-1.016-2.054-1.394-2.054-2.899c0-2.832 3.737-5.553 7.346-5.466c3.605.087 6.412 2.69 6.412 5.725c0 1.66-1.058 4.015-2.788 5.825a11.5 11.5 0 0 1-3.921 2.684q.141.232.29.503c.98 1.786.852 2.003.977 4.234c.124 2.232-.536 6.222-.283 8.188c.254 1.965 1.523 2.184 1.802 3.6q.265 1.346 1.317 11.68a1 1 0 0 1-.996 1.104h-2.057a1 1 0 0 1-.998-.998v-.497c0-.315.148-.612.4-.8l.318-.239a1 1 0 0 0 .383-.986q-.82-4.368-1.442-5.259c-.306-.44-1.688-1.157-3.47-2.547q-.479-.374-1.72-1.592a.5.5 0 0 0-.848.296q-.226 1.805-.561 3.042q-.405 1.492-2.489 7.777a1 1 0 0 1-.95.686h-2.618a.895.895 0 0 1-.894-.894v-.06a1 1 0 0 1 .821-.985l1.123-.206q1.209-4.416 1.055-6.469c-.072-.968-.726-2.094-1.385-4.054q-.206-.611-.578-2.5a.5.5 0 0 0-.617-.387l-6.663 1.726a.5.5 0 0 0-.316.72l.157.296c.3.562.456 1.19.456 1.827v9.36c0 .311-.145.605-.392.795l-1.397 1.07a1 1 0 0 1-.61.207H22.67a1 1 0 0 1-1-1.001v-.51c0-.363.195-.698.512-.875l.72-.402a1 1 0 0 0 .51-.958q-.17-2.027-.422-3.083q-.258-1.09-1.253-3.886a.5.5 0 0 0-.799-.21l-.195.168c-.489.423-1.086.7-1.724.803l-6.252 1a.5.5 0 0 0-.291.83l.665.732c.168.184.26.424.26.673v.654a1 1 0 0 1-1.03 1l-.82-.024a1 1 0 0 1-.767-.394L9.75 46.327a1 1 0 0 1-.205-.607v-1.988c0-.347.18-.67.475-.852q6.407-3.96 6.948-4.38q.561-.435.468-1.454c-.696-2.067-1.811-2.799-2.312-4.023s-1.43-5.03-1.89-6.492c-.925-2.94-1.737-4.495-1.956-4.96c-.492-1.044-1.36-1.192-2.277-1.552s-2.66-.306-3.794-1.301c-1.133-.996-1.029-2.036-1.293-3.168v-1.385c0-.553.449-1.001 1.002-1.001h2.716c.367 0 .704-.2.88-.523q.465-.854 1.486-1.631a8.6 8.6 0 0 1 3.039-1.469q-.375-4.671 0-5.277t2.087 1.896q.244-2.946.955-2.16q.663.735 2.288 5.34c.142.4.347.778.607 1.115q.682.882 1.232 2.11c.697 1.556 1.511 5.62 2.952 7.619c1.44 1.999 2.281 2.163 4.361 2.533c1.382.246 6.147-.54 10.05-.692c3.006-.118 5.424.388 5.86.5q.235.06.453.14"
                                stroke-width="1.5"
                                stroke="#dcb342"
                              />
                            </svg>

                            <p className="mt-4 font-semibold text-gray-800 text-lg">
                              Chăm sóc thú cưng
                            </p>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                              Dịch vụ grooming, tắm rửa, làm đẹp cho thú cưng.
                            </p>
                          </div>

                          <div
                            onClick={() => handleNavigate("/hotel")}
                            className="flex flex-col items-center bg-gray-50 hover:bg-pink-50 border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#42dcce"
                                d="m12.707 2.293l9 9c.63.63.184 1.707-.707 1.707h-1v6a3 3 0 0 1-3 3h-1v-7a3 3 0 0 0-2.824-2.995L13 12h-2a3 3 0 0 0-3 3v7H7a3 3 0 0 1-3-3v-6H3c-.89 0-1.337-1.077-.707-1.707l9-9a1 1 0 0 1 1.414 0M13 14a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883-.993L11 14z"
                                stroke-width="0.5"
                                stroke="#42dcce"
                              />
                            </svg>

                            <p className="mt-4 font-semibold text-gray-800 text-lg">
                              Khách sạn thú cưng
                            </p>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                              Lưu trú an toàn, tiện nghi khi bạn đi xa.
                            </p>
                          </div>

                          <div
                            onClick={() => handleNavigate("/spa-hotel")}
                            className="flex flex-col items-center bg-gray-50 hover:bg-pink-50 border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="60"
                              height="60"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#d58ffa"
                                fill-rule="evenodd"
                                d="M8.499 5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m4.631 5.825a3.926 3.926 0 0 1 5.552 5.553l-.01.01l-6.677 6.676l-.522-.53l-6.147-6.146l-.01-.01a3.923 3.923 0 1 1 5.727-5.356l.956.956l.895-.895q.111-.134.236-.258"
                                clip-rule="evenodd"
                                stroke-width="0.5"
                                stroke="#d58ffa"
                              />
                            </svg>

                            <p className="mt-4 font-semibold text-gray-800 text-lg">
                              Chăm sóc + Khách sạn
                            </p>
                            <p className="text-sm text-gray-500 mt-1 text-center">
                              Combo chăm sóc & lưu trú tiết kiệm cho boss.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <form
              onSubmit={onSearch}
              className="ml-6 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 shadow-sm"
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pets, services..."
                className="bg-transparent placeholder:text-slate-400 text-sm pl-2 pr-3 outline-none text-slate-900 dark:text-slate-100 w-64"
                aria-label="Search"
              />
              <button
                aria-label="Search"
                type="submit"
                className="ml-1 text-sm text-pink-500"
              ></button>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
            >
              <Heart className="w-4 h-4" />
              Login
            </Link>

            <Link
              href="/register"
              className="hidden md:inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-md text-sm hover:shadow"
            >
              <UserPlus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
