"use client";

import React from "react";

type Props = {
  name: string;
  className?: string;
  title?: string;
};

export default function AnimatedPetName({
  name,
  className = "",
  title,
}: Props) {
  return (
    <>
      <span
        className={`animated-pet-name ${className}`}
        title={title ?? name}
        tabIndex={0}
        aria-label={name}
      >
        {name}
      </span>

      <style jsx>{`
        .animated-pet-name {
          display: inline-block;
          position: relative;
          cursor: default;
          transition: transform 180ms ease, color 180ms ease, filter 180ms ease;
          color: #0f172a; /* darker text */
          will-change: transform, filter;
          font-weight: 600;
        }

        /* subtle idle breathing (gentle motion) */
        .animated-pet-name {
          animation: pet-breath 3500ms ease-in-out infinite;
        }

        /* stronger, darker moving attractor line */
        .animated-pet-name::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          bottom: 0;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            rgba(14, 116, 237, 0.55) 0%,
            rgba(88, 80, 232, 0.75) 30%,
            rgba(88, 80, 232, 0.55) 60%,
            rgba(14, 116, 237, 0.45) 100%
          );
          background-size: 200% 100%;
          animation: attractor-slide 2.4s linear infinite;
          opacity: 1;
          pointer-events: none;
          box-shadow: 0 6px 18px rgba(14, 116, 237, 0.06);
        }

        /* animations */
        @keyframes pet-breath {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-1px) scale(1.003);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes attractor-slide {
          0% {
            background-position: 0% 50%;
            opacity: 1;
          }
          50% {
            background-position: 100% 50%;
            opacity: 1;
          }
          100% {
            background-position: 0% 50%;
            opacity: 1;
          }
        }

        /* reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animated-pet-name,
          .animated-pet-name::before {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
