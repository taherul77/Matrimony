"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localIsHovering, setLocalIsHovering] = useState(false);

  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  // const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgRect, setImgRect] = useState<{ width: number; height: number } | null>(null);
  const [supportsMask, setSupportsMask] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    // keep the measured rect up-to-date for the fallback magnifier
    setImgRect({ width: rect.width, height: rect.height });
  };

  React.useEffect(() => {
    // feature-detect mask support
    try {
      const ok =
        typeof CSS !== "undefined" &&
        (CSS as any).supports &&
        ((CSS as any).supports("mask-image", "radial-gradient(circle,#fff,#000)") ||
          (CSS as any).supports("-webkit-mask-image", "radial-gradient(circle,#fff,#000)"));
      setSupportsMask(!!ok);
    } catch (err) {
      setSupportsMask(false);
    }

    if (!containerRef.current) return;
    const img = containerRef.current.querySelector("img") as HTMLImageElement | null;
    if (img && img.src) setImgSrc(img.src);

    const updateRect = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setImgRect({ width: r.width, height: r.height });
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg z-20"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
            style={{
              // show the inner area (white) and fade to transparent at the edges
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 80%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 80%)`,
              transformOrigin: `${position.x}px ${position.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${position.x}px ${position.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {isHovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  // use a mask with a solid inner area so the magnified content shows through
                  maskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 80%)`,
                  WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 80%)`,
                  transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  zIndex: 50,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoomFactor})`,
                    transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  }}
                >
                  {children}
                </div>
              </motion.div>
              {/* Fallback magnifier for browsers without mask support */}
              {!supportsMask && imgSrc && imgRect && isHovering && (
                <div
                  className="pointer-events-none"
                  style={{
                    position: "absolute",
                    left: mousePosition.x - lensSize / 2,
                    top: mousePosition.y - lensSize / 2,
                    width: lensSize,
                    height: lensSize,
                    borderRadius: "50%",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                    backgroundImage: `url(${imgSrc})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${imgRect.width * zoomFactor}px ${imgRect.height * zoomFactor}px`,
                    backgroundPosition: `${-mousePosition.x * zoomFactor + lensSize / 2}px ${-mousePosition.y * zoomFactor + lensSize / 2}px`,
                    zIndex: 60,
                    border: "2px solid rgba(255,255,255,0.12)",
                    overflow: "hidden",
                  }}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
