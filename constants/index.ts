import Service1 from "@/public/images/services/jamie-street-ikv10lHZUas-unsplash.jpg";
import Service2 from "@/public/images/services/roberto-nickson-ey5s8rNHG-c-unsplash.jpg";

export const services = [
  {
    title: "PET SPA",
    desc: "Chúng tôi mang đến dịch vụ tắm gội dịu nhẹ, cắt tỉa tạo kiểu, massage thư giãn, vệ sinh răng miệng và cắt móng, không gian sạch sẽ hiện đại và đội ngũ giàu kinh nghiệm.",
    img: Service1,
  },
  {
    title: "PET HOTEL",
    desc: "Dịch vụ khách sạn thú cưng tiện nghi, an toàn và thân thiện. Thú cưng của bạn sẽ được chăm sóc chu đáo như ở nhà.",
    img: Service2,
  },
];

export const hotelServices = [
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

export const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

import {
  Bath,
  Gamepad2,
  LucideBath,
  LucideDog,
  LucideGraduationCap,
  LucideHome,
  LucideStethoscope,
  LucideTruck,
  Shirt,
  Utensils,
} from "lucide-react";
export const productCategories = [
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
        image: "/images/product_1.jpg",
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
        image: "/images/product_2.jpg",
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
        image: "/images/product_3.jpg",
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
        image: "/images/product_4.jpg",
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
        image: "/images/product_5.jpg",
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
        image: "/images/product_6.jpg",
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
        image: "/images/product_7.jpg",
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
        image: "/images/product_8.jpg",
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
        image: "/images/product_9.jpg",
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
        image: "/images/product_10.jpg",
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
        image: "/images/product_11.jpg",
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
        image: "/images/product_12.jpg",
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

export const servicesSpa = [
  {
    id: "spa",
    title: "Spa & Grooming",
    subtitle: "Tắm, cắt tỉa, vệ sinh móng, tạo kiểu lông.",
    icon: LucideBath,
    price: "Từ 250.000đ",
    img: "/images/shower.jpg",
  },
  {
    id: "boarding",
    title: "Boarding (Khách sạn)",
    subtitle: "Chỗ ở tiện nghi, giám sát 24/7, an toàn tuyệt đối.",
    icon: LucideHome,
    price: "Từ 300.000đ/đêm",
    img: "/images/hotel.jpg",
  },
  {
    id: "daycare",
    title: "Chăm sóc",
    subtitle: "Chăm sóc ban ngày, chơi & vận động cho thú cưng.",
    icon: LucideDog,
    price: "150.000đ/ngày",
    img: "/images/care.jpg",
  },
  {
    id: "training",
    title: "Huấn luyện",
    subtitle: "Hành vi, obedience, tricks cơ bản & nâng cao.",
    icon: LucideGraduationCap,
    price: "Từ 1.200.000đ/khóa",
    img: "/images/train.jpg",
  },
  {
    id: "vet",
    title: "Khám & Tiêm chủng",
    subtitle: "Bác sĩ thú y tận tình, dịch vụ y tế toàn diện.",
    icon: LucideStethoscope,
    price: "Khám: 200.000đ",
    img: "/images/medical.jpg",
  },
  {
    id: "pickup",
    title: "Đón & Trả tận nơi",
    subtitle: "Đưa đón thú cưng tiện lợi, an toàn & nhanh chóng.",
    icon: LucideTruck,
    price: "50.000đ/chuyến",
    img: "/images/travel.jpg",
  },
];

export const productVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};
