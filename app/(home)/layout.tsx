import { Footer, Header } from "@/components/shared";
import { PushLayout } from "@/components/cart/PushLayout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PushLayout>
      <div className="bg-linear-to-b from-pink-100 via-white to-yellow-100 min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden pt-24">{children}</main>
        <Footer />
      </div>
    </PushLayout>
  );
}
