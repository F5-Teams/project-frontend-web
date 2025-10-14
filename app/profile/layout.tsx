import Sidebar from "@/components/profile/Sidebar";
import { Footer, Header } from "@/components/shared";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-pink-100 via-white to-yellow-100 min-h-screen flex flex-col w-full">
      <Header />
      <div className="grid md:grid-cols-[260px_1fr] gap-6 px-16 pb-6">
        <Sidebar />
        <main
          className="
            relative overflow-hidden rounded-2xl
            bg-white/35 dark:bg-neutral-900/25 backdrop-blur-xl
            border border-white/25 dark:border-white/10
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          "
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-white/10 to-transparent [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
          <div className="relative p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
