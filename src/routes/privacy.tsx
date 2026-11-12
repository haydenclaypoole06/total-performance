import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { LogoMark } from "@/components/site/Logo";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — TOTAL RACING & PERFORMANCE" },
      { name: "description", content: "How TOTAL RACING & PERFORMANCE handles the information you send through the project inquiry form." },
      { property: "og:title", content: "Privacy — TOTAL RACING & PERFORMANCE" },
      { property: "og:description", content: "How we handle the information you send through our project inquiry form." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="h-7" />
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.08em]">
              Total <span className="text-primary">Performance</span>
            </span>
          </Link>
          <Link to="/" className="label-mono inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="label-mono text-ice">Privacy information</p>
        <h1 className="display mt-4 text-[clamp(3rem,9vw,5.5rem)]">Your details, handled simply.</h1>
        <div className="mt-10 space-y-8 text-lg leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-2xl font-extrabold uppercase">What we collect</h2>
            <p className="mt-3">
              When you send a project inquiry, we receive the details you enter: your name, email, and
              optionally your phone number, your vehicle, current modifications, what you’d like done,
              an approximate budget and a preferred timeframe.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-extrabold uppercase">How it’s used</h2>
            <p className="mt-3">
              We use this information only to respond to your inquiry and discuss your project. We don’t
              sell it or use it for advertising. Submitting an inquiry does not confirm an appointment.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-extrabold uppercase">Where it’s stored</h2>
            <p className="mt-3">
              Inquiries are stored in a secure database that only {site.name} can access. This site does
              not use advertising or tracking cookies.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-extrabold uppercase">Questions or removal</h2>
            <p className="mt-3">
              To ask about or remove the information you sent, reply to our response to your inquiry or
              send a new inquiry asking for removal.
            </p>
          </section>
        </div>
      </main>
      <Footer onHome={false} />
    </>
  );
}
