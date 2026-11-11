import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/config/site";
import { visibleNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = visibleNav().map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="label-mono sr-only z-[70] rounded-sm bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:h-20 md:px-8 lg:grid-cols-[auto_1fr_auto]">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="TOTAL PERFORMANCE — back to top">
          <LogoMark className="h-7 shrink-0 md:h-8" />
          <span className="font-display truncate text-lg font-extrabold uppercase tracking-[0.08em] md:text-xl">
            Total <span className="text-primary">Performance</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-10">
            {visibleNav().map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-active={active === item.href.slice(1)}
                  className="nav-sweep label-mono text-[0.78rem] text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" className="hidden h-11 px-5 text-sm sm:inline-flex">
            <a href="#contact">{site.hero.primaryCta}</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="tech" size="icon" className="h-11 w-11 lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="flex w-[86vw] max-w-sm flex-col border-border bg-graphite p-0">
              <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <LogoMark className="h-6" />
                <SheetTitle className="font-display text-lg font-extrabold uppercase tracking-[0.08em]">
                  Menu
                </SheetTitle>
              </div>
              <nav aria-label="Mobile" className="flex-1 px-6 py-8">
                <ul className="space-y-1">
                  {visibleNav().map((item, i) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <a
                          href={item.href}
                          className="group flex items-baseline gap-4 border-b border-border py-4 font-display text-3xl font-extrabold uppercase transition-colors hover:text-ice"
                        >
                          <span className="label-mono text-muted-foreground group-hover:text-ice">0{i + 1}</span>
                          {item.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-border p-6">
                <SheetClose asChild>
                  <Button asChild variant="hero" size="xl" className="w-full">
                    <a href="#contact">{site.hero.primaryCta}</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
