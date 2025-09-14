// components/shared/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, Heart, UserPlus, SunMoon } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        open &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  // Simple search handler (client-side demo)
  function onSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    // for now navigate to /adoption with query param or call a search function
    // router.push(`/search?q=${encodeURIComponent(query)}`)
    alert(`Tìm kiếm: ${query}`);
    setQuery("");
  }

  // toggle dark class on body (simple demo)
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const nav = [
    { href: "/home", label: "Home" },
    { href: "/adoption", label: "Adoption" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

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
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-pink-500 dark:hover:text-pink-400 transition"
                >
                  {n.label}
                </Link>
              ))}
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
              >
                Go
              </button>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-md border dark:border-slate-700"
            >
              <SunMoon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>

            <Link
              href="/adoption"
              className="hidden sm:inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
            >
              <Heart className="w-4 h-4" />
              Adopt
            </Link>

            <Link
              href="/register"
              className="hidden md:inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-md text-sm hover:shadow"
            >
              <UserPlus className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              Join
            </Link>

            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2 rounded-md border lg:hidden"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden transition-max-height duration-300 overflow-hidden ${
          open ? "max-h-[480px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800">
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-2 w-full">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pets or services"
                className="bg-transparent placeholder:text-slate-400 text-sm pl-2 pr-3 outline-none w-full text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-pink-500 text-white"
            >
              Go
            </button>
          </form>

          <nav className="grid gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/adoption"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              <Heart className="w-4 h-4" />
              Adopt
            </Link>
            <Link
              href="/register"
              className="flex-1 inline-flex items-center justify-center gap-2 border rounded-lg px-4 py-2"
              onClick={() => setOpen(false)}
            >
              <UserPlus className="w-4 h-4" />
              Join
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
