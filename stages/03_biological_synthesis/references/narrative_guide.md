# Narrative Synthesis Guide

> Layer 3 · Structure and style constraints for biological analysis output

---

## Output Format

```json
{
  "moleculeType": "Concise classification (see CONTEXT.md priority table)",
  "analysis": "3–5 expert sentences covering the 4 dimensions below."
}
```

---

## Required Narrative Structure (4 Sentences)

### Sentence 1 — Architecture & Coding Profile

Describe the dominant structural feature of the sequence:

- **If long ORF exists**: State the sequence length, molecule type, dominant
  ORF length (nt and amino acids), reading frame, and positional coordinates.
- **If start codon but no long ORF**: Classify as 5'-UTR leader or
  fragmented exonic segment.
- **If no start codon**: Classify as non-coding or regulatory element.

### Sentence 2 — GC Content & Thermodynamic Stability

Connect the GC percentage to physical properties:

- **GC ≥ 65%**: Emphasize thermal stability, high Tm, hairpin formation
  potential, protective chromatin architecture.
- **GC ≤ 35%**: Emphasize structural flexibility, strand breathing, open
  DNA topologies, replication origins, promoter spacers.
- **31–64%**: Describe balanced hybridization kinetics and optimal melting
  thermodynamics for transcript processing.

Always include the estimated Tm value.

### Sentence 3 — Motif & Functional Features

Report the detected biological motifs:

- **If regulatory motifs found**: Name up to 3 motifs and state their
  functional significance (transcription, translation, or post-transcriptional).
- **If only restriction enzyme sites**: Mention cloning vector compatibility.
- **If no motifs**: Confirm absence of premature truncation signals and
  uniform sequence integrity.

### Sentence 4 — Biological & Organism Context

Place the sequence in its likely biological environment:

- **RNA sequences**: Ribonucleic acid processing, ribosomal scanning,
  post-transcriptional dynamics.
- **Promoter elements** (TATA / CpG): Eukaryotic nuclear promoter landscapes,
  RNA Pol II initiation complexes.
- **Coding sequences with long ORFs**: Recombinant protein expression,
  structural genomics, cDNA verification.
- **Default**: Synthetic oligonucleotide design, hybridization probes,
  sequencing validation.

---

## Style Constraints

1. **Voice**: Expert molecular biologist. Authoritative, precise, technical.
2. **Avoid**: Hedging language ("might", "could"), first person, questions.
3. **Include**: Specific numbers (nt counts, percentages, Tm values, positions).
4. **Length**: Each sentence should be substantive (20–40 words). Total
   analysis: 80–160 words.
5. **Terminology**: Use proper biochemical nomenclature (e.g., "transactivation
   domain", "pre-initiation complex", "donor splice consensus").
