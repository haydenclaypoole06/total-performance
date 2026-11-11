import { site } from "@/config/site";

/** True when the Featured Work section may appear: real project supplied, or the development preview. */
export function featuredWorkVisible() {
  return site.featuredWork.isReal || import.meta.env.DEV;
}

/** Navigation links, minus any section that is hidden on this build (so no link ever goes nowhere). */
export function visibleNav() {
  return site.nav.filter((n) => n.href !== "#work" || featuredWorkVisible());
}
