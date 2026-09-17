# Pipeline Context — BioSeq Oracle

> **Layer 1** · Stage routing, dependencies, and execution order

---

## Pipeline Overview

BioSeq Oracle processes nucleotide sequences through a **4-stage linear pipeline**.
Each stage consumes the previous stage's `output/` and writes its own.

```
INPUT → [01 Ingest & Profile] → [02 Motif & ORF Scan] → [03 Biological Synthesis] → [04 UI Assembly] → OUTPUT
              ↓                        ↓                          ↓                          ↓
         profile.json           motifs_detected.json        synthesis_report.json     bioseq-oracle.html
                                orfs.json
```

---

## Stage Execution Order

| Order | Stage Directory           | Type         | Depends On   | Produces                          |
| :---: | :------------------------ | :----------- | :----------- | :-------------------------------- |
|   1   | `01_ingest_profile/`      | Mechanical   | Raw input    | `profile.json`, `clean.fasta`     |
|   2   | `02_motif_orf_scan/`      | Mechanical   | Stage 1      | `motifs_detected.json`, `orfs.json` |
|   3   | `03_biological_synthesis/`| AI (Model)   | Stages 1 + 2 | `synthesis_report.json`           |
|   4   | `04_ui_assembly/`         | Mechanical   | Stages 1–3   | `bioseq-oracle.html`             |

---

## Stage Types

- **Mechanical** — Deterministic computation executed by scripts in `shared/scripts/`.
  No model reasoning needed. Reproducible, testable, fast.
- **AI (Model)** — Requires Anti-Gravity intelligence for narrative synthesis.
  Reads only structured data from prior stages + reference knowledge.

---

## Review Gates

After each stage completes, the user may:
1. **Inspect** the `output/` artifacts.
2. **Edit** any artifact to correct, refine, or extend it.
3. **Approve** to continue to the next stage.

The pipeline does not auto-advance past a review gate without explicit user approval.

---

## Global Reference Dependencies

All stages may read from `_config/` (Layer 3 global references):
- `_config/motifs.json` — Canonical motif pattern library
- `_config/thresholds.md` — Validation limits and severity rules
- `_config/design_system.css` — Visual design tokens for UI assembly
