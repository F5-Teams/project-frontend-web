"use client";
import { motion } from "framer-motion";
import { Package, Truck, Shield } from "lucide-react";
import Image from "next/image";
import bg from "@/public/images/care.jpg";
import { useEffect, useState } from "react";
import { Input, Spin } from "antd";
import { Product } from "@/services/product/getProductPublic/type";
import { useAllProduct } from "@/services/product/getProductPublic/hooks";
import { useProductCartStore } from "@/stores/productCart.store";
import BuyModal from "@/components/shopping/BuyModal";

export const ProductCard = ({ product }: { product: Product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const addProduct = useProductCartStore((state) => state.addProduct);
  const [openBuy, setOpenBuy] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const clearCart = useProductCartStore((state) => state.clearCart);
  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  const maxStock = product?.stocks ?? 0;

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () =>
    setQuantity((prev) => Math.min(maxStock, prev + 1));

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={product.images[currentImage]?.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
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

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-poppins-medium text-slate-800 mb-1">
          {product.name}
        </h3>
        <p className="text-slate-600 text-sm mb-3">{product.description}</p>

        <div className="flex justify-between text-sm text-gray-700 mb-3">
          <span>
            <span className="font-medium">Loại:</span> {product.type}
          </span>
          <span>
            <span className="font-medium">Số lượng:</span>{" "}
            <span className="text-green-600 font-medium">{product.stocks}</span>
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center border rounded-xl overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className={`px-2 py-1 text-lg font-bold ${
                quantity <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              −
            </button>
            <span className="px-6">{quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={quantity >= maxStock}
              className={`px-2 py-1 text-lg font-bold ${
                quantity >= maxStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              +
            </button>
          </div>
          <span className="text-pink-600 font-medium text-3xl">
            {new Intl.NumberFormat("vi-VN").format(Number(product.price))} đ
          </span>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            disabled={maxStock === 0}
            onClick={() => {
              addProduct({
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                quantity,
                imageUrl: product.images?.[0]?.imageUrl,
                weight: product.weight,
              });
            }}
            className={`h-10 cursor-pointer rounded-xl w-full font-medium transition ${
              maxStock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#f8daef] hover:bg-[#f5bee4] text-pink-600"
            }`}
          >
            {maxStock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>

          <button
            onClick={() => setOpenBuy(true)}
            disabled={maxStock === 0}
            className={`h-10 cursor-pointer rounded-xl w-full font-medium transition ${
              maxStock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            {maxStock === 0 ? "Hết hàng" : "Đặt ngay"}
          </button>
        </div>
      </div>
      <BuyModal
        isOpen={openBuy}
        isCancel={() => setOpenBuy(false)}
        clearCart={clearCart}
        items={[
          {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity,
            weight: product.weight,
            imageUrl: product.images?.[0]?.imageUrl || "",
          },
        ]}
      />
    </div>
  );
};

const PetStorePage = () => {
  const { data: products = [], isLoading, error } = useAllProduct();
  const [type, setType] = useState<string[]>([]);
  const [select, setSelect] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (products.length > 0) {
      const filterType = Array.from(new Set(products.map((item) => item.type)));
      setType(filterType);
    }
  }, [products]);

  console.log("PRODUCT", products);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Lỗi tải sản phẩm
      </div>
    );

  const filteredProduct = products
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
            <h1 className="text-4xl md:text-5xl font-poppins-medium text-white mb-6">
              Cửa hàng <span className="text-pink-500">Thú Cưng</span> Chuyên
              Nghiệp
            </h1>
            <p className="text-white max-w-3xl mx-auto text-lg leading-relaxed">
              Khám phá bộ sưu tập sản phẩm cao cấp và dịch vụ chăm sóc toàn diện
              dành cho thú cưng của bạn.
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

      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
        <div className="flex flex-wrap font-poppins-light text-[14px] items-center gap-2">
          <p
            onClick={() => setSelect("All")}
            className={`px-2 py-1 rounded-xl cursor-pointer transition ${
              select === "All"
                ? "bg-pink-500 text-white"
                : "bg-gray-400 text-white hover:bg-gray-800"
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
                className={`px-2 py-1 rounded-xl font-poppins-light cursor-pointer transition ${
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

        <div className="w-full font-poppins-regular md:w-auto flex justify-end">
          <Input
            style={{ width: 250 }}
            placeholder="Tìm sản phẩm ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
