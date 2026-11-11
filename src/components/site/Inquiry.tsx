import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { inquirySchema, type InquiryInput } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/lib/inquiry.functions";
import { cn } from "@/lib/utils";
import { TurboFallback } from "./hero/TurboFallback";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

type FieldName = Exclude<keyof InquiryInput, "company">;
type Values = Record<FieldName, string> & { company: string };

const empty: Values = {
  name: "",
  email: "",
  phone: "",
  vehicle: "",
  currentModifications: "",
  request: "",
  budget: "",
  timeframe: "",
  company: "",
};

const fields: {
  name: FieldName;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  placeholder?: string;
  wide?: boolean;
}[] = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "vehicle", label: "Vehicle year / make / model", required: true, placeholder: "e.g. 2016 Corvette Stingray" },
  { name: "currentModifications", label: "Current modifications", multiline: true, wide: true },
  { name: "request", label: "What would you like done?", required: true, multiline: true, wide: true },
  { name: "budget", label: "Approximate budget" },
  { name: "timeframe", label: "Preferred timeframe" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function Inquiry({ index }: { index: string }) {
  const { inquiry } = site;
  const send = useServerFn(submitInquiry);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const update = (name: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name as FieldName]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError(null);
    const parsed = inquirySchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = fields.find((f) => next[f.name]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await send({ data: values });
      if (res.ok) {
        setStatus("success");
        setValues(empty);
      } else {
        setStatus("error");
        setServerError(res.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerError("We couldn’t send your inquiry. Your details are still here — please try again.");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-24 md:py-36"
    >
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[20%] top-10 -z-10 w-[70vw] max-w-[820px] opacity-[0.16] md:-right-[8%]">
        <div className="animate-spin-slow">
          <TurboFallback className="h-auto w-full" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <Reveal>
          <SectionLabel index={index}>Contact</SectionLabel>
          <h2 id="contact-heading" className="display mt-6 text-[clamp(3.25rem,9vw,7.5rem)]">
            <span className="block">{inquiry.headline[0]}</span>
            <span className="block text-primary">{inquiry.headline[1]}</span>
          </h2>
          <p className="mt-8 max-w-md text-xl leading-relaxed text-muted-foreground">{inquiry.copy}</p>
          <p className="label-mono mt-10 text-[0.65rem] text-muted-foreground">
            <span className="text-ice">*</span> Required
          </p>
        </Reveal>

        <Reveal delay={120}>
          {status === "success" ? (
            <div role="status" className="rounded-sm border border-primary/60 bg-graphite p-8 shadow-glow md:p-12">
              <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-ice" />
              <h3 className="font-display mt-6 text-4xl font-extrabold uppercase leading-none">Inquiry received.</h3>
              <p className="mt-4 max-w-md text-muted-foreground">
                Thanks — your project details reached us. We’ll be in touch about next steps. {inquiry.note}
              </p>
              <Button variant="tech" size="xl" className="mt-8" onClick={() => setStatus("idle")}>
                Send another inquiry
              </Button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              aria-describedby={`${uid}-note`}
              className="relative rounded-sm border border-border bg-graphite/85 p-6 shadow-panel backdrop-blur-sm md:p-10"
            >
              <div aria-hidden="true" className="edge-line absolute inset-x-0 top-0" />
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    name="company"
                    value={values.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </label>
              </div>

              <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                {fields.map((f) => {
                  const id = `${uid}-${f.name}`;
                  const err = errors[f.name];
                  const shared = {
                    id,
                    name: f.name,
                    value: values[f.name],
                    required: f.required,
                    "aria-required": f.required || undefined,
                    "aria-invalid": err ? true : undefined,
                    "aria-describedby": err ? `${id}-err` : undefined,
                    autoComplete: f.autoComplete,
                    placeholder: f.placeholder,
                    disabled: status === "submitting",
                    className: cn(
                      "w-full rounded-sm border bg-background/70 px-4 text-base text-foreground placeholder:text-muted-foreground/60 transition-colors",
                      "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                      "disabled:opacity-60",
                      err ? "border-destructive" : "border-input hover:border-border-strong",
                    ),
                  };
                  return (
                    <div key={f.name} className={cn(f.wide && "sm:col-span-2")}>
                      <label htmlFor={id} className="label-mono mb-2 block text-[0.68rem] text-muted-foreground">
                        {f.label}
                        {f.required ? <span className="text-ice"> *</span> : <span className="normal-case tracking-normal"> (optional)</span>}
                      </label>
                      {f.multiline ? (
                        <textarea
                          {...shared}
                          rows={4}
                          maxLength={f.name === "request" ? 3000 : 2000}
                          onChange={(e) => update(f.name, e.target.value)}
                          className={cn(shared.className, "min-h-28 resize-y py-3")}
                        />
                      ) : (
                        <input
                          {...shared}
                          type={f.type ?? "text"}
                          maxLength={f.name === "email" ? 255 : 150}
                          onChange={(e) => update(f.name, e.target.value)}
                          className={cn(shared.className, "h-12")}
                        />
                      )}
                      {err && (
                        <p id={`${id}-err`} className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
                          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {serverError && (
                <div role="alert" className="mt-6 flex items-start gap-3 rounded-sm border border-destructive/60 bg-destructive/10 p-4 text-sm">
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p>{serverError}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p id={`${uid}-note`} className="text-sm text-muted-foreground">
                  {inquiry.note}
                </p>
                <Button type="submit" variant="hero" size="xl" disabled={status === "submitting"} className="shrink-0">
                  {status === "submitting" ? (
                    <>
                      <Loader2 aria-hidden="true" className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      {inquiry.submit}
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground/80">
                Your details are stored securely and used only to respond to this inquiry.{" "}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground">
                  Privacy information
                </Link>
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
