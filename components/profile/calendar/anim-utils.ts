import { Variants } from "framer-motion";

// Modal animation variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.2 } },
};

// Star hover/tap animations for rating items
export const ratingStarHover = { scale: 1.2, rotate: 8 };
export const ratingStarTap = { scale: 0.9 };

// Predefined particle offsets for the fancy button burst effect
export const starParticleOffsets: Array<{ x: number; y: number; r?: number }> =
  [
    { x: -20, y: -8, r: -10 },
    { x: 0, y: -24, r: 12 },
    { x: 20, y: -10, r: -8 },
    { x: -16, y: 14, r: 10 },
    { x: 16, y: 16, r: -12 },
    { x: 0, y: 20, r: 0 },
  ];
