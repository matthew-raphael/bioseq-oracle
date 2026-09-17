# Stage 4 — UI Assembly

> **Layer 2** · Stage contract for final standalone HTML compilation

---

## Purpose

Assemble all pipeline outputs and design assets into a single, self-contained
`bioseq-oracle.html` file that runs entirely in the browser with zero
dependencies. This stage is **fully mechanical**.

---

## Inputs

| Source                              | File / Data                                       |
| :---------------------------------- | :------------------------------------------------ |
| Stage 1 output                     | `01_ingest_profile/output/profile.json`            |
| Stage 2 output                     | `02_motif_orf_scan/output/motifs_detected.json`    |
| Stage 2 output                     | `02_motif_orf_scan/output/orfs.json`               |
| Stage 3 output                     | `03_biological_synthesis/output/synthesis_report.json` |
| Global config                      | `_config/design_system.css`                        |
| Global config                      | `_config/motifs.json`                              |
| Template                           | `shared/templates/viewer_template.html`            |
| References                         | `references/components.md`                         |

---

## Process

1. **Load template** — Read `shared/templates/viewer_template.html`.
2. **Inject CSS** — Inline all styles from `_config/design_system.css`
   plus component-specific CSS into a single `<style>` block.
3. **Inject data** — Embed `motifs.json` as a JS constant, along with the
   5 example sequences.
4. **Inject scripts** — Inline the JS from `bio_profiler.js` and
   `orf_scanner.js` plus the synthesis engine into a single `<script>` block.
5. **Compile** — Write the final standalone HTML to `output/bioseq-oracle.html`.

---

## Outputs → `output/`

| File                 | Format | Contents                                           |
| :------------------- | :----- | :------------------------------------------------- |
| `bioseq-oracle.html` | HTML   | Fully self-contained interactive web application    |

---

## Output Requirements

The compiled HTML must:
- Work offline with no external dependencies
- Require zero API keys
- Include all CSS inline in a `<style>` tag
- Include all JS inline in a `<script>` tag
- Display the "Anti-Gravity" badge in the header
- Show "Zero API Key Required" in the tagline
- Be responsive down to 480px viewport width

---

## Review Gate

Final review. The user opens `bioseq-oracle.html` in a browser to verify
that all 5 example sequences produce correct analysis output.
