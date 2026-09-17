/**
 * BioSeq Oracle — ORF Scanner, Translation & Motif/Digest Engine
 * Shared mechanical script for Stage 2: Motif Detection & ORF Mapping
 *
 * Deterministic functions — no AI reasoning required.
 * Reads: clean sequence, motifs.json, thresholds
 * Writes: motifs_detected.json, orfs.json, annotations.md → stages/02_motif_orf_scan/output/
 */

// ── Standard Genetic Code Codon Translation Table ──
var CODON_TABLE = {
  'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
  'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
  'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
  'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
  'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
  'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
  'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
  'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
  'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
  'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
  'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
  'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
  'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
  'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
  'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
  'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
};

var AMINO_ACID_3_LETTER = {
  'A': 'Ala', 'R': 'Arg', 'N': 'Asn', 'D': 'Asp', 'C': 'Cys',
  'E': 'Glu', 'Q': 'Gln', 'G': 'Gly', 'H': 'His', 'I': 'Ile',
  'L': 'Leu', 'K': 'Lys', 'M': 'Met', 'F': 'Phe', 'P': 'Pro',
  'S': 'Ser', 'T': 'Thr', 'W': 'Trp', 'Y': 'Tyr', 'V': 'Val',
  '*': 'Stop', 'X': 'Xaa'
};

// Monoisotopic residue MWs in Da (residue minus water)
var AA_RESIDUE_MW = {
  'A': 71.08, 'R': 156.20, 'N': 114.11, 'D': 115.09, 'C': 103.14,
  'E': 129.12, 'Q': 128.14, 'G': 57.05,  'H': 137.15, 'I': 113.17,
  'L': 113.17, 'K': 128.18, 'M': 131.21, 'F': 147.19, 'P': 97.12,
  'S': 87.08,  'T': 101.11, 'W': 186.23, 'Y': 163.18, 'V': 99.14
};

// ── Codon Translation ──
function translateCodons(dnaSeq) {
  var clean = dnaSeq.toUpperCase().replace(/U/g, 'T');
  var peptide = [];
  for (var i = 0; i + 2 < clean.length; i += 3) {
    var codon = clean.slice(i, i + 3);
    var aa = CODON_TABLE[codon] || 'X';
    if (aa === '*') break; // stop translation at stop codon
    peptide.push(aa);
  }
  return peptide.join('');
}

// ── Protein Molecular Weight (Da) ──
function proteinMolecularWeight(aaSeq) {
  var mw = 18.015; // N-terminal H and C-terminal OH
  for (var i = 0; i < aaSeq.length; i++) {
    var aa = aaSeq[i];
    mw += (AA_RESIDUE_MW[aa] || 110.0);
  }
  return Math.round(mw * 10) / 10;
}

// ── Protein Isoelectric Point (pI) Estimation (Bjellqvist model) ──
function estimateProteinPI(aaSeq) {
  if (!aaSeq || !aaSeq.length) return 7.0;

  var pKa = {
    Nterm: 9.69, Cterm: 2.34,
    C: 8.33, D: 3.86, E: 4.25, H: 6.00, K: 10.50, R: 12.48, Y: 10.07
  };

  var counts = { C: 0, D: 0, E: 0, H: 0, K: 0, R: 0, Y: 0 };
  for (var i = 0; i < aaSeq.length; i++) {
    var c = aaSeq[i];
    if (counts[c] !== undefined) counts[c]++;
  }

  function chargeAtPH(pH) {
    var charge = 0;
    // N-terminus
    charge += 1 / (1 + Math.pow(10, pH - pKa.Nterm));
    // C-terminus
    charge -= 1 / (1 + Math.pow(10, pKa.Cterm - pH));
    // Basic residues (positive when protonated)
    charge += counts.K * (1 / (1 + Math.pow(10, pH - pKa.K)));
    charge += counts.R * (1 / (1 + Math.pow(10, pH - pKa.R)));
    charge += counts.H * (1 / (1 + Math.pow(10, pH - pKa.H)));
    // Acidic residues (negative when deprotonated)
    charge -= counts.D * (1 / (1 + Math.pow(10, pKa.D - pH)));
    charge -= counts.E * (1 / (1 + Math.pow(10, pKa.E - pH)));
    charge -= counts.C * (1 / (1 + Math.pow(10, pKa.C - pH)));
    charge -= counts.Y * (1 / (1 + Math.pow(10, pKa.Y - pH)));
    return charge;
  }

  // Binary search for net charge ~ 0 between pH 2.0 and 14.0
  var min = 2.0, max = 14.0, pI = 7.0;
  for (var iter = 0; iter < 20; iter++) {
    pI = (min + max) / 2;
    var charge = chargeAtPH(pI);
    if (charge > 0) min = pI;
    else max = pI;
  }
  return Math.round(pI * 100) / 100;
}

// ── Reverse Complement Helper ──
function revComp(seq) {
  var comp = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G', 'U': 'A', 'N': 'N' };
  var out = [];
  for (var i = seq.length - 1; i >= 0; i--) {
    out.push(comp[seq[i]] || 'N');
  }
  return out.join('');
}

// ── Open Reading Frame Detection (All 6 Reading Frames) ──
// Scans forward (+1, +2, +3) and reverse (-1, -2, -3) frames for ATG → stop ORFs ≥ minLen nt
function findORFs(seq, minLen) {
  minLen = minLen || 15;
  var fwdDna = seq.replace(/U/g, 'T').toUpperCase();
  var revDna = revComp(fwdDna);
  var totalLen = fwdDna.length;
  var stops = { 'TAA': true, 'TAG': true, 'TGA': true };
  var orfs = [];

  // Helper to scan a single strand
  function scanStrand(dna, strandSign) {
    for (var frame = 0; frame < 3; frame++) {
      var startIdx = -1;
      for (var i = frame; i + 2 < dna.length; i += 3) {
        var codon = dna.slice(i, i + 3);
        if (startIdx === -1 && codon === 'ATG') {
          startIdx = i;
        } else if (startIdx !== -1 && stops[codon]) {
          var ntLen = (i + 3) - startIdx;
          if (ntLen >= minLen) {
            var orfSeq = dna.slice(startIdx, i + 3);
            var peptide = translateCodons(orfSeq);

            // Calculate original 5'->3' coordinates (1-indexed)
            var startCoord, endCoord;
            if (strandSign === '+') {
              startCoord = startIdx + 1;
              endCoord   = i + 3;
            } else {
              // Reverse complement mapping back to forward strand
              startCoord = totalLen - (i + 2);
              endCoord   = totalLen - startIdx;
            }

            orfs.push({
              frame:         strandSign + (frame + 1),
              strand:        strandSign,
              frameOffset:   frame,
              start:         startCoord,
              end:           endCoord,
              length:        ntLen,
              codons:        Math.floor(ntLen / 3),
              seq:           orfSeq,
              peptide:       peptide,
              peptideMWDa:   proteinMolecularWeight(peptide),
              peptidePI:     estimateProteinPI(peptide)
            });
          }
          startIdx = -1;
        }
      }
    }
  }

  scanStrand(fwdDna, '+');
  scanStrand(revDna, '-');

  // Sort by descending nucleotide length
  orfs.sort(function(a, b) { return b.length - a.length; });
  return orfs;
}

// ── Positional Regulatory Motif Scanning ──
function scanMotifs(seq, motifDefs, gcPercent) {
  var clean = seq.toUpperCase().replace(/U/g, 'T');
  var found = [];
  motifDefs = motifDefs || [];

  for (var i = 0; i < motifDefs.length; i++) {
    var m = motifDefs[i];
    try {
      var re = new RegExp(m.pattern, 'g');
      var match;
      var matchesForThisMotif = 0;
      while ((match = re.exec(clean)) !== null) {
        matchesForThisMotif++;
        found.push({
          id:         m.id,
          label:      m.label,
          severity:   m.severity,
          category:   m.category || 'motif',
          start:      match.index + 1,
          end:        match.index + match[0].length,
          strand:     '+',
          matchedSeq: match[0]
        });
        if (matchesForThisMotif >= 8) break; // cap repetitive matches per motif
        if (match.index === re.lastIndex) re.lastIndex++;
      }
    } catch(e) {}
  }

  // Threshold-based quality flags (from _config/thresholds.md)
  if (gcPercent >= 65) {
    found.push({ label: 'High GC (' + gcPercent + '%)', severity: 'warning', category: 'quality' });
  }
  if (gcPercent <= 30) {
    found.push({ label: 'Low GC (' + gcPercent + '%)', severity: 'warning', category: 'quality' });
  }

  var stops = (clean.match(/TAA|TAG|TGA/g) || []).length;
  if (stops > 2) {
    found.push({ label: stops + ' stop codons', severity: 'warning', category: 'quality' });
  }

  if (clean.length >= 300) {
    found.push({ label: '\u2265300 nt', severity: 'neutral', category: 'quality' });
  }
  if (clean.length < 20) {
    found.push({ label: 'Short sequence', severity: 'warning', category: 'quality' });
  }

  return found;
}

// ── Restriction Enzyme Cleavage Catalog & In Silico Digest ──
var RESTRICTION_ENZYMES = [
  { id: 'EcoRI',  name: 'EcoRI',  pattern: 'GAATTC',   cutOffset: 1, overhang: "5' AATT" },
  { id: 'BamHI',  name: 'BamHI',  pattern: 'GGATCC',   cutOffset: 1, overhang: "5' GATC" },
  { id: 'HindIII',name: 'HindIII',pattern: 'AAGCTT',   cutOffset: 1, overhang: "5' AGCT" },
  { id: 'NotI',   name: 'NotI',   pattern: 'GCGGCCGC', cutOffset: 2, overhang: "5' GGCC" },
  { id: 'XhoI',   name: 'XhoI',   pattern: 'CTCGAG',   cutOffset: 1, overhang: "5' TCGA" },
  { id: 'PstI',   name: 'PstI',   pattern: 'CTGCAG',   cutOffset: 5, overhang: "3' TGCA" },
  { id: 'NdeI',   name: 'NdeI',   pattern: 'CATATG',   cutOffset: 2, overhang: "5' TATG" },
  { id: 'BglII',  name: 'BglII',  pattern: 'AGATCT',   cutOffset: 1, overhang: "5' GATC" }
];

function digestSequence(seq, selectedEnzymes) {
  var clean = seq.toUpperCase().replace(/U/g, 'T');
  var cuts = []; // array of 1-indexed cut positions
  var siteDetails = [];

  var enzymes = selectedEnzymes || RESTRICTION_ENZYMES;
  for (var e = 0; e < enzymes.length; e++) {
    var enz = enzymes[e];
    var re = new RegExp(enz.pattern, 'g');
    var match;
    while ((match = re.exec(clean)) !== null) {
      var cutPos = match.index + enz.cutOffset;
      cuts.push(cutPos);
      siteDetails.push({
        enzyme:     enz.name,
        cutPos:     cutPos,
        matchStart: match.index + 1,
        matchEnd:   match.index + match[0].length,
        sequence:   match[0],
        overhang:   enz.overhang
      });
      if (match.index === re.lastIndex) re.lastIndex++;
    }
  }

  // Deduplicate and sort cut positions
  cuts.sort(function(a, b) { return a - b; });
  var uniqueCuts = [];
  for (var i = 0; i < cuts.length; i++) {
    if (i === 0 || cuts[i] !== cuts[i - 1]) uniqueCuts.push(cuts[i]);
  }

  // Calculate fragment sizes
  var fragments = [];
  var prev = 0;
  for (var j = 0; j < uniqueCuts.length; j++) {
    var size = uniqueCuts[j] - prev;
    if (size > 0) fragments.push({ size: size, start: prev + 1, end: uniqueCuts[j] });
    prev = uniqueCuts[j];
  }
  var lastSize = clean.length - prev;
  if (lastSize > 0) {
    fragments.push({ size: lastSize, start: prev + 1, end: clean.length });
  }

  fragments.sort(function(a, b) { return b.size - a.size; });

  return {
    cuts: uniqueCuts,
    sites: siteDetails,
    fragments: fragments,
    totalCuts: uniqueCuts.length
  };
}

// ── Colorized Sequence HTML with Coordinates ──
function colorizeSeq(seq) {
  var buf = [];
  var lineLen = 60;
  for (var i = 0; i < seq.length; i++) {
    if (i % lineLen === 0) {
      if (i > 0) buf.push('\n');
      var lineNum = (i + 1).toString();
      while (lineNum.length < 5) lineNum = ' ' + lineNum;
      buf.push('<span class="seq-coord">' + lineNum + ' </span> ');
    } else if (i % 10 === 0) {
      buf.push(' ');
    }
    var c = seq[i];
    buf.push('<span class="nt-' + c + '" data-pos="' + (i + 1) + '">' + c + '</span>');
  }
  return buf.join('');
}

// ── Exports ──
if (typeof module !== 'undefined') {
  module.exports = {
    CODON_TABLE: CODON_TABLE,
    AMINO_ACID_3_LETTER: AMINO_ACID_3_LETTER,
    RESTRICTION_ENZYMES: RESTRICTION_ENZYMES,
    translateCodons: translateCodons,
    proteinMolecularWeight: proteinMolecularWeight,
    estimateProteinPI: estimateProteinPI,
    findORFs: findORFs,
    scanMotifs: scanMotifs,
    digestSequence: digestSequence,
    colorizeSeq: colorizeSeq
  };
}
