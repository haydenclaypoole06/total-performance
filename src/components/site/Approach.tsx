import { site } from "@/config/site";
import { OwnerNote } from "./OwnerNote";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Approach({ index }: { index: string }) {
  const { approach } = site;
  const img = approach.image;
  return (
    <section id="approach" aria-labelledby="approach-heading" className="relative">
      {/* Full-width image band */}
      <div className="relative h-[46svh] min-h-[320px] overflow-hidden md:h-[70svh]">
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        {!img.isRealShopPhoto && (
          <p className="label-mono absolute right-5 top-24 rounded-sm bg-background/70 px-2 py-1 text-[0.6rem] text-muted-foreground md:right-8 md:top-28">
            Illustrative image
          </p>
        )}
      </div>

      <div className="relative mx-auto -mt-24 max-w-7xl px-5 pb-24 md:-mt-40 md:px-8 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <SectionLabel index={index}>Our Approach</SectionLabel>
            <h2 id="approach-heading" className="display mt-6 text-[clamp(3rem,8vw,6.5rem)]">
              Your car. <br />
              <span className="text-primary">A clear plan.</span>
            </h2>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-foreground/85 md:text-2xl md:leading-relaxed">
              {approach.copy}
            </p>
            {!approach.confirmed && <OwnerNote className="mt-6">Approach copy needs owner confirmation</OwnerNote>}
          </Reveal>

          <ol className="self-end">
            {approach.themes.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 90} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-border py-6">
                <span aria-hidden="true" className="relative mt-2 block h-3 w-3">
                  <span className="absolute inset-0 rotate-45 border border-primary" />
                  <span className="absolute inset-[3px] rotate-45 bg-primary" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-tight">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
