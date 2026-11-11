import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Mobile-only inquiry bar. Hidden over the hero, the inquiry form and the footer so it never
 * covers form controls or footer content.
 */
export function MobileContactBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const blockers = new Set<Element>();
    let pastHero = false;
    const sync = () => setShow(pastHero && blockers.size === 0);

    const hero = document.getElementById("top");
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(
      Boolean,
    ) as Element[];

    const heroIo = new IntersectionObserver(([e]) => {
      if (!e) return;
      pastHero = !e.isIntersecting;
      sync();
    });
    if (hero) heroIo.observe(hero);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? blockers.add(e.target) : blockers.delete(e.target)));
      sync();
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      heroIo.disconnect();
      io.disconnect();
    };
  }, []);

  const phone = site.contact.phone;
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden",
        show ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!show}
    >
      <div className="flex gap-2">
        {phone && (
          <Button asChild variant="tech" size="xl" className="px-4" tabIndex={show ? 0 : -1}>
            <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} aria-label={`Call ${phone}`}>
              <Phone aria-hidden="true" />
            </a>
          </Button>
        )}
        <Button asChild variant="hero" size="xl" className="flex-1" tabIndex={show ? 0 : -1}>
          <a href="#contact">{site.hero.primaryCta}</a>
        </Button>
      </div>
    </div>
  );
}
