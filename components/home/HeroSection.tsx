"use client";
import { useRef } from "react";
import Image from "next/image";
import Image1 from "@/public/images/sections/pexels-lilen-diaz-1025474869-29319218.jpg";
import Image2 from "@/public/images/sections/hayffield-l-ZVdZw2p08y4-unsplash.jpg";
import Image3 from "@/public/images/sections/pexels-tranmautritam-2194261.jpg";
import Image4 from "@/public/images/sections/sandy-millar-kKAaCeGf5wY-unsplash.jpg";
import Image5 from "@/public/images/sections/anya-prygunova-u2H8mUzoF2Q-unsplash.jpg";
import Link from "next/link";
import { useFloatingCircles, useTypingEffect } from "@/hooks";
import { highlightText } from "@/utils";

const typingTexts = [
  "Boss cực xấu\nSen nào cũng chê",
  "Tắm thơm sấy dịu\nAi gặp cũng mê",
];

const HeroSection = () => {
  const displayText = useTypingEffect(typingTexts);

  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  useFloatingCircles(circleRefs);

  return (
    <section className="flex flex-col w-full items-center gap-[54px] px-0 pb-[80px] pt-[160px] relative">
      <div className="inline-flex flex-col items-center justify-center gap-4 relative flex-[0_0_auto]">
        <h1
          className="relative w-[1500px] mt-[-20px] font-poppins-regular text-[90px] text-foreground text-center leading-[100px] tracking-[-4px] whitespace-pre-line min-h-[200px]"
          dangerouslySetInnerHTML={{
            __html: `${highlightText(
              displayText
            )}<span class="animate-blink">|</span>`,
          }}
        />
        <p className="relative w-[587px] font-poppins-light text-[20px] text-foreground text-center leading-[30px] tracking-[0px]">
          Hãy để chúng tôi đồng hành và mang đến cho bé sự chăm sóc ân cần, đầy
          yêu thương và thật riêng biệt.
        </p>
        <Link
          href="/login"
          className="btn-primary text-[18px] cursor-pointer"
          style={{ zIndex: 50, position: "relative", marginTop: "18px" }}
        >
          BẮT ĐẦU
        </Link>
      </div>

      <div className="absolute w-full h-[784px] -top-14 left-[34px]">
        <div
          ref={(el: HTMLDivElement | null) => {
            circleRefs.current[0] = el;
          }}
          className="inline-flex items-start gap-[9.31px] absolute top-[0%] left-[6%]"
        >
          <div className="relative w-[240px] h-[240px] bg-secondary rounded-[135px]" />
          <div className="absolute top-3.5 left-[13px] w-[212px] h-[212px] rounded-full overflow-hidden">
            <Image
              src={Image1}
              alt="Pet"
              width={212}
              height={212}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div
          ref={(el: HTMLDivElement | null) => {
            circleRefs.current[1] = el;
          }}
          className="inline-flex items-start gap-[9.31px] absolute top-[0%] left-[45%]"
        >
          <div className="relative w-[183px] h-[183px] bg-primary rounded-[91.5px]" />
          <div className="absolute top-[9px] left-[9px] w-[164px] h-[164px] rounded-full overflow-hidden">
            <Image
              src={Image2}
              alt="Pet"
              width={164}
              height={164}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div
          ref={(el: HTMLDivElement | null) => {
            circleRefs.current[2] = el;
          }}
          className="inline-flex items-start gap-[9.31px] absolute top-[15%] right-[5%]"
        >
          <div className="relative w-[201px] h-[201px] bg-[#8FB3F7] rounded-[100.5px]" />
          <div className="absolute w-[180px] h-[180px] top-2.5 left-2.5 rounded-full overflow-hidden">
            <Image
              src={Image3}
              alt="Pet"
              width={180}
              height={180}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div
          ref={(el: HTMLDivElement | null) => {
            circleRefs.current[3] = el;
          }}
          className="inline-flex items-start gap-[9.31px] absolute bottom-[20%] left-[0%]"
        >
          <div className="relative w-[309px] h-[309px] bg-success rounded-[154.5px]" />
          <div className="absolute w-[277px] h-[277px] top-4 left-[15px] rounded-full overflow-hidden">
            <Image
              src={Image4}
              alt="Pet"
              width={277}
              height={277}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div
          ref={(el: HTMLDivElement | null) => {
            circleRefs.current[4] = el;
          }}
          className="inline-flex items-start gap-[9.31px] absolute bottom-[15%] right-[10%]"
        >
          <div className="relative w-[296px] h-[296px] bg-[#FEBF03] rounded-[148px]" />
          <div className="absolute w-[265px] h-[265px] top-[15px] left-3.5 rounded-full overflow-hidden">
            <Image
              src={Image5}
              alt="Pet"
              width={265}
              height={265}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
