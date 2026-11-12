import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { prefillInquiry } from "@/lib/inquiry-prefill";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { ServiceGraphic } from "./ServiceGraphic";

export function Services() {
  const { services } = site;
  const [active, setActive] = useState(0);
  const current = services.items[active] ?? services.items[0]!;

  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_minmax(0,28rem)] md:items-center">
          <div>
            <SectionLabel index="01">Services</SectionLabel>
           <h2
  id="services-heading"
  className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]"
>
  <span className="block">Your next upgrade</span>
  <span className="block text-primary">starts here.</span>
</h2>`
          </div>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">{services.intro}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <ol className="border-t border-border">
            {services.items.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.number} className="border-b border-border">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    data-active={isActive}
                    className={cn(
                      "group relative grid w-full grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 py-7 text-left transition-colors md:grid-cols-[4.5rem_minmax(0,1fr)] md:py-9",
                      "focus-visible:outline-offset-[-2px]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-0 h-px bg-primary transition-[width] duration-500",
                        isActive ? "w-full" : "w-0",
                      )}
                    />
                    <span
                      className={cn(
                        "label-mono pt-2 transition-colors",
                        isActive ? "text-ice" : "text-muted-foreground",
                      )}
                    >
                      {s.number}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "font-display block text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold uppercase leading-none transition-colors",
                          isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground",
                        )}
                      >
                        {s.title}
                      </span>
                      <span className="mt-3 block max-w-lg text-base leading-relaxed text-muted-foreground">
                        {s.description}
                      </span>
                      {/* Inline graphic on smaller screens */}
                      <span className="mt-5 block lg:hidden" data-active="true">
                        <ServiceGraphic type={s.graphic} className="h-28 w-28 opacity-80" />
                      </span>
                    </span>
                  </button>
                  <a
                    href="#contact"
                    onClick={() => prefillInquiry(`${s.title}: `)}
                    className="label-mono -mt-2 mb-7 ml-16 inline-flex items-center gap-2 text-[0.7rem] text-ice underline-offset-4 hover:underline md:ml-[5.5rem] lg:hidden"
                  >
                    Discuss this<span className="sr-only"> service: {s.title}</span>
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </li>
              );
            })}
          </ol>

          {/* Desktop visual panel */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="machined relative aspect-square overflow-hidden rounded-sm border border-border shadow-panel">
                <div aria-hidden="true" className="edge-line absolute inset-x-0 top-0" />
                <div key={current.graphic} data-active="false" className="absolute inset-0 p-10" ref={(el) => {
                  if (el) requestAnimationFrame(() => el.setAttribute("data-active", "true"));
                }}>
                  <ServiceGraphic type={current.graphic} className="h-full w-full" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-border bg-background/80 px-6 py-4 backdrop-blur-sm">
                  <div className="min-w-0">
                    <p className="label-mono text-[0.65rem] text-ice">
                      {current.number} / {String(services.items.length).padStart(2, "0")}
                    </p>
                    <p className="font-display mt-1 truncate text-lg font-bold uppercase tracking-wide">{current.title}</p>
                  </div>
                  <Button asChild variant="hero" size="lg" className="shrink-0">
                    <a href="#contact" onClick={() => prefillInquiry(`${current.title}: `)}>
                      Discuss this<span className="sr-only">: {current.title}</span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
              <p className="label-mono mt-4 text-[0.62rem] text-muted-foreground">
                Diagram is illustrative
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
