<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All owner-editable content (business details, services, vehicles, featured project, approach, contact) lives in `src/config/site.ts`; components read from it so copy changes never touch layout code.
- Preview-only owner notes use `OwnerNote` / `import.meta.env.DEV`, so placeholders and "needs confirmation" tags never ship to the published site.
- The hero turbo is a photoreal render image (`src/assets/hero-turbo.webp`) animated with CSS/DOM only (pointer tilt, luminance-masked light sweep) in `src/components/site/hero/HeroVisual.tsx`; no WebGL, so it loads instantly and needs no fallback path.
- SVG coordinates computed with trig are rounded (`r2`) so server and browser markup match and hydration stays clean.
- Project inquiries are inserted by the public `submitInquiry` server function using the publishable key and an insert-only RLS policy; visitors can never read submissions back.
