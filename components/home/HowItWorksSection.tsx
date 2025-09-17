import { steps } from "@/constants/step";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Image from "next/image";

const HowItWorksSection = () => {
  return (
    <section className="flex w-full items-start justify-between px-16 py-4 relative">
      <div className="inline-flex justify-center sticky top-20 gap-4 flex-[0_0_auto] flex-col items-start">
        <h2 className="relative w-fit mt-[-1.00px] font-poppins-regular text-[80px] text-black text-center tracking-[-1.82px]">
          HẸN THẾ NÀO?
        </h2>
        <p className="relative max-w-2xl font-poppins-light text-[20px] text-black leading-[30px]">
          Tại HappyPaws, chúng tôi giúp bạn chăm sóc những người bạn lông xù một
          cách dễ dàng và chu đáo. Quy trình của chúng tôi đơn giản, linh hoạt,
          phù hợp với nhu cầu riêng của bạn.
        </p>
      </div>
      <div className="inline-flex flex-col items-center gap-8 relative overflow-y-auto ">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="w-[500px] full-h py-[0px] gap-0 items-start relative rounded-lg overflow-hidden border-none"
          >
            <CardContent className="px-3 w-full bg-white">
              <div
                className={`${step.textColor} font-poppins-regular text-[30px] tracking-[-0.18px] leading-[50px]`}
              >
                {step.number}
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="font-poppins-regular text-dark text-[60px] tracking-[-1.82px] leading-[80px]">
                  {step.title.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < step.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="font-poppins-light text-muted-foreground text-[18px] leading-[30px] mb-2">
                  {step.description}
                </p>
              </div>
            </CardContent>

            <div
              className={`flex items-center justify-center w-full h-[250px] ${step.bgColor}`}
            >
              <Image
                src={step.img}
                alt={step.title}
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
