import { useEffect, useRef, useState, type CSSProperties } from "react";

import turboImg from "@/assets/hero-turbo.webp";

/** Tilt feel, in degrees / pixels at the edge of the hero. */
const MAX_TILT = 6;
const MAX_SHIFT = 14;
const EASE = 0.06;

/**
 * Hero centerpiece: a photoreal turbocharger render with a slow light sweep across the metal
 * and a gentle pointer tilt. Pure CSS/DOM, so it is instant, needs no WebGL, and the motion is
 * skipped entirely for reduced-motion and touch-only visitors.
 */
export function HeroVisual() {
  const stage = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches || !finePointer.matches) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      cur.x += (target.x - cur.x) * EASE;
      cur.y += (target.y - cur.y) * EASE;
      el.style.transform = `perspective(1400px) rotateY(${(cur.x * MAX_TILT).toFixed(3)}deg) rotateX(${(
        -cur.y * MAX_TILT
      ).toFixed(3)}deg) translate3d(${(cur.x * MAX_SHIFT).toFixed(2)}px, ${(cur.y * MAX_SHIFT).toFixed(2)}px, 0)`;
      if (Math.abs(target.x - cur.x) > 0.0005 || Math.abs(target.y - cur.y) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sweepMask: CSSProperties = {
    maskImage: `url(${turboImg})`,
    WebkitMaskImage: `url(${turboImg})`,
    maskMode: "luminance",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center" data-scene-ready={loaded ? "true" : undefined}>
      {/* blue bloom behind the part */}
      <div aria-hidden="true" className="turbo-bloom absolute inset-0" />
      <div
        className={`turbo-vignette relative aspect-square w-[min(100%,82svh,760px)] transition-[opacity,translate] duration-1000 ease-out ${
          loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div ref={stage} className="relative h-full w-full will-change-transform">
          <img
            ref={imgRef}
            src={turboImg}
            alt=""
            width={1400}
            height={1400}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className="h-full w-full select-none object-contain"
            draggable={false}
          />
          {/* moving highlight that only lands on the bright metal */}
          <div aria-hidden="true" className="turbo-sweep absolute inset-0" style={sweepMask} />
        </div>
      </div>
    </div>
  );
}
