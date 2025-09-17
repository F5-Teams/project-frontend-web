"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const InformationSection = () => {
  return (
    <section className="flex flex-col w-full items-center px-6 md:px-12 lg:px-16 pt-20 pb-12 relative">
      <Card className="w-full bg-white rounded-2xl border-0 drop-shadow-[3px_5px_8px_rgba(210,180,140,0.1)]">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-10 lg:px-12 py-6 ">
          <div className="flex items-start gap-4">
            <div className="w-[72px] h-[72px] lg:w-[89px] lg:h-[89px] bg-ring rounded-full flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-10 h-10 lg:w-16 lg:h-16 text-dark" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-poppins-medium text-[22px] lg:text-[28px] text-dark leading-[28px]">
                Thời gian mở cửa
              </h3>
              <p className="font-poppins-regular text-dark text-[16px] lg:text-[18px] leading-[28px]">
                T2 - T6: 8:00 AM đến 6:00 PM
              </p>
              <p className="font-poppins-regular text-dark text-[16px] lg:text-[18px] leading-[18px]">
                T7 - CN: 8:00 AM đến 2:00 PM
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-[72px] h-[72px] lg:w-[89px] lg:h-[89px] bg-ring rounded-full flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-10 h-10 lg:w-16 lg:h-16 text-dark" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-poppins-medium text-[22px] lg:text-[28px] text-dark leading-[28px]">
                Địa chỉ
              </h3>
              <p className="font-poppins-regular text-dark text-[16px] lg:text-[18px] leading-[28px]">
                7 Đ. D1, Long Thạnh Mỹ,
                <br /> Thủ Đức, Hồ Chí Minh
              </p>
              <a
                href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+FPT+TP.+HCM/@10.8411329,106.8073027,767m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31752731176b07b1:0xb752b24b379bae5e!8m2!3d10.8411276!4d106.809883!16s%2Fg%2F11j2zx_fz_?entry=ttu&g_ep=EgoyMDI1MDkxNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="font-poppins-light text-primary text-[15px] lg:text-[16px] leading-[24px] cursor-pointer hover:underline"
              >
                Xem bản đồ
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-[72px] h-[72px] lg:w-[89px] lg:h-[89px] bg-ring rounded-full flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="w-10 h-10 lg:w-16 lg:h-16 text-dark" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-poppins-medium text-[22px] lg:text-[28px] text-dark leading-[28px]">
                Liên hệ
              </h3>
              <p className="font-poppins-regular text-dark text-[16px] lg:text-[18px] leading-[28px]">
                037-4745872
              </p>
              <p className="font-poppins-regular text-dark text-[15px] lg:text-[16px] leading-[16px] break-words">
                cuonghkse182700.fpt.edu.vn
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default InformationSection;
