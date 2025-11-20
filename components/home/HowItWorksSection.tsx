"use client";

import React, { useLayoutEffect, useRef } from "react";
import { steps } from "@/constants/step";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      // ===== DOM refs =====
      const leftEl = leftRef.current as HTMLElement | null;
      const heading = document.querySelector(
        ".hiw-heading"
      ) as HTMLElement | null;
      const desc = document.querySelector(".hiw-desc") as HTMLElement | null;

      // ===== Split desc into words for subtle stagger on entry (no paid plugins) =====
      const splitDescIntoWords = (el: HTMLElement) => {
        const text = el.innerText;
        const parts = text.split(/(\s+)/);
        el.innerHTML = parts
          .map((p) =>
            /\s+/.test(p)
              ? p
              : `<span class="hiw-word inline-block will-change-transform">${p}</span>`
          )
          .join("");
      };
      if (desc) splitDescIntoWords(desc);

      // ===== Cards list (for triggers) =====
      const cards = gsap.utils.toArray<HTMLElement>(".hiw-card");

      // ===== Base states / reduced motion =====
      if (reduce) {
        gsap.set([heading, desc, ".hiw-word", leftEl, ".hiw-card"], {
          opacity: 1,
          x: 0,
          y: 0,
        });
      } else {
        // Entry animations for heading + desc
        if (heading) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top center",
            },
            defaults: { ease: "power3.out" },
          });

          tl.from(heading, {
            y: 28,
            opacity: 0,
            scale: 0.98,
            letterSpacing: "-0.08em",
            duration: 0.85,
          }).fromTo(
            heading,
            { boxShadow: "inset 0 -0px 0 0 rgba(250,204,21,0)" },
            {
              boxShadow: "inset 0 -12px 0 0 rgba(250,204,21,0.25)",
              duration: 0.9,
            },
            "-=0.45"
          );

          gsap.to(heading, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }

        const words = gsap.utils.toArray<HTMLElement>(".hiw-word");
        if (words.length) {
          gsap.from(words, {
            y: 8,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.02,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }

        // Reveal cards
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 24 });
          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.1,
              }),
            once: true,
          });

          // Subtle image parallax & float
          cards.forEach((card) => {
            const imgWrap = card.querySelector(".hiw-imgwrap");
            const img = card.querySelector(".hiw-img");
            if (imgWrap && img) {
              const floatTl = gsap.timeline({ paused: true });
              floatTl.to(img, {
                y: -8,
                rotation: -1.5,
                duration: 1.8,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
              ScrollTrigger.create({
                trigger: imgWrap,
                start: "top 95%",
                onEnter: () => floatTl.play(),
                onLeaveBack: () => floatTl.pause(0),
              });

              gsap.fromTo(
                img,
                { yPercent: -5 },
                {
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: imgWrap,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.6,
                  },
                }
              );
            }
          });
        }

        // Parallax nhẹ cho cả block trái
        if (leftEl) {
          gsap.to(leftEl, {
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
            },
          });
        }

        // ======= CORE: Cả tiêu đề + mô tả (block .hiw-left) đi theo scroll trái -> phải -> trái =======
        if (leftEl && cards.length) {
          const mm = gsap.matchMedia();
          mm.add(
            {
              isSmall: "(max-width: 767px)",
              isMedium: "(min-width: 768px) and (max-width: 1279px)",
              isLarge: "(min-width: 1280px)",
            },
            (mq) => {
              const { isSmall, isMedium } = mq.conditions as Record<
                string,
                boolean
              >;
              const SHIFT = isSmall ? 36 : isMedium ? 120 : 200; // độ lệch sang phải

              // Lấy 3 cột mốc đầu cho pattern sole (nếu ít hơn thì fallback hợp lý)
              const c0 = cards[0];
              const c1 = cards[1] ?? cards[cards.length - 1];
              const c2 = cards[2] ?? cards[cards.length - 1];

              // Reset vị trí
              gsap.set(leftEl, { x: 0 });

              // Keyframes scrub từ card1 -> card3:
              // 0 (ảnh phải) => x:0
              // 1 (ảnh trái) => x:SHIFT
              // 2 (ảnh phải) => x:0
              gsap.to(leftEl, {
                keyframes: [{ x: 0 }, { x: SHIFT }, { x: 0 }],
                ease: "none",
                scrollTrigger: {
                  trigger: c0,
                  endTrigger: c2,
                  start: "top center+=10%",
                  end: "bottom center",
                  scrub: 0.6,
                },
              });
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex w-full items-start justify-between px-16 py-4 relative"
    >
      {/* LEFT (sticky, đi theo scroll) */}
      <div
        ref={leftRef}
        className="hiw-left inline-flex justify-center sticky top-20 gap-4 flex-[0_0_auto] flex-col items-start"
      >
        <Card className="w-full bg-white/50 backdrop-blur-sm rounded-2xl border-0 drop-shadow-[3px_5px_8px_rgba(210,180,140,0.1)] p-6">
          <h2 className="hiw-heading relative w-fit mt-[-1.00px] font-poppins-regular text-[80px] text-black text-center tracking-[-1.82px]">
            HẸN THẾ NÀO?
          </h2>
          <p className="hiw-desc relative max-w-2xl font-poppins-light text-[20px] text-black leading-[30px]">
            Tại HappyPaws, chúng tôi giúp bạn chăm sóc những người bạn lông xù
            một cách dễ dàng và chu đáo. Quy trình của chúng tôi đơn giản, linh
            hoạt, phù hợp với nhu cầu riêng của bạn.
          </p>
        </Card>
      </div>

      {/* RIGHT (list) */}
      <div className="hiw-list inline-flex flex-col items-center gap-8 relative">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="hiw-card w-[500px] full-h py-[0px] gap-0 items-start relative rounded-lg overflow-hidden border-none"
          >
            <CardContent className="px-3 w-full bg-white">
              <div
                className={`${step.textColor} hiw-number font-poppins-regular text-[30px] tracking-[-0.18px] leading-[50px]`}
              >
                {step.number}
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="hiw-title font-poppins-regular text-dark text-[60px] tracking-[-1.82px] leading-[80px]">
                  {step.title.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < step.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="hiw-text font-poppins-light text-muted-foreground text-[18px] leading-[30px] mb-2">
                  {step.description}
                </p>
              </div>
            </CardContent>

            <div
              className={`hiw-imgwrap flex items-center justify-center w-full h-[250px] ${step.bgColor}`}
            >
              <Image
                src={step.img}
                alt={step.title}
                width={200}
                height={200}
                className="hiw-img object-contain will-change-transform"
                priority={index < 2}
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
