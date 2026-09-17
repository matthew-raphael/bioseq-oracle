# Stage 2 — Motif Detection & ORF Mapping

> **Layer 2** · Stage contract for regulatory motif scanning and open reading frame detection

---

## Purpose

Scan the cleaned sequence against a catalog of biological motifs and detect
all viable open reading frames across three forward reading frames. This
stage is **fully mechanical** — no AI reasoning required.

---

## Inputs

| Source                            | File / Data          |
| :-------------------------------- | :------------------- |
| Stage 1 output                   | `01_ingest_profile/output/clean.fasta`   |
| Stage 1 output                   | `01_ingest_profile/output/profile.json`  |
| Global config                    | `_config/motifs.json`                    |
| Global config                    | `_config/thresholds.md`                  |

---

## Process

### Motif Scanning

1. Load the motif catalog from `_config/motifs.json`.
2. For each motif, test the regex pattern against the cleaned sequence.
3. Record all matches with their `label` and `severity`.
4. Apply threshold-based quality flags:
   - GC ≥ 65% → `warning: High GC (XX%)`
   - GC ≤ 30% → `warning: Low GC (XX%)`
   - Stop codons > 2 → `warning: N stop codons`
   - Length ≥ 300 nt → `neutral: ≥300 nt`
   - Length < 20 nt → `warning: Short sequence`

### ORF Detection

1. Convert all `U` → `T` in the sequence.
2. For each reading frame (+1, +2, +3):
   - Walk codons from frame offset.
   - Track ATG start → stop codon (TAA/TAG/TGA) spans.
   - Record ORFs ≥ 15 nt (5 codons).
3. Sort by descending length.
4. Return top 6 ORFs.

---

## Outputs → `output/`

| File                   | Format | Contents                                                  |
| :--------------------- | :----- | :-------------------------------------------------------- |
| `motifs_detected.json` | JSON   | Array of `{ label, severity }` for all detected motifs     |
| `orfs.json`            | JSON   | Array of `{ frame, start, end, length, seq }` (max 6)     |
| `annotations.md`       | MD     | Human-readable summary of features and ORFs for review     |

---

## Script

`shared/scripts/orf_scanner.js` — Executes motif scanning and ORF detection.

---

## Review Gate

After this stage, the user may inspect `annotations.md` to verify detected
motifs and reading frames before proceeding to biological narrative synthesis.
