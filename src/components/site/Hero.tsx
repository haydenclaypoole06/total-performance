import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { HeroVisual } from "./hero/HeroVisual";

/** Round SVG coordinates so server and browser render identical markup. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function TachCue() {
  const ticks = 9;
  return (
    <a
      href="#services"
      className="group inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Scroll to services"
    >
      <svg viewBox="0 0 48 28" className="h-7 w-12" aria-hidden="true">
        <path d="M4 26 A20 20 0 0 1 44 26" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
        <path d="M34 9 A20 20 0 0 1 44 26" fill="none" stroke="var(--ice)" strokeWidth="1.5" />
        {Array.from({ length: ticks }).map((_, i) => {
          const a = Math.PI + (i / (ticks - 1)) * Math.PI;
          return (
            <line
              key={i}
              x1={r2(24 + Math.cos(a) * 20)}
              y1={r2(26 + Math.sin(a) * 20)}
              x2={r2(24 + Math.cos(a) * 16)}
              y2={r2(26 + Math.sin(a) * 16)}
              stroke="var(--steel)"
              strokeWidth="1"
            />
          );
        })}
        <g style={{ transformBox: "view-box", transformOrigin: "24px 26px" }} className="animate-tach">
          <line x1="24" y1="26" x2="24" y2="10" stroke="var(--electric)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="24" cy="26" r="2.2" fill="var(--white)" />
      </svg>
      <span className="label-mono">Scroll</span>
    </a>
  );
}

export function Hero() {
  const { hero } = site;
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* environment */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-background" />
      <div aria-hidden="true" className="tech-grid tech-grid-fade absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="edge-line absolute inset-x-0 bottom-0 opacity-60" />

      {/* 3D centerpiece */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-14 -z-10 h-[52svh] md:top-0 md:h-full lg:left-[48%]"
      >
        <HeroVisual />
      </div>
      <p
        aria-hidden="true"
        className="label-mono absolute right-5 top-24 hidden text-[0.62rem] text-muted-foreground md:block lg:right-8"
      >
        Fig. 01 — Turbocharger / illustrative render
      </p>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-24 pt-[48svh] md:justify-center md:px-8 md:pb-28 md:pt-28">
        <div className="max-w-2xl">
          <p className="label-mono mb-6 flex items-center gap-3 text-ice">
            <span aria-hidden="true" className="h-px w-10 bg-primary" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="display text-[clamp(4.5rem,15vw,11.5rem)]">
            <span className="block">{hero.headline[0]}</span>
            <span className="block text-primary">{hero.headline[1]}</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">{hero.copy}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <a href="#contact">
                {hero.primaryCta}
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="tech" size="xl">
              <a href="#services">{hero.secondaryCta}</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <TachCue />
        <p className="label-mono hidden text-[0.62rem] text-muted-foreground sm:block">{site.tagline}</p>
      </div>
    </section>
  );
}
