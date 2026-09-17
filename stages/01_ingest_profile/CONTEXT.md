# Stage 1 — Ingest & Profile

> **Layer 2** · Stage contract for sequence ingestion and physicochemical profiling

---

## Purpose

Accept raw nucleotide input, sanitize it, and compute all deterministic
physicochemical properties. This stage is **fully mechanical** — no AI
reasoning required.

---

## Inputs

| Source                | File / Data                     |
| :-------------------- | :------------------------------ |
| User input            | Raw sequence (textarea or file) |
| `_config/thresholds.md` | Validation limits & MW constants |

---

## Process

1. **Clean** — Strip all characters except `A`, `T`, `G`, `C`, `U`, `N`.
   Convert to uppercase.
2. **Validate** — Reject if length < 6 or > 5,000.
3. **Detect molecule type** — `DNA` (has T, no U), `RNA` (has U, no T),
   `DNA/RNA` (neither), `Mixed` (both).
4. **Compute GC content** — `count(G+C) / length × 100`, rounded to 1 decimal.
5. **Compute molecular weight** — RNA: `length × 340 / 1000` kDa,
   DNA: `length × 324.5 / 1000` kDa.
6. **Count codons** — `floor(length / 3)`.
7. **Estimate Tm** — Wallace rule (< 20 nt) or Marmur-Schildkraut-Doty (≥ 20 nt).

---

## Outputs → `output/`

| File               | Format   | Contents                                            |
| :----------------- | :------- | :-------------------------------------------------- |
| `clean.fasta`      | Text     | Sanitized uppercase nucleotide sequence              |
| `profile.json`     | JSON     | `{ length, gcPercent, moleculeType, codons, mwKDa, tmEstimate }` |

---

## Script

`shared/scripts/bio_profiler.js` — Executes this entire stage deterministically.

---

## Review Gate

After this stage, the user may inspect `profile.json` to verify sequence
length, GC%, and molecule type before proceeding to motif scanning.
