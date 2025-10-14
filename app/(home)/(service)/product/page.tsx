"use client";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Truck, Shield, Search } from "lucide-react";
import Image from "next/image";
import bg from "@/public/images/care.jpg";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";
import { productPublic } from "@/redux/product/public/getPublic";
import { getProductPublic } from "@/redux/product/public/getPublicSlice";
import { Input } from "antd";
import { parse } from "path";

interface ProductCardProps {
  product: productPublic;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };
  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.images[currentImage]?.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
            >
              &gt;
            </button>
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {product.name}
        </h3>
        <p className="text-slate-600 text-sm mb-3 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(product.price))}
          </span>
          <button className="flex items-center gap-2 mt-4 px-4 py-2 cursor-pointer rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition">
            {" "}
            <ShoppingCart className="w-5 h-5" /> <p>Đặt ngay</p>{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

const PetStorePage = () => {
  const dispatch = useAppDispatch();
  const { productPublic = [] } = useAppSelector(
    (state: RootState) => state.getProductPublic
  );
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState<productPublic[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [select, setSelect] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      const parse = JSON.parse(auth);
      setUser(parse);
    }
    console.log(parse);
  }, []);

  useEffect(() => {
    dispatch(getProductPublic());
  }, [dispatch]);

  useEffect(() => {
    if (productPublic.length > 0) {
      setProduct(productPublic);
      const filterType = Array.from(
        new Set(productPublic.map((item) => item.type))
      );
      setType(filterType);
    }
  }, [productPublic]);

  const filteredProduct = product
    .filter((p) => (select === "All" ? true : p.type === select))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

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
              .
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

      <div className="flex justify-end gap-2.5 px-10 mt-5">
        <Input
          style={{ width: 250 }}
          placeholder="Tìm sản phẩm ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-5 px-10">
        <p
          onClick={() => setSelect("All")}
          className={`px-2 py-1 rounded-xl font-medium cursor-pointer transition
            ${
              select === "All"
                ? "bg-pink-500 text-white"
                : "bg-gray-300 text-white hover:bg-gray-400"
            }`}
        >
          All
        </p>

        {type?.map((item, index) => (
          <motion.section
            key={item}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <p
              onClick={() => setSelect(item)}
              className={`px-2 py-1 rounded-xl font-medium cursor-pointer transition
                ${
                  select === item
                    ? "bg-pink-500 text-white"
                    : "bg-gray-300 text-white hover:bg-gray-400"
                }`}
            >
              {item}
            </p>
          </motion.section>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProduct.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
};

export default PetStorePage;
