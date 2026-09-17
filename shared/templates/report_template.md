# Synthesis Report

> Template for Stage 3 output

---

## Molecule Classification

**Type**: {{ moleculeType }}

---

## Molecular Analysis

{{ analysis }}

---

## Source Data

| Metric         | Value              |
| :------------- | :----------------- |
| Sequence length | {{ length }} nt   |
| GC content     | {{ gcPercent }}%    |
| Molecule type  | {{ moleculeType }} |
| Tm estimate    | {{ tmEstimate }}°C |

### Detected Motifs

{{ motifs_list }}

### Open Reading Frames

{{ orfs_list }}
