# Mastering

**Live site: https://merlicne.github.io/mastering/**

An interactive, hands-on learning site — click, drag, and step through concepts instead of just reading about them. Every page is plain static HTML/CSS/JS (no build step, no framework).

## Subjects

- **Networking** — OSI/TCP-IP layers, subnetting, TCP handshake, DNS resolution, Linux networking, L3 routing, firewalls, L4 TCP/UDP, L7 protocols (HTTP/WebSocket/gRPC), container networking, Kubernetes networking
- **Security** — TLS/HTTPS handshake, network attacks & defenses, DNS security
- **Kubernetes** — architecture & control plane, node components & container runtime, workloads & scheduling, storage & configuration, policy & security, extensibility & ecosystem

## Structure

```
docs/                   GitHub Pages serves from here
├── index.html          Global hub — lists each subject
├── content.js          Single source of truth for every topic page (path, title, tags, ...)
├── css/style.css        Shared design system
├── fonts/                Self-hosted webfonts used by css/style.css (no CDN)
├── js/nav.js             Shared nav bar, driven by content.js
├── js/tooltip.js         Shared glossary-tooltip engine (the .term/data-tip spans)
├── networking/           Networking subject: its own index.html + topic pages
├── security/             Security subject
└── kubernetes/           Kubernetes subject
```

A page can carry more than one tag in `content.js` (e.g. Firewalls is tagged both `networking` and `security`) — it lives in one folder, but shows up as a cross-referenced "Also relevant" card on every other subject's hub it's tagged for, without duplicating content.

## Running locally

No build step — just serve the `docs/` folder:

```
python3 -m http.server --directory docs 8000
```

Then open `http://localhost:8000`.

## Deployment

GitHub Pages, configured to serve from the `docs/` folder on `main`. Pushing to `main` redeploys automatically.
