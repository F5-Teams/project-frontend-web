"use client";
import { motion } from "framer-motion";
import { Check, LucideHome, Star, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cardVariants } from "@/constants";
import { useState } from "react";
import { SelectPetsModal } from "@/components/modals/SelectPetsModal";
import { RoomBookingModal } from "@/components/modals/RoomBookingModal";
import { useCartStore } from "@/stores/cart.store";
import { BookingDraft } from "@/types/cart";
import { useHotelRooms } from "@/services/hotel";

const PetHotelPage = () => {
  const { addItems } = useCartStore();
  const { rooms, loading, error, refetch } = useHotelRooms();

  // Modal states
  const [isSelectPetsOpen, setIsSelectPetsOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);

  const handleBookRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsSelectPetsOpen(true);
  };

  const handlePetsSelected = (petIds: string[]) => {
    setSelectedPetIds(petIds);
    setIsSelectPetsOpen(false);
    setIsBookingModalOpen(true);
  };

  // Find selected room from available rooms for passing to modal
  const selectedRoom = rooms.find(
    (room) => room.id.toString() === selectedRoomId
  );

  const handleBookingConfirm = async (bookingDrafts: BookingDraft[]) => {
    const result = await addItems(bookingDrafts);
    if (result.success) {
      setIsBookingModalOpen(false);
      // Optionally show success message or redirect
    }
  };
  return (
    <main className="min-h-screen ">
      <section className="py-10 ">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Dịch vụ <span className="text-pink-500">Khách sạn Thú Cưng</span>
            </h1>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Mang đến cho thú cưng của bạn một nơi ở an toàn, tiện nghi và vui
              chơi thoải mái. Từ phòng riêng, khu vui chơi đến dịch vụ chăm sóc
              24/7 – tất cả đều được thực hiện bởi đội ngũ yêu động vật tận tâm.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <iframe
              width="600"
              height="400"
              className="rounded-2xl"
              src="https://www.youtube.com/embed/lNf-JrfbR2A"
              title="I Tested 5-Star Hotels Made for Dogs"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className="flex-1 text-slate-600 text-lg leading-relaxed">
            <p>
              Tại Pet Hotel, mỗi thú cưng được chăm sóc trong không gian thoải
              mái, ấm áp như ở nhà. Khu vui chơi rộng rãi, phòng riêng tiện nghi
              và đội ngũ chăm sóc 24/7 đảm bảo an toàn tuyệt đối.
            </p>
            <p className="mt-4 font-semibold text-pink-600">
              Chăm sóc tận tâm, an toàn & vui chơi không giới hạn!
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#fbedf6]">
        <div className="flex gap-2 justify-center">
          <h1 className="text-4xl mb-10 font-bold">Lựa chọn</h1>
          <h1 className="text-4xl mb-10 font-bold text-pink-600">Của Bạn</h1>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                <p className="text-slate-600">Đang tải danh sách phòng...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={refetch}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không có phòng nào có sẵn</p>
                <button
                  onClick={refetch}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Tải lại
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {rooms.map((room, idx) => {
                const roomData = {
                  id: room.id.toString(),
                  name: room.name,
                  description:
                    room.description ||
                    `Phòng ${room.class} tiện nghi và an toàn`,
                  price: parseInt(room.price),
                  image: room.images?.[0]?.imageUrl || "/images/hotel1.jpg",
                  isAvailable: room.isAvailable ?? true, // Use API value or default to true
                  totalAvailableRooms: 1,
                };

                return (
                  <motion.div
                    key={roomData.id}
                    custom={idx}
                    variants={cardVariants}
                    className="group relative rounded-2xl border bg-white shadow-md p-6 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-500 flex flex-col h-full"
                  >
                    <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden mb-4 flex-shrink-0">
                      <Image
                        src={roomData.image || "/images/hotel1.jpg"}
                        alt={roomData.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg">
                        <LucideHome className="w-6 h-6" />
                      </div>
                      {roomData.isAvailable &&
                        roomData.totalAvailableRooms > 0 && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Có sẵn
                          </div>
                        )}
                      {(!roomData.isAvailable ||
                        roomData.totalAvailableRooms === 0) && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Hết chỗ
                        </div>
                      )}
                    </div>

                    {/* Title & Description - Fixed height */}
                    <div className="flex-shrink-0">
                      <h3 className="h-14 text-lg md:text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 flex items-center">
                        {roomData.name}
                      </h3>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed h-12 line-clamp-2">
                        {roomData.description}
                      </p>
                    </div>

                    {/* Flexible spacer */}
                    <div className="flex-grow" />

                    {/* Price & Duration - Fixed height with border */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                      <p className="font-semibold text-pink-600">
                        {roomData.price > 0
                          ? `${roomData.price.toLocaleString()}đ/đêm`
                          : "Liên hệ"}
                      </p>
                    </div>

                    {/* Button - Always at bottom */}
                    <button
                      className={`mt-4 px-4 py-2 cursor-pointer rounded-lg font-medium transition flex-shrink-0 w-full ${
                        roomData.isAvailable && roomData.totalAvailableRooms > 0
                          ? "bg-pink-500 text-white hover:bg-pink-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        roomData.isAvailable &&
                        roomData.totalAvailableRooms > 0 &&
                        handleBookRoom(roomData.id)
                      }
                      disabled={
                        !roomData.isAvailable ||
                        roomData.totalAvailableRooms === 0
                      }
                    >
                      {roomData.isAvailable && roomData.totalAvailableRooms > 0
                        ? "Đặt ngay"
                        : "Hết chỗ"}
                    </button>
                    <span className="hidden sm:inline-block mt-3 text-sm text-pink-600 font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Xem chi tiết →
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
              Vì sao chọn <span className="text-pink-500">Pet Hotel?</span>
            </h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <Star size={24} color="#cbbd25" strokeWidth={1.5} />
                Giám sát 24/7, đảm bảo an toàn tuyệt đối
              </li>
              <li className="flex gap-3">
                <Star size={24} color="#cbbd25" strokeWidth={1.5} /> Phòng tiện
                nghi, thoáng mát và sạch sẽ
              </li>
              <li className="flex gap-3">
                <Star size={24} color="#cbbd25" strokeWidth={1.5} /> Khu vui
                chơi rộng rãi, vận động thoải mái
              </li>
              <li className="flex gap-3">
                <Star size={24} color="#cbbd25" strokeWidth={1.5} /> Hình ảnh &
                video cập nhật mỗi ngày
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              “Bé Corgi của mình cực kỳ vui khi ở Pet Hotel. Nhìn video mỗi ngày
              thấy bé chạy nhảy thoải mái và khỏe mạnh, mình hoàn toàn yên tâm.”
            </p>
            <div className="mt-4 font-semibold text-pink-600">
              – Khách hàng hài lòng 🐶
            </div>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-20 text-center mt-20"
        >
          <section className="py-20 bg-[#fdf2f8]">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full h-100 md:h-100 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={"/images/hotel7.jpg"}
                    alt="Dịch vụ Pet Hotel"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-slate-800">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                  Dịch vụ{" "}
                  <span className="text-pink-500">toàn diện cho thú cưng</span>
                </h2>
                <p className="text-lg leading-relaxed mb-4">
                  Tại Pet Hotel, chúng tôi mang đến những dịch vụ chăm sóc thú
                  cưng chuyên nghiệp và an toàn. Từ phòng ở tiện nghi, khu vui
                  chơi rộng rãi, đến chăm sóc sức khỏe định kỳ, tất cả đều được
                  thực hiện bởi đội ngũ yêu động vật tận tâm.
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Phòng nghỉ sạch sẽ, thoáng mát, tiện nghi đầy đủ.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Khu vui chơi vận động, giải trí và xã hội hóa thú cưng.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Chăm sóc 24/7, theo dõi sức khỏe, tiêm phòng định kỳ.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Spa & Grooming, dinh dưỡng khoa học, và cập nhật hình
                    ảnh/video hàng ngày.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </motion.section>

        <motion.section
          className="py-10 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Pet Hotel –{" "}
              <span className="text-pink-500">Chăm sóc thú cưng toàn diện</span>
            </h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Chúng tôi mang đến không gian nghỉ dưỡng an toàn và tiện nghi cho
              thú cưng của bạn. Từ phòng nghỉ riêng, khu vui chơi rộng rãi, đến
              dịch vụ chăm sóc 24/7, spa & grooming, dinh dưỡng khoa học, tất cả
              đều được thực hiện bởi đội ngũ tận tâm, đảm bảo thú cưng luôn vui
              vẻ, khỏe mạnh.
            </p>
            <p className="text-lg text-slate-700 mb-10 leading-relaxed">
              Pet Hotel không chỉ là nơi nghỉ dưỡng mà còn là nơi thú cưng trải
              nghiệm và phát triển, giao lưu với các bạn thú khác, vận động
              thoải mái trong môi trường an toàn và được cập nhật hình ảnh/video
              mỗi ngày để bạn theo dõi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {[
                "Phòng nghỉ sạch sẽ, thoáng mát, tiện nghi đầy đủ.",
                "Khu vui chơi vận động và giải trí rộng rãi.",
                "Chăm sóc 24/7, theo dõi sức khỏe và tiêm phòng định kỳ.",
                "Spa & Grooming, dinh dưỡng khoa học và thực đơn riêng.",
                "Camera trực tuyến, cập nhật hình ảnh/video hàng ngày.",
                "Đội ngũ yêu động vật tận tâm và chuyên nghiệp.",
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <span className="text-pink-500 text-2xl">✔</span>
                  <p className="text-slate-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </section>

      {/* Modals */}
      <SelectPetsModal
        isOpen={isSelectPetsOpen}
        onClose={() => setIsSelectPetsOpen(false)}
        onConfirm={handlePetsSelected}
        serviceId={selectedRoomId}
        title="Chọn thú cưng"
        description="Chọn thú cưng để đặt phòng khách sạn"
      />

      <RoomBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
        roomId={selectedRoomId}
        selectedPetIds={selectedPetIds}
        room={selectedRoom}
      />
    </main>
  );
};

export default PetHotelPage;
