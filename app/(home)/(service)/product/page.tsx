"use client";
import { motion } from "framer-motion";

import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Shield,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import bg from "@/public/images/care.jpg";
import { productCategories, productVariants } from "@/constants";

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
                &quot;Sản phẩm chất lượng tuyệt vời! Thức ăn Royal Canin mà tôi
                mua cho bé Golden rất ngon, bé ăn rất khỏe. Dịch vụ spa cũng rất
                chuyên nghiệp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục
                ủng hộ shop&quot;
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
                &quot;Lược FURminator thật sự hiệu quả! Lông rụng của bé Husky
                giảm đáng kể. Dịch vụ boarding cũng tuyệt vời, bé được chăm sóc
                như ở nhà. Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp.
                Highly recommended!&quot;
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
