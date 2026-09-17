# Motif Reference Guide

> Layer 3 · Biological context for each motif in `_config/motifs.json`

---

## Translation Signals

| Motif           | Pattern         | Biological Role                                          |
| :-------------- | :-------------- | :------------------------------------------------------- |
| Start codon     | `ATG` / `AUG`   | Translation initiation; methionine incorporation          |
| Stop codon TAA  | `TAA` / `UAA`   | Translation termination (ochre)                           |
| Stop codon TAG  | `TAG` / `UAG`   | Translation termination (amber)                           |
| Stop codon TGA  | `TGA` / `UGA`   | Translation termination (opal/umber)                      |
| Kozak consensus | `[AG]CC[AG]CCATG` | Optimal ribosomal recognition context for AUG start      |

---

## Promoter Elements

| Motif     | Pattern           | Biological Role                                        |
| :-------- | :---------------- | :----------------------------------------------------- |
| TATA box  | `TATAAA`          | RNA Pol II core promoter; TBP/TFIID binding site        |
| CAAT box  | `CCAAT` / `CAAT`  | Upstream promoter element; NF-Y/CBF binding             |
| GC box    | `GGGCGG`          | Sp1 transcription factor recognition site               |

---

## Post-Transcriptional Elements

| Motif         | Pattern           | Biological Role                                    |
| :------------ | :---------------- | :------------------------------------------------- |
| Poly-A signal | `AATAAA` / `AAUAAA` | 3'-end polyadenylation signal for mRNA maturation  |
| Splice site   | `GT[ACGT]{4,6}AG` | Exon-intron donor/acceptor junction consensus       |

---

## Epigenetic Markers

| Motif      | Pattern            | Biological Role                                   |
| :--------- | :----------------- | :------------------------------------------------ |
| CpG island | `CGCGCG` / `GCGCGC` | Dense CG dinucleotides; methylation/gene silencing |

---

## Restriction Enzyme Sites

| Enzyme  | Pattern  | Cut Site                          |
| :------ | :------- | :-------------------------------- |
| HindIII | `AAGCTT` | 5'-A↓AGCTT-3' / 3'-TTCGA↑A-5'    |
| EcoRI   | `GAATTC` | 5'-G↓AATTC-3' / 3'-CTTAA↑G-5'    |
| BamHI   | `GGATCC` | 5'-G↓GATCC-3' / 3'-CCTAG↑G-5'    |
