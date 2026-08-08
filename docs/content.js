/*
 * Single source of truth for every topic page on the site: nav.js reads this
 * to build the in-page nav bar, and each subject's index.html reads it to
 * render its topic-grid cards. Subject hub pages themselves (index.html in
 * each folder, plus the root hub) are NOT listed here -- nav.js always
 * synthesizes a "Home" link for the current folder's own index.html instead.
 *
 * tags: every subject this page is relevant to. The FIRST folder segment of
 * `path` is where the file actually lives (its primary home); any tag that
 * doesn't match that folder makes this page show up as a secondary
 * "Also relevant" card on that other subject's hub, without duplicating it.
 */
window.CONTENT = [
  // ---- networking / Foundations ----
  { path: "networking/osi-layers.html", navLabel: "OSI / TCP-IP", title: "OSI / TCP-IP Layers", icon: "🧱", tags: ["networking"], group: "Foundations",
    description: "Click through each layer to see what it does, then watch a message get wrapped in headers on the way down and unwrapped on the way up." },
  { path: "networking/subnetting.html", navLabel: "Subnetting", title: "Subnetting & IP Addressing", icon: "🧮", tags: ["networking"], group: "Foundations",
    description: "Type an IP and CIDR prefix and instantly see the network address, broadcast address, usable range, and binary mask." },
  { path: "networking/tcp-handshake.html", navLabel: "TCP Handshake", title: "TCP Handshake & Packet Flow", icon: "🤝", tags: ["networking"], group: "Foundations",
    description: "Step through SYN, SYN-ACK, ACK, a data transfer, and the FIN teardown between a client and a server." },
  { path: "networking/dns-resolution.html", navLabel: "DNS Resolution", title: "DNS Resolution", icon: "🌐", tags: ["networking"], group: "Foundations",
    description: "Follow a domain lookup hop by hop: browser cache, resolver, root, TLD, and authoritative name server." },
  { path: "networking/linux-networking.html", navLabel: "Linux Netns", title: "Linux Networking", icon: "🐧", tags: ["networking"], group: "Foundations",
    description: "See how network namespaces, interfaces, and veth pairs relate to the ip commands that create them." },

  // ---- networking / Deep Dives & Orchestration ----
  { path: "networking/l3-routing.html", navLabel: "L3 Routing", title: "L3: IP Routing & ICMP", icon: "🧭", tags: ["networking"], group: "Deep Dives & Orchestration",
    description: "See how routers pick a next hop with longest-prefix match, and how traceroute uses ICMP to map the whole path." },
  { path: "networking/firewalls.html", navLabel: "Firewalls", title: "Firewalls & Rules", icon: "🛡️", tags: ["networking", "security"], group: "Deep Dives & Orchestration",
    description: "Test a hypothetical packet against a real rule chain and see why order — not specificity — decides the outcome." },
  { path: "networking/l4-tcp-udp.html", navLabel: "L4 TCP/UDP", title: "L4: TCP vs UDP", icon: "⚖️", tags: ["networking"], group: "Deep Dives & Orchestration",
    description: "Compare reliable, ordered TCP against fast, connectionless UDP — and watch sliding windows and congestion control in action." },
  { path: "networking/l7-protocols.html", navLabel: "L7 HTTP+", title: "L7: HTTP, WebSocket & gRPC", icon: "📡", tags: ["networking"], group: "Deep Dives & Orchestration",
    description: "From HTTP/0.9 to HTTP/3, plus how WebSocket and gRPC solve problems plain request/response HTTP can't." },
  { path: "networking/container-networking.html", navLabel: "Containers", title: "Container Networking", icon: "📦", tags: ["networking"], group: "Deep Dives & Orchestration",
    description: "See exactly how Docker wires up a container's network using the same namespaces and veth pairs from the Linux Networking page." },
  { path: "networking/kubernetes-networking.html", navLabel: "Kubernetes", title: "Kubernetes Networking", icon: "☸️", tags: ["networking", "kubernetes"], group: "Deep Dives & Orchestration",
    description: "Follow a request from Ingress to Pod, and see how Services, kube-proxy, CNI, and NetworkPolicy all fit together." },

  // ---- security ----
  { path: "security/tls-handshake.html", navLabel: "TLS Handshake", title: "TLS / HTTPS Handshake", icon: "🔐", tags: ["security"], group: "Security",
    description: "Step through TLS 1.2 vs 1.3, explore a certificate chain, and see what's actually inside a cipher suite name." },
  { path: "security/network-attacks.html", navLabel: "Network Attacks", title: "Network Attacks & Defenses", icon: "🕵️", tags: ["security"], group: "Security",
    description: "ARP spoofing, port scanning, SYN floods, IP spoofing — the mechanisms from the Networking pages, now exploited." },
  { path: "security/dns-security.html", navLabel: "DNS Security", title: "DNS Security", icon: "🛰️", tags: ["security"], group: "Security",
    description: "Cache poisoning, DNSSEC's chain of trust, and why DoH/DoT solve a completely different problem than DNSSEC." },

  // ---- kubernetes ----
  { path: "kubernetes/architecture.html", navLabel: "Architecture", title: "Architecture & Control Plane", icon: "🏛️", tags: ["kubernetes"], group: "Kubernetes",
    description: "Cluster topology, the API server, etcd, the scheduler, and the controller manager — how the \"brain\" works, tied together in one request's journey." },
  { path: "kubernetes/node-components.html", navLabel: "Node Components", title: "Node Components & Container Runtime", icon: "🖥️", tags: ["kubernetes"], group: "Kubernetes",
    description: "kubelet, the container runtime, and the CRI/CSI/CNI plugin interfaces — how a node actually turns a PodSpec into running containers." },
  { path: "kubernetes/workloads-scheduling.html", navLabel: "Workloads & Scheduling", title: "Workloads & Scheduling", icon: "📦", tags: ["kubernetes"], group: "Kubernetes",
    description: "Pods, Deployments, StatefulSets, DaemonSets, Jobs — and how the scheduler actually decides which node any of them land on." },
  { path: "kubernetes/storage-config.html", navLabel: "Storage & Config", title: "Storage & Configuration", icon: "💾", tags: ["kubernetes"], group: "Kubernetes",
    description: "Volumes, PersistentVolumes and Claims, StorageClasses, ConfigMaps, and Secrets." },
  { path: "kubernetes/policy-security.html", navLabel: "Policy & Security", title: "Policy & Security", icon: "🛡️", tags: ["kubernetes", "security"], group: "Kubernetes",
    description: "RBAC, Pod Security Admission, ResourceQuotas, and admission controllers — test a permission check yourself." },
  { path: "kubernetes/extensibility.html", navLabel: "Extensibility", title: "Extensibility & Ecosystem", icon: "🧩", tags: ["kubernetes"], group: "Kubernetes",
    description: "Custom Resource Definitions, the Operator pattern, and how Helm and Kustomize package and customize manifests." }
];
