# Plan: Firewalls &amp; rule configuration page

## Decisions
- New page `firewalls.html`, inserted into the "Deep Dives & Orchestration" nav group and footer sequence right after `l3-routing.html` (before L4). Why: firewalls build directly on NAT/conntrack concepts already introduced on the L3 page, and the Kubernetes page's NetworkPolicy card already called firewalling "the closest thing Kubernetes has to a built-in firewall" — natural to slot the general concept in before the L4/L7/container/k8s pages that assume it. Rejected: appending it at the very end (breaks the concept ordering — NetworkPolicy already references firewalling before this page would exist).
- Central interactive demo is a **rule-order tester**: a fixed INPUT-chain-style rule table (including a leading ESTABLISHED,RELATED stateful rule) plus a form describing a hypothetical inbound packet (protocol, dest port, source IP, "belongs to an established connection?"), evaluated first-match-wins with a default policy fallback. Why: this is the single mechanism ("how it works") that explains real rule files, and it deliberately contrasts with the L3 page's longest-prefix-match routing lookup ("why" — order-dependence is the thing people get wrong). Rejected: a static rule list with no evaluator (wouldn't demonstrate first-match behavior, just describe it).
- Cover four rule-editing surfaces side by side: `iptables`, `nftables`, `ufw`, and a short contrast with cloud security groups (stateful, allow-only, no explicit DROP/REJECT). Why: matches the site's existing pattern of a tool-comparison table (CNI plugins, network drivers) and answers "how do I actually set this up," which the user asked for by name. Rejected: covering only iptables (most-installed base still runs it, but nftables is its designated successor and ufw/security-groups are what most readers will actually touch day to day).
- Follows the established page anatomy: intro w/ tooltips → stateful-vs-stateless explainer → rule-order tester → rule-editing comparison/reference table → "Common gotchas" card → prev/next footer nav. Why: consistency with all 10 existing pages. Rejected: a bespoke layout.

## Open Questions
None.

## Blast Radius
Touches: `static/js/nav.js` (insert one nav entry), `static/index.html` (insert one topic card), `static/l3-routing.html` (next-link), `static/l4-tcp-udp.html` (prev-link), new `static/firewalls.html`
Does NOT touch: content of any other existing page
Risk: low — one new page plus small, mechanical link updates on two neighbors and the two shared nav/index files.

---

## Steps
- [x] 1. Insert "Firewalls" into `js/nav.js`'s Deep Dives & Orchestration group (right after "L3 Routing") and add its topic card to `index.html`'s matching grid position.  deps: —
      Files: modify `static/js/nav.js`, `static/index.html`
      Accept: `grep -c "firewalls.html" static/js/nav.js` ≥ 1; `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/index.html').read())"` exits 0

- [x] 2. Build `firewalls.html`: stateful-vs-stateless explainer, rule-order tester demo (with a stateful ESTABLISHED,RELATED shortcut rule), iptables/nftables/ufw/security-group comparison with real example commands, glossary tooltips, "Common gotchas" card (self-lockout, order-dependence, DROP vs REJECT, missing ESTABLISHED rule, security groups aren't a full replacement).  deps: 1
      Files: create `static/firewalls.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('static/firewalls.html').read())"` exits 0

- [x] 3. Re-wire the sequence: `l3-routing.html`'s "Next" → Firewalls, `firewalls.html`'s prev/next → L3 Routing / L4 TCP vs UDP, `l4-tcp-udp.html`'s "Previous" → Firewalls. Verify no dead links and every `.term` has `data-tip` across all 12 pages.  deps: 2
      Files: modify `static/l3-routing.html`, `static/l4-tcp-udp.html`, `static/firewalls.html`
      Accept: the existing dead-link grep prints nothing; `grep -o 'class="term"[^>]*' static/*.html | grep -v 'data-tip="[^"]\+"'` prints nothing

## Verification
Run in a fresh session, not the one that implemented.
- Confirm the rule tester actually evaluates first-match order (not just displays a static table) — try an input that only a later rule would catch if an earlier broad rule didn't already match it first.
- Confirm nav.js still renders on an untouched page (e.g. `dns-resolution.html`).
- Which acceptance checks were skipped, weakened, or left failing?
