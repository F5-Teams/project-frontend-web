"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";

import text from "@/mock/aboutText.json";
import { toast } from "sonner";

export default function PrivacyPolicyPage() {
  const [isExpanded, setIsExpanded] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const answersRef = useRef<Array<HTMLDivElement | null>>([]);
  const prevExpanded = useRef<number | null>(null);
  // Cache counts to ensure consistent indexing across both sections
  const dieuKhoanCount =
    (text as { dieuKhoan?: unknown[] }).dieuKhoan?.length ?? 0;
  const chinhSachCount =
    (text as { chinhSach?: unknown[] }).chinhSach?.length ?? 0;

  const toggleAccordion = (index: number) => {
    setIsExpanded((prev) => (prev === index ? null : index));
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Đã copy: ${value}`);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Không thể copy, thử lại nhé.");
    }
  };

  // Reveal elements sequentially when page mounts
  useEffect(() => {
    const nodes =
      containerRef.current?.querySelectorAll<HTMLElement>(".fade-up");
    if (!nodes || nodes.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(nodes, { autoAlpha: 0, y: 16 });
      gsap.to(nodes, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth accordion expand/collapse
  useEffect(() => {
    const prevIndex = prevExpanded.current;
    prevExpanded.current = isExpanded;

    if (prevIndex !== null && prevIndex !== isExpanded) {
      const closing = answersRef.current[prevIndex];
      if (closing) {
        gsap.to(closing, {
          height: 0,
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            if (prevExpanded.current === prevIndex) return;
            closing.style.display = "none";
            closing.style.height = "0px";
            closing.style.opacity = "0";
          },
        });
      }
    }

    if (isExpanded !== null) {
      const currentIndex = isExpanded;
      const opening = answersRef.current[currentIndex];
      if (opening) {
        opening.style.display = "block";
        const target = opening.scrollHeight;
        gsap.fromTo(
          opening,
          { height: 0, autoAlpha: 0 },
          {
            height: target,
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              if (prevExpanded.current !== currentIndex) return;
              opening.style.height = "auto";
            },
          }
        );
      }
    }
  }, [isExpanded]);

  const setAnswerRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      answersRef.current[index] = node;
      if (!node) return;
      node.style.overflow = "hidden";
      node.style.display = "none";
      node.style.height = "0px";
      node.style.opacity = "0";
    },
    []
  );

  // IMPORTANT: Use a single shared refs array sized to both lists combined
  answersRef.current.length = dieuKhoanCount + chinhSachCount;

  return (
    <div ref={containerRef} className="space-y-6 p-6">
      <Section className="mx-auto px-8 py-2 fade-up">
        <div className="bg-white/20 rounded-2xl shadow-md px-4 py-6">
          <h1 className="font-poppins-medium text-3xl mb-4">
            {text.dieuKhoanSuDung}
          </h1>
          <p className="font-poppins-regular text-gray-700">
            {text.mainDescription}
          </p>
          {/* <br />
          <p className="font-poppins-regular">{text.subDescription}</p> */}
        </div>
      </Section>

      <Section className="mx-auto px-8 fade-up">
        {/* <h2 className="font-poppins-medium text-2xl text-title-primary">
          {text.faqTitle}
        </h2> */}

        {text.dieuKhoan.map(
          (
            item: { icon: string; question: string; answer: string },
            index: number
          ) => (
            <div key={index} className="mt-4 fade-up">
              <button
                className="flex justify-between w-full text-left font-medium text-lg items-center p-3 rounded-3xl transition-colors duration-300 hover:bg-[#ebc6d9]"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isExpanded === index}
              >
                <span className="font-poppins-regular flex items-center gap-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="1.75rem"
                    height="1.75rem"
                    className="fill-current"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  />
                  {item.question}
                </span>

                <span
                  className={`transform transition-transform duration-300 ${
                    isExpanded === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="1.25rem"
                    height="1.25rem"
                    className="fill-current text-gray-600"
                  >
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </span>
              </button>

              <div className="overflow-hidden">
                <div
                  ref={setAnswerRef(index)}
                  className={`answer-content answer-${index} px-1 pt-1 pb-3 font-poppins-regular leading-relaxed`}
                  aria-hidden={isExpanded !== index}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          )
        )}
      </Section>

      <Section className="mx-auto px-8 py-2 fade-up">
        <div className="bg-white/20 rounded-2xl shadow-md px-4 py-6">
          <h1 className="font-poppins-medium text-3xl mb-4">
            {text.chinhSachQuyenRiengTu}
          </h1>
          <p className="font-poppins-regular text-gray-700">
            {text.mainDescription2}
          </p>
        </div>
      </Section>

      <Section className="mx-auto px-8 fade-up">
        {text.chinhSach.map(
          (
            item: { icon: string; question: string; answer: string },
            index: number
          ) => {
            const combinedIndex = dieuKhoanCount + index;
            return (
              <div key={index} className="mt-4 fade-up">
                <button
                  className="flex justify-between w-full text-left font-medium text-lg items-center p-3 rounded-[9999px] transition-colors duration-300 hover:bg-[#ffecf6]"
                  onClick={() => toggleAccordion(combinedIndex)}
                  aria-expanded={isExpanded === combinedIndex}
                >
                  <span className="font-poppins-regular flex items-center gap-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="1.75rem"
                      height="1.75rem"
                      className="fill-current"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                    {item.question}
                  </span>

                  <span
                    className={`transform transition-transform duration-300 ${
                      isExpanded === combinedIndex ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="1.25rem"
                      height="1.25rem"
                      className="fill-current text-gray-600"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  </span>
                </button>

                <div className="overflow-hidden">
                  <div
                    ref={setAnswerRef(combinedIndex)}
                    className={`answer-content answer-${combinedIndex} px-1 pt-1 pb-3 font-poppins-regular leading-relaxed`}
                    aria-hidden={isExpanded !== combinedIndex}
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </Section>

      <Section className="mx-auto px-8 fade-up">
        <h2 className="text-3xl font-poppins-medium mb-4">
          {text.contactTitle}
        </h2>

        <div className="font-poppins-regular   flex flex-col gap-3">
          <p>
            Mọi thắc mắc hoặc yêu cầu liên quan đến Điều khoản Sử dụng hay Chính
            sách Quyền Riêng tư có thể được gửi về:
          </p>
          {/* <ContactRow
            icon={text.contactInfo.phoneIcon}
            label={text.customerSupport}
            value={text.contactInfo.phone}
            onCopy={copyToClipboard}
          /> */}
          <ContactRow
            icon={text.contactInfo.emailIcon}
            label={text.email}
            value={text.contactInfo.email}
            onCopy={copyToClipboard}
          />
        </div>
      </Section>
    </div>
  );
}

type ContactRowProps = {
  icon: string;
  label: string;
  value: string;
  onCopy: (val: string) => void;
};

function ContactRow({ icon, label, value, onCopy }: ContactRowProps) {
  return (
    <div className="flex items-center gap-2 group">
      <span className="w-6 h-6" dangerouslySetInnerHTML={{ __html: icon }} />
      <span className="font-medium">{label}</span>
      <p>{value}</p>
      <button
        className="transition-opacity duration-300 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-full w-10 h-10 hover:bg-[#ffecf6]"
        onClick={() => onCopy(value)}
        aria-label={`Copy ${label}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.25rem"
          height="1.25rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"
          />
        </svg>
      </button>
    </div>
  );
}

type SectionProps = {
  className?: string;
  children: ReactNode;
};

function Section({ className = "", children }: SectionProps) {
  return <section className={className}>{children}</section>;
}
