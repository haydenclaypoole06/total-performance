import markAsset from "@/assets/tp-mark-light.png.asset.json";
import fullAsset from "@/assets/tp-logo-full-light.png.asset.json";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img src={markAsset.url} alt="" width={836} height={435} className={cn("h-7 w-auto", className)} />
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      src={fullAsset.url}
      alt="TOTAL PERFORMANCE"
      width={1600}
      height={560}
      loading="lazy"
      className={cn("h-16 w-auto", className)}
    />
  );
}
