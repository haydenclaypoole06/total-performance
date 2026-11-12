import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/trp-mark-dark.svg"
      alt=""
      className={cn("h-7 w-auto", className)}
    />
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      src="/brand/trp-plain-dark.svg"
      alt="Total Racing & Performance"
      loading="lazy"
      className={cn("h-16 w-auto", className)}
    />
  );
}
