'use client';

import React, { useRef, useState } from 'react';

type LensProps = {
  children: React.ReactNode;
  className?: string;
  setHovering?: (v: boolean) => void;
};

export default function Lens({ children, className = '', setHovering }: LensProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    wrapRef.current.style.setProperty('--mx', `${x}%`);
    wrapRef.current.style.setProperty('--my', `${y}%`);
  };

  const onEnter = () => {
    setVisible(true);
    if (setHovering) setHovering(true);
  };
  const onLeave = () => {
    setVisible(false);
    if (setHovering) setHovering(false);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        // CSS variables used by the overlay
        ['--mx' as any]: '50%',
        ['--my' as any]: '50%',
      }}
    >
      {children}

      {/* radial highlight / lens overlay */}
      <div
        aria-hidden
        className={`pointer-events-none transition-opacity duration-300 absolute inset-0 ${visible ? 'opacity-80' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,0.10), rgba(255,255,255,0.02) 30%, transparent 45%)`,
          mixBlendMode: 'screen'
        }}
      />

      {/* subtle vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
    </div>
  );
}
