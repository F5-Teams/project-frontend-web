import { Footer, Header } from "@/components/shared";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-pink-100 via-white to-yellow-100 min-h-screen flex flex-col w-full transition-all duration-300 ease-in-out">
      <div className="transition-all duration-300 ease-in-out">
        <Header />
      </div>
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {children}
      </main>
      <div className="transition-all duration-300 ease-in-out">
        <Footer />
      </div>
    </div>
  );
}
