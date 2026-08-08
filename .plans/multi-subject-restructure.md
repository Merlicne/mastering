# Plan: Restructure into a multi-subject site ("Mastering")

## Decisions
- New site brand: **"Mastering"**. Why: user's explicit answer. Nav brand text and the new root hub page both use it; per-page `<title>` suffix changes from "— Networking Lab" to "— Networking" (drop "Lab", keep the subject name — the umbrella brand lives in the nav, not repeated in every browser tab).
- Move all 12 existing pages into `static/networking/`; `css/` and `js/` (the shared design system, nav, tooltip) stay at `static/` root. Why: user's explicit answer — a future subject gets its own `static/<subject>/` folder alongside `networking/`, while the design system and tooltip engine stay subject-agnostic and shared. Rejected: moving css/js per-subject too (they have zero networking-specific content — duplicating them would violate the same "shared chrome, one copy" reasoning already used for nav.js/tooltip.js).
- The current root `index.html` (the Foundations/Deep-Dives topic-grid hub) becomes `static/networking/index.html` verbatim (paths adjusted). A brand-new, minimal `static/index.html` becomes the global hub: "Mastering" + a grid of **subject** cards, today containing exactly one card ("Networking" → `networking/index.html`). Why: this is literally what "centralize, open to all topics" means structurally — one level up, subjects are the unit, topics are one level below that. Rejected: keeping the 12-topic grid at the root and just renaming it (doesn't create room for a second subject at the same level).
- `js/nav.js` becomes subject-aware via one hardcoded `subjects` map keyed by URL folder (today: just `networking`), detected from `location.pathname`. At the root (no subject folder matched) it renders only the brand link. Inside a subject folder it renders that subject's existing groups, unchanged. Why: keeps the "one shared nav.js" property that already held for 12 pages, extended the minimum amount needed — adding subject #2 later is one more map entry, not a rewrite. Rejected: a separate nav script per subject (reintroduces the exact drift risk `nav.js` was created to avoid), and any dynamic subject auto-discovery (nothing to discover yet — one hardcoded entry is not over-engineering, it's the actual current state).
- Brand link target is computed from current depth (root page → `index.html`; inside `networking/` → `../index.html`); subject-internal links (the 11 topic pages + that subject's own index) are untouched, since they were already same-directory-relative and moving the whole folder together preserves that.

## Open Questions
None — both structural questions were resolved via the prior clarifying round.

## Blast Radius
Touches: all 12 files currently in `static/*.html` (moved into `static/networking/`, asset-path prefixes updated, `<title>` suffix updated), `static/js/nav.js` (rewritten for subject-awareness), new `static/index.html` (global hub, replaces the old one)
Does NOT touch: `static/css/style.css`, `static/js/tooltip.js` (no changes needed — both are already path-independent), any page's actual topic content/interactive demos
Risk: medium — this is a file-move refactor with **no git in this directory** (confirmed not a git repo), so there is no safety net to revert a bad move; every one of the 12 moved files needs its two `<script src>` / one `<link href>` paths updated correctly or the whole site's chrome breaks at once.

---

## Steps
- [x] 1. Create `static/networking/`, move all 12 existing `static/*.html` files into it with `mv` (verify the file count before and after).  deps: —
      Files: move `static/*.html` → `static/networking/*.html`
      Accept: `ls static/*.html 2>/dev/null | wc -l` prints `0`; `ls static/networking/*.html | wc -l` prints `12`

- [x] 2. In every moved file, update `css/style.css` → `../css/style.css`, `js/nav.js` → `../js/nav.js`, `js/tooltip.js` → `../js/tooltip.js`, and the `<title>` suffix from "Networking Lab" to "Networking". Leave all other same-directory hrefs (links between the 12 pages) untouched.  deps: 1
      Files: modify all `static/networking/*.html`
      Accept: `grep -L '\.\./css/style.css' static/networking/*.html` prints nothing; `grep -rn '"css/style.css"\|"js/nav.js"\|"js/tooltip.js"' static/networking/*.html` prints nothing (no un-prefixed paths remain)

- [x] 3. Rewrite `static/js/nav.js`: hardcoded `subjects` map (one entry, `networking`, with the existing two groups unchanged), pathname-based subject detection, computed brand-link prefix, brand-only rendering at the root.  deps: 2
      Files: modify `static/js/nav.js`
      Accept: opening `static/networking/index.html` still shows the full grouped nav (manually confirm during verification, since this can't be grep-checked); `grep -c "subjects" static/js/nav.js` ≥ 1

- [x] 4. Write new `static/index.html`: "Mastering" global hub with a subject-card grid containing the Networking card linking to `networking/index.html`.  deps: 3
      Files: create `static/index.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/index.html').read())"` exits 0

- [x] 5. Full-site verification: HTML parse check on every file, dead-link grep across `static/` and `static/networking/`, confirm `static/networking/index.html`'s "Home" link and every topic page's footer prev/next still resolve inside the new folder.  deps: 4
      Files: none (verification only)
      Accept: dead-link grep (extended to check relative `../` targets too) prints nothing; parse check passes on all 13 files

## Verification
Run in a fresh session, not the one that implemented.
- Confirm no stray top-level `static/*.html` remain (everything under `static/networking/` except the new root hub).
- Confirm `static/css/style.css` and `static/js/tooltip.js` were NOT moved or duplicated.
- Open `static/index.html` and `static/networking/index.html` and click through: does the brand link correctly go up a level from inside `networking/`?
- Which acceptance checks were skipped, weakened, or left failing?
