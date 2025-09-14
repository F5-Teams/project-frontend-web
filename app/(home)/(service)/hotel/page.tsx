"use client";
import React from "react";
import { motion } from "framer-motion";
import { LucideHome } from "lucide-react";
import Image from "next/image";

import hotel7 from "@/public/images/hotel7.jpg";

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

const PetHotelPage = () => {
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

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
              Vì sao chọn <span className="text-pink-500">Pet Hotel?</span>
            </h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#cbd218"
                    d="M18.483 16.767A8.5 8.5 0 0 1 8.118 7.081a1 1 0 0 1-.113.097c-.28.213-.63.292-1.33.45l-.635.144c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.052 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507z"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                  <path
                    fill="#cbd218"
                    d="m9.153 5.408l-.328.588c-.36.646-.54.969-.82 1.182q.06-.045.113-.097a8.5 8.5 0 0 0 10.366 9.686l-.02-.19c-.071-.743-.107-1.115 0-1.46c.107-.344.345-.623.822-1.18l.434-.507c1.677-1.96 2.515-2.941 2.222-3.882c-.292-.941-1.522-1.22-3.982-1.776l-.636-.144c-.699-.158-1.049-.237-1.33-.45c-.28-.213-.46-.536-.82-1.182l-.327-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"
                    opacity="0.8"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                </svg>{" "}
                Giám sát 24/7, đảm bảo an toàn tuyệt đối
              </li>
              <li className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#cbd218"
                    d="M18.483 16.767A8.5 8.5 0 0 1 8.118 7.081a1 1 0 0 1-.113.097c-.28.213-.63.292-1.33.45l-.635.144c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.052 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507z"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                  <path
                    fill="#cbd218"
                    d="m9.153 5.408l-.328.588c-.36.646-.54.969-.82 1.182q.06-.045.113-.097a8.5 8.5 0 0 0 10.366 9.686l-.02-.19c-.071-.743-.107-1.115 0-1.46c.107-.344.345-.623.822-1.18l.434-.507c1.677-1.96 2.515-2.941 2.222-3.882c-.292-.941-1.522-1.22-3.982-1.776l-.636-.144c-.699-.158-1.049-.237-1.33-.45c-.28-.213-.46-.536-.82-1.182l-.327-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"
                    opacity="0.8"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                </svg>{" "}
                Phòng tiện nghi, thoáng mát và sạch sẽ
              </li>
              <li className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#cbd218"
                    d="M18.483 16.767A8.5 8.5 0 0 1 8.118 7.081a1 1 0 0 1-.113.097c-.28.213-.63.292-1.33.45l-.635.144c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.052 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507z"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                  <path
                    fill="#cbd218"
                    d="m9.153 5.408l-.328.588c-.36.646-.54.969-.82 1.182q.06-.045.113-.097a8.5 8.5 0 0 0 10.366 9.686l-.02-.19c-.071-.743-.107-1.115 0-1.46c.107-.344.345-.623.822-1.18l.434-.507c1.677-1.96 2.515-2.941 2.222-3.882c-.292-.941-1.522-1.22-3.982-1.776l-.636-.144c-.699-.158-1.049-.237-1.33-.45c-.28-.213-.46-.536-.82-1.182l-.327-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"
                    opacity="0.8"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                </svg>{" "}
                Khu vui chơi rộng rãi, vận động thoải mái
              </li>
              <li className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#cbd218"
                    d="M18.483 16.767A8.5 8.5 0 0 1 8.118 7.081a1 1 0 0 1-.113.097c-.28.213-.63.292-1.33.45l-.635.144c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.052 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507z"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                  <path
                    fill="#cbd218"
                    d="m9.153 5.408l-.328.588c-.36.646-.54.969-.82 1.182q.06-.045.113-.097a8.5 8.5 0 0 0 10.366 9.686l-.02-.19c-.071-.743-.107-1.115 0-1.46c.107-.344.345-.623.822-1.18l.434-.507c1.677-1.96 2.515-2.941 2.222-3.882c-.292-.941-1.522-1.22-3.982-1.776l-.636-.144c-.699-.158-1.049-.237-1.33-.45c-.28-.213-.46-.536-.82-1.182l-.327-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"
                    opacity="0.8"
                    stroke-width="0.5"
                    stroke="#cbd218"
                  />
                </svg>{" "}
                Hình ảnh & video cập nhật mỗi ngày
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
                    src={hotel7}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#20ad5f"
                        fill-rule="evenodd"
                        stroke="#20ad5f"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Phòng nghỉ sạch sẽ, thoáng mát, tiện nghi đầy đủ.
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#20ad5f"
                        fill-rule="evenodd"
                        stroke="#20ad5f"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Khu vui chơi vận động, giải trí và xã hội hóa thú cưng.
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#20ad5f"
                        fill-rule="evenodd"
                        stroke="#20ad5f"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Chăm sóc 24/7, theo dõi sức khỏe, tiêm phòng định kỳ.
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#20ad5f"
                        fill-rule="evenodd"
                        stroke="#20ad5f"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
    </main>
  );
};

export default PetHotelPage;
