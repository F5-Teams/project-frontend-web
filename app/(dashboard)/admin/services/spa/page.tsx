export default function SpaServicesPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-pink-600">Dịch vụ Spa</h1>
        <p className="text-sm text-pink-500/80">
          Trang tạm thời cho tắm/grooming/spa thú cưng.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
          <h2 className="mb-2 font-medium text-pink-600">Tổng quan</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600">
            <li>Lịch hôm nay: 9 slot</li>
            <li>Đã đặt: 6</li>
            <li>Tình trạng: Bình thường</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
          <h2 className="mb-2 font-medium text-pink-600">Hành động nhanh</h2>
          <div className="text-sm text-slate-600">
            (Nút tạo lịch Spa sẽ đặt ở đây sau)
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-pink-600">Lịch đặt gần đây</h2>
        <div className="text-sm text-slate-600">
          Bảng dữ liệu sẽ được render ở đây.
        </div>
      </section>
    </main>
  );
}
