import { useEffect, useRef, useState } from "react";

export default function useCountUp(target: number, duration = 800) {
  // Initialize with current target to avoid flashing 0 (e.g., when returning from background tabs)
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const prevTargetRef = useRef<number>(target);

  useEffect(() => {
    if (prevTargetRef.current === target) return;
    prevTargetRef.current = target;

    startRef.current = null;
    startValueRef.current = value;

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      const next = Math.round(
        startValueRef.current + (target - startValueRef.current) * eased
      );
      setValue(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}
