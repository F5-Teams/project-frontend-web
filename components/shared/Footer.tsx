import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t p-4 text-center">
      <p className="text-sm">
        © 2025 MyNextApp | <Link href="/about">About</Link>
      </p>
    </footer>
  );
}
