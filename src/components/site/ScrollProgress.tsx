import { useEffect, useRef } from "react";

/** Thin tachometer-style progress bar across the top of the viewport. */
export function ScrollProgress() {
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--steel) 0 1px, transparent 1px 2.5%)",
        }}
      />
      <div
        ref={fill}
        className="absolute inset-0 origin-left bg-primary"
        style={{ transform: "scaleX(0)" }}
      >
        <div className="absolute inset-y-0 right-0 w-[12%] bg-ice" />
      </div>
    </div>
  );
}
