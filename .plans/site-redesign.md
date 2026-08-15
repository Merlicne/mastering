# Plan: Site-wide visual redesign ("Mastering")

## Decisions
- New direction, "engineering field notebook": schematic/drafting motifs (rule lines, coordinate-style labels, corner ticks) over a warm-serif reading body + condensed technical grotesk headings + mono data face. Why: subject is literally schematics (packet flow, wire protocols, cluster topology) — lean into what the site already has (mono logs, flag badges, packet traces) instead of a generic SaaS card-grid look. Rejected: keep current blue-accent/system-font look (that's exactly the "nothing wrong, just generic" complaint); a dark terminal/neon look (explicit AI-cliché per design-artifact skill).
- Palette: Ink `#14181f` (text), Paper `#f3f5f4` (bg, cool-tinted not cream), Trace `#0a7c73` (primary accent — teal, replaces the stock `#2563eb` blue), Signal `#c2622a` (secondary accent — copper/amber, replaces current teal `--accent-2`), status colors (ok/warn/danger) kept in their own lane, unchanged in hue family since they already carry real protocol meaning (SYN/ACK/FIN colors, danger badges). Why: distinct from the generic blue and from the AI-cliché cream+terracotta+serif combo (serif here is body text, not display, and bg isn't cream). Rejected: reusing existing blue/teal pair (that pairing is the thing being replaced); pure grayscale with one accent (subject has two genuinely distinct semantic accents already in use — cross-tag badges vs. primary nav/links — worth keeping as two colors).
- Type: heading/label face IBM Plex Sans Condensed (600/700), body face Literata (serif, built for on-screen reading), data/code face IBM Plex Mono — three roles per design-artifact fundamentals. Self-hosted as local `.woff2` files under `docs/fonts/`, fetched once via `curl` from Google Fonts' static CDN (OFL-licensed, redistributable) and committed — not linked live from a CDN. Why: matches the README's stated "no build step, no framework" and implicitly no-external-requests philosophy while still getting real typographic character instead of the current `-apple-system` stack. Rejected: linking fonts.googleapis.com directly (adds a live third-party request on every page load, against the site's own stated philosophy); staying on system fonts (safe, but caps how distinctive a "redesign" can actually be — the ask that started this).
- Scope: full site, all 30 pages, in one coordinated pass — per your call. Mechanically this means: redesign tokens/components once in `docs/css/style.css` (cascades to every page automatically), then per-page work is auditing each page's bespoke inline `<style>` block for hardcoded hex that bypasses tokens (6 pages have this: `osi-layers`, `subnetting`, `tcp-handshake`, `l3-routing`, `l4-tcp-udp`, `tls-handshake`) and restyling their custom diagram chrome (flag badges, arrows) to the new accent language. The other ~19 topic pages + 5 hub pages use shared classes only (`.card`, `.panel`, `.log`, `.btn`, `.badge`, `.topic-grid`, tables) and should inherit the redesign for free — verification there is a visual sweep, not a rewrite.
- Preserve explicitly: light-theme-only (a deliberate prior decision, not revisited here), the manifest-driven nav (`content.js` + `js/nav.js`), the tooltip engine (`js/tooltip.js`), and all interactive JS logic in every topic page — this is a visual pass, not a content or behavior change.

## Open Questions
None.

## Blast Radius
Touches: `docs/css/style.css` (full rewrite of tokens/components), new `docs/fonts/*.woff2`, all 30 `docs/**/*.html` (inline `<style>` blocks only — no JS logic changes), `README.md` if the `docs/` structure section needs a one-line mention of `docs/fonts/`.
Does NOT touch: `docs/content.js` (tags/paths/copy), `docs/js/nav.js`, `docs/js/tooltip.js`, any interactive step/simulation JavaScript inside topic pages, dark-mode behavior (staying light-only).
Risk: medium — this is a live public site (GitHub Pages) and the diff touches every page, but the shared-token architecture means the actual per-page edits are small and mechanical outside the 6 hardcoded-hex files. Worst failure mode: a token rename breaks a page that references an old CSS variable name directly, or a self-hosted font fails to load and silently falls back (mitigated by keeping the old system-font stack as the declared fallback in the `font-family` list).

---

## Steps
- [x] 1. Fetch and self-host webfonts: IBM Plex Sans Condensed (600, 700), Literata (400, 400 italic, 600), IBM Plex Mono (400, 500) as `.woff2` under `docs/fonts/`.    deps: —
      Files: create `docs/fonts/*.woff2`
      Accept: `ls docs/fonts/*.woff2 | wc -l` prints 7 (or the actual weight count chosen), each file is a valid woff2 (`file docs/fonts/*.woff2` reports "Web Open Font Format")

- [x] 2. Redesign `docs/css/style.css`: new color tokens, `@font-face` declarations pointing at step 1's files with the old system stack kept as fallback, and restyled shared components (nav, page-header/eyebrow, cards/topic-grid, buttons, badges, tables, panel/log, tooltip, footer-nav) in the new schematic/field-notebook language.    deps: 1
      Files: modify `docs/css/style.css`
      Accept: serve `python3 -m http.server --directory docs 8000` and open `docs/index.html` + `docs/networking/tcp-handshake.html` — new tokens visibly applied, no console errors, `grep -c "prefers-color-scheme" docs/css/style.css` still prints 0
      note: no browser/screenshot tool available in this environment — verified via brace-balance check, asset-resolution (200s for css/fonts/pages), and WCAG contrast computation on every token pair instead of a visual check. Found and fixed one failure: `--accent-2` at `#c2622a` was 3.77:1 on paper (fails AA for the small eyebrow/badge text it's used on) — darkened to `#a55324` (4.96:1). Real browser verification still needed before calling this done — flagging for the fresh-session verification pass.

- [x] 3. Fix the 6 pages with hardcoded hex colors (`networking/osi-layers.html`, `networking/subnetting.html`, `networking/tcp-handshake.html`, `networking/l3-routing.html`, `networking/l4-tcp-udp.html`, `security/tls-handshake.html`): replace literal hex in their inline `<style>` blocks with `var(--token)` references, restyle bespoke diagram chrome (flag badges, sequence arrows) to the new accent pair.    deps: 2
      Files: modify the 6 files above
      Accept: `grep -oE '#[0-9a-fA-F]{3,6}' docs/networking/osi-layers.html docs/networking/subnetting.html docs/networking/tcp-handshake.html docs/networking/l3-routing.html docs/networking/l4-tcp-udp.html docs/security/tls-handshake.html` prints nothing
      note: the 5-hue categorical chip sets (OSI protocol stack, TLS cipher-suite anatomy) needed more than the 2 brand accents to stay mutually distinguishable — added 3 new `--swatch-*` tokens (violet/amber/indigo) to style.css, reusing `--accent` and `--danger` for the other 2 slots rather than inventing 5 unrelated hues. Also swapped literal `"SFMono-Regular", Consolas, monospace` stacks to `var(--font-mono)` in these 6 files while already in there (not done sitewide — that's steps 4-7's job if found elsewhere).

- [x] 4. Visual sweep: networking subject (`index.html` + the 5 topic pages not covered in step 3: `dns-resolution`, `linux-networking`, `firewalls`, `l7-protocols`, `container-networking`, `kubernetes-networking`).    deps: 2
      Files: modify as needed (expected: minimal/none, verification-first)
      Accept: each file passes `python3 -c "import html.parser as h; p=h.HTMLParser(); p.feed(open('<file>').read())"`; manual browser check at 375px and 1280px widths shows no clipped/overlapping elements
      note: no hardcoded hex in any of the 7 files. 6 of 7 (all but index.html) had literal `"SFMono-Regular", Consolas, monospace` stacks bypassing `var(--font-mono)` — fixed (dns-resolution, linux-networking, firewalls, l7-protocols, container-networking, kubernetes-networking). Cross-checked every `var(--token)` reference across all 7 files against the tokens actually defined in the redesigned style.css — none missing. All 7 parse cleanly. No browser check performed (no browser tool available) — structural/static sweep only.

- [x] 5. Visual sweep: security subject (`index.html`, `network-attacks.html`, `dns-security.html`; `tls-handshake.html` already done in step 3).    deps: 2
      Files: modify as needed
      Accept: same as step 4, scoped to `docs/security/*.html`
      note: index.html and dns-security.html were already fully token-based, no changes. network-attacks.html had one literal font stack (`.scan-row td:first-child { font-family: "SFMono-Regular", Consolas, monospace; }`) bypassing `var(--font-mono)` — fixed. No hardcoded hex found in any of the 3. All CSS custom properties referenced (--border, --danger, --bg-elevated, --text-muted, --accent, --accent-ink, --ok, --code-bg, --code-border) still exist in the redesigned style.css. All 3 files parse cleanly. No browser check performed (no browser tool available) — structural/static sweep only.

- [x] 6. Visual sweep: kubernetes subject (`index.html` + 5 topic pages).    deps: 2
      Files: modify as needed
      Accept: same as step 4, scoped to `docs/kubernetes/*.html`
      note: no hardcoded hex found in any of the 7 files. Two literal `"SFMono-Regular", Consolas, monospace` stacks bypassing the token found and fixed → `var(--font-mono)` (architecture.html `.topo-chip`, workloads-scheduling.html `.rollout-bar-label`). All `var(--*)` references across the 7 files checked against style.css's defined token list — no stale/removed names. All 7 files pass html.parser well-formedness. No browser tool available, so this is a structural check only, not a rendered visual check.

- [x] 7. Visual sweep: virtualization subject (`index.html` + 5 topic pages).    deps: 2
      Files: modify as needed
      Accept: same as step 4, scoped to `docs/virtualization/*.html`
      note: no hardcoded hex colors found in any of the 7 files (index.html + 6 topic pages). Found and fixed 5 literal `"SFMono-Regular", Consolas, monospace` font stacks bypassing `var(--font-mono)` across 4 files (fundamentals.html, memory-virtualization.html x2, storage.html x2, qemu-libvirt-practice.html). No stray references to removed/renamed CSS custom properties. All 7 files parse cleanly via html.parser. No browser tool available in this environment — this was a structural/static sweep only, not a rendered visual check.

- [x] 8. Global hub (`docs/index.html`): confirm it reads well under the new type/color system as the site's front door; adjust only if the generic `page-header` treatment undersells the new direction.    deps: 2
      Files: modify `docs/index.html` if needed
      Accept: manual browser check, no console errors
      note: no bespoke styling on this page at all — pure `.page-header` + `.topic-grid`, both shared components already redesigned in step 2. No hardcoded hex, no changes needed. No browser check performed (no browser tool available).

- [x] 9. Final full-site QA pass across all 30 pages.    deps: 3, 4, 5, 6, 7, 8
      Files: none (verification only)
      Accept: every page loads with a clean console, correct active nav state, working tooltips, no horizontal overflow at 375px width; `grep -rL 'docs/fonts' docs/css/style.css` confirms fonts are wired once centrally (not per-page)
      note: ran a sitewide sweep — zero hardcoded hex left in any of the 30 HTML files, all 30 parse cleanly via html.parser, all 30 return HTTP 200 from a local server, fonts are wired exactly once (7 `@font-face` rules in style.css, zero per-page font references), `prefers-color-scheme` count still 0 (light-only preserved), and `git diff --stat` confirms content.js/js/nav.js/js/tooltip.js are untouched. What this pass could NOT do: an actual rendered browser check (no browser/screenshot tool available in this environment) — no visual confirmation of layout, overflow, active nav state, or tooltip behavior at any viewport width. That gap is real and should be the first thing the fresh-session verification pass does.

## Verification
Run in a fresh session, not the one that implemented.
- Does the diff match Decisions — specifically, did any page keep hardcoded hex, or drift onto ad-hoc colors not in the token set?
- Is light-only preserved (`grep -c prefers-color-scheme docs/css/style.css` still 0)?
- Do `content.js`, `js/nav.js`, `js/tooltip.js`, and every page's interactive step/simulation JS still work unchanged — this was scoped as visual-only?
- Which acceptance checks (steps 4–7 in particular) were skipped, weakened, or left as "looks fine" without an actual browser check?
