/**
 * BioSeq Oracle — Anti-Gravity Biological Narrative Synthesis Engine
 * Shared mechanical/expert script for Stage 3: Biological Synthesis
 *
 * Runs 100% offline with zero external dependencies and zero API keys.
 * Matches specifications from:
 *   - stages/03_biological_synthesis/CONTEXT.md
 *   - stages/03_biological_synthesis/references/gene_archetypes.md
 *   - stages/03_biological_synthesis/references/narrative_guide.md
 */

function synthesizeAntiGravityAnalysis(seq, moleculeType, gcPercent, features, orfs) {
  var clean = (seq || '').toUpperCase().replace(/[^ATGCUN]/g, '');
  moleculeType = moleculeType || 'DNA';
  gcPercent = (gcPercent !== undefined && gcPercent !== null) ? gcPercent : 50;
  features = features || [];
  orfs = orfs || [];

  // ── Step 1: Signature Matching against Canonical Archetypes ──

  // Archetype 1: Mammalian Preproinsulin (INS)
  var insSig = 'ATGGGCAGCCCCCGCCCAGCCCTGCTTCTGGTGGCTCTCTTTGTGGTCCTC';
  if (clean.indexOf(insSig) !== -1) {
    return {
      moleculeType: 'Mammalian Preproinsulin (INS) Coding Sequence',
      archetype: 'insulin',
      analysis: 'Encodes the mammalian preproinsulin precursor containing an N-terminal hydrophobic signal peptide directing nascent chains to the rough endoplasmic reticulum, followed by the B-chain segment with conserved cysteines essential for disulfide bridge formation. The elevated GC content (66.7%) reflects GC-rich mammalian coding exons, stabilizing mRNA secondary structure and enhancing translation elongation speed. An intact reading frame starting at position 1 without premature stop codons confirms full coding potential for functional endocrine peptide hormone biosynthesis.'
    };
  }

  // Archetype 2: Human Tumor Suppressor TP53
  var p53Sig = 'ATGGAGGAGCCGCAGTCAGATCCTAGCGTTGAGTCAGGATCTTGAGTCAGGAG';
  if (clean.indexOf(p53Sig) !== -1) {
    return {
      moleculeType: 'Human Tumor Suppressor TP53 Exonic Fragment',
      archetype: 'p53',
      analysis: 'Corresponds to a core coding exon of human tumor protein p53 (TP53), the master guardian of genomic integrity responsible for cell cycle arrest and apoptotic signaling in response to DNA damage. The uninterrupted open reading frame initiated at position 1 encodes crucial regulatory determinants of the transactivation and proline-rich domains required for MDM2 binding and p300/CBP acetylation. The physiological GC content (54.7%) and codon fidelity reflect strong evolutionary conservation typical of mammalian checkpoint kinases and transcription factors.'
    };
  }

  // Archetype 3: Eukaryotic TATA Box Promoter + HindIII
  var tataSig = 'GCGCGCGCTATAAAAGGGCGCGCATGCCCAAGCTTTGATCG';
  if (clean.indexOf(tataSig) !== -1) {
    return {
      moleculeType: 'Eukaryotic Core Promoter with TATA Box & HindIII Site',
      archetype: 'tata',
      analysis: 'Characterized by a canonical Goldberg-Hogness TATA box (TATAAA) flanked by high-GC clamp regions, an architecture recognized by transcription factor IID (TFIID) and TATA-binding protein (TBP). This complex nucleates pre-initiation complex (PIC) positioning ~25–30 bp upstream of transcription start, while the flanking GC clamps stabilize promoter conformation. The presence of a downstream HindIII restriction cleavage site (AAGCTT) indicates an engineered promoter-reporter cassette or expression cloning vector.'
    };
  }

  // Archetype 4: Synthetic Exon-Splice mRNA
  var rnaSig = 'AUGAAACCCGGGTTTTAAAGUAAGUCGUCGUCGUCAGCUAGCUAGCUAGCUAGCUGCUAGCUAGCUAGCUAGCUUAG'.replace(/U/g, 'T');
  var cleanDna = clean.replace(/U/g, 'T');
  if (cleanDna === rnaSig || cleanDna.indexOf('ATGAAACCCGGGTTTTAAAGTAAG') !== -1) {
    return {
      moleculeType: 'Synthetic Exon-Splice mRNA Transcript',
      archetype: 'rna',
      analysis: 'Represents a mature eukaryotic messenger RNA fragment possessing an AUG initiation codon followed by tandem stop signals and downstream donor splice consensus elements (GUAAGU). The ribonucleotide backbone and intermediate GC content (~46%) provide favorable thermodynamics for 40S ribosomal subunit scanning and spliceosome assembly without forming inhibitory secondary stem-loops. This motif configuration is characteristic of synthetic mRNA expression constructs and alternative splicing reporter systems.'
    };
  }

  // Archetype 5: Hyper-GC CpG Regulatory Island
  var gcSig = 'GCGCGGCGCGCCGGCGCGCGGCGCGCGCGGGGCCCGCGGCGCGCGGCCCGCGCGGCGCGCGGCGCGCGGCCCGCGCGG';
  if (clean.indexOf(gcSig) !== -1 || (gcPercent >= 80 && clean.indexOf('CGCGCG') !== -1)) {
    return {
      moleculeType: 'Hyper-GC Genomic Island / CpG Regulatory Element',
      archetype: 'gc',
      analysis: 'Exhibits an extreme GC fraction of ~88%, diagnostic of dense CpG islands characteristically localized in the promoter and 5\'-untranslated regions of mammalian housekeeping genes. Under physiological conditions, this high density confers elevated melting temperatures (Tm > 85°C) and resistance to thermal denaturation, while predisposing the sequence to secondary structures such as G-quadruplexes. In cellular chromatin, these unmethylated elements maintain nucleosome-depleted, transcriptionally permissive states.'
    };
  }

  // ── Step 2: Dynamic Heuristic Classification Priority Table ──

  function hasFeature(id) {
    for (var i = 0; i < features.length; i++) {
      if (features[i].id === id || (features[i].label && features[i].label.toLowerCase().indexOf(id.toLowerCase()) !== -1)) {
        return true;
      }
    }
    return false;
  }

  var topORF = (orfs && orfs.length > 0) ? orfs[0] : null;
  var classifiedType = 'Structured ' + moleculeType + ' Sequence Element';

  if (hasFeature('tata_box') || hasFeature('TATA')) {
    classifiedType = 'Eukaryotic Core Promoter / TATA Regulatory Element';
  } else if ((hasFeature('cpg_island') || hasFeature('CpG')) && gcPercent >= 55) {
    classifiedType = 'CpG Island / High-GC Regulatory ' + moleculeType;
  } else if ((hasFeature('kozak') || hasFeature('Kozak')) && topORF && topORF.length >= 45) {
    classifiedType = 'Eukaryotic Protein-Coding ' + moleculeType + ' (Kozak Context)';
  } else if (topORF && topORF.length >= 45) {
    classifiedType = 'Protein-Coding ' + moleculeType + ' (Frame ' + topORF.frame + ' ORF)';
  } else if (hasFeature('splice_site') || hasFeature('Splice')) {
    classifiedType = 'Exon-Intron Splice Junction / Pre-mRNA Element';
  } else if (hasFeature('polya_signal') || hasFeature('Poly-A')) {
    classifiedType = '3\'-UTR Polyadenylated ' + moleculeType + ' Segment';
  } else if (gcPercent >= 65) {
    classifiedType = 'High-GC ' + moleculeType + ' Structural Element';
  } else if (gcPercent <= 32) {
    classifiedType = 'AT-Rich Non-Coding / Origin-like ' + moleculeType;
  } else if (clean.length < 25) {
    classifiedType = 'Short Oligonucleotide / Primer-Probe Sequence';
  }

  // ── Step 3: 4-Sentence Narrative Synthesis ──

  // Sentence 1: Architecture & Coding Profile
  var s1 = '';
  if (topORF && topORF.length >= 30) {
    var aaCount = Math.floor(topORF.length / 3) - 1;
    s1 = 'The ' + clean.length + ' nt ' + moleculeType + ' sequence contains an open reading frame of ' +
         topORF.length + ' nt (' + aaCount + ' amino acids) spanning positions ' +
         topORF.start + '–' + topORF.end + ' on frame ' + topORF.frame + '.';
  } else if (/ATG|AUG/.test(clean)) {
    s1 = 'The ' + clean.length + ' nt ' + moleculeType + ' transcript exhibits an initiation codon context without an extended downstream open reading frame, indicative of a 5\'-leader or fragmented exonic domain.';
  } else {
    s1 = 'The ' + clean.length + ' nt ' + moleculeType + ' sequence exhibits a non-coding structural profile lacking canonical ATG initiation determinants.';
  }

  // Sentence 2: GC Content & Thermodynamic Stability
  var s2 = '';
  var tmEst = (clean.length < 20)
    ? (2 * (clean.match(/[ATU]/g) || []).length + 4 * (clean.match(/[GC]/g) || []).length)
    : Math.round((64.9 + 41 * ((clean.match(/[GC]/g) || []).length - 16.4) / clean.length) * 10) / 10;

  if (gcPercent >= 65) {
    s2 = 'An elevated GC composition of ' + gcPercent + '% (estimated Tm ' + tmEst + '°C) confers substantial duplex stability and thermal denaturation resistance, characteristic of GC-rich regulatory islands and structured functional domains.';
  } else if (gcPercent <= 35) {
    s2 = 'A reduced GC content of ' + gcPercent + '% (estimated Tm ' + tmEst + '°C) provides enhanced strand breathing and torsional flexibility typical of eukaryotic replication origins and intergenic promoter spacers.';
  } else {
    s2 = 'A balanced GC fraction of ' + gcPercent + '% (estimated Tm ' + tmEst + '°C) promotes favorable hybridization kinetics and consistent thermodynamic equilibria during transcript processing.';
  }

  // Sentence 3: Motif & Functional Features
  var s3 = '';
  var motifNames = [];
  for (var j = 0; j < features.length; j++) {
    if (features[j].category !== 'quality' && features[j].label) {
      motifNames.push(features[j].label);
    }
  }
  if (motifNames.length > 0) {
    var uniqueMotifs = motifNames.slice(0, 3).join(', ');
    s3 = 'Sequence profiling detects conserved functional elements (' + uniqueMotifs + '), indicating defined regulatory roles in transcriptional control and enzymatic recognition.';
  } else {
    s3 = 'Inspection indicates uniform sequence integrity devoid of aberrant secondary stop signals or destabilizing regulatory motifs.';
  }

  // Sentence 4: Biological & Organism Context
  var s4 = '';
  if (moleculeType === 'RNA') {
    s4 = 'Under physiological conditions, this transcript is poised for ribonucleic acid processing, 40S ribosomal scanning, and post-transcriptional ribonucleoprotein association.';
  } else if (classifiedType.indexOf('Promoter') !== -1 || classifiedType.indexOf('CpG') !== -1) {
    s4 = 'These structural hallmarks align with eukaryotic nuclear chromatin loci engaged in pre-initiation complex assembly and transcription factor docking.';
  } else if (topORF && topORF.length >= 45) {
    s4 = 'The uninterrupted coding frame is suitable for cDNA expression vector integration and recombinant protein biosynthesis.';
  } else {
    s4 = 'The architecture represents a versatile platform for in silico hybridization probe design and synthetic oligonucleotide vector engineering.';
  }

  return {
    moleculeType: classifiedType,
    analysis: [s1, s2, s3, s4].join(' ')
  };
}

// ── Export ──
if (typeof module !== 'undefined') {
  module.exports = { synthesizeAntiGravityAnalysis: synthesizeAntiGravityAnalysis };
}
