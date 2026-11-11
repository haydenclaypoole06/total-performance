import { useId } from "react";

/** Round SVG coordinates so server and browser render identical markup. */
const r2 = (n: number) => Math.round(n * 100) / 100;
/** Static illustrated turbo/compressor used before 3D loads, without WebGL, or on low-power devices. */
export function TurboFallback({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${uid}`;
  const blades = 14;
  const ticks = 120;
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id("tf-metal")} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="var(--white)" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--steel)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--graphite)" />
        </radialGradient>
        <linearGradient id={id("tf-rim")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ice)" />
          <stop offset="50%" stopColor="var(--electric)" />
          <stop offset="100%" stopColor="var(--graphite)" />
        </linearGradient>
        <radialGradient id={id("tf-glow")} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="var(--electric)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--electric)" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      {/* tach ring */}
      <g stroke="var(--ice)" opacity="0.45">
        {Array.from({ length: ticks }).map((_, i) => {
          const a = (i / ticks) * Math.PI * 2;
          const len = i % 10 === 0 ? 18 : i % 5 === 0 ? 11 : 6;
          const r1 = 272;
          const rIn = r1 - len;
          return (
            <line
              key={i}
              x1={r2(300 + Math.cos(a) * r1)}
              y1={r2(300 + Math.sin(a) * r1)}
              x2={r2(300 + Math.cos(a) * rIn)}
              y2={r2(300 + Math.sin(a) * rIn)}
              strokeWidth={i % 10 === 0 ? 1.6 : 1}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="290" fill="none" stroke="var(--electric)" strokeOpacity="0.5" />
      {/* housing */}
      <circle cx="300" cy="300" r="225" fill={`url(#${id("tf-glow")})`} />
      <circle cx="300" cy="300" r="205" fill="var(--graphite)" stroke={`url(#${id("tf-rim")})`} strokeWidth="10" />
      <circle cx="300" cy="300" r="182" fill="none" stroke="var(--steel)" strokeOpacity="0.35" strokeWidth="2" />
      <circle cx="300" cy="300" r="170" fill="var(--near-black)" />
      {/* blades */}
      <g>
        {Array.from({ length: blades }).map((_, i) => {
          const rot = (i / blades) * 360;
          const splitter = i % 2 === 1;
          return (
            <path
              key={i}
              transform={`rotate(${rot} 300 300)`}
              d={
                splitter
                  ? "M300 300 Q 330 240 318 175 L 306 178 Q 312 238 300 300 Z"
                  : "M300 300 Q 345 225 322 136 L 306 138 Q 322 222 300 300 Z"
              }
              fill={`url(#${id("tf-metal")})`}
              opacity={splitter ? 0.75 : 0.95}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="34" fill={`url(#${id("tf-metal")})`} />
      <circle cx="300" cy="300" r="12" fill="var(--electric)" />
    </svg>
  );
}
