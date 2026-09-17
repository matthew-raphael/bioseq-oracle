# UI Components Reference

> Layer 3 · Component layout and interaction specifications for Stage 4 assembly

---

## Component Inventory

### 1. Site Header

| Element          | Content                                               |
| :--------------- | :---------------------------------------------------- |
| Logo SVG         | 28×28 helix icon, `stroke: #2563eb`                   |
| Site name        | "BioSeq Oracle"                                        |
| Badge            | "Anti-Gravity" pill badge (blue-50 bg, blue-600 text)  |
| Tagline          | "Integrated BioSeq Intelligence · Zero API Key Required" |

**Behavior**: Sticky top, `z-index: 10`, bottom border separator.

---

### 2. Input Section

| Element          | ID / Class        | Details                              |
| :--------------- | :---------------- | :----------------------------------- |
| Section label    | `.section-label`  | "NUCLEOTIDE SEQUENCE"                |
| Textarea         | `#seqInput`       | 5 rows, monospace, placeholder text  |
| Example buttons  | `.ex-btn`         | 5 buttons with `data-key` attributes |
| Clear button     | `#clearBtn`       | Clears textarea + hides results      |

**Example button keys**: `insulin`, `tata`, `rna`, `gc`, `p53`

---

### 3. Stats Row

| Stat Card     | ID           | Label           | Format            |
| :------------ | :----------- | :-------------- | :---------------- |
| Length         | `#statLen`   | Length (nt)      | Locale number     |
| GC Content    | `#statGC`    | GC content       | `XX%` + bar fill  |
| Molecule Type | `#statType`  | Molecule type    | DNA / RNA / Mixed |
| Codons        | `#statCodons`| Codons           | Locale number     |
| Mol. Weight   | `#statMW`    | Mol. weight (kDa)| Locale number    |

**Behavior**: Hidden by default (`.stats-row`), shown via `.visible` class
on input. Updates on every keystroke via `input` event.

---

### 4. Error Banner

| Element | ID             | Behavior                                    |
| :------ | :------------- | :------------------------------------------ |
| Banner  | `#errorBanner` | Hidden by default, shown via `.visible` class |

**Validation errors**: "Enter a nucleotide sequence first",
"Sequence too short", "Sequence too long"

---

### 5. Analyze Button

| Element | ID           | States                                |
| :------ | :----------- | :------------------------------------ |
| Button  | `#analyzeBtn`| Default: "Analyze sequence"           |
|         |              | Loading: "Analyzing…" + disabled      |

---

### 6. Result Panel (2-column grid)

#### Left Column
- **Annotated Sequence** (`#annotSeq`) — Color-coded nucleotides,
  60-char lines, 10-char spacing. Legend: A (blue), T/U (red), G (green), C (amber).
- **Predicted Features** (`#featureGrid`) — Flex-wrap pill tags with severity classes.

#### Right Column
- **Molecule Classification** (`#molType`) — Large bold text from `synthesis_report.json`.
- **Molecular Analysis** (`#analysisText`) — Paragraph text from `synthesis_report.json`.
  Shows thinking dots animation while processing.
- **Open Reading Frames** (`#orfList`) — Grid items: ORF label, sequence preview
  (truncated at 18 chars), length + position range.

---

### 7. Site Footer

Content: `BioSeq Oracle · Anti-Gravity BioSeq Engine · Zero API Key Required · Research use`

---

## Responsive Breakpoints

| Breakpoint | Changes                                          |
| :--------- | :----------------------------------------------- |
| ≤ 768px    | Result panel → single column; stats → 3 columns; tagline hidden |
| ≤ 480px    | Stats → 2 columns                                |
