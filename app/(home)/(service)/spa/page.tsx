"use client";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import dog from "@/public/images/dog.jpg";
import cat from "@/public/images/cat.jpg";
import { useState } from "react";
import { SelectPetsModal } from "@/components/modals/SelectPetsModal";
import { SingleServiceBookingModal } from "@/components/modals/SingleServiceBookingModal";
import { ComboDetailModal } from "@/components/modals/ComboDetailModal";
import { useCartStore } from "@/stores/cart.store";
import { BookingDraft } from "@/types/cart";
import { useCombos } from "@/hooks/useCombos";

const PetCarePage = () => {
  const { addItems } = useCartStore();
  const { combos, loading, error, refetch } = useCombos();

  // Modal states
  const [isSelectPetsOpen, setIsSelectPetsOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);

  const handleShowDetail = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsDetailModalOpen(true);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsSelectPetsOpen(true);
  };

  // Find selected service from combos for passing to modal
  const selectedService = combos.find(
    (combo) => combo.id.toString() === selectedServiceId
  );

  const handlePetsSelected = (petIds: string[]) => {
    setSelectedPetIds(petIds);
    setIsSelectPetsOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = async (bookingDrafts: BookingDraft[]) => {
    const result = await addItems(bookingDrafts);
    if (result.success) {
      setIsBookingModalOpen(false);
      // Optionally show success message
    }
  };
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="py-6 sm:py-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.section
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 sm:mb-10 md:mb-12 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins-medium text-slate-900">
              Dịch vụ <span className="text-pink-500">Chăm sóc Thú Cưng</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-slate-600 max-w-4xl mx-auto font-poppins-regular sm:text-lg leading-relaxed px-4">
              Chúng tôi mang đến cho thú cưng của bạn sự chăm sóc toàn diện, từ{" "}
              <span className="text-pink-500 font-poppins-medium">
                làm đẹp, khách sạn, huấn luyện
              </span>{" "}
              đến{" "}
              <span className="text-[#1849A9] font-poppins-medium">
                khám chữa bệnh
              </span>
              . Mọi dịch vụ đều được thực hiện bởi đội ngũ chuyên nghiệp, tận
              tâm và yêu thương động vật.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 sm:mb-10 md:mb-12 text-center"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1 w-full">
                <iframe
                  className="rounded-xl sm:rounded-2xl w-full aspect-video"
                  src="https://www.youtube.com/embed/oOJEJCxx_n0"
                  title="Discover the Ultimate Guide to Home-Boarding for Dogs | What is Home-Boarding? | TailZ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>

              <div className="flex-1 leading-relaxed px-4">
                <p className="mb-6 font-poppins-medium text-xl text-pink-600">
                  Giải pháp chăm sóc cá nhân hoá, tối ưu chi phí!
                </p>
                <p className="text-black font-poppins-regular">
                  Chúng tôi mang đến một trải nghiệm boarding khác biệt cho thú
                  cưng, nơi các boss được ở trong môi trường gia đình ấm cúng
                  thay vì lồng sắt. Với đội ngũ chăm sóc tận tâm, mỗi bé được
                  quan tâm chu đáo và vui chơi an toàn.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-4 sm:mb-8 text-center"
      >
        <section className=" bg-[#fbedf6] py-6">
          <div className="flex gap-1.5 sm:gap-2 justify-center px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-10 font-poppins-medium">
              Lựa chọn
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-10 font-poppins-medium text-pink-600">
              Của Bạn
            </h1>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  <p className="text-slate-600">
                    Đang tải danh sách dịch vụ...
                  </p>
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
            ) : combos.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không có dịch vụ nào có sẵn</p>
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10"
              >
                {combos.map((combo, idx) => (
                  <motion.div
                    key={combo.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      delay: idx * 0.15,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    onClick={() => handleShowDetail(combo.id.toString())}
                    className="group relative rounded-xl sm:rounded-2xl border bg-white shadow-md p-4 sm:p-6 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-500 flex flex-col h-full"
                  >
                    <div className="relative w-full h-40 sm:h-48 md:h-56 shrink-0">
                      <Image
                        src={
                          combo.serviceLinks?.[0]?.service?.images?.[0]
                            ?.imageUrl || "/images/spa1.jpg"
                        }
                        alt={combo.name}
                        fill
                        className="object-cover rounded-2xl"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-tr from-pink-400 to-blue-500 text-white shadow-lg">
                        <Check className="w-6 h-6" />
                      </div>
                      {combo.isActive ? (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-poppins-regular">
                          Có sẵn
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-poppins-regular">
                          Hết chỗ
                        </div>
                      )}
                    </div>

                    {/* Title & Description - Fixed height for consistency */}
                    <div className="mt-1 sm:mt-2 shrink-0">
                      <h3 className="h-12 sm:h-14 justify-center text-base sm:text-lg md:text-xl font-poppins-medium text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 flex items-center">
                        {combo.name}
                      </h3>
                      <p className="text-slate-600 font-poppins-regular sm:text-sm leading-relaxed line-clamp-2 h-10 sm:h-12">
                        {combo.description}
                      </p>
                    </div>

                    {/* Display included services - Flexible height */}
                    <div className="grow mt-2 sm:mt-3">
                      {combo.serviceLinks && combo.serviceLinks.length > 0 && (
                        <div>
                          <p className="text-[12px] sm:text-xs font-poppins-regular text-gray-800 mb-1.5 sm:mb-2">
                            Bao gồm:
                          </p>
                          <div className="space-y-0.5 sm:space-y-1">
                            {combo.serviceLinks
                              .slice(0, 3)
                              .map((serviceLink) => (
                                <div
                                  key={serviceLink.id}
                                  className="flex items-center gap-1.5 sm:gap-2"
                                >
                                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 shrink-0" />
                                  <span className="text-[14px] font-poppins-light text-black truncate">
                                    {serviceLink.service.name}
                                  </span>
                                </div>
                              ))}
                            {combo.serviceLinks.length > 3 && (
                              <p className="text-[10px] sm:text-xs text-gray-500 pl-4 sm:pl-5">
                                +{combo.serviceLinks.length - 3} dịch vụ khác
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Duration - Fixed height */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 shrink-0">
                      <p className="font-poppins-semibold text-lg sm:text-md text-pink-600">
                        {parseInt(combo.price).toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-[12px] sm:text-[14px] font-poppins-light text-gray-500 mt-1">
                        ⏳ Thời gian thực hiện: {combo.duration} phút
                      </p>
                    </div>

                    {/* Button - Always at bottom */}
                    <button
                      className={`mt-3 sm:mt-4 w-full px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer rounded-lg text-sm sm:text-base font-poppins-regular transition shrink-0 ${
                        combo.isActive
                          ? "bg-pink-500 text-white hover:bg-pink-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (combo.isActive) {
                          handleBookService(combo.id.toString());
                        }
                      }}
                      disabled={!combo.isActive}
                    >
                      {combo.isActive ? "Đặt ngay" : "Hết chỗ"}
                    </button>

                    <span className="hidden sm:inline-block mt-3 sm:mt-4 text-xs sm:text-sm text-pink-600 font-poppins-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Xem chi tiết →
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-10 text-center py-5"
      >
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-poppins-medium text-slate-800 mb-6">
                  Vì sao chọn <span className="text-pink-500">Pet Spa?</span>
                </h2>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-center gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Đội ngũ được xác minh & yêu động vật thật sự
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Chăm sóc cá nhân hóa cho từng thú cưng
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Gặp mặt trước – hoàn tiền dễ dàng nếu không phù hợp
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={24} color="#25cb57" strokeWidth={1.5} />
                    Cập nhật hình ảnh & hoạt động mỗi ngày
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-lg text-start font-poppins-regular text-black leading-relaxed">
                  “Cảm ơn PetCare đã chăm sóc bé Corgi của mình rất chu đáo.
                  Mình cực kỳ yên tâm khi gửi bé ở đây. Definitely recommend!”
                </p>
                <div className="mt-4 text-end font-poppins-regular text-pink-600">
                  – Anh Kim Cương - Chủ bé Corgi Milo
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <section className="py-12 bg-pink-50">
          <div className="max-w-6xl mx-auto px-6 text-left space-y-6">
            <h2 className="text-3xl text-center font-poppins-medium text-slate-800 mb-6">
              Trải nghiệm chăm sóc thú cưng toàn diện
            </h2>
            <p className="text-slate-600 font-poppins-regular text-lg leading-relaxed">
              Tại PetCare, mỗi thú cưng đều được chăm sóc như một thành viên
              trong gia đình. Chúng tôi cung cấp các dịch vụ{" "}
              <span className="text-pink-500 font-poppins-medium">
                Spa, Khách sạn, Daycare, Huấn luyện
              </span>{" "}
              và
              <span className="text-[#1849A9] font-poppins-medium">
                {" "}
                Khám chữa bệnh
              </span>{" "}
              với đội ngũ chuyên nghiệp và tận tâm.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Chúng tôi hiểu rằng mỗi thú cưng có nhu cầu khác nhau, vì vậy các
              dịch vụ được cá nhân hóa hoàn toàn. Từ chế độ ăn, hoạt động vui
              chơi, đến phương pháp huấn luyện, mọi thứ đều được thiết kế để phù
              hợp với từng bé.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Với{" "}
              <span className="font-poppins-medium text-pink-500">
                công nghệ giám sát 24/7
              </span>
              , bạn luôn có thể cập nhật tình hình thú cưng qua hình ảnh và
              video hàng ngày, giúp bạn yên tâm khi không ở bên.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Chúng tôi tin rằng một thú cưng hạnh phúc sẽ mang lại niềm vui cho
              cả gia đình. Hãy để PetCare trở thành người bạn đồng hành đáng tin
              cậy của bạn và bé yêu.
            </p>
          </div>
        </section>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="py-5 bg-white "
      >
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <h2 className="text-3xl mt-6 font-poppins-medium text-slate-800 text-center">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-lg text-black font-poppins-regular text-center max-w-6xl mx-auto leading-relaxed">
            PetCare bắt đầu từ niềm yêu thương động vật chân thành. Chúng tôi
            tin rằng mọi thú cưng đều xứng đáng được chăm sóc tận tâm, vui chơi
            an toàn, và cảm thấy hạnh phúc mỗi ngày. Từ những buổi spa nhỏ cho
            đến boarding dài ngày, chúng tôi luôn đặt trái tim vào từng chi
            tiết.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-90 rounded-2xl overflow-hidden shadow-lg">
              <Image src={dog} alt="PetCare story" height={300} width={600} />
            </div>
            <div>
              <h3 className="text-2xl font-poppins-medium text-pink-500 mb-4">
                Trải nghiệm khách hàng
              </h3>
              <p className="text-slate-700 font-poppins-regular leading-relaxed mb-4">
                “Tôi cực kỳ yên tâm khi gửi bé Corgi của mình tại PetCare. Hình
                ảnh và video mỗi ngày giúp tôi thấy bé vui chơi, ngủ ngon và
                khỏe mạnh. Không gian ở đây ấm áp và đội ngũ nhân viên thân
                thiện, đáng tin cậy.”
              </p>

              <p className=" text-end font-poppins-regular text-pink-600">
                – chị Thảo (chủ bé Susu)
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-last md:order-first">
              <h3 className="text-2xl font-poppins-medium text-[#1849A9] mb-4">
                Cam kết lâu dài
              </h3>
              <p className="text-slate-700 font-poppins-regular leading-relaxed mb-4">
                PetCare không chỉ là dịch vụ một lần, mà là người bạn đồng hành
                lâu dài. Chúng tôi luôn cập nhật và cải thiện dịch vụ để đảm bảo
                mỗi thú cưng đều được chăm sóc chu đáo, vui vẻ và khỏe mạnh.
              </p>
              <p className="text-slate-700 font-poppins-regular leading-relaxed">
                Hãy đến và trải nghiệm sự khác biệt với PetCare – nơi tình yêu
                và chuyên môn kết hợp để tạo ra dịch vụ chăm sóc thú cưng tốt
                nhất.
              </p>
            </div>
            <div className="relative w-full h-90 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={cat}
                alt="PetCare story"
                height={300}
                width={600}
                className="object-fill"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <ComboDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        combo={selectedService || null}
        onBook={() => handleBookService(selectedServiceId)}
      />

      <SelectPetsModal
        isOpen={isSelectPetsOpen}
        onClose={() => setIsSelectPetsOpen(false)}
        onConfirm={handlePetsSelected}
        serviceId={selectedServiceId}
        title="Chọn thú cưng"
        description="Chọn thú cưng để đặt dịch vụ spa"
      />

      <SingleServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
        serviceId={selectedServiceId}
        selectedPetIds={selectedPetIds}
        service={selectedService}
      />
    </main>
  );
};

export default PetCarePage;
