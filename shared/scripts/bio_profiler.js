/**
 * BioSeq Oracle — Bio Profiler
 * Shared mechanical script for Stage 1: Ingest & Profile
 *
 * Deterministic functions — no AI reasoning required.
 * Reads: raw sequence input (raw string or FASTA formatted)
 * Writes: clean.fasta, profile.json → stages/01_ingest_profile/output/
 */

// ── Sequence Cleaning ──
// Strips FASTA header lines (starting with >), whitespace, numbers, and invalid characters
function cleanSeq(raw) {
  if (!raw) return '';
  // Remove FASTA comments/headers: lines starting with >
  var lines = raw.split(/\r?\n/);
  var seqLines = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.length > 0 && line.charAt(0) !== '>') {
      seqLines.push(line);
    }
  }
  var combined = seqLines.length ? seqLines.join('') : raw;
  return combined.toUpperCase().replace(/[^ATGCUN]/g, '');
}

// ── Molecule Type Detection ──
function detectMolType(seq) {
  var hasU = /U/.test(seq);
  var hasT = /T/.test(seq);
  if (hasU && !hasT) return 'RNA';
  if (hasT && !hasU) return 'DNA';
  if (!hasU && !hasT) return 'DNA/RNA';
  return 'Mixed';
}

// ── GC Content (%) ──
function gcContent(seq) {
  if (!seq.length) return 0;
  var gc = (seq.match(/[GC]/g) || []).length;
  return Math.round((gc / seq.length) * 1000) / 10;
}

// ── Base Composition Breakdown ──
function baseComposition(seq) {
  var len = seq.length || 1;
  var counts = { A: 0, T: 0, G: 0, C: 0, U: 0, N: 0 };
  for (var i = 0; i < seq.length; i++) {
    var c = seq[i];
    if (counts[c] !== undefined) counts[c]++;
    else counts.N++;
  }
  return {
    A: { count: counts.A, percent: Math.round((counts.A / len) * 1000) / 10 },
    T: { count: counts.T, percent: Math.round((counts.T / len) * 1000) / 10 },
    G: { count: counts.G, percent: Math.round((counts.G / len) * 1000) / 10 },
    C: { count: counts.C, percent: Math.round((counts.C / len) * 1000) / 10 },
    U: { count: counts.U, percent: Math.round((counts.U / len) * 1000) / 10 },
    N: { count: counts.N, percent: Math.round((counts.N / len) * 1000) / 10 },
    purines: counts.A + counts.G,
    pyrimidines: counts.T + counts.C + counts.U
  };
}

// ── Molecular Weight (kDa) ──
function molecularWeight(seq) {
  var avgMW = /U/.test(seq) && !/T/.test(seq) ? 340 : 324.5;
  return Math.round((seq.length * avgMW) / 1000 * 10) / 10;
}

// ── Melting Temperature Estimation (Empirical: Wallace & Marmur-Doty) ──
function estimateTm(seq) {
  var gcCount = (seq.match(/[GC]/g) || []).length;
  var atCount = (seq.match(/[ATU]/g) || []).length;
  if (seq.length < 20) {
    return 2 * atCount + 4 * gcCount;
  }
  return Math.round((64.9 + 41 * (gcCount - 16.4) / seq.length) * 10) / 10;
}

// ── Nearest-Neighbor Thermodynamics (SantaLucia 1998 Unified Model) ──
// Returns Tm in °C with 50mM Na+ and 250nM primer concentration
function nearestNeighborTm(seq, naConc, primerConc) {
  var dna = seq.replace(/U/g, 'T');
  if (dna.length < 4) return estimateTm(seq);
  naConc = naConc || 0.050; // 50 mM
  primerConc = primerConc || 0.00000025; // 250 nM

  // SantaLucia (1998) Unified parameters: dH (kcal/mol), dS (cal/mol·K)
  var NN = {
    'AA': { dH: -7.6, dS: -21.3 }, 'TT': { dH: -7.6, dS: -21.3 },
    'AT': { dH: -7.2, dS: -20.4 }, 'TA': { dH: -7.2, dS: -21.3 },
    'CA': { dH: -8.5, dS: -22.7 }, 'TG': { dH: -8.5, dS: -22.7 },
    'GT': { dH: -8.4, dS: -22.4 }, 'AC': { dH: -8.4, dS: -22.4 },
    'CT': { dH: -7.8, dS: -21.0 }, 'AG': { dH: -7.8, dS: -21.0 },
    'GA': { dH: -8.2, dS: -22.2 }, 'TC': { dH: -8.2, dS: -22.2 },
    'CG': { dH: -10.6, dS: -27.2 }, 'GC': { dH: -9.8, dS: -24.4 },
    'GG': { dH: -8.0, dS: -19.9 }, 'CC': { dH: -8.0, dS: -19.9 }
  };

  var dH = 0.2; // initiation penalty
  var dS = -5.7;

  // Terminal initiation penalties
  var first = dna[0];
  var last = dna[dna.length - 1];
  if (first === 'G' || first === 'C') { dH += 0.1; dS += -2.8; }
  else { dH += 2.3; dS += 4.1; }
  if (last === 'G' || last === 'C') { dH += 0.1; dS += -2.8; }
  else { dH += 2.3; dS += 4.1; }

  for (var i = 0; i < dna.length - 1; i++) {
    var doublet = dna.slice(i, i + 2);
    if (NN[doublet]) {
      dH += NN[doublet].dH;
      dS += NN[doublet].dS;
    } else {
      dH += -8.0;
      dS += -22.0;
    }
  }

  // Salt correction for dS (SantaLucia 1998)
  dS += 0.368 * (dna.length - 1) * Math.log(naConc);

  var R = 1.9872; // gas constant cal/(mol·K)
  var tmK = (1000 * dH) / (dS + R * Math.log(primerConc / 4));
  var tmC = tmK - 273.15;
  return Math.round(tmC * 10) / 10;
}

// ── Reverse Complement ──
function reverseComplement(seq) {
  var complement = {
    'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
    'U': 'A', 'N': 'N',
    'a': 't', 't': 'a', 'g': 'c', 'c': 'g', 'u': 'a', 'n': 'n'
  };
  var rc = [];
  for (var i = seq.length - 1; i >= 0; i--) {
    var char = seq[i];
    rc.push(complement[char] || 'N');
  }
  return rc.join('');
}

// ── Sliding Window GC Content & GC Skew ──
// GC Skew = (G - C) / (G + C), diagnostic of replication origins (oriC)
function calculateSlidingGC(seq, windowSize, step) {
  windowSize = windowSize || Math.max(15, Math.min(60, Math.floor(seq.length / 10)));
  step = step || Math.max(1, Math.floor(windowSize / 3));
  var points = [];

  for (var i = 0; i + windowSize <= seq.length; i += step) {
    var sub = seq.slice(i, i + windowSize);
    var g = (sub.match(/G/g) || []).length;
    var c = (sub.match(/C/g) || []).length;
    var gc = g + c;
    var pct = Math.round((gc / windowSize) * 1000) / 10;
    var skew = (gc > 0) ? Math.round(((g - c) / gc) * 1000) / 1000 : 0;
    points.push({
      start: i + 1,
      center: Math.floor(i + windowSize / 2) + 1,
      end: i + windowSize,
      gcPercent: pct,
      gcSkew: skew
    });
  }
  return points;
}

// ── Build Profile Object ──
function buildProfile(seq) {
  return {
    length:          seq.length,
    gcPercent:       gcContent(seq),
    moleculeType:    detectMolType(seq),
    codons:          Math.floor(seq.length / 3),
    mwKDa:           molecularWeight(seq),
    tmEstimate:      estimateTm(seq),
    tmNearestNeighbor: (seq.length >= 8 && seq.length <= 1000) ? nearestNeighborTm(seq) : estimateTm(seq),
    composition:     baseComposition(seq)
  };
}

// ── Exports (for use in compile_ui.js, pipeline.py or browser) ──
if (typeof module !== 'undefined') {
  module.exports = {
    cleanSeq,
    detectMolType,
    gcContent,
    baseComposition,
    molecularWeight,
    estimateTm,
    nearestNeighborTm,
    reverseComplement,
    calculateSlidingGC,
    buildProfile
  };
}
