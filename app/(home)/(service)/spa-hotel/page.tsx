"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LucideHome,
  LucideBath,
  LucideDog,
  LucideGraduationCap,
  LucideStethoscope,
  LucideTruck,
} from "lucide-react";

import bg from "@/public/images/hotel-spa.jpg";
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

const hotelServices = [
  {
    id: "room1",
    title: "Luxury Suite",
    subtitle: "Phòng rộng rãi, giường êm, view đẹp.",
    price: "Từ 500.000đ/đêm",
    img: "/images/hotel1.jpg",
  },
  {
    id: "room2",
    title: "Standard Room",
    subtitle: "Tiện nghi đầy đủ, an toàn cho thú cưng.",
    price: "Từ 300.000đ/đêm",
    img: "/images/hotel2.jpg",
  },
  {
    id: "room3",
    title: "Family Room",
    subtitle: "Không gian cho nhiều bé cùng lúc, vui chơi thoải mái.",
    price: "Từ 700.000đ/đêm",
    img: "/images/hotel3.jpg",
  },
  {
    id: "room4",
    title: "Family Room",
    subtitle: "Không gian cho nhiều bé cùng lúc, vui chơi thoải mái.",
    price: "Từ 700.000đ/đêm",
    img: "/images/hotel4.jpg",
  },
  {
    id: "room5",
    title: "Family Room",
    subtitle: "Không gian cho nhiều bé cùng lúc, vui chơi thoải mái.",
    price: "Từ 700.000đ/đêm",
    img: "/images/hotel5.jpg",
  },
  {
    id: "room6",
    title: "Family Room",
    subtitle: "Không gian cho nhiều bé cùng lúc, vui chơi thoải mái.",
    price: "Từ 700.000đ/đêm",
    img: "/images/hotel6.jpg",
  },
];
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

const PetUnifiedPage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative h-[500px]">
        <Image
          src={bg}
          alt="Pet Hotel Banner"
          fill
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Chăm sóc <span className="text-pink-500">Toàn Diện</span> Cho Thú
            Cưng
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white max-w-3xl drop-shadow-md">
            Từ khách sạn, spa, huấn luyện đến khám chữa bệnh – tất cả trong một
            trải nghiệm chuyên nghiệp và tận tâm.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-10">
            Dịch vụ <span className="text-pink-500">Chăm sóc thú cưng</span>
          </h2>
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
                  className="group relative rounded-3xl border bg-white shadow-lg overflow-hidden hover:shadow-2xl transition duration-500 cursor-pointer"
                >
                  <div className="relative h-64">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                      {s.subtitle}
                    </p>
                    <p className="mt-4 font-semibold text-pink-600">
                      {s.price}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#fdf2f8]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">
              Vì sao chọn{" "}
              <span className="text-pink-500">Pet Care Center?</span>
            </h2>
            <ul className="space-y-4 text-slate-700">
              {[
                "Phòng nghỉ sạch sẽ, thoáng mát, tiện nghi đầy đủ.",
                "Khu vui chơi vận động rộng rãi, an toàn.",
                "Chăm sóc 24/7, theo dõi sức khỏe và tiêm phòng định kỳ.",
                "Spa & Grooming, dinh dưỡng khoa học.",
                "Huấn luyện và phát triển hành vi cho thú cưng.",
                "Đội ngũ yêu động vật tận tâm và chuyên nghiệp.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-pink-500 text-2xl">✔</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
            <Image src={dog} alt="Pet Care" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-10 ">
        <div className="flex gap-2 justify-center">
          <h1 className="text-4xl mb-10 font-bold">Dịch vụ</h1>
          <h1 className="text-4xl mb-10 font-bold text-pink-600">
            Khách sạn thú cưng
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {hotelServices.map((s, idx) => (
              <motion.div
                key={s.id}
                custom={idx}
                variants={cardVariants}
                className="group relative rounded-2xl border bg-white shadow-md p-6 cursor-pointer overflow-hidden hover:-translate-y-2 hover:shadow-xl transition duration-500"
              >
                <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg">
                    <LucideHome className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                  {s.subtitle}
                </p>
                <p className="mt-4 font-semibold text-pink-600">{s.price}</p>
                <span className="inline-block mt-4 text-sm text-pink-600 font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  Xem chi tiết →
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-pink-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <iframe
              className="w-full h-64 md:h-96 rounded-3xl shadow-lg"
              src="https://www.youtube.com/embed/oOJEJCxx_n0"
              title="Pet Care Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
          <div className="flex-1 text-slate-700 text-lg">
            <div className="flex gap-2 justify-center">
              <h1 className="text-4xl mb-10 font-bold">Tin tưởng</h1>
              <h1 className="text-4xl mb-10 font-bold text-pink-600">
                Ở chúng tôi
              </h1>
            </div>
            <p>
              Trải nghiệm chăm sóc thú cưng toàn diện: từ khách sạn tiện nghi,
              khu vui chơi rộng rãi, đến spa & grooming, huấn luyện và dịch vụ y
              tế chuyên nghiệp. Mỗi bé được quan tâm tận tình trong môi trường
              ấm áp và an toàn.
            </p>
            <p className="mt-4 font-semibold text-pink-600">
              Chăm sóc tận tâm – Niềm vui cho thú cưng, an tâm cho chủ nhân!
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-6">
            Giới thiệu <span className="text-pink-500">PetHub</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            PetHub là trung tâm chăm sóc thú cưng hàng đầu, cung cấp dịch vụ
            toàn diện từ khách sạn, spa, huấn luyện đến y tế. Chúng tôi cam kết
            mang đến môi trường an toàn, sạch sẽ và đầy yêu thương cho từng bé,
            giúp các bé khỏe mạnh, vui vẻ và phát triển tốt nhất.
          </p>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
            Với đội ngũ nhân viên tận tâm, chuyên nghiệp và nhiều năm kinh
            nghiệm, chúng tôi luôn đồng hành cùng bạn chăm sóc những người bạn
            bốn chân thân yêu.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PetUnifiedPage;
