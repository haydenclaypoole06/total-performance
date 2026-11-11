import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { prefillInquiry } from "@/lib/inquiry-prefill";
import { featuredWorkVisible } from "@/lib/nav";
import { OwnerNote } from "./OwnerNote";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export { featuredWorkVisible };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-5">
      <dt className="label-mono text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-base leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}

export function FeaturedWork() {
  const fw = site.featuredWork;
  if (!featuredWorkVisible()) return null;
  const sample = !fw.isReal;
  const { project, images } = fw;

  return (
    <section id="work" aria-labelledby="work-heading" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02">Our Work</SectionLabel>
            <h2 id="work-heading" className="display mt-6 text-[clamp(3rem,8vw,6.5rem)]">
              The details <br className="hidden sm:block" />
              make the <span className="text-primary">build.</span>
            </h2>
          </div>
          {sample && (
            <div className="max-w-sm space-y-3">
              <OwnerNote>Sample placeholder — hidden on the published site</OwnerNote>
              {import.meta.env.DEV && (
                <p className="text-sm text-muted-foreground">
                  Add a real project and real shop photos to show this section publicly.
                </p>
              )}
            </div>
          )}
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-sm border border-border lg:col-span-8 lg:row-span-2">
            <img
              src={images.main.src}
              alt={images.main.alt}
              width={images.main.width}
              height={images.main.height}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {sample && (
              <span className="label-mono absolute left-4 top-4 rounded-sm bg-background/85 px-3 py-1.5 text-[0.62rem] text-warning">
                Sample image — not our work
              </span>
            )}
          </Reveal>
          {images.details.map((img, i) => (
            <Reveal key={img.alt} delay={120 * (i + 1)} className="relative overflow-hidden rounded-sm border border-border lg:col-span-4">
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto"
              />
              {sample && (
                <span className="label-mono absolute left-3 top-3 rounded-sm bg-background/85 px-2 py-1 text-[0.58rem] text-warning">
                  Sample
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 grid gap-x-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="label-mono text-ice">Featured project</p>
            <h3 className="font-display mt-3 text-4xl font-extrabold uppercase leading-none md:text-5xl">
              {project.vehicle}
            </h3>
            <Button asChild variant="tech" size="lg" className="mt-8">
              <a href="#contact" onClick={() => prefillInquiry("A build similar to your featured project: ")}>
                Plan a similar build
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
          <dl className="mt-8 md:mt-0">
            <Field label="Owner’s goal">{project.goal}</Field>
            <Field label="Work performed">
              <ul className="space-y-1">
                {project.workPerformed.map((w, i) => (
                  <li key={i}>— {w}</li>
                ))}
              </ul>
            </Field>
            <Field label="Supporting modifications">
              <ul className="space-y-1">
                {project.supportingMods.map((w, i) => (
                  <li key={i}>— {w}</li>
                ))}
              </ul>
            </Field>
            {project.verifiedResults.length > 0 && (
              <Field label="Verified results">
                <ul className="space-y-1">
                  {project.verifiedResults.map((w, i) => (
                    <li key={i}>— {w}</li>
                  ))}
                </ul>
              </Field>
            )}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
