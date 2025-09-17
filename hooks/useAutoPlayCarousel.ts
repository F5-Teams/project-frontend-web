import { useEffect } from "react";
import { CarouselApi } from "@/components/ui/carousel";

export function useAutoPlayCarousel(
  api: CarouselApi | undefined,
  delay = 4000
) {
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, delay);

    return () => clearInterval(interval);
  }, [api, delay]);
}
