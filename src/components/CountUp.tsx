'use client';

import React, { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: string | number;
  duration?: number; // ms
  className?: string;
};

function parseValue(val: string | number) {
  if (typeof val === 'number') return { num: val, suffix: '' };
  const m = String(val).match(/^([\d,.]+)(.*)$/);
  if (!m) return { num: NaN, suffix: String(val) };
  const num = parseFloat(m[1].replace(/,/g, ''));
  const suffix = m[2] || '';
  return { num, suffix };
}

export default function CountUp({ value, duration = 1400, className = '' }: CountUpProps) {
  const [display, setDisplay] = useState<string>(String(value));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const { num, suffix } = parseValue(value);
    if (!isNaN(num)) {
      const start = performance.now();
      const from = 0;
      const to = num;

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
        const current = from + (to - from) * eased;
        // Show integer for big numbers, preserve decimals if small
        const formatted = to >= 1000 ? Math.round(current).toLocaleString() : (Math.round(current * 10) / 10).toString();
        setDisplay(formatted + suffix);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      setDisplay(String(value));
    }
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
