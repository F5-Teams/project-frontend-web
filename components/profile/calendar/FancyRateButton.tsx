"use client";
import React from "react";
import gsap from "gsap";
import { Star } from "lucide-react";

type Props = {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export default function FancyRateButton({
  onClick,
  className,
  children,
}: Props) {
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const haloRef = React.useRef<HTMLSpanElement | null>(null);
  const shineRef = React.useRef<HTMLSpanElement | null>(null);
  const starRef = React.useRef<HTMLSpanElement | null>(null);

  const shineTweenRef = React.useRef<gsap.core.Tween | null>(null);

  const onEnter = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      duration: 0.25,
      scale: 1.05,
      boxShadow:
        "0 0 0 2px rgba(245,158,11,0.35), 0 10px 30px rgba(245,158,11,0.35)",
      ease: "power2.out",
    });
    if (haloRef.current) {
      gsap.to(haloRef.current, {
        duration: 0.25,
        opacity: 1,
        ease: "power2.out",
      });
    }
    if (starRef.current) {
      gsap.to(starRef.current, {
        duration: 0.25,
        rotate: 12,
        scale: 1.1,
        ease: "back.out(2)",
      });
    }
    if (shineRef.current) {
      gsap.set(shineRef.current, { x: "-140%", opacity: 0 });
      shineTweenRef.current = gsap.to(shineRef.current, {
        x: "240%",
        opacity: 1,
        duration: 0.9,
        ease: "power2.inOut",
        repeat: -1,
      });
    }
  };

  const onLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      duration: 0.25,
      scale: 1,
      boxShadow: "none",
      ease: "power2.inOut",
    });
    if (haloRef.current) {
      gsap.to(haloRef.current, {
        duration: 0.25,
        opacity: 0,
        ease: "power2.inOut",
      });
    }
    if (starRef.current) {
      gsap.to(starRef.current, {
        duration: 0.25,
        rotate: 0,
        scale: 1,
        ease: "power2.inOut",
      });
    }
    if (shineTweenRef.current) {
      shineTweenRef.current.kill();
      shineTweenRef.current = null;
    }
    if (shineRef.current) {
      gsap.set(shineRef.current, { x: "-140%", opacity: 0 });
    }
  };

  React.useEffect(() => {
    return () => {
      if (shineTweenRef.current) {
        shineTweenRef.current.kill();
        shineTweenRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      ref={btnRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={() => {
        if (btnRef.current)
          gsap.to(btnRef.current, { duration: 0.08, scale: 0.98 });
      }}
      onMouseUp={() => {
        if (btnRef.current)
          gsap.to(btnRef.current, { duration: 0.12, scale: 1.05 });
      }}
      onClick={onClick}
      className={
        "relative overflow-hidden px-4 py-2 rounded-2xl bg-amber-500 text-white text-sm md:text-base font-medium hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-900 transition-colors " +
        (className ?? "")
      }
    >
      {/* soft glow halo */}
      <span
        aria-hidden
        ref={haloRef}
        className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-amber-300/25 blur-md opacity-0"
      />

      {/* shine sweep */}
      <span
        aria-hidden
        ref={shineRef}
        className="pointer-events-none absolute inset-y-0 left-[-35%] w-[35%] bg-white/35 blur-sm"
        style={{ transform: "skewX(-20deg)" }}
      />

      <span className="relative z-10 inline-flex items-center gap-2 font-poppins-light">
        <span ref={starRef} aria-hidden className="inline-flex">
          <Star size={14} className="text-yellow-300" />
        </span>
        {children ?? "Đánh giá"}
      </span>
    </button>
  );
}
