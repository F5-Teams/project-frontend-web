"use client";

import { useLayoutEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import A1 from "@/public/images/avatar/avatar1.png";
import A2 from "@/public/images/avatar/avatar2.png";
import A3 from "@/public/images/avatar/avatar3.png";
import A4 from "@/public/images/avatar/avatar4.jpg";

gsap.registerPlugin(ScrollTrigger);

const OurHappyClientsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // prefer reduced motion
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!sectionRef.current || shouldReduceMotion) return;
    const ctx = gsap.context(() => {
      // Heading
      gsap.from(".clients-heading", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });

      // Cards reveal in 2x2 grid
      const cards = gsap.utils.toArray<HTMLDivElement>(".client-card");
      gsap.set(cards, { opacity: 0, y: 32 });

      ScrollTrigger.batch(cards, {
        start: "top 80%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          }),
        once: true,
      });

      // Avatar pop-in per card
      const avatars = gsap.utils.toArray<HTMLDivElement>(".client-avatar");
      ScrollTrigger.batch(avatars, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { scale: 0.85, rotate: -2, opacity: 0 },
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              stagger: 0.1,
            }
          ),
        once: true,
      });

      // Stars bounce subtly (loop, paused until visible)
      const starRows = gsap.utils.toArray<SVGSVGElement | HTMLElement>(
        ".client-stars"
      );
      starRows.forEach((row) => {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power1.inOut" },
        });
        tl.fromTo(
          row.querySelectorAll("svg"),
          { y: 0, scale: 0.95 },
          {
            y: -4,
            scale: 1,
            duration: 0.9,
            stagger: 0.05,
            yoyo: true,
            repeat: -1,
          }
        );
        ScrollTrigger.create({
          trigger: row,
          start: "top 90%",
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.pause(0),
        });
      });

      // Paragraph slide
      const texts = gsap.utils.toArray<HTMLElement>(".client-text");
      ScrollTrigger.batch(texts, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { x: -10, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
            }
          ),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col w-full items-center gap-8 px-8 py-10 relative"
    >
      <h2 className="clients-heading relative w-fit -mt-px font-poppins-regular text-[56px] md:text-[80px] text-center tracking-[-1.8px] bg-linear-to-r from-secondary via-pink-350 to-primary bg-clip-text text-transparent drop-shadow-[3px_5px_8px_rgba(210,180,140,0.5)]">
        KHÁCH HÀNG CỦA CHÚNG TÔI
      </h2>

      {/* GRID 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Card 1 */}
        <Card className="client-card flex flex-col items-start gap-4 p-6 relative flex-1 bg-white rounded-2xl h-full">
          <CardContent className="flex flex-col gap-4 p-0 w-full h-full">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="client-avatar w-[74px] h-[74px]">
                <AvatarImage
                  src={A1.src}
                  alt="Nguyễn Minh Anh"
                  className="object-cover"
                />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1.5 flex-1">
                <h3 className="font-poppins-medium text-black text-[20px] lg:text-[30px] tracking-[-0.18px] leading-10">
                  Nguyễn Minh Anh
                </h3>
                <p className="font-poppins-light text-black text-[14px] lg:text-[16px] leading-5">
                  Chủ nuôi - bé cún Rocky
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="client-stars inline-flex items-start gap-[5px]">
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
              </div>
              <p className="client-text font-poppins-light text-black text-[14px] lg:text-[16px] leading-[30px]">
                Dịch vụ chăm sóc của HappyPaws thật sự làm mình yên tâm. Bé cún
                được tắm gội sạch sẽ, cắt tỉa gọn gàng và còn thơm lâu. Nhân
                viên nhiệt tình, cập nhật trạng thái liên tục.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="client-card flex flex-col items-start gap-4 p-6 relative flex-1 bg-white rounded-2xl h-full">
          <CardContent className="flex flex-col gap-4 p-0 w-full h-full">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="client-avatar w-[74px] h-[74px]">
                <AvatarImage
                  src={A2.src}
                  alt="Trần Hoàng Long"
                  className="object-cover"
                />
                <AvatarFallback>HL</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1.5 flex-1">
                <h3 className="font-poppins-medium text-black text-[20px] lg:text-[30px] tracking-[-0.18px] leading-10">
                  Trần Hoàng Long
                </h3>
                <p className="font-poppins-light text-black text-[14px] lg:text-[16px] leading-[20px]">
                  Khách hàng thân thiết - bé mèo Miu
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="client-stars inline-flex items-start gap-[5px]">
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
              </div>
              <p className="client-text font-poppins-light text-black text-[14px] lg:text-[16px] leading-[30px]">
                Đặt lịch nhanh, đúng giờ và làm rất cẩn thận. Bé mèo nhà mình
                khá khó tính nhưng các bạn groomer xử lý nhẹ nhàng, không hề
                stress. Giá cả hợp lý so với chất lượng.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="client-card flex flex-col items-start gap-4 p-6 relative flex-1 bg-white rounded-2xl h-full">
          <CardContent className="flex flex-col gap-4 p-0 w-full h-full">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="client-avatar w-[74px] h-[74px]">
                <AvatarImage
                  src={A3.src}
                  alt="Phạm Thu Hà"
                  className="object-cover"
                />
                <AvatarFallback>TH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1.5 flex-1">
                <h3 className="font-poppins-medium text-black text-[20px] lg:text-[30px] tracking-[-0.18px] leading-10">
                  Phạm Thu Hà
                </h3>
                <p className="font-poppins-light text-black text-[14px] lg:text-[16px] leading-[20px]">
                  Người nuôi mèo lần đầu - bé mèo Simba
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="client-stars inline-flex items-start gap-[5px]">
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
              </div>
              <p className="client-text font-poppins-light text-black text-[14px] lg:text-[16px] leading-[30px]">
                Mình được tư vấn rất kỹ về vệ sinh tai, cắt móng và chải lông
                tại nhà. Sau buổi spa, bé ngoan hơn hẳn. Ảnh trước–sau được lưu
                lại trên ứng dụng rất tiện theo dõi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="client-card flex flex-col items-start gap-4 p-6 relative flex-1 bg-white rounded-2xl h-full">
          <CardContent className="flex flex-col gap-4 p-0 w-full h-full">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="client-avatar w-[74px] h-[74px]">
                <AvatarImage
                  src={A4.src}
                  alt="Lê Quốc Khánh"
                  className="object-cover"
                />
                <AvatarFallback>LK</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1.5 flex-1">
                <h3 className="font-poppins-medium text-black text-[20px] lg:text-[30px] tracking-[-0.18px] leading-10">
                  Lê Quốc Khánh
                </h3>
                <p className="font-poppins-light text-black text-[14px] lg:text-[16px] leading-[20px]">
                  Chủ nuôi - bé chó Corgi Luna
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="client-stars inline-flex items-start gap-[5px]">
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
              </div>
              <p className="client-text font-poppins-light text-black text-[14px] lg:text-[16px] leading-[30px]">
                Rất ưng dịch vụ đưa đón tận nơi và nhắc lịch tự động. Bé Corgi
                được spa đúng quy trình, bác sĩ còn tư vấn thêm về da lông. Ứng
                dụng theo dõi rõ ràng, ảnh trước–sau lưu lại cực tiện.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OurHappyClientsSection;
