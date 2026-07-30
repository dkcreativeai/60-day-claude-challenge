# Swatchboard — Environment

**Status:** Complete — Day 3

---

## 1. Environment Variables

**None required.** Swatchboard has no API keys, no secrets, no database credentials, and no server-side configuration. Every library used is loaded from a public CDN with no authentication.

---

## 2. Development Environment

| Tool | Purpose | Installed Where |
|---|---|---|
| GitHub Codespaces | Cloud-based development environment (editor + terminal), accessed entirely via browser | N/A — hosted by GitHub, no local install |
| Python 3 (`http.server` module) | Runs a lightweight local web server so the app can be previewed over `http://` instead of `file://` | Pre-installed in the Codespace image |
| Git | Version control | Pre-installed in the Codespace image |

No IDE extensions, SDKs, or package managers (npm, pip) are required for this project's actual functionality.

---

## 3. Runtime Libraries (Loaded via CDN in `index.html`)

| Library | Version/Source | Purpose |
|---|---|---|
| **ColorThief** | `https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.4.0/color-thief.umd.js` | Extracts dominant colors from an image via Canvas pixel data |
| **jsPDF** | `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js` | Generates the downloadable PDF swatch sheet client-side |

Both are loaded directly in the `<head>`/before the closing `<body>` tag of `index.html` — no installation step, no version management beyond the URLs above.

---

## 4. Hosting Environment (Day 9)

| Setting | Value |
|---|---|
| Host | GitHub Pages |
| Source branch | `main` (to be configured on Day 9) |
| Source folder | `/swatchboard` (the app lives in a subfolder of the monorepo, not the repo root) |
| Build command | None — static files served as-is |
| Environment variables on host | None required |

---

## 5. Local Preview Configuration

| Setting | Value |
|---|---|
| Local server command | `python3 -m http.server 8080` |
| Local URL | `http://localhost:8080` (or the Codespace's forwarded port URL, e.g. `https://<codespace-name>-8080.app.github.dev`) |
| Port | `8080` (can be changed if already in use — replace `8080` in the command with any other free port, e.g. `8081`) |

---

## 6. Browser Requirements

| Feature Used | Minimum Support Needed |
|---|---|
| Canvas API | All modern browsers (Chrome, Firefox, Edge, Safari) |
| Clipboard API (`navigator.clipboard`) | Requires a secure context — `https://` or `localhost`/`http://127.0.0.1` — will NOT work when opening `index.html` directly as a `file://` path |
| Drag and Drop API | All modern browsers |

No polyfills or fallback libraries are used for older browsers, consistent with the PRD's compatibility requirement (latest Chrome, Firefox, Edge).
