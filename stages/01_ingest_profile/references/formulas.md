# Formulas & Constants

> Layer 3 · Reference for Stage 1 calculations

---

## Molecular Weight

| Backbone          | Average nucleotide MW | Unit conversion       |
| :---------------- | --------------------: | :-------------------- |
| Deoxyribonucleotide (DNA) | 324.5 Da     | `÷ 1000` → kDa       |
| Ribonucleotide (RNA)      | 340.0 Da     | `÷ 1000` → kDa       |

**Formula**: `MW(kDa) = round( length × avgMW / 1000, 1 )`

---

## GC Content

```
GC% = round( count(G + C) / length × 100, 1 )
```

---

## Melting Temperature (Tm)

### Wallace Rule (sequences < 20 nt)

```
Tm = 2 × count(A + T + U) + 4 × count(G + C)
```

### Marmur-Schildkraut-Doty (sequences ≥ 20 nt)

```
Tm = round( 64.9 + 41 × (count(G+C) − 16.4) / length, 1 )
```

---

## Molecule Type Detection

| Has T? | Has U? | Classification |
| :----: | :----: | :------------- |
| Yes    | No     | DNA            |
| No     | Yes    | RNA            |
| No     | No     | DNA/RNA        |
| Yes    | Yes    | Mixed          |
