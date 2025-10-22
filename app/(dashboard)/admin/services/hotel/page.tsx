export default function HotelServicesPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-pink-600">Dịch vụ Hotel</h1>
        <p className="text-sm text-pink-500/80">
          Trang tạm thời cho quản lý đặt phòng, boarding, v.v.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
          <h2 className="mb-2 font-medium text-pink-600">Tổng quan</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600">
            <li>Phòng hiện có: 12</li>
            <li>Đang lưu trú: 7</li>
            <li>Tỉ lệ lấp đầy: 58%</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
          <h2 className="mb-2 font-medium text-pink-600">Hành động nhanh</h2>
          <div className="text-sm text-slate-600">
            (Nút tạo đặt phòng / check-in sẽ đặt ở đây sau)
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-pink-100 bg-white/70 p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-pink-600">Đặt phòng gần đây</h2>
        <div className="text-sm text-slate-600">
          Bảng dữ liệu sẽ được render ở đây.
        </div>
      </section>
    </main>
  );
}
