import { Link } from "@tanstack/react-router";

import { site } from "@/config/site";
import { visibleNav } from "@/lib/nav";
import { LogoFull } from "./Logo";
import { OwnerNote } from "./OwnerNote";

export function Footer({ onHome = true }: { onHome?: boolean }) {
  const c = site.contact;
  const hasContact = !!(c.phone || c.email || c.address || c.hours?.length || c.socials.length);
  const href = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <footer className="relative border-t border-border bg-graphite pb-28 pt-16 md:pb-12">
      <div aria-hidden="true" className="edge-line absolute inset-x-0 top-0 opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:px-8">
        <div>
          <LogoFull className="h-auto w-56" />
          <p className="label-mono mt-6 text-[0.65rem] text-muted-foreground">{site.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="label-mono text-ice">Navigate</p>
          <ul className="mt-5 space-y-3">
            {visibleNav().map((n) => (
              <li key={n.href}>
                <a href={href(n.href)} className="nav-sweep text-foreground/85 transition-colors hover:text-foreground">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/privacy" className="nav-sweep text-foreground/85 transition-colors hover:text-foreground">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="label-mono text-ice">Get in touch</p>
          {hasContact ? (
            <dl className="mt-5 space-y-4 text-foreground/85">
              {c.phone && (
                <div>
                  <dt className="label-mono text-[0.62rem] text-muted-foreground">Phone</dt>
                  <dd><a className="hover:text-ice" href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`}>{c.phone}</a></dd>
                </div>
              )}
              {c.email && (
                <div>
                  <dt className="label-mono text-[0.62rem] text-muted-foreground">Email</dt>
                  <dd><a className="hover:text-ice" href={`mailto:${c.email}`}>{c.email}</a></dd>
                </div>
              )}
              {c.address && (
                <div>
                  <dt className="label-mono text-[0.62rem] text-muted-foreground">Shop</dt>
                  <dd className="whitespace-pre-line">{c.address}</dd>
                </div>
              )}
              {c.hours && c.hours.length > 0 && (
                <div>
                  <dt className="label-mono text-[0.62rem] text-muted-foreground">Hours</dt>
                  <dd>
                    <ul>
                      {c.hours.map((h) => (
                        <li key={h.days}>{h.days}: {h.time}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {c.socials.length > 0 && (
                <div>
                  <dt className="label-mono text-[0.62rem] text-muted-foreground">Follow</dt>
                  <dd className="flex flex-wrap gap-4">
                    {c.socials.map((s) => (
                      <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ice">
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-foreground/85">
                The fastest way to reach us is the{" "}
                <a href={href("#contact")} className="text-ice underline underline-offset-4">project inquiry form</a>.
              </p>
              <OwnerNote>Phone, email, address, hours and socials not added yet</OwnerNote>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-border px-5 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p className="text-xs">Vehicle names are used descriptively; no manufacturer affiliation is implied.</p>
      </div>
    </footer>
  );
}
