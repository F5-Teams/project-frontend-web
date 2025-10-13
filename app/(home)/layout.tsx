import { Footer, Header } from "@/components/shared";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-pink-100 via-white to-yellow-100 min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
