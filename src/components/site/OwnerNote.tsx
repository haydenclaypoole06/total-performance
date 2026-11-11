import { cn } from "@/lib/utils";

/** Preview-only tag flagging content that needs owner input. Never renders on the published site. */
export function OwnerNote({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!import.meta.env.DEV) return null;
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2 rounded-sm border border-warning/50 bg-warning/10 px-2 py-1 text-[0.62rem] tracking-[0.14em] text-warning",
        className,
      )}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warning" />
      {children}
    </span>
  );
}
