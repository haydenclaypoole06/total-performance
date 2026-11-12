import { site } from "@/config/site";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Process({ index }: { index: string }) {
  const { process } = site;
  return (
    <section aria-labelledby="process-heading" className="machined relative border-y border-border py-24 md:py-32">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel index={index}>Process</SectionLabel>
          <h2 id="process-heading" className="display mt-6 text-[clamp(2.75rem,7vw,5.5rem)]">
            Let’s get your <span className="text-primary">build started.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-border-strong md:block">
            <div className="edge-line h-px w-full" />
          </div>
          <div aria-hidden="true" className="absolute bottom-12 left-[1.1rem] top-6 w-px bg-border-strong md:hidden" />
        <ol className="relative grid gap-0 md:grid-cols-3 md:gap-8">
          {process.steps.map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 140} className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-5 pb-12 md:block md:pb-0">
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-background">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
              <div className="md:mt-8">
                <p className="label-mono text-ice">Step {step.number}</p>
                <h3 className="font-display mt-2 text-3xl font-extrabold uppercase leading-none md:text-4xl">{step.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
