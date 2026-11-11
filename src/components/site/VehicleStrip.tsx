import { site } from "@/config/site";
import { OwnerNote } from "./OwnerNote";

export function VehicleStrip() {
  const { vehicleFocus } = site;
  return (
    <section aria-label="Vehicle focus" className="carbon relative border-y border-border">
      <div aria-hidden="true" className="edge-line absolute inset-x-0 top-0 opacity-50" />
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-between">
          {vehicleFocus.items.map((v, i) => (
            <li key={v} className="flex items-center gap-6">
              <span className="font-display text-[clamp(1.5rem,4vw,3rem)] font-extrabold uppercase leading-none tracking-wide text-foreground/90">
                {v}
              </span>
              {i < vehicleFocus.items.length - 1 && (
                <span aria-hidden="true" className="font-display text-[clamp(1.5rem,4vw,3rem)] font-light text-primary">
                  /
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="label-mono text-[0.62rem] text-muted-foreground">{vehicleFocus.disclaimer}</p>
          {!vehicleFocus.confirmed && <OwnerNote>Confirm vehicle coverage</OwnerNote>}
        </div>
      </div>
    </section>
  );
}
