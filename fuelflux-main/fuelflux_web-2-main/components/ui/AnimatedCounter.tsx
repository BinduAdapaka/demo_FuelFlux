'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export interface AnimatedCounterProps {
  end?: number;
  value?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  separator?: string;
  triggerOnMount?: boolean;
}

/**
 * AnimatedCounter
 * Performs a high-precision, smooth count-up from 0 to the target value
 * using an easeOutExpo easing curve and zero glitch/NaN artifacts.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  value,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  separator = ',',
  triggerOnMount = true,
}) => {
  const targetNumber = typeof end === 'number' ? end : typeof value === 'number' ? value : 0;
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState<number>(() => {
    // If reduced motion is requested, render the final target immediately
    if (prefersReducedMotion) {
      return Number.isFinite(targetNumber) ? targetNumber : 0;
    }
    return 0;
  });

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const hasAnimated = useRef(false);
  const prevTarget = useRef<number>(targetNumber);

  useEffect(() => {
    // If target value is not valid, safeguard immediately
    const targetEnd = Number.isFinite(targetNumber) ? targetNumber : 0;

    if (prefersReducedMotion) {
      setCount(targetEnd);
      return;
    }

    // Determine if we should start animation
    const shouldStart = triggerOnMount || isInView;
    if (!shouldStart) return;

    // Check if we need to animate (first time or target has changed)
    const isNewTarget = prevTarget.current !== targetEnd;
    if (hasAnimated.current && !isNewTarget && count === targetEnd) return;
    hasAnimated.current = true;
    prevTarget.current = targetEnd;

    let startTime: number | null = null;
    let animationFrameId: number;
    const startVal = isNewTarget ? count : 0;

    // Smooth exponential decay easing (easeOutExpo)
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const updateCount = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / Math.max(duration, 300), 1);
      const easedProgress = easeOutExpo(progress);
      const currentVal = startVal + easedProgress * (targetEnd - startVal);

      if (Number.isFinite(currentVal)) {
        setCount(currentVal);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(targetEnd);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, triggerOnMount, targetNumber, duration, prefersReducedMotion]);

  // Safe formatting without NaN
  const safeCount = Number.isFinite(count) ? count : 0;
  let formattedNumber: string;

  if (decimals > 0) {
    const fixed = safeCount.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    formattedNumber = parts.join('.');
  } else {
    formattedNumber = Math.floor(safeCount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  return (
    <span ref={ref} className={`tabular-nums inline-block font-inherit ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
