# Plan: Interactive networking mini-course (static HTML)

## Decisions
- Plain static HTML/CSS/vanilla JS, no build step, no framework. Why: user asked for "static html", repo has no package.json or toolchain — matches existing empty `static/` scaffold. Rejected: React/Vite SPA (adds a build step and dependency the user didn't ask for).
- One HTML file per topic + shared `css/style.css` + `index.html` landing/nav hub. Why: 5 independent topics, each viewable standalone; shared CSS keeps a consistent look without a templating engine. Rejected: single giant page with tabs (harder to link to/share a specific topic, slower to load all interactivity at once).
- Per-page interactivity lives in an inline `<script>` at the bottom of that page rather than a shared `js/` bundle. Why: no build step means no module bundling; inline keeps each page copy-pasteable/readable as a learning artifact in its own right. Rejected: shared `js/common.js` imported via `<script src>` for topic logic (fine for nav, overkill/fragile for one-off simulations with no bundler).
- Small shared `js/nav.js` only for injecting the consistent top nav bar across pages. Why: avoids duplicating/hand-syncing the nav links in 6 files. Rejected: hand-copy nav HTML into every page (drifts over time, easy to forget a link when adding a 6th topic later).
- Topics and one page each: OSI/TCP-IP layers, Subnetting & IP addressing, TCP handshake & packet flow, DNS resolution, Linux networking (namespaces/interfaces). Why: exactly what the user selected. Rejected: combining DNS + TCP handshake into one "protocols" page (user picked them as distinct topics).

## Open Questions
None.

## Blast Radius
Touches: `static/` (new files only: `index.html`, `css/style.css`, `js/nav.js`, and 5 topic `.html` files)
Does NOT touch: nothing else exists in the repo yet — purely additive.
Risk: low — static files only, no server/build/runtime to break.

---

## Steps
- [x] 1. Build shared design system: `static/css/style.css` (colors, layout, nav bar, card/panel components, light+dark via `prefers-color-scheme`) and `static/js/nav.js` (injects nav bar + highlights active page), plus `static/index.html` landing page linking to all 5 topics.  deps: —
      Files: create `static/css/style.css`, `static/js/nav.js`, `static/index.html`
      Accept: `python3 -c "import html.parser,sys; p=html.parser.HTMLParser(); p.feed(open('static/index.html').read())"` exits 0 (no parse errors)

- [x] 2. OSI/TCP-IP layer stack page: clickable layer stack, selecting a layer shows its role, protocols, and an animated view of how a message gets encapsulated with headers as it descends the stack and decapsulated on the way up.  deps: 1
      Files: create `static/osi-layers.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/osi-layers.html').read())"` exits 0

- [x] 3. Subnetting & IP addressing playground: enter an IP + CIDR prefix, page renders network address, broadcast address, usable host range, subnet mask in dotted+binary, and number of hosts, updating live as you type or drag a prefix slider.  deps: 1
      Files: create `static/subnetting.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/subnetting.html').read())"` exits 0

- [x] 4. TCP handshake & packet flow page: step-through animation of SYN / SYN-ACK / ACK between a client and server, then a simplified data-transfer + FIN teardown sequence, with a "next step" control and a running log of what each packet's flags mean.  deps: 1
      Files: create `static/tcp-handshake.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/tcp-handshake.html').read())"` exits 0

- [x] 5. DNS resolution page: step through resolving a domain name — browser cache → resolver → root → TLD → authoritative server → answer — with each hop visualized and the actual query/response shown at each stage.  deps: 1
      Files: create `static/dns-resolution.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/dns-resolution.html').read())"` exits 0

- [x] 6. Linux networking page: visual explainer + light interactivity for network namespaces, interfaces (veth pairs), and how `ip link`/`ip addr`/`ip netns` commands relate to the diagram (e.g. toggling a namespace or veth pair updates an example command + diagram side by side).  deps: 1
      Files: create `static/linux-networking.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/linux-networking.html').read())"` exits 0

- [x] 7. Wire up and verify cross-links: confirm `index.html` links to all 5 topic pages and each topic page's nav links back to `index.html` and to its siblings, with no dead links.  deps: 2, 3, 4, 5, 6
      Files: modify `static/index.html` if any link is missing/wrong
      Accept: a script that greps all `href="*.html"` across `static/*.html` and confirms every target file exists, e.g.:
      `for f in static/*.html; do grep -o 'href="[a-z-]*\.html"' "$f" | sed 's/href="//;s/"//' | while read t; do test -f "static/$t" || echo "MISSING: $t referenced in $f"; done; done` prints nothing

## Verification
Run in a fresh session, not the one that implemented.
- Does the diff match Decisions? Flag any page that pulled in a framework/build step, or any topic-logic JS that got moved into shared `js/` instead of staying inline.
- Which acceptance checks were skipped, weakened, or left failing? Re-run the parse check and the dead-link grep from steps 1-7 above.
- Open each page and confirm the interactive element actually responds to input (parse-clean HTML can still have broken JS) — this can't be fully automated without a browser; call out explicitly if it wasn't checked.
