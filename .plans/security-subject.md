# Plan: New "Security" subject (TLS, network attacks, DNS security)

## Decisions
- New standalone subject at `docs/security/`, mirroring `docs/networking/`'s shape: its own `index.html` hub + topic pages, one new key added to `nav.js`'s `subjects` map. Why: user's explicit choice — this is the first real second-subject test of the multi-subject architecture built two rounds ago; adding one map entry (not touching the detection algorithm) validates that design was right. Rejected: folding these into Networking's Deep Dives group (the other option offered, not chosen).
- Three pages, in this order: **TLS/HTTPS Handshake** → **Network Attacks & Defenses** → **DNS Security**. Why: TLS establishes the crypto/trust vocabulary (certificates, chains of trust, signatures) used later; Network Attacks then gives the broad exploitation landscape (and is where SYN floods/port scanning cash in concepts from the existing TCP Handshake and Firewalls pages); DNS Security closes as a capstone that reuses both — DNSSEC's chain of trust mirrors TLS's certificate chain, cache poisoning is a spoofing attack like ARP spoofing. Rejected: DNS Security first (it would need to forward-reference concepts from the other two pages).
- Reuse existing proven interactive patterns rather than invent new mechanisms: the sequence-diagram step-through from `tcp-handshake.html` (for the TLS 1.2-vs-1.3 handshake comparison), the clickable-item-then-detail-panel from `osi-layers.html` (for the certificate chain), the hop-row diagram from `dns-resolution.html`/`l3-routing.html` (for the cache-poisoning race), and the rule/table-tester pattern from `firewalls.html` (for the port-scan simulator). Why: consistency with the established visual language, and every one of these mechanisms already works and is understood. Rejected: designing bespoke new widgets per page (more risk, less consistent).
- Every new page cross-links back to the specific existing Networking pages it builds on (TCP Handshake's half-open-connection gotcha → SYN flood; Firewalls' DROP-vs-REJECT → port-scan filtered-vs-closed; DNS Resolution → DNS Security). Why: user asked for "very detailed," and the strongest version of that here is showing these as exploits/extensions of mechanisms already taught, not isolated new facts. Rejected: self-contained pages that re-explain TCP/DNS basics from scratch.
- Root `docs/index.html` gets a second subject card ("Security" → `security/index.html`) alongside the existing Networking card. Why: mechanical consequence of adding a subject.
- Follows the same page anatomy as every existing page: intro w/ tooltips → interactive demo(s) → reference table(s) → "Common gotchas" → prev/next footer nav. Eyebrow uses the "Topic N of 3" convention (matching the original 5 Foundations pages) since Security has no need for a Foundations/Deep-Dives split at only 3 pages.

## Open Questions
None — topic list and placement were resolved via the prior clarifying round.

## Blast Radius
Touches: `docs/js/nav.js` (add `security` entry to `subjects` map), `docs/index.html` (add Security subject card), new `docs/security/index.html` + 3 new topic pages
Does NOT touch: anything under `docs/networking/`, `docs/css/style.css`, `docs/js/tooltip.js`
Risk: low — additive only, same pattern already proven for the `networking` subject; nav.js's subject-detection algorithm needs no changes, only a new data entry.

---

## Steps
- [x] 1. Add `security` entry to `js/nav.js`'s `subjects` map (one group, 4 items: Home + the 3 topic pages) and add the Security subject card to root `docs/index.html`.  deps: —
      Files: modify `docs/js/nav.js`, `docs/index.html`
      Accept: `grep -c "security" docs/js/nav.js` ≥ 1; `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('docs/index.html').read())"` exits 0

- [x] 2. Build `docs/security/index.html`: subject hub with 3 topic cards, matching `docs/networking/index.html`'s structure with `../` asset paths.  deps: 1
      Files: create `docs/security/index.html`
      Accept: parse check exits 0

- [x] 3. Build `docs/security/tls-handshake.html`: TLS 1.2 vs 1.3 handshake step-through (round-trip comparison), certificate chain visualizer (leaf → intermediate → root), cipher-suite anatomy breakdown, SNI/forward-secrecy/session-resumption tooltips, "Common gotchas" (cert expiry outages, TLS termination vs end-to-end, downgrade attacks).  deps: 1
      Files: create `docs/security/tls-handshake.html`
      Accept: parse check exits 0

- [x] 4. Build `docs/security/network-attacks.html`: ARP spoofing before/after, port-scan simulator (OPEN/CLOSED/FILTERED per port, cross-linking Firewalls' DROP vs REJECT), SYN flood explainer (cross-linking TCP Handshake's half-open state), IP spoofing & ingress filtering, DDoS/amplification overview, gotchas.  deps: 1
      Files: create `docs/security/network-attacks.html`
      Accept: parse check exits 0

- [x] 5. Build `docs/security/dns-security.html`: cache-poisoning race demo, DNSSEC chain of trust (parallel to the TLS cert chain), DoH/DoT vs DNSSEC distinction (confidentiality vs integrity — commonly confused), DNS amplification as a specific attack case, gotchas (fail-closed validation risk, adoption gaps, DoH bypassing enterprise filtering).  deps: 1
      Files: create `docs/security/dns-security.html`
      Accept: parse check exits 0

- [x] 6. Cross-link pass: wire prev/next footer nav across all 4 Security pages, add cross-links from the relevant existing Networking pages (tcp-handshake.html → network-attacks.html for SYN flood, firewalls.html → network-attacks.html for port scanning, dns-resolution.html → dns-security.html) where natural. Full-site verification: parse check + dead-link check + `.term`/`data-tip` completeness across every page in `docs/`.  deps: 2, 3, 4, 5
      Files: modify footer nav on the 4 new pages; light cross-link additions to `tcp-handshake.html`, `firewalls.html`, `dns-resolution.html`
      Accept: the existing dead-link check (path-aware, handles `../`) prints nothing; term/data-tip grep prints nothing; parse check passes on every `docs/**/*.html`

## Verification
Run in a fresh session, not the one that implemented.
- Confirm nav.js's `security` entry didn't require touching the detection algorithm — only a data addition.
- Confirm each new page's central interactive demo actually reuses an established pattern (sequence diagram / detail panel / hop-row / rule-tester) rather than a one-off.
- Spot-check that cross-links from Networking pages into Security pages actually make sense in context, not just bolted on.
- Which acceptance checks were skipped, weakened, or left failing?
