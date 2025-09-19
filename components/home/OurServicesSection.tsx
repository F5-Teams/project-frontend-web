"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState } from "react";
import { useAutoPlayCarousel } from "@/hooks";
import { services } from "@/constants";

const OurServicesSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  useAutoPlayCarousel(api, 6000);

  return (
    <section className="flex flex-col w-full items-center gap-14 px-16 pb-8 relative">
      <h2 className="relative w-fit font-poppins-regular text-[80px] text-center tracking-[-1.82px] bg-gradient-to-r from-secondary via-pink-350 to-primary bg-clip-text text-transparent drop-shadow-[3px_5px_8px_rgba(210,180,140,0.5)]">
        DỊCH VỤ CỦA CHÚNG TÔI
      </h2>

      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        className="w-full max-w-[1340px]"
      >
        <CarouselContent>
          {services.map((service, i) => (
            <CarouselItem key={i}>
              <Card className="flex w-[1265px] h-[455px] items-center gap-16 bg-white rounded-2xl overflow-hidden border-0 drop-shadow-[3px_5px_8px_rgba(210,180,140,0.1)]">
                <CardContent className="flex items-center gap-10 p-0 w-[1265px] h-full">
                  <div className="relative w-[500px] h-[455px] flex-shrink-0 overflow-hidden">
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                  <div className="flex h-[455px] justify-between flex-1 flex-col items-start pr-16 py-8">
                    <div className="flex gap-4 flex-col items-start">
                      <h3 className="font-poppins-semibold text-black text-[66px] lg:text-[70px] leading-[58px] break-words">
                        {service.title}
                      </h3>
                      <p className="w-[637px] font-poppins-light text-dark text-[16px] lg:text-[18px] leading-[30px]">
                        {service.desc}
                      </p>
                    </div>
                    <button className="btn-primary text-[20px]">
                      Đặt lịch ngay
                    </button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center justify-between w-full mt-6">
          <button className="btn-secondary inline-flex items-center justify-center gap-2.5 px-4 py-2.5 relative flex-[0_0_auto] rounded-lg h-auto border-0 shadow-none">
            Xem tất cả các dịch vụ
          </button>
          <div className="flex gap-4">
            <CarouselPrevious className=" w-16 h-16 bg-white rounded-[32px] border-0 shadow-none hover:bg-white/90 drop-shadow-[3px_5px_8px_rgba(210,180,140,0.75)]">
              <ChevronLeftIcon className="w-[46px] h-[46px]" />
            </CarouselPrevious>
            <CarouselNext className=" w-16 h-16 bg-white rounded-[32px] border-0 shadow-none hover:bg-white/90 drop-shadow-[3px_5px_8px_rgba(210,180,140,0.75)]">
              <ChevronRightIcon className="w-[46px] h-[46px]" />
            </CarouselNext>
          </div>
        </div>
      </Carousel>
    </section>
  );
};

export default OurServicesSection;
