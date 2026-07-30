# Swatchboard — Project Structure

**Status:** Approved — Day 2
**Location in repo:** `60-day-claude-challenge/swatchboard/`

---

## 1. Folder Structure

```
swatchboard/
├── index.html
├── /css
│   └── style.css
├── /js
│   ├── extract.js       (color extraction logic — canvas + ColorThief)
│   ├── convert.js        (HEX/RGB/CMYK conversion functions)
│   ├── export.js         (PDF generation logic — jsPDF)
│   └── main.js            (UI wiring, event listeners, app state)
├── /assets
│   └── favicon.ico        (or .png — added Day 8 polish)
├── ARCHITECTURE.md
├── SCHEMA.md
├── API.md
├── UI-WIREFRAMES.md
├── PROJECT-STRUCTURE.md
└── README.md
```

---

## 2. What Each Part Is Responsible For

| Path | Responsibility |
|---|---|
| `index.html` | The single page shell: header, upload zone, results area, all markup. Loads CSS and all JS files (including CDN script tags for ColorThief and jsPDF). |
| `/css/style.css` | All visual styling: layout, colors, typography, spacing, hover/active states, responsive rules. One file is sufficient given the single-page scope. |
| `/js/extract.js` | Everything related to reading the image and getting raw dominant colors: canvas setup, ColorThief calls. Corresponds to `extractColors()` from API.md. |
| `/js/convert.js` | Pure color-math functions: `hexToRgb()`, `rgbToCmyk()`. Kept separate from extraction logic since these are simple, testable, reusable utilities. |
| `/js/export.js` | Everything related to building and downloading the PDF: `exportToPDF()` and its internal layout logic. Isolated so PDF-specific code doesn't clutter the main UI logic. |
| `/js/main.js` | The "glue" file: event listeners for upload/drag-drop/click, `appState` management, calls into the other three JS files, and `renderSwatches()`/`copyHexToClipboard()`. This is the file most days' work will touch. |
| `/assets/` | Static assets — currently just a favicon, added during Day 8 polish. No images are stored here since user-uploaded images are never persisted. |
| `README.md` | Project description, live link (added Day 9), and a short "how it works" section (finalized Day 10). |
| The five `.md` design docs | Living reference documents for the remainder of the build — not part of the shipped product, but committed to the repo for transparency and future reference. |

---

## 3. Where Future Code Will Live

- **Day 4 (Upload UI)** → markup added to `index.html`, styles to `style.css`, logic to `main.js`
- **Day 5 (Color Extraction)** → logic added to `extract.js`, called from `main.js`
- **Day 6 (Formats + Copy)** → conversion functions added to `convert.js`; copy logic and swatch rendering added to `main.js`
- **Day 7 (PDF Export)** → logic added to `export.js`, called from `main.js`
- **Day 8 (Polish)** → refinements across `style.css` and all JS files; no new files expected
- **Day 9 (Deployment)** → no new project files; possibly a hosting-platform config file only if required
- **Day 10 (Final)** → `README.md` finalized; no new feature files expected

---

## 4. Why This Structure Was Chosen

- **Separation by responsibility, not by "feature day":** files are split by what they *do* (extraction, conversion, export, UI wiring) rather than by which day they were built on — so the code stays organized even as work happens incrementally across 9 sessions.
- **No build step:** every file is loaded directly via `<script>` tags in `index.html`, in a fixed order (`convert.js` → `extract.js` → `export.js` → `main.js`, since `main.js` depends on the other three). No bundler, no npm, no compile step — matching the project's zero-friction deployment goal.
- **Flat and shallow:** no deeply nested folders — appropriate for a small, single-page tool. Over-structuring this would add complexity with no benefit at this scale.
- **Design docs live alongside the code:** keeping `ARCHITECTURE.md`, `SCHEMA.md`, etc. inside `swatchboard/` (rather than elsewhere in the monorepo) means anyone opening the folder immediately has full context — including a fresh AI conversation on any future day.

---

## 5. Script Load Order in `index.html` (Important for Day 3+)

```html
<!-- External libraries first -->
<script src="[ColorThief CDN URL]"></script>
<script src="[jsPDF CDN URL]"></script>

<!-- Project JS, in dependency order -->
<script src="js/convert.js"></script>
<script src="js/extract.js"></script>
<script src="js/export.js"></script>
<script src="js/main.js"></script>
```

Getting this order right on Day 3 avoids "function is not defined" errors later — `main.js` must always load last since it calls functions defined in the other files.
