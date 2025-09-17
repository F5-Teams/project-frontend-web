"use client";
import { useEffect, RefObject } from "react";
import gsap from "gsap";

export const useFloatingCircles = (
  refs: RefObject<(HTMLDivElement | null)[]>
) => {
  useEffect(() => {
    if (!refs.current) return;

    refs.current.forEach((el, index) => {
      if (!el) return;

      const direction = index % 2 === 0 ? "y" : "x";
      const distance = index % 2 === 0 ? 20 : 15;

      gsap.to(el, {
        [direction]: distance,
        duration: 3 + index * 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });
  }, [refs]);
};
