"use client";
import { motion } from "framer-motion";

import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Shield,
  Utensils,
  Bath,
  Shirt,
  Stethoscope,
  Gamepad2,
  LucideBath,
  LucideHome,
  LucideDog,
  LucideGraduationCap,
  LucideStethoscope,
  LucideTruck,
} from "lucide-react";
import Image from "next/image";
import bg from "@/public/images/care.jpg";
import pr1 from "@/public/images/product_1.jpg";
import pr2 from "@/public/images/product_2.jpg";
import pr3 from "@/public/images/product_3.jpg";
import pr4 from "@/public/images/product_4.jpg";
import pr5 from "@/public/images/product_5.jpg";
import pr6 from "@/public/images/product_6.jpg";
import pr7 from "@/public/images/product_7.jpg";
import pr8 from "@/public/images/product_8.jpg";
import pr9 from "@/public/images/product_9.jpg";
import pr10 from "@/public/images/product_10.jpg";
import pr11 from "@/public/images/product_11.jpg";
import pr12 from "@/public/images/product_12.jpg";
const productCategories = [
  {
    id: "food",
    title: "Thức ăn & Dinh dưỡng",
    subtitle: "Thức ăn cao cấp, snack, vitamin cho thú cưng",
    icon: Utensils,
    products: [
      {
        name: "Royal Canin Adult Dog Food",
        price: "850.000đ",
        originalPrice: "950.000đ",
        rating: 4.8,
        reviews: 245,
        image: pr1,
        description:
          "Thức ăn cao cấp cho chó trưởng thành, cân bằng dinh dưỡng",
        features: [
          "Protein cao",
          "Omega 3&6",
          "Hỗ trợ tiêu hóa",
          "Made in France",
        ],
      },
      {
        name: "Whiskas Cat Food Tuna",
        price: "320.000đ",
        originalPrice: "380.000đ",
        rating: 4.6,
        reviews: 189,
        image: pr2,
        description: "Thức ăn ướt cho mèo vị cá ngừ, bổ sung nước",
        features: [
          "Cá ngừ tươi",
          "Vitamin E",
          "Taurine",
          "Không chất bảo quản",
        ],
      },
      {
        name: "Pedigree Dentastix",
        price: "180.000đ",
        originalPrice: "220.000đ",
        rating: 4.7,
        reviews: 156,
        image: pr3,
        description: "Snack chăm sóc răng miệng cho chó",
        features: [
          "Làm sạch răng",
          "Giảm cao răng",
          "Hương vị thịt",
          "Dễ tiêu hóa",
        ],
      },
    ],
  },
  {
    id: "grooming",
    title: "Vệ sinh & Làm đẹp",
    subtitle: "Sản phẩm tắm gội, cắt tỉa, chăm sóc lông",
    icon: Bath,
    products: [
      {
        name: "Bio-Groom Protein Lanolin Shampoo",
        price: "450.000đ",
        originalPrice: "520.000đ",
        rating: 4.9,
        reviews: 98,
        image: pr4,
        description: "Dầu gội cao cấp với protein và lanolin",
        features: [
          "Protein tự nhiên",
          "Làm mềm lông",
          "pH cân bằng",
          "Không gây kích ứng",
        ],
      },
      {
        name: "Kìm cắt móng Millers Forge",
        price: "280.000đ",
        originalPrice: "350.000đ",
        rating: 4.8,
        reviews: 134,
        image: pr5,
        description: "Kìm cắt móng chuyên nghiệp, an toàn",
        features: [
          "Thép không gỉ",
          "Tay cầm chống trượt",
          "Cắt sạch sẽ",
          "Bảo hành 2 năm",
        ],
      },
      {
        name: "Lược chải lông FURminator",
        price: "680.000đ",
        originalPrice: "780.000đ",
        rating: 4.9,
        reviews: 267,
        image: pr6,
        description: "Lược chải lông chuyên nghiệp, giảm rụng lông",
        features: [
          "Công nghệ đặc biệt",
          "Giảm 90% rụng lông",
          "Tay cầm ergonomic",
          "Phù hợp mọi giống",
        ],
      },
    ],
  },
  {
    id: "toys",
    title: "Đồ chơi & Giải trí",
    subtitle: "Đồ chơi thông minh, bóng, dây thừng cho thú cưng",
    icon: Gamepad2,
    products: [
      {
        name: "Kong Classic Dog Toy",
        price: "320.000đ",
        originalPrice: "380.000đ",
        rating: 4.8,
        reviews: 445,
        image: pr7,
        description: "Đồ chơi cao su tự nhiên, kích thích trí tuệ",
        features: [
          "Cao su tự nhiên",
          "Nhồi snack được",
          "Kích thích IQ",
          "Siêu bền",
        ],
      },
      {
        name: "Feather Wand Cat Toy",
        price: "150.000đ",
        originalPrice: "200.000đ",
        rating: 4.7,
        reviews: 189,
        image: pr8,
        description: "Đồ chơi lông vũ tương tác cho mèo",
        features: [
          "Lông vũ tự nhiên",
          "Cần câu linh hoạt",
          "Kích thích săn mồi",
          "An toàn",
        ],
      },
      {
        name: "Puzzle Feeder Bowl",
        price: "280.000đ",
        originalPrice: "340.000đ",
        rating: 4.6,
        reviews: 123,
        image: pr9,
        description: "Bát ăn thông minh, chậm tiêu hóa",
        features: [
          "Ăn chậm",
          "Kích thích tư duy",
          "Chống đầy hơi",
          "Dễ vệ sinh",
        ],
      },
    ],
  },
  {
    id: "accessories",
    title: "Phụ kiện & Trang phục",
    subtitle: "Vòng cổ, dây dắt, quần áo, giường nằm",
    icon: Shirt,
    products: [
      {
        name: "Leather Collar Premium",
        price: "420.000đ",
        originalPrice: "500.000đ",
        rating: 4.8,
        reviews: 156,
        image: pr10,
        description: "Vòng cổ da thật cao cấp, khắc tên miễn phí",
        features: [
          "Da thật 100%",
          "Khắc tên miễn phí",
          "Khóa inox",
          "Nhiều size",
        ],
      },
      {
        name: "Retractable Leash 5m",
        price: "380.000đ",
        originalPrice: "450.000đ",
        rating: 4.7,
        reviews: 234,
        image: pr11,
        description: "Dây dắt tự động 5m, chịu lực 50kg",
        features: [
          "Tự động thu dây",
          "Chịu lực 50kg",
          "Tay cầm chống trượt",
          "Khóa an toàn",
        ],
      },
      {
        name: "Orthopedic Pet Bed",
        price: "1.200.000đ",
        originalPrice: "1.450.000đ",
        rating: 4.9,
        reviews: 89,
        image: pr12,
        description: "Giường nệm memory foam, hỗ trợ xương khớp",
        features: [
          "Memory foam",
          "Hỗ trợ xương khớp",
          "Vỏ tháo rời",
          "Chống nước",
        ],
      },
    ],
  },
];

const productVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const PetStorePage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br">
        <div
          className="px-6 py-30 text-center"
          style={{
            backgroundImage: `url(${bg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Cửa hàng <span className="text-pink-500">Thú Cưng</span> Chuyên
              Nghiệp
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Khám phá bộ sưu tập sản phẩm cao cấp và dịch vụ chăm sóc toàn diện
              dành cho thú cưng của bạn. Từ{" "}
              <span className="text-pink-500 font-semibold">
                thức ăn dinh dưỡng
              </span>
              ,{" "}
              <span className="text-purple-500 font-semibold">
                đồ chơi thông minh
              </span>{" "}
              đến{" "}
              <span className="text-blue-300 font-semibold">
                dịch vụ spa & khách sạn
              </span>
              . Tất cả đều được tuyển chọn kỹ lưỡng để mang lại sự an toàn và
              hạnh phúc cho boss nhà bạn.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-medium text-white">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-white">Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Package className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-white">Đổi trả 30 ngày</span>
            </div>
          </motion.div>
        </div>
      </section>

      {productCategories.map((category, categoryIndex) => (
        <motion.section
          key={category.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg">
                  <category.icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {category.title}
                </h2>
              </div>
              <p className="text-slate-600 text-lg">{category.subtitle}</p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {category.products.map((product, productIndex) => (
                <motion.div
                  key={product.name}
                  custom={productIndex}
                  variants={productVariants}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -
                        {Math.round(
                          ((Number.parseFloat(
                            product.originalPrice.replace(/[^\d]/g, "")
                          ) -
                            Number.parseFloat(
                              product.price.replace(/[^\d]/g, "")
                            )) /
                            Number.parseFloat(
                              product.originalPrice.replace(/[^\d]/g, "")
                            )) *
                            100
                        )}
                        %
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-pink-600">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2 group-hover:scale-105">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm font-medium">Thêm</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      ))}

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Tại sao chọn <span className="text-pink-500">Pet Store</span>?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất với
              dịch vụ tận tâm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Chính hãng 100%
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Tất cả sản phẩm đều được nhập khẩu chính hãng từ các thương hiệu
                uy tín trên thế giới
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Tư vấn chuyên nghiệp
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Đội ngũ bác sĩ thú y và chuyên gia sẵn sàng tư vấn sản phẩm phù
                hợp nhất cho thú cưng
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Yêu thương động vật
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Chúng tôi hiểu và yêu thương động vật, mỗi sản phẩm đều được
                chọn lọc với tình yêu
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-pink-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                "Sản phẩm chất lượng tuyệt vời! Thức ăn Royal Canin mà tôi mua
                cho bé Golden rất ngon, bé ăn rất khỏe. Dịch vụ spa cũng rất
                chuyên nghiệp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục
                ủng hộ shop!"
              </p>
              <div className="font-semibold text-pink-600">
                – Chị Lan, Hà Nội 🐕
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                "Lược FURminator thật sự hiệu quả! Lông rụng của bé Husky giảm
                đáng kể. Dịch vụ boarding cũng tuyệt vời, bé được chăm sóc như ở
                nhà. Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Highly
                recommended!"
              </p>
              <div className="font-semibold text-pink-600">
                – Anh Minh, TP.HCM 🐺
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default PetStorePage;
