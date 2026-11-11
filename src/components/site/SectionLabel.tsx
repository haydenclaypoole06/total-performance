import { cn } from "@/lib/utils";

/** Small monospace section index, e.g. "02 — SERVICES". */
export function SectionLabel({ index, children, className }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono flex items-center gap-3 text-ice", className)}>
      <span className="text-muted-foreground">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-primary" />
      {children}
    </p>
  );
}
