import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

const OurHappyClientsSection = () => {
  return (
    <section className="flex flex-col w-full items-center gap-16 px-16 py-20 relative">
      <h2 className="relative w-fit mt-[-1.00px] font-poppins-regular text-[80px] text-center tracking-[-1.8px] bg-gradient-to-r from-secondary via-pink-350 to-primary bg-clip-text text-transparent drop-shadow-[3px_5px_8px_rgba(210,180,140,0.5)]">
        KHÁCH HÀNG CỦA CHÚNG TÔI
      </h2>

      <div className="flex flex-wrap items-start justify-center gap-[32px_32px] relative self-stretch w-full flex-[0_0_auto]">
        <Card className="flex flex-col min-w-[620px] items-start gap-4 p-6 relative flex-1 grow bg-white rounded-lg">
          <CardContent className="flex flex-col gap-4 p-0 w-full">
            <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <Avatar className="w-[74px] h-[74px]">
                <AvatarImage
                  src="/ellipse-7.svg"
                  alt="Michael Johnson"
                  className="object-cover"
                />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1.5 relative flex-1 grow">
                <h3 className="relative w-fit mt-[-1.00px] font-poppins-medium text-black text-[30px] lg:text-[40px] tracking-[-0.18px] leading-[40px] break-words">
                  Michael Johnson
                </h3>
                <p className="relative font-poppins-light text-black text-[14px] lg:text-[16px] tracking-[0.px] leading-[20px] break-words">
                  Pet Owner, Happy Paws
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="inline-flex items-start gap-[5px] relative flex-[0_0_auto]">
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
                <StarIcon className="w-6 h-6 fill-current text-yellow-400" />
              </div>
              <p className="relative self-stretch font-poppins-light text-black text-[20px] lg:text-[22px] tracking-[0.px] leading-[30px] break-words">
                Gatito pet care services have been a game-changer for me and my
                furry friend. Their team is reliable, compassionate, and truly
                understands the unique needs of pets.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OurHappyClientsSection;
