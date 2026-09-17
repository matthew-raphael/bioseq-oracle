# Thresholds & Validation Rules

> Layer 3 · Global reference constraints for all pipeline stages

---

## Sequence Validation

| Parameter       | Minimum | Maximum | Error Message                                    |
| :-------------- | ------: | ------: | :----------------------------------------------- |
| Sequence length |       6 |   5,000 | `Sequence too short` / `Sequence too long`        |
| Valid chars     |       — |       — | Only `A`, `T`, `G`, `C`, `U`, `N` after cleaning |

---

## GC Content Severity Thresholds

| Condition    | Threshold | Severity  | Tag Label          |
| :----------- | --------: | :-------- | :----------------- |
| High GC      |     ≥ 65% | `warning` | `High GC (XX%)`    |
| Low GC       |     ≤ 30% | `warning` | `Low GC (XX%)`     |
| Balanced     |   31–64%  | —         | No warning emitted |

---

## ORF Detection Rules

| Parameter           | Value | Notes                                         |
| :------------------ | ----: | :-------------------------------------------- |
| Minimum ORF length  |  15 nt | 5 codons minimum                             |
| Reading frames      |     3 | Forward strand only: +1, +2, +3              |
| Start codon         |   ATG | Uracil variant AUG converted to ATG first     |
| Stop codons         |     3 | TAA, TAG, TGA                                 |
| Max ORFs reported   |     6 | Ranked by descending length                   |

---

## Stop Codon Warning

| Condition          | Threshold | Severity  | Tag Label            |
| :----------------- | --------: | :-------- | :------------------- |
| Excessive stops    |       > 2 | `warning` | `N stop codons`      |

---

## Length Classification

| Condition          | Threshold | Severity  | Tag Label          |
| :----------------- | --------: | :-------- | :----------------- |
| Long sequence      |   ≥ 300 nt | `neutral` | `≥300 nt`         |
| Short sequence     |    < 20 nt | `warning` | `Short sequence`   |

---

## Molecular Weight Constants

| Molecule | Average Nucleotide MW | Formula                        |
| :------- | --------------------: | :----------------------------- |
| DNA      |            324.5 Da   | `length × 324.5 / 1000` (kDa) |
| RNA      |            340.0 Da   | `length × 340.0 / 1000` (kDa) |

---

## Melting Temperature (Tm) Estimation

| Sequence Length | Method                    | Formula                                       |
| :-------------- | :------------------------ | :-------------------------------------------- |
| < 20 nt         | Wallace Rule              | `Tm = 2(A+T) + 4(G+C)`                       |
| ≥ 20 nt         | Marmur-Schildkraut-Doty   | `Tm = 64.9 + 41 × (GC − 16.4) / length`      |
