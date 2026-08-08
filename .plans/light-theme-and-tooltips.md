# Plan: Light theme, glossary tooltips, deeper content

## Decisions
- Remove the `@media (prefers-color-scheme: dark)` block from `style.css`; keep only the light palette as `:root`. Why: user explicitly wants light theme, not "light unless OS prefers dark." Rejected: a `data-theme` toggle forcing light (adds a switch nobody asked for).
- Add one shared `js/tooltip.js` + tooltip CSS in `style.css` for technical-term popovers, reused via `<span class="term" data-tip="...">word</span>` markup on every page. Why: tooltips need identical behavior on all 5 topic pages — genuinely shared UI chrome, same precedent as the existing shared `js/nav.js`. Rejected: per-page duplicated tooltip CSS/JS (would drift as pages are added/edited) and the plain `title=""` attribute (no styling, truncates, poor on touch).
- Tooltip triggers on hover (desktop) and tap-to-toggle (touch/keyboard), dismissed by outside click, `Escape`, or re-tap. Why: `title=""` and hover-only CSS tooltips are unusable on mobile/touch and for keyboard users. Rejected: hover-only (fails on touch devices, which the plan's original design already targets via responsive CSS).
- Expand written content on all 5 existing topic pages — more explanatory paragraphs, more terms wrapped in tooltips, and a short "notes" callout per page for gotchas/edge cases. Why: user asked for "very detailed" pages going forward. Rejected: a separate glossary page (user wants definitions inline where the term appears, not a lookup elsewhere).
- Content depth and exact term list is a judgment call per page, guided by what's already there (e.g. OSI page: MTU, PDU, socket, checksum; TCP page: MSS, window size, RST, TIME_WAIT; DNS page: recursive vs iterative, NXDOMAIN, root hints; subnetting: VLSM, private ranges; Linux page: netns, bridge, routing table). ASSUMPTION: "very detailed" means expanding prose and vocabulary coverage on the existing structure, not adding new interactive demos — flagging this so it can be corrected if wrong.

## Open Questions
None.

## Blast Radius
Touches: `static/css/style.css` (dark-mode removal, tooltip CSS), new `static/js/tooltip.js`, all 6 `static/*.html` files (script include + content/tooltip markup)
Does NOT touch: existing step-through simulation logic/JS in each page (kept as-is, only prose and tooltip spans added around it)
Risk: low — purely presentational/content changes, no behavior removed.

---

## Steps
- [x] 1. Strip dark-mode block from `style.css`, keep light palette only; add tooltip component CSS (`.term`, popover box, arrow, transition).  deps: —
      Files: modify `static/css/style.css`
      Accept: `grep -c "prefers-color-scheme" static/css/style.css` prints `0`

- [x] 2. Create `static/js/tooltip.js`: event-delegated click/tap toggle on `.term[data-tip]`, closes on outside click/Escape, positions popover above/below to stay in viewport.  deps: 1
      Files: create `static/js/tooltip.js`
      Accept: `node -c static/js/tooltip.js` (or, if node unavailable, `python3 -c "import html.parser"`-style manual review) exits 0 with no syntax errors

- [x] 3. Wire `<script src="js/tooltip.js">` into all 6 pages.  deps: 2
      Files: modify all `static/*.html`
      Accept: `grep -L 'js/tooltip.js' static/*.html` prints nothing (no file missing the include)

- [x] 4. Expand `osi-layers.html`: deeper prose per layer, tooltips on terms like MTU, PDU, socket, checksum, encapsulation.  deps: 1, 2
      Files: modify `static/osi-layers.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/osi-layers.html').read())"` exits 0

- [x] 5. Expand `subnetting.html`: deeper prose, tooltips on terms like CIDR, VLSM, wildcard mask, private/reserved ranges.  deps: 1, 2
      Files: modify `static/subnetting.html`
      Accept: same parse check on `static/subnetting.html`

- [x] 6. Expand `tcp-handshake.html`: deeper prose, tooltips on terms like MSS, window size, RST, TIME_WAIT, sequence number.  deps: 1, 2
      Files: modify `static/tcp-handshake.html`
      Accept: same parse check on `static/tcp-handshake.html`

- [x] 7. Expand `dns-resolution.html`: deeper prose, tooltips on terms like recursive/iterative query, TTL, NXDOMAIN, root hints, A record.  deps: 1, 2
      Files: modify `static/dns-resolution.html`
      Accept: same parse check on `static/dns-resolution.html`

- [x] 8. Expand `linux-networking.html`: deeper prose, tooltips on terms like network namespace, veth, bridge, routing table.  deps: 1, 2
      Files: modify `static/linux-networking.html`
      Accept: same parse check on `static/linux-networking.html`

- [x] 9. Final verification pass: re-run HTML parse check on all 6 pages, re-run dead-link grep, confirm no `prefers-color-scheme` remains, confirm every `.term` span has a non-empty `data-tip`.  deps: 3, 4, 5, 6, 7, 8
      Files: none (verification only)
      Accept: `grep -o 'class="term"[^>]*' static/*.html | grep -v 'data-tip="[^"]\+"'` prints nothing

## Verification
Run in a fresh session, not the one that implemented.
- Confirm light-only: search the CSS for any remaining dark-mode tokens.
- Confirm tooltip content is genuinely informative (not just restating the term) — spot check 3–4 tooltips per page.
- Confirm tooltips are reachable by keyboard/touch, not just `:hover` — check `tooltip.js` wires a click/tap handler, not just CSS `:hover`.
- Which acceptance checks were skipped, weakened, or left failing?
