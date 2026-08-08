# Plan: L3/L4/L7 deep-dives + container & Kubernetes networking

## Decisions
- Add 5 new topic pages: `l3-routing.html`, `l4-tcp-udp.html`, `l7-protocols.html`, `container-networking.html`, `kubernetes-networking.html`. Why: exactly what the user selected — L3 (IP routing & ICMP), L4 (TCP vs UDP in depth), L7 (HTTP deep-dive + WebSocket + gRPC folded into one topic), Docker container networking, and full-depth Kubernetes networking including NetworkPolicy. Rejected: splitting WebSocket/gRPC into their own pages (the user grouped them under the single L7 answer, not as separate votes).
- Restructure `js/nav.js` to render two labeled groups — "Foundations" (the existing 6 pages) and "Deep Dives & Orchestration" (the 5 new ones) — as uppercase dividers inside the same flat nav bar. Why: 11 links in one unlabeled row is hard to scan; grouping restores scannability without adding open/close menu state. Rejected: a dropdown/mega-menu (more interaction states to build and keyboard-test, not requested, and inconsistent with the site's "everything visible, no hidden menus" feel so far).
- Update `index.html`'s topic grid into the same two grouped sections with 5 new topic cards. Why: consistency with the nav grouping decision above.
- Before writing the L4 congestion-window chart, load the `dataviz` skill per its own trigger rule ("before writing the first line of chart code"). Why: standing skill requirement already in force this session for any chart/graph, and a congestion-window-over-time plot is exactly that. Rejected: hand-rolling an ad hoc line chart without consulting it.
- `container-networking.html` explicitly builds on `linux-networking.html`'s namespace/veth mechanics (cross-links to it) instead of re-teaching them. Why: Docker networking on Linux literally is that same namespace+veth primitive plus Docker's own bridge and NAT rules on top — showing it as an extension makes the "why" land harder, and re-teaching from zero would be redundant. Rejected: a fully self-contained page repeating namespace/veth basics.
- Every new page follows the anatomy already established across the existing 6: page-header intro (with `.term` tooltips) → one or more interactive step-through/visual demos → reference table(s) → "Common gotchas" card → prev/next footer nav. Why: keeps 11 pages feeling like one coherent site rather than 11 one-offs; this was implicit before and should now be explicit since the site is nearly doubling. Rejected: a bespoke layout per topic.
- Kubernetes page covers, in this order: flat pod-network model → CNI → Services (ClusterIP/NodePort/LoadBalancer/Headless) → kube-proxy mechanics → cluster DNS naming → Ingress → NetworkPolicy. Why: this is the dependency order concepts actually build on each other in (you can't explain a Service sanely before the flat network model, can't explain NetworkPolicy before Services exist to protect). ASSUMPTION: this ordering and scope is my read of "everything incl. Network Policies" — flagging in case a narrower cut was intended.

## Open Questions
None — resolved via the two prior clarifying questions (layer selection, Kubernetes depth).

## Blast Radius
Touches: `static/js/nav.js` (grouped rendering), `static/css/style.css` (nav-group divider styling + any new shared visual components, e.g. timeline/chart containers), `static/index.html` (new grouped topic cards), 5 new `static/*.html` files, footer prev/next links on all existing 6 pages (to weave the new pages into the sequence)
Does NOT touch: existing written content/interactive demos on the 6 existing pages (only their footer nav links change)
Risk: medium — nav.js is shared by every page, so a mistake there breaks navigation site-wide; the L4 page includes a genuine data visualization governed by the dataviz skill; total page count goes from 6 to 11.

---

## Steps
- [x] 1. Update `js/nav.js` to render two labeled groups (Foundations / Deep Dives & Orchestration) instead of one flat list; add group-divider CSS to `style.css`.  deps: —
      Files: modify `static/js/nav.js`, `static/css/style.css`
      Accept: `grep -c "Deep Dives" static/js/nav.js` prints a number ≥ 1; `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/index.html').read())"` still exits 0 after nav renders on it

- [x] 2. Update `index.html`: regroup the topic grid into "Foundations" and "Deep Dives & Orchestration" sections, add 5 new topic cards linking to the not-yet-created pages.  deps: 1
      Files: modify `static/index.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/index.html').read())"` exits 0

- [x] 3. Build `l3-routing.html`: routing-table longest-prefix-match lookup demo, hop-by-hop packet-journey visualization (TTL decrementing, ties into how traceroute/ICMP Time Exceeded works), NAT translation demo, IP fragmentation explainer, glossary tooltips, "Common gotchas" card.  deps: 1
      Files: create `static/l3-routing.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/l3-routing.html').read())"` exits 0

- [x] 4. Build `l4-tcp-udp.html`: TCP vs UDP comparison table, animated sliding-window flow-control demo, congestion-window-over-time chart (load `dataviz` skill first), use-case guidance, glossary tooltips, gotchas.  deps: 1
      Files: create `static/l4-tcp-udp.html`
      Accept: same parse check on `static/l4-tcp-udp.html`

- [x] 5. Build `l7-protocols.html`: HTTP evolution (0.9 → 1.1 → 2 → 3) with a visual waterfall/timeline comparison, request/response anatomy walkthrough, status-code reference table, WebSocket upgrade-handshake + duplex demo, gRPC streaming-modes diagram (unary/server/client/bidi), glossary tooltips, gotchas.  deps: 1
      Files: create `static/l7-protocols.html`
      Accept: same parse check on `static/l7-protocols.html`

- [x] 6. Build `container-networking.html`: Docker bridge/veth/NAT step-through that cross-links `linux-networking.html`, port-publishing (`-p`) demo, container DNS explainer, network-driver comparison table (bridge/host/none/overlay/macvlan), glossary tooltips, gotchas.  deps: 1
      Files: create `static/container-networking.html`
      Accept: same parse check on `static/container-networking.html`

- [x] 7. Build `kubernetes-networking.html`: flat pod-network model, "life of a request" step-through (client → Ingress → Service → kube-proxy rule → Pod), Service-types comparison table, CNI explainer, cluster DNS naming reference, NetworkPolicy allow/deny visualization, glossary tooltips, gotchas.  deps: 1
      Files: create `static/kubernetes-networking.html`
      Accept: same parse check on `static/kubernetes-networking.html`

- [x] 8. Cross-link pass: update prev/next footer nav on all 11 pages to reflect the new full sequence (Foundations 6, then the 5 new pages); verify no dead links and every `.term` span has `data-tip`.  deps: 2, 3, 4, 5, 6, 7
      Files: modify footer nav on all `static/*.html` as needed
      Accept: the dead-link grep from prior work prints nothing, and `grep -o 'class="term"[^>]*' static/*.html | grep -v 'data-tip="[^"]\+"'` prints nothing

## Verification
Run in a fresh session, not the one that implemented.
- Confirm nav.js renders correctly on every page (not just the ones edited directly) — nav is shared, so check a page that wasn't touched in steps 3-7 (e.g. `dns-resolution.html`) still shows the full grouped nav.
- Confirm the L4 chart actually followed the dataviz skill's guidance (check for its palette/contrast approach, not an ad hoc color scheme).
- Confirm "how it works AND why" is actually present on each new page, not just mechanism — spot check that each page answers a "why does this exist / why not do it the old way" question somewhere.
- Which acceptance checks were skipped, weakened, or left failing?
