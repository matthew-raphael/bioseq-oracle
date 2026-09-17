# BioSeq Oracle — Anti-Gravity Workspace

> **Engine**: Anti-Gravity BioSeq Intelligence Engine  
> **Runtime**: Offline · Zero API Key · Client-Side  
> **Protocol**: Model Workspace Protocol (MWP) · 5-Layer Context Architecture

---

## Identity

This workspace powers **BioSeq Oracle**, a nucleotide sequence analysis tool
that runs entirely within the Anti-Gravity system. It performs real-time
physicochemical profiling, regulatory motif scanning, open reading frame
detection, and expert biological narrative synthesis — all without external
API calls or internet connectivity.

---

## Directory Map

```
bioseq-workspace/
├── AGENTS.md                    ← YOU ARE HERE · Layer 0 · Workspace Identity
├── CONTEXT.md                   ← Layer 1 · Pipeline Routing & Stage Order
│
├── _config/                     ← Layer 3 (Global) · Immutable Reference Data
│   ├── motifs.json              ← Biological motif pattern catalog
│   ├── thresholds.md            ← Severity thresholds & validation limits
│   └── design_system.css        ← CSS tokens, colors & layout primitives
│
├── shared/                      ← Mechanical Utilities & Templates
│   ├── scripts/
│   │   ├── bio_profiler.js      ← Deterministic: clean, GC%, MW, Tm
│   │   ├── orf_scanner.js       ← Deterministic: 3-frame ORF + motif scan
│   │   └── compile_ui.js        ← Assembly: binds data + template → HTML
│   └── templates/
│       ├── report_template.md   ← Markdown template for synthesis output
│       └── viewer_template.html ← Base HTML5 shell for the final app
│
├── stages/
│   ├── 01_ingest_profile/       ← Stage 1: Sequence Ingestion & Profiling
│   │   ├── CONTEXT.md           ← Layer 2: Stage contract
│   │   ├── references/          ← Layer 3: Formulas & constants
│   │   └── output/              ← Layer 4: Mutable run artifacts
│   │
│   ├── 02_motif_orf_scan/       ← Stage 2: Motif Detection & ORF Mapping
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   │
│   ├── 03_biological_synthesis/ ← Stage 3: AI Narrative & Classification
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   │
│   └── 04_ui_assembly/          ← Stage 4: Final HTML Compilation
│       ├── CONTEXT.md
│       ├── references/
│       └── output/              ← Contains final bioseq-oracle.html
│
└── setup/
    └── questionnaire.md         ← Configuration preferences
```

---

## Global Rules

1. **No external API calls.** All analysis runs natively on Anti-Gravity.
2. **Layer separation is strict.** Reference data (`_config/`, `references/`)
   is read-only. Only `output/` directories are writable at runtime.
3. **Stage contracts are law.** Each `CONTEXT.md` defines exactly what a
   stage reads, what it does, and what it writes. Do not skip stages.
4. **Deterministic work stays mechanical.** GC%, Tm, MW, ORF detection —
   these are computed by scripts, never by the AI model. The model handles
   only biological narrative synthesis (Stage 3).
5. **Human review gates exist between stages.** The user can inspect and
   modify `output/` artifacts before the next stage runs.
6. **Anti-Gravity native.** This workspace is designed for the Anti-Gravity
   agentic system. All file references, tool usage, and runtime behaviors
   align with Anti-Gravity conventions.
