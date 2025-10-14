import {
  Scissors,
  Home,
  ShoppingBag,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Tiêu đề chính */}
        <section className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Về chúng tôi
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            HappyPaws được thành lập với sứ mệnh mang đến dịch vụ chăm sóc toàn
            diện và sản phẩm chất lượng cao cho thú cưng. Chúng tôi tin rằng thú
            cưng không chỉ là vật nuôi, mà còn là những người bạn thân thiết
            trong gia đình.
          </p>
        </section>

        {/* Sứ mệnh */}
        <section className="bg-card rounded-2xl shadow-sm p-8 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Sứ mệnh</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sứ mệnh của HappyPaws là tạo ra một hệ sinh thái dịch vụ và sản phẩm
            dành cho thú cưng, giúp các bé luôn khỏe mạnh, sạch sẽ và hạnh phúc.
            Chúng tôi mong muốn mang đến sự an tâm cho chủ nuôi khi gửi gắm thú
            cưng tại HappyPaws.
          </p>
        </section>

        {/* Dịch vụ chính */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground text-center">
            Dịch vụ chính
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-card rounded-xl p-6 shadow-sm text-center">
              <div className="flex items-center justify-center mb-3">
                <Scissors className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Spa & Grooming
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dịch vụ tắm, cắt tỉa và chăm sóc toàn diện, giúp thú cưng luôn
                sạch sẽ và thơm tho.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm text-center">
              <div className="flex items-center justify-center mb-3">
                <Home className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Khách sạn thú cưng
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Không gian lưu trú an toàn, tiện nghi, giúp thú cưng được chăm
                sóc như ở nhà.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm text-center">
              <div className="flex items-center justify-center mb-3">
                <ShoppingBag className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Sản phẩm thú cưng
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cung cấp đa dạng sản phẩm như thức ăn, đồ chơi, phụ kiện, đảm
                bảo chất lượng và an toàn.
              </p>
            </div>
          </div>
        </section>

        {/* Đội ngũ */}
        <section className="bg-card rounded-2xl shadow-sm p-8 space-y-4 text-center">
          <div className="flex justify-center mb-3">
            <Users className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Đội ngũ</h2>
          <p className="text-muted-foreground leading-relaxed">
            Đội ngũ nhân viên của HappyPaws là những người yêu thương động vật,
            được đào tạo chuyên nghiệp và luôn tận tâm. Chúng tôi cam kết đem
            đến trải nghiệm tốt nhất cho cả thú cưng và chủ nuôi.
          </p>
        </section>
      </main>
    </div>
  );
}
