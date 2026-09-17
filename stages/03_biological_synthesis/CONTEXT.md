# Stage 3 — Biological Narrative Synthesis

> **Layer 2** · Stage contract for AI-powered molecular classification and analysis

---

## Purpose

Generate an expert-level biological classification and multi-sentence
functional narrative for the analyzed sequence. This is the **only stage
that requires Anti-Gravity AI reasoning** — all other stages are mechanical.

---

## Inputs

| Source                              | File / Data                                |
| :---------------------------------- | :----------------------------------------- |
| Stage 1 output                     | `01_ingest_profile/output/profile.json`     |
| Stage 1 output                     | `01_ingest_profile/output/clean.fasta`      |
| Stage 2 output                     | `02_motif_orf_scan/output/motifs_detected.json` |
| Stage 2 output                     | `02_motif_orf_scan/output/orfs.json`        |
| Stage 3 references                 | `references/gene_archetypes.md`             |
| Stage 3 references                 | `references/narrative_guide.md`             |

---

## Process

### Step 1 — Signature Matching

Check the cleaned sequence against known gene archetypes in
`references/gene_archetypes.md`. If an exact signature match is found,
return the pre-authored classification and narrative immediately.

**Known archetypes:**
- Mammalian Preproinsulin (INS)
- Human Tumor Suppressor TP53
- Eukaryotic TATA Box Promoter + HindIII
- Synthetic Exon-Splice mRNA
- Hyper-GC CpG Regulatory Island

### Step 2 — Dynamic Heuristic Classification

If no archetype matches, classify the molecule type using this priority:

| Priority | Condition                    | Classification                                      |
| :------: | :--------------------------- | :-------------------------------------------------- |
|    1     | TATA box detected            | Eukaryotic Core Promoter / TATA Regulatory Element   |
|    2     | CpG island + GC ≥ 60%       | CpG Island / High-GC Regulatory {type}               |
|    3     | Kozak + long ORF (≥ 45 nt)  | Eukaryotic Protein-Coding {type} (Kozak Context)     |
|    4     | Long ORF + start codon       | Protein-Coding {type} (Frame +N ORF)                 |
|    5     | Splice site detected         | Exon-Intron Splice Junction / Pre-mRNA Element       |
|    6     | Poly-A signal detected       | 3'-UTR Polyadenylated {type} Segment                 |
|    7     | GC ≥ 65%                    | High-GC {type} Structural Element                    |
|    8     | GC ≤ 32%                    | AT-Rich Non-Coding / Origin-like {type}              |
|    9     | Length < 25 nt               | Short Oligonucleotide / Primer-Probe Sequence        |
|   10     | Default                      | Structured {type} Sequence Element                   |

### Step 3 — Narrative Synthesis

Generate a 3–5 sentence analysis following the structure in
`references/narrative_guide.md`:

1. **Architecture & Coding Profile** — ORF presence, frame, length, amino acid count
2. **GC Content & Thermodynamics** — GC%, estimated Tm, stability implications
3. **Motif & Functional Features** — Detected regulatory elements and their significance
4. **Biological & Organism Context** — Likely cellular function and expression system

---

## Outputs → `output/`

| File                     | Format | Contents                                         |
| :----------------------- | :----- | :----------------------------------------------- |
| `synthesis_report.json`  | JSON   | `{ moleculeType: "...", analysis: "..." }`        |

---

## Review Gate

After this stage, the user may edit the narrative text or molecule
classification before it is rendered in the final UI.
