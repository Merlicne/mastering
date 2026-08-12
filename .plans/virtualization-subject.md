# Plan: New "Virtualization" subject (hypervisors, CPU/memory/device virtualization, storage, QEMU/libvirt practice)

## Decisions
- New standalone subject at `docs/virtualization/`, fourth entry in `nav.js`'s auto-detected subjects (via `content.js`), parallel to `networking`/`security`/`kubernetes`. Why: same proven manifest-driven pattern; no nav.js changes needed, only new `content.js` entries + a root `index.html` card. Rejected: folding into Kubernetes (different layer — this is below the container/orchestration line, not part of it) or Networking (touches networking only tangentially, via TAP/bridge).
- Six pages, in dependency order: **Fundamentals & Hypervisor Types** (incl. Containers vs VMs comparison), **CPU Virtualization**, **Memory Virtualization**, **Device & I/O Virtualization**, **Storage: Disk Images & Snapshots**, **QEMU & libvirt in Practice**. Why: user-selected "6-page deep dive," matching Kubernetes' depth. Order: fundamentals first (ring privilege, trap-and-emulate — needed to understand CPU virtualization), then CPU → memory (memory virtualization reuses CPU virtualization's hardware-assist framing: EPT/NPT is "the memory analog of VT-x/AMD-V"), then device/storage (both depend on knowing QEMU is a userspace process, established on the CPU page via the KVM/QEMU split), then the hands-on practice page last since it exercises everything before it.
- Containers vs VMs comparison lives as a section on the Fundamentals page (not a separate page), cross-linking to `kubernetes/node-components.html` (container runtime) and `networking/container-networking.html` (namespaces/veth) rather than re-explaining them. Why: user-selected; avoids duplicating content that already exists in depth elsewhere.
- QEMU/libvirt hands-on content is a single dedicated page (`qemu-libvirt-practice.html`), not spread as snippets across every concept page. Why: user-selected — keeps the "how it actually works" pages theory-focused and gives one linear, runnable walkthrough (create qcow2 image → boot with `qemu-system-x86_64` → add virtio-net + TAP → snapshot) that ties the whole subject together.
- Reuse established interactive patterns, no new widget types: the multi-hop step-through (`architecture.html`'s "life of a kubectl apply") for "life of a VM boot" (firmware → bootloader → guest kernel, with the trap-and-emulate / VMEXIT-VMENTRY cycle highlighted) and for the QEMU practice page's command walkthrough; the clickable-list-plus-detail-panel (`architecture.html`'s component explorer) for hypervisor-type comparison and device-model comparison (emulated vs virtio vs passthrough); the rule/table-tester pattern (`firewalls.html`) adapted for a "what happens on this instruction" or "which device model fits this workload" decision demo on the CPU/Device pages. Why: proven, consistent, lower risk than inventing new widgets.
- Cross-links instead of duplication: Device & I/O's TAP/bridge networking section links to `networking/linux-networking.html` (namespaces/veth) and `networking/container-networking.html` (bridge already explained there) rather than re-teaching bridging from scratch; Fundamentals' Containers vs VMs links to `kubernetes/node-components.html`; CPU Virtualization's ring-privilege framing can be referenced (not duplicated) by Kubernetes' Node Components page in a follow-up if useful, but that page is NOT touched by this plan (avoid scope creep into an already-shipped subject).
- Each page follows the established anatomy seen on every existing subject page: intro w/ `.term`/tooltip → interactive demo(s) → reference table(s) → "Common gotchas" → prev/next footer nav. Eyebrow uses "Topic N of 6".

## Open Questions
None — page count, hands-on-page structure, and containers-vs-VMs placement were resolved via clarifying questions.

## Blast Radius
Touches: `docs/content.js` (add 6 new entries, `virtualization` tag/group), `docs/index.html` (add Virtualization subject card), new `docs/virtualization/index.html` + 6 topic pages
Does NOT touch: `docs/js/nav.js` (subject-detection is generic, already works for any new folder present in `content.js`), any existing page's content, no duplication of namespaces/veth/bridge (networking) or container-runtime (kubernetes) explanations
Risk: low — additive only, same pattern proven three times now (networking, security, kubernetes subjects); nav.js needs zero changes.

---

## Steps
- [x] 1. Add 6 `virtualization/*` entries to `content.js` (path, navLabel, title, icon, tags: ["virtualization"], group: "Virtualization", description) and add the Virtualization subject card to root `docs/index.html`.  deps: —
      Files: modify `docs/content.js`, `docs/index.html`
      Accept: `python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('docs/index.html').read())"` exits 0; `node -e "require('./docs/content.js')"` — N/A (browser global, not a module) — instead validate via `node --check` is not applicable to non-strict script; use `node -e "global.window={}; require('fs').readFileSync('docs/content.js','utf8'); eval(require('fs').readFileSync('docs/content.js','utf8')); console.log(window.CONTENT.filter(e=>e.path.indexOf('virtualization/')===0).length)"` prints `6`

- [x] 2. Build `docs/virtualization/index.html`: subject hub with 6 topic cards, matching the existing subject-hub structure (`kubernetes/index.html`) with `../` asset paths.  deps: 1
      Files: create `docs/virtualization/index.html`
      Accept: parse check exits 0

- [x] 3. Build `docs/virtualization/fundamentals.html`: what virtualization is and why it's possible (ring privilege levels, trap-and-emulate), Type 1 vs Type 2 hypervisor explorer, full vs para- vs OS-level virtualization comparison, a "Containers vs VMs" section (isolation boundary: shared kernel vs. full guest kernel) cross-linking `kubernetes/node-components.html` and `networking/container-networking.html`, gotchas.  deps: 1
      Files: create `docs/virtualization/fundamentals.html`
      Accept: parse check exits 0

- [x] 4. Build `docs/virtualization/cpu-virtualization.html`: why x86 wasn't classically virtualizable (Popek-Goldberg), binary translation vs hardware-assisted (VT-x/AMD-V, "ring -1"), VMCS/VMCB and the VMEXIT/VMENTRY cycle, KVM-as-accelerator vs QEMU-as-device-emulator relationship (the split that everything later on the QEMU practice page depends on), a step-through of one trapped instruction causing a VMEXIT, gotchas.  deps: 1
      Files: create `docs/virtualization/cpu-virtualization.html`
      Accept: parse check exits 0

- [x] 5. Build `docs/virtualization/memory-virtualization.html`: the double-translation problem (guest virtual → guest physical → host physical), shadow page tables vs hardware-assisted EPT/NPT (framed as "the memory analog of what CPU virtualization's VT-x/AMD-V did for instructions"), memory overcommit, ballooning, KSM (page deduplication), gotchas (e.g. ballooning + guest OOM interactions).  deps: 4
      Files: create `docs/virtualization/memory-virtualization.html`
      Accept: parse check exits 0

- [x] 6. Build `docs/virtualization/device-io.html`: emulated devices vs paravirtualized virtio drivers vs PCI passthrough/VFIO/SR-IOV (a device-model comparison explorer), TAP/bridge networking for VMs (cross-linking `networking/linux-networking.html` and `networking/container-networking.html` instead of re-teaching bridging), a "pick the right device model for this workload" decision demo, gotchas (e.g. virtio driver availability in guest, IOMMU requirement for passthrough).  deps: 4
      Files: create `docs/virtualization/device-io.html`
      Accept: parse check exits 0

- [x] 7. Build `docs/virtualization/storage.html`: raw vs qcow2 image formats, copy-on-write and backing files, internal/external snapshots, virtio-blk vs virtio-scsi, thin provisioning, gotchas (backing-file chain fragility, snapshot != backup).  deps: 4
      Files: create `docs/virtualization/storage.html`
      Accept: parse check exits 0

- [x] 8. Build `docs/virtualization/qemu-libvirt-practice.html`: end-to-end hands-on walkthrough as a step-through demo — `qemu-img create` a qcow2 image, boot with `qemu-system-x86_64` (KVM accel flag, memory, virtio-net with a TAP device, virtio-blk disk), take and revert a snapshot, then libvirt/virsh as the declarative management layer on top (XML domain definition vs raw QEMU flags) — reusing every concept from pages 3-7, gotchas (KVM device permissions, forgetting `-enable-kvm` silently falls back to slow TCG emulation).  deps: 4, 5, 6, 7
      Files: create `docs/virtualization/qemu-libvirt-practice.html`
      Accept: parse check exits 0

- [x] 9. Cross-link pass: wire prev/next footer nav across all 7 Virtualization pages in dependency order (fundamentals → cpu → memory → device-io → storage → qemu-libvirt-practice). Full-site verification: parse check + dead-link check + `.term`/`data-tip` completeness across every page in `docs/`.  deps: 2, 3, 4, 5, 6, 7, 8
      Files: modify footer nav on the 6 new topic pages
      Accept: the existing path-aware dead-link check prints nothing; term/data-tip grep prints nothing; parse check passes on every `docs/**/*.html`

## Verification
Run in a fresh session, not the one that implemented.
- Confirm no content duplicates existing pages (namespaces/veth/bridge in Networking, container runtime in Kubernetes) — check that Fundamentals and Device & I/O link out rather than re-explaining.
- Confirm each new page's central interactive demo reuses an established pattern (step-through, component explorer, or rule-tester) rather than a one-off.
- Confirm the CPU Virtualization page's KVM/QEMU split is actually used (not just mentioned) by the QEMU & libvirt Practice page's `-enable-kvm` explanation.
- Confirm QEMU commands shown are syntactically plausible (correct flag names/shapes) even though they can't be executed in this environment.
- Which acceptance checks were skipped, weakened, or left failing?
