# Swatchboard — Setup Guide

**Status:** Complete — Day 3

---

## 1. Overview

Swatchboard requires **no local installation** on your personal computer. The entire development environment runs in the browser via **GitHub Codespaces**, and the app itself is a static HTML/CSS/JS site with two CDN-loaded libraries — no npm install, no build tools, no local runtime needed.

---

## 2. Prerequisites

| Requirement | Notes |
|---|---|
| A GitHub account | Already set up — repo is `dkcreativeai/60-day-claude-challenge` |
| A modern web browser | Chrome, Firefox, or Edge — used for both the Codespace editor and previewing the app |
| GitHub Codespaces access | Free tier includes a monthly quota of usage hours, more than sufficient for this project |

No Node.js, Python packages, database software, or IDE installation is required on your personal machine.

---

## 3. One-Time Setup Steps

1. Navigate to `https://github.com/dkcreativeai/60-day-claude-challenge`.
2. Click **`<> Code`** → **Codespaces** tab → **"Create codespace on main"**.
3. Wait for the Codespace to finish loading (a full browser-based VS Code environment).
4. In the built-in terminal, navigate into the project:
   ```
   cd swatchboard
   ```

That's the entire setup — everything else (the folder structure, files, and libraries) is already scaffolded as of Day 3.

---

## 4. Running the Project Locally (Inside the Codespace)

A lightweight local web server is required (not for the app's functionality, but because some browser features like the Clipboard API only work over `http://` or `https://`, not when opening a file directly).

1. From the project root (`/workspaces/60-day-claude-challenge`), run:
   ```
   python3 -m http.server 8080
   ```
   *(Python 3 comes pre-installed in GitHub Codespaces — no separate install needed.)*
2. Click **"Open in Browser"** on the popup, or use the **PORTS** tab to open port `8080` manually.
3. Navigate to the `swatchboard` folder in the file listing, then click `index.html`.
4. You should see the Swatchboard title and a confirmation message that both libraries loaded successfully.

To stop the server later, click into the terminal and press `Ctrl + C`.

---

## 5. Verifying Everything Works

Confirm all of the following before starting new feature work:
- [ ] Codespace opens without errors
- [ ] `swatchboard/` folder contains: `index.html`, `css/style.css`, `js/convert.js`, `js/extract.js`, `js/export.js`, `js/main.js`, `assets/.gitkeep`, and all five design docs
- [ ] Running the local server and opening `index.html` shows the Swatchboard title
- [ ] The on-page status message confirms both ColorThief and jsPDF loaded successfully (green checkmark, not a yellow warning)

---

## 6. Common Setup Issues

| Issue | Fix |
|---|---|
| Codespace won't load / times out | Refresh the page, or create a new Codespace from the same repo — Codespaces occasionally need a restart |
| `python3: command not found` | Very rare in Codespaces, but if it happens, try `python -m http.server 8080` instead |
| Port 8080 popup doesn't appear | Open the **PORTS** tab (next to Terminal) and manually click the globe icon next to port 8080 |
| Files dragged in don't appear nested correctly | Make sure you drag the *contents* of the unzipped folder, not the folder itself, directly onto `swatchboard` in the Explorer sidebar |
| A file shows 0 bytes after dragging | Re-check using `wc -l <filename>` in the terminal — this is more reliable than trusting the editor tab's visual content, which can occasionally render oddly for large files |
git add .
