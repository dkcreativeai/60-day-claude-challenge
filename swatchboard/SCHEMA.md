# Swatchboard — Data Schema

**Status:** Approved — Day 2

---

## 1. No Database in v1.0

Swatchboard has **no database, no tables, no collections, and no persisted user data**. This is a deliberate architectural decision, not an oversight:

- The PRD (Section 3.2) explicitly excludes user accounts, saved palette history, and cloud storage from v1.0.
- All processing is client-side and single-session — there is nothing to persist between visits.
- Removing a database entirely removes an entire category of setup, security, and hosting-cost concerns for a 9-18 hour build budget.

If v2.0 ever adds accounts or saved palette history, a lightweight solution (e.g. browser `localStorage` for a single device, or a free-tier hosted database for cross-device sync) would be evaluated at that time — not before.

---

## 2. In-Memory Data Structures (Runtime "Schema")

While there's no database, the app does hold structured data **temporarily in browser memory** during a session. Documenting this here ensures every day's implementation uses consistent naming and shape.

### 2.1 `uploadedImage`
Represents the currently loaded image.

| Field | Type | Description |
|---|---|---|
| `file` | `File` (browser native) | The raw uploaded file object |
| `objectURL` | `string` | A temporary local URL used to display the image in an `<img>` tag |
| `width` | `number` | Natural width of the image, used for canvas sizing |
| `height` | `number` | Natural height of the image, used for canvas sizing |

### 2.2 `extractedColors` (array of `ColorResult`)
Represents the up-to-3 dominant colors extracted from the image. This is the core data structure the whole UI renders from.

| Field | Type | Example | Description |
|---|---|---|---|
| `hex` | `string` | `"#3A5F8A"` | Hex code, always includes the `#` prefix |
| `rgb` | `{ r: number, g: number, b: number }` | `{ r: 58, g: 95, b: 138 }` | RGB values, 0-255 each |
| `cmyk` | `{ c: number, m: number, y: number, k: number }` | `{ c: 58, m: 31, y: 0, k: 46 }` | CMYK values as whole-number percentages (0-100) |

**Constraint:** this array will always have a length between 1 and 3 (see PRD FR-3 — some very flat/simple images may yield fewer than 3 distinct colors; the app must never force exactly 3).

### 2.3 `appState`
A simple state flag used to control which UI section is visible.

| Value | Meaning |
|---|---|
| `"idle"` | No image uploaded yet — show empty upload zone only |
| `"processing"` | Image uploaded, extraction in progress — show loading state |
| `"results"` | Extraction complete — show image + swatches + export button |
| `"error"` | Invalid file or extraction failure — show error message |

---

## 3. Validation Against User Stories

Checking this data model against every relevant PRD requirement:

| PRD Requirement | Covered By |
|---|---|
| FR-1/FR-2: Upload via picker or drag-and-drop | `uploadedImage.file` populated from either input path |
| FR-3: Extract up to 3 colors | `extractedColors` array, length 1-3 |
| FR-4: Display swatches | Rendered directly from `extractedColors` |
| FR-5: HEX/RGB/CMYK display | All three formats present on every `ColorResult` object |
| FR-6: Copy HEX | Reads `extractedColors[i].hex` directly |
| FR-8: PDF export with thumbnail + values | Uses `uploadedImage.objectURL` (or canvas data URL) + full `extractedColors` array |
| FR-9: Invalid file handling | `appState = "error"` short-circuits before any color data is created |
| FR-10: Loading state | `appState = "processing"` drives the loading UI |

No PRD requirement needs data this model doesn't already cover, and no field exists that isn't tied to a specific requirement — the schema is intentionally minimal.
