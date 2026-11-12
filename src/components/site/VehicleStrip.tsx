import { site } from "@/config/site";
import { OwnerNote } from "./OwnerNote";

function Row({ hidden = false }: { hidden?: boolean }) {
  const { items } = site.vehicleFocus;
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {items.map((v, i) => (
        <li key={v} className="flex items-center">
          <span className="font-display whitespace-nowrap px-6 text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-none tracking-wide text-foreground/90 md:px-10">
            {v}
          </span>
          <span
            aria-hidden="true"
            className={`font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-none text-primary ${i === items.length - 1 ? "motion-reduce:hidden" : ""}`}
          >
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export function VehicleStrip() {
  const { vehicleFocus } = site;
  return (
    <section aria-label="Vehicle focus" className="carbon relative overflow-hidden border-y border-border">
      <div aria-hidden="true" className="edge-line absolute inset-x-0 top-0 opacity-50" />

      {/* Continuous ticker; pauses on hover and stops for reduced-motion visitors. */}
      <div className="marquee-mask py-10 motion-reduce:[mask-image:none] md:py-14">
        <div className="marquee-track flex w-max motion-reduce:w-full motion-reduce:justify-center">
          <Row />
          <Row hidden />
        </div>
      </div>

      <div className="mx-auto -mt-4 flex max-w-7xl flex-wrap items-center gap-4 px-5 pb-8 md:-mt-6 md:px-8 md:pb-10">
        {!vehicleFocus.confirmed && <OwnerNote>Confirm vehicle coverage</OwnerNote>}
      </div>
    </section>
  );
}
