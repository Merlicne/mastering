# Plan: Manifest-driven nav + hub pages (multi-tag content)

## Decisions
- New `docs/content.js` sets `window.CONTENT`, an array of `{ path, navLabel, title, description, icon, tags, group? }` covering all 24 existing pages. `path` is relative to `docs/` and stays exactly where each file physically lives today — no file moves. Why: this is the single source of truth nav.js and the 3 subject hubs will both read from, replacing today's two hand-maintained copies (nav.js's `subjects` map + each hub's hand-coded cards) with one. Rejected: a JSON file fetched via `fetch()` (works fine on a real server, but `file://` testing — which this project has used throughout — blocks local `fetch()` of JSON via CORS; a plain `.js` file setting a global sidesteps that entirely, same as the existing `nav.js`/`tooltip.js` pattern).
- "Primary vs. secondary" for hub-page cross-tag display is computed from **path**, not tag order: a page is primary on a hub if its `path` starts with that hub's own folder; it's secondary ("Also relevant") if the hub's tag appears in its `tags` array but its `path` doesn't start with that folder. Why: this needs no ordering convention in `tags` (order-independent, harder to get wrong later) and falls directly out of something already true — where the file physically sits. Rejected: a `tags[0] = home subject` convention (works, but is an implicit rule someone editing the manifest later could silently violate).
- Only 3 pages get a second tag in this pass, matching the concrete cases already identified: `networking/firewalls.html` (networking + security), `networking/kubernetes-networking.html` (networking + kubernetes), `kubernetes/policy-security.html` (kubernetes + security). Why: these are the pages that actually prompted this refactor. Rejected: speculatively cross-tagging other "kind of related" pages (e.g. TLS Handshake touching L7) — no clear second home, would be tagging for its own sake.
- Cross-tagged ("Also relevant") cards get a visually distinct treatment on hub pages — dashed border + a small "Also in Networking/Security/Kubernetes" badge — rather than looking identical to the hub's own primary cards. Why: user's own stated preference from the design sketch (confirmed by proceeding). Rejected: identical styling (would blur which subject actually "owns" a page).
- Scope is nav.js + the 3 subject hub pages (`networking/index.html`, `security/index.html`, `kubernetes/index.html`) only. The root `docs/index.html` (which lists subjects, not tagged content) stays hand-coded as-is. Why: root hub has exactly 3 entries and isn't where the multi-category problem lives — converting it too would be churn without solving anything. Rejected: also making the root hub manifest-driven (out of scope, no real benefit yet).

## Open Questions
None — the manifest shape, primary/secondary rule, and cross-tag styling were settled in the prior design discussion.

## Blast Radius
Touches: new `docs/content.js`, `docs/js/nav.js` (rewritten to read `CONTENT` instead of its hardcoded `subjects` map), `docs/networking/index.html`, `docs/security/index.html`, `docs/kubernetes/index.html` (all 3 rewritten to render cards from `CONTENT`), `docs/css/style.css` (new `.topic-card.cross-tag` styling)
Does NOT touch: root `docs/index.html`, any of the 24 individual topic pages' own content, `docs/js/tooltip.js`
Risk: medium — `nav.js` is loaded by every single page, so a rendering bug there breaks navigation site-wide (same risk class as the original subject-aware nav.js rewrite, which went cleanly); this can't be fully verified without a browser (flagging now, consistent with every prior round) — only structural/integrity checks are scriptable.

---

## Steps
- [x] 1. Write `docs/content.js`: one entry per existing page (24 total), with the 3 identified pages carrying two tags each.  deps: —
      Files: create `docs/content.js`
      Accept: a script confirms every `path` in `CONTENT` resolves to a real file under `docs/`, and every actual `.html` file under `docs/networking`, `docs/security`, `docs/kubernetes` appears in `CONTENT` exactly once

- [x] 2. Rewrite `docs/js/nav.js` to filter `CONTENT` by the current page's folder (same grouping behavior as today, via each entry's `group` field) instead of its hardcoded `subjects` map.  deps: 1
      Files: modify `docs/js/nav.js`
      Accept: `grep -c "CONTENT" docs/js/nav.js` ≥ 1; every page still includes `content.js` before `nav.js` (`grep -L` check across all 24 pages)

- [x] 3. Add `.topic-card.cross-tag` styling to `style.css` (dashed border + small subject badge).  deps: —
      Files: modify `docs/css/style.css`
      Accept: `grep -c "cross-tag" docs/css/style.css` ≥ 1

- [x] 4. Rewrite `docs/networking/index.html`, `docs/security/index.html`, `docs/kubernetes/index.html` to render their topic-grid(s) from `CONTENT` (primary cards grouped as today, secondary "Also relevant" cross-tag cards where applicable) instead of hand-coded HTML cards.  deps: 1, 3
      Files: modify the 3 hub pages
      Accept: parse check exits 0 on all 3; Security's hub shows 2 cross-tag cards (Firewalls, Policy & Security), Kubernetes' hub shows 1 (Kubernetes Networking), Networking's hub shows 0

- [x] 5. Add `<script src="content.js">` (before `nav.js`) to every page that doesn't already have it — i.e. all 24 — since `nav.js` now depends on it.  deps: 2
      Files: modify all `docs/**/*.html`
      Accept: `grep -L "content.js" docs/**/*.html` (or equivalent find+grep) prints nothing

- [x] 6. Full-site verification: parse check + the existing path-aware dead-link check + `.term`/`data-tip` completeness across every page, plus the manifest-integrity check from step 1 re-run.  deps: 4, 5
      Files: none (verification only)
      Accept: all checks print clean

## Verification
Run in a fresh session, not the one that implemented.
- This changes rendering logic on every page (via nav.js) and 3 hub pages — actually load a few pages in a browser (not just parse-check the raw HTML) and confirm the nav bar and hub cards render the same content as before, plus the 3 new cross-tag cards appear where expected. This cannot be verified by static checks alone; call it out explicitly if skipped.
- Confirm no page lost its nav bar or its hub cards due to a `content.js` load-order or path bug.
- Confirm the "Also relevant" cards link correctly across folder boundaries (e.g. Security hub's Firewalls card actually opens `../networking/firewalls.html`, not a 404).
- Which acceptance checks were skipped, weakened, or left failing?
