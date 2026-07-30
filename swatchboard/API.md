# Swatchboard — API Design

**Status:** Approved — Day 2

---

## 1. No Network API

Swatchboard has no backend server, so there are no HTTP endpoints, REST routes, or network requests involved in its core functionality. Everything happens inside the browser.

Instead, this document specifies the **internal JavaScript function contract** — the equivalent of an API for a client-only app. Every function below is called directly within `app.js` (or its supporting files). Documenting these now means Days 4-7 implement against a fixed contract instead of inventing function signatures on the fly.

---

## 2. Function Contracts

### 2.1 `handleFile(file)`
**Purpose:** Single entry point for any newly selected/dropped file — the "endpoint" both upload paths call.

- **Request (input):** `file` — a browser `File` object
- **Response (output):** none directly; updates `appState` and triggers the next step in the pipeline
- **Validation:** confirms `file.type` starts with `image/`; rejects anything else
- **Authentication:** N/A
- **Error cases:**
  - Not an image file → sets `appState = "error"`, displays "Please upload a valid image file."
  - File read fails (corrupted file) → sets `appState = "error"`, displays a generic "Couldn't read this image, please try another."

---

### 2.2 `extractColors(imageElement)`
**Purpose:** Runs the uploaded image through canvas + ColorThief to produce dominant colors.

- **Request (input):** `imageElement` — an `<img>` DOM element with the uploaded image already loaded
- **Response (output):** an array of 1-3 raw HEX strings (before RGB/CMYK conversion)
- **Validation:** confirms the image has fully loaded (non-zero width/height) before reading canvas data
- **Authentication:** N/A
- **Error cases:**
  - Extraction library throws (e.g. unsupported image encoding) → catch and set `appState = "error"`, displays "Couldn't extract colors from this image."
  - Image too large causing slow processing → mitigated by downscaling image before extraction (see Blueprint Day 5 debugging notes)

---

### 2.3 `hexToRgb(hex)`
**Purpose:** Converts a HEX string to an RGB object.

- **Request (input):** `hex` — string, e.g. `"#3A5F8A"`
- **Response (output):** `{ r: number, g: number, b: number }`
- **Validation:** confirms input matches a valid 6-digit hex pattern
- **Error cases:** malformed hex input → should not occur in practice since input always comes from `extractColors()`, but defensively returns `{r:0, g:0, b:0}` rather than throwing

---

### 2.4 `rgbToCmyk(r, g, b)`
**Purpose:** Converts RGB values to CMYK percentages.

- **Request (input):** `r`, `g`, `b` — numbers, 0-255 each
- **Response (output):** `{ c: number, m: number, y: number, k: number }`, each 0-100
- **Validation:** none needed beyond expecting numeric input already validated upstream
- **Error cases:** N/A (pure math function, cannot fail given valid numeric input)

---

### 2.5 `renderSwatches(colorResults)`
**Purpose:** Renders the array of color results as visual swatch cards in the DOM.

- **Request (input):** `colorResults` — array of `ColorResult` objects (see SCHEMA.md)
- **Response (output):** none directly; updates the DOM's results container
- **Validation:** expects a non-empty array (length 1-3); if empty, falls back to an error message instead of rendering nothing silently
- **Error cases:** empty array passed in → treated as an extraction failure, `appState = "error"`

---

### 2.6 `copyHexToClipboard(hex)`
**Purpose:** Copies a given HEX string to the user's clipboard, with visual confirmation.

- **Request (input):** `hex` — string
- **Response (output):** none directly; triggers a temporary "Copied!" UI state on the clicked element
- **Validation:** N/A
- **Authentication:** N/A — but requires a secure context (HTTPS or localhost) per browser Clipboard API rules
- **Error cases:** clipboard write fails/denied (rare, e.g. browser permission issue) → falls back to showing the HEX value in a selectable text field so the user can copy manually

---

### 2.7 `exportToPDF(uploadedImage, colorResults)`
**Purpose:** Generates and downloads the PDF swatch sheet.

- **Request (input):** `uploadedImage` object + `colorResults` array (see SCHEMA.md)
- **Response (output):** triggers a browser file download; no return value used
- **Validation:** only callable when `appState === "results"` (i.e. a successful extraction already occurred) — the Export button is not shown otherwise
- **Authentication:** N/A
- **Error cases:**
  - Image fails to embed in PDF (e.g. data URL conversion issue) → catch and show a non-blocking message: "PDF export failed, please try again."
  - jsPDF library fails to load (e.g. CDN unreachable) → Export button is disabled with a tooltip explaining the library didn't load; detected at page-load time, not export time

---

## 3. Summary Table

| Function | Input | Output | Called From |
|---|---|---|---|
| `handleFile` | `File` | updates state | Upload picker + drag/drop listeners |
| `extractColors` | `<img>` element | HEX array | Called after successful `handleFile` |
| `hexToRgb` | hex string | RGB object | Called once per color during processing |
| `rgbToCmyk` | r, g, b | CMYK object | Called once per color during processing |
| `renderSwatches` | ColorResult array | DOM update | Called after all conversions complete |
| `copyHexToClipboard` | hex string | DOM update | Click listener on each swatch's HEX label |
| `exportToPDF` | image + colors | file download | Click listener on Export button |
