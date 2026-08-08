# Plan: New "Kubernetes" subject (architecture, components, workloads, storage, policy, ecosystem)

## Decisions
- New standalone subject at `docs/kubernetes/`, third entry in `nav.js`'s `subjects` map, parallel to `networking` and `security`. Why: scope (architecture, components, policy, workloads, storage, ecosystem) is a full platform, not a networking topic — matches the precedent already set for Security. Rejected: extending the existing `kubernetes-networking.html` page (already a full page on its own; this is a different, much larger scope).
- The existing `docs/networking/kubernetes-networking.html` stays exactly where it is and is NOT duplicated. New pages cross-link to it for Services/kube-proxy/CNI/Ingress/NetworkPolicy instead of re-explaining them. Why: that content is already correct and detailed; duplicating it risks drift between two copies of the same explanation. Rejected: moving it into the new subject (would break existing inbound links from the Security subject and the Networking hub).
- Six pages, user-selected: **Architecture & Control Plane**, **Node Components & Container Runtime**, **Workloads & Scheduling**, **Storage & Configuration**, **Policy & Security**, **Extensibility & Ecosystem** (CRDs/Operators/Helm/Kustomize). Why: user's explicit picks across two rounds of clarifying questions. Order follows dependency: architecture/control-plane concepts (esp. the reconciliation-loop pattern) are used by every later page, node components come next since workloads run on nodes, then workloads/scheduling, storage/config, policy, and ecosystem last since it builds on CRDs which need the API model from page 1.
- Reuse established interactive patterns again rather than invent new ones: the multi-hop step-through (`dns-resolution.html`/`l3-routing.html` style) for "life of a kubectl apply" and pod startup sequences; the rule/table-tester pattern (`firewalls.html`) for the RBAC permission checker and the scheduler filter/score demo; the clickable-list-plus-detail-panel (`osi-layers.html`/`tls-handshake.html`) for component and workload-type explorers. Why: proven, consistent, lower risk than new widgets.
- Heavy cross-linking to existing pages wherever the same primitive already has a page: Node Components → Linux Networking (namespaces/veth, the pause container reuses exactly this) and Container Networking (same container-runtime relationship); Policy & Security's RBAC → Firewalls' "allow-only, no explicit deny" gotcha (RBAC is the same shape); Storage's Secrets gotcha → nothing existing to link, stands on its own. Why: same "exploiting/extending what you already learned" framing used successfully for the Security subject.
- Each page follows the established anatomy: intro w/ tooltips → interactive demo(s) → reference table(s) → "Common gotchas" → prev/next footer nav. Eyebrow uses "Topic N of 6".

## Open Questions
None — topic list, page count, and scope boundary (stop at ecosystem tooling, no service-mesh/multi-cluster page) were resolved via the two prior clarifying rounds.

## Blast Radius
Touches: `docs/js/nav.js` (add `kubernetes` entry to `subjects` map), `docs/index.html` (add Kubernetes subject card), `docs/networking/kubernetes-networking.html` (add a callout linking to the new subject), new `docs/kubernetes/index.html` + 6 topic pages
Does NOT touch: any other existing page's content; no duplication of Services/kube-proxy/CNI/Ingress/NetworkPolicy explanations
Risk: low — additive only, same pattern proven twice now (`security` subject, and the original `networking` subject itself); nav.js's subject-detection algorithm needs no changes, only a new data entry.

---

## Steps
- [x] 1. Add `kubernetes` entry to `js/nav.js`'s `subjects` map (one group, 7 items: Home + the 6 topic pages) and add the Kubernetes subject card to root `docs/index.html`.  deps: —
      Files: modify `docs/js/nav.js`, `docs/index.html`
      Accept: `grep -c "kubernetes" docs/js/nav.js` ≥ 1 (note: `networking` already contains "kubernetes" substring via `kubernetes-networking.html`, so also confirm the new subject key specifically exists); `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('docs/index.html').read())"` exits 0

- [x] 2. Build `docs/kubernetes/index.html`: subject hub with 6 topic cards, matching the existing subject-hub structure with `../` asset paths.  deps: 1
      Files: create `docs/kubernetes/index.html`
      Accept: parse check exits 0

- [x] 3. Build `docs/kubernetes/architecture.html`: cluster topology (control plane vs worker nodes, HA/etcd quorum), API server/etcd/scheduler/controller-manager deep dive, a "life of a kubectl apply" step-through tying all of them together, reconciliation-loop explainer, gotchas.  deps: 1
      Files: create `docs/kubernetes/architecture.html`
      Accept: parse check exits 0

- [x] 4. Build `docs/kubernetes/node-components.html`: kubelet, container runtime (containerd/CRI-O) cross-linking Linux Networking's namespace/veth mechanics and Container Networking's pause-container equivalent, CRI/CSI/CNI interfaces (CNI cross-links kubernetes-networking.html, not re-explained), a pod-startup-on-a-node step-through, gotchas.  deps: 1
      Files: create `docs/kubernetes/node-components.html`
      Accept: parse check exits 0

- [x] 5. Build `docs/kubernetes/workloads-scheduling.html`: Pod/ReplicaSet/Deployment/StatefulSet/DaemonSet/Job/CronJob comparison, a rolling-update visualizer, scheduler filter-then-score demo (reusing the rule-tester pattern) covering taints/tolerations/affinity/resource requests-limits, gotchas.  deps: 1
      Files: create `docs/kubernetes/workloads-scheduling.html`
      Accept: parse check exits 0

- [x] 6. Build `docs/kubernetes/storage-config.html`: Volumes vs PersistentVolume/PersistentVolumeClaim vs StorageClass (dynamic provisioning), reclaim policies, ConfigMaps, Secrets (with the "base64 isn't encryption" gotcha), a PVC-to-PV binding demo, gotchas.  deps: 1
      Files: create `docs/kubernetes/storage-config.html`
      Accept: parse check exits 0

- [x] 7. Build `docs/kubernetes/policy-security.html`: RBAC (Role/ClusterRole/RoleBinding/ClusterRoleBinding) with an interactive permission-checker, Pod Security Admission standards, ResourceQuota/LimitRange, Admission controllers/webhooks (OPA/Gatekeeper/Kyverno mention), cross-link to the existing NetworkPolicy page instead of duplicating it, gotchas (RBAC's allow-only shape cross-linking Firewalls' security-group gotcha).  deps: 1
      Files: create `docs/kubernetes/policy-security.html`
      Accept: parse check exits 0

- [x] 8. Build `docs/kubernetes/extensibility.html`: CRDs, the Operator pattern (as an extension of Architecture's reconciliation-loop concept), Helm vs Kustomize vs raw manifests comparison, gotchas (inert CRDs without a controller, Helm hook trust, operator blast radius).  deps: 1
      Files: create `docs/kubernetes/extensibility.html`
      Accept: parse check exits 0

- [x] 9. Cross-link pass: wire prev/next footer nav across all 7 Kubernetes pages in dependency order; add a callout in `docs/networking/kubernetes-networking.html` pointing to the new subject for the broader platform picture. Full-site verification: parse check + dead-link check + `.term`/`data-tip` completeness across every page in `docs/`.  deps: 2, 3, 4, 5, 6, 7, 8
      Files: modify footer nav on the 6 new topic pages, light addition to `docs/networking/kubernetes-networking.html`
      Accept: the existing path-aware dead-link check prints nothing; term/data-tip grep prints nothing; parse check passes on every `docs/**/*.html`

## Verification
Run in a fresh session, not the one that implemented.
- Confirm no content duplicates `kubernetes-networking.html` (Services, kube-proxy, CNI, Ingress, NetworkPolicy) — check that the new pages link to it rather than re-explaining.
- Confirm each new page's central interactive demo reuses an established pattern rather than a one-off.
- Confirm the "life of a kubectl apply" step-through in Architecture and the "pod startup" step-through in Node Components are actually different flows, not the same content twice.
- Which acceptance checks were skipped, weakened, or left failing?
