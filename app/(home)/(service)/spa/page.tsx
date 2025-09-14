"use client";
import React from "react";
import { motion } from "framer-motion";

import {
  LucideBath,
  LucideHome,
  LucideDog,
  LucideGraduationCap,
  LucideStethoscope,
  LucideTruck,
  Check,
} from "lucide-react";
import Image from "next/image";
import dog from "@/public/images/dog.jpg";
import cat from "@/public/images/cat.jpg";
const services = [
  {
    id: "spa",
    title: "Spa & Grooming",
    subtitle: "Tắm, cắt tỉa, vệ sinh móng, tạo kiểu lông.",
    icon: LucideBath,
    price: "Từ 250.000đ",
    img: "/shower.jpg",
  },
  {
    id: "boarding",
    title: "Boarding (Khách sạn)",
    subtitle: "Chỗ ở tiện nghi, giám sát 24/7, an toàn tuyệt đối.",
    icon: LucideHome,
    price: "Từ 300.000đ/đêm",
    img: "/hotel.jpg",
  },
  {
    id: "daycare",
    title: "Chăm sóc",
    subtitle: "Chăm sóc ban ngày, chơi & vận động cho thú cưng.",
    icon: LucideDog,
    price: "150.000đ/ngày",
    img: "/care.jpg",
  },
  {
    id: "training",
    title: "Huấn luyện",
    subtitle: "Hành vi, obedience, tricks cơ bản & nâng cao.",
    icon: LucideGraduationCap,
    price: "Từ 1.200.000đ/khóa",
    img: "/train.jpg",
  },
  {
    id: "vet",
    title: "Khám & Tiêm chủng",
    subtitle: "Bác sĩ thú y tận tình, dịch vụ y tế toàn diện.",
    icon: LucideStethoscope,
    price: "Khám: 200.000đ",
    img: "/medical.jpg",
  },
  {
    id: "pickup",
    title: "Đón & Trả tận nơi",
    subtitle: "Đưa đón thú cưng tiện lợi, an toàn & nhanh chóng.",
    icon: LucideTruck,
    price: "50.000đ/chuyến",
    img: "/travel.jpg",
  },
];
// Animation
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

const PetCarePage = () => {
  return (
    <main className="min-h-screen ">
      <section className="py-10 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.section
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-20 text-center "
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Dịch vụ <span className="text-pink-500">Chăm sóc Thú Cưng</span>
            </h1>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Chúng tôi mang đến cho thú cưng của bạn sự chăm sóc toàn diện, từ{" "}
              <span className="text-pink-500 font-semibold">
                làm đẹp, khách sạn, huấn luyện
              </span>{" "}
              đến{" "}
              <span className="text-purple-500 font-semibold">
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
            className="mb-20 text-center"
          >
            <div className="flex flex-col  md:flex-row items-center gap-10">
              <div className="flex-1 ">
                <iframe
                  className="rounded-2xl"
                  width="664"
                  height="372"
                  src="https://www.youtube.com/embed/oOJEJCxx_n0"
                  title="Discover the Ultimate Guide to Home-Boarding for Dogs | What is Home-Boarding? | TailZ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>

              <div className="flex-1 text-slate-600 text-lg leading-relaxed">
                <p>
                  Chúng tôi mang đến một trải nghiệm boarding khác biệt cho thú
                  cưng, nơi các boss được ở trong môi trường gia đình ấm cúng
                  thay vì lồng sắt. Với đội ngũ chăm sóc tận tâm, mỗi bé được
                  quan tâm chu đáo và vui chơi an toàn.
                </p>
                <p className="mt-6 font-semibold text-pink-600">
                  Personalized care at affordable rates in your neighborhood!
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
        className="mb-10 text-center"
      >
        <section className="py-10 bg-[#fbedf6]">
          <div className="flex gap-2 justify-center">
            <h1 className="text-4xl mb-10 font-bold">Lựa chọn</h1>
            <h1 className="text-4xl mb-10 font-bold text-pink-600">Của Bạn</h1>
          </div>

          <div className="max-w-7xl mx-auto px-6 ">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {services.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.id}
                    custom={idx}
                    variants={cardVariants}
                    className="group relative rounded-2xl border bg-white shadow-md p-6 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-500"
                  >
                    <div className="relative w-full h-48 md:h-56">
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        className="object-cover rounded-2xl"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                      {s.subtitle}
                    </p>
                    <p className="mt-4 font-semibold text-pink-600">
                      {s.price}
                    </p>

                    <span className="inline-block mt-4 text-sm text-pink-600 font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Xem chi tiết →
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-10 text-center py-5"
      >
        <section className="py-20 ">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
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
                <p className="text-lg text-slate-600 leading-relaxed">
                  “Cảm ơn PetCare đã chăm sóc bé Corgi của mình rất chu đáo.
                  Mình cực kỳ yên tâm khi gửi bé ở đây. Definitely recommend!”
                </p>
                <div className="mt-4 font-semibold text-pink-600">
                  – Một khách hàng hạnh phúc 🐶
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
        className="mb-20 text-center"
      >
        <section className="py-20 bg-pink-50">
          <div className="max-w-5xl mx-auto px-6 text-left space-y-8">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
              Trải nghiệm chăm sóc thú cưng toàn diện
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Tại PetCare, mỗi thú cưng đều được chăm sóc như một thành viên
              trong gia đình. Chúng tôi cung cấp các dịch vụ{" "}
              <span className="text-pink-500 font-semibold">
                Spa, Khách sạn, Daycare, Huấn luyện
              </span>{" "}
              và
              <span className="text-purple-500 font-semibold">
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
              <span className="font-semibold text-pink-500">
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
        className="py-5 bg-white mb-20"
      >
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-extrabold text-slate-800 text-center">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
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
              <h3 className="text-2xl font-bold text-pink-500 mb-4">
                Trải nghiệm khách hàng
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                “Tôi cực kỳ yên tâm khi gửi bé Corgi của mình tại PetCare. Hình
                ảnh và video mỗi ngày giúp tôi thấy bé vui chơi, ngủ ngon và
                khỏe mạnh. Không gian ở đây ấm áp và đội ngũ nhân viên thân
                thiện, đáng tin cậy.”
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                “Các dịch vụ huấn luyện, spa, và boarding đều được thực hiện
                chuyên nghiệp. Tôi không chỉ thấy thú cưng hạnh phúc mà còn thấy
                được niềm đam mê của PetCare trong từng chi tiết chăm sóc.”
              </p>
              <p className="font-semibold text-pink-600">
                – Khách hàng hạnh phúc 🐶
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-last md:order-first">
              <h3 className="text-2xl font-bold text-purple-500 mb-4">
                Cam kết lâu dài
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                PetCare không chỉ là dịch vụ một lần, mà là người bạn đồng hành
                lâu dài. Chúng tôi luôn cập nhật và cải thiện dịch vụ để đảm bảo
                mỗi thú cưng đều được chăm sóc chu đáo, vui vẻ và khỏe mạnh.
              </p>
              <p className="text-slate-700 leading-relaxed">
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
    </main>
  );
};

export default PetCarePage;
