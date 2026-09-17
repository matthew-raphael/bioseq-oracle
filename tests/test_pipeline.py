#!/usr/bin/env python3
"""
BioSeq Oracle — Automated Quality Assurance & Test Suite
Validates bioinformatics algorithms, stage contracts, and pipeline end-to-end.
"""

import json
import os
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.join(ROOT, 'shared', 'scripts'))

from pipeline import (
    clean_sequence,
    detect_molecule_type,
    calculate_gc_content,
    calculate_molecular_weight,
    estimate_tm,
    translate_codons,
    calculate_protein_mw,
    estimate_pi,
    find_orfs_6_frames,
    scan_motifs_catalog,
    run_stage_1,
    run_stage_2,
    run_stage_3,
    run_pipeline,
    BENCHMARKS
)

class TestBioProfiler(unittest.TestCase):
    def test_clean_sequence_fasta(self):
        raw = ">NM_000207.3 Homo sapiens insulin (INS)\nATGGGCAGCCCCCGCC\nCAGCCCTGCTTCTGGT\n"
        cleaned = clean_sequence(raw)
        self.assertEqual(cleaned, "ATGGGCAGCCCCCGCCCAGCCCTGCTTCTGGT")

    def test_clean_sequence_dirty_input(self):
        raw = " \n atg 123 \t ccc \r\n ggg!@# uuu "
        cleaned = clean_sequence(raw)
        self.assertEqual(cleaned, "ATGCCCGGGUUU")

    def test_detect_molecule_type(self):
        self.assertEqual(detect_molecule_type("ATGC"), "DNA")
        self.assertEqual(detect_molecule_type("AUGC"), "RNA")
        self.assertEqual(detect_molecule_type("ACGC"), "DNA/RNA")
        self.assertEqual(detect_molecule_type("ATGCU"), "Mixed")

    def test_gc_content_calculation(self):
        self.assertEqual(calculate_gc_content("GCGC"), 100.0)
        self.assertEqual(calculate_gc_content("ATAT"), 0.0)
        self.assertEqual(calculate_gc_content("ATGC"), 50.0)

    def test_molecular_weight(self):
        # DNA: 100 nt * 324.5 / 1000 = 32.5 kDa
        self.assertEqual(calculate_molecular_weight("A" * 100), 32.5)
        # RNA: 100 nt * 340.0 / 1000 = 34.0 kDa
        self.assertEqual(calculate_molecular_weight("U" * 100), 34.0)

    def test_tm_estimation(self):
        # Short sequence (<20 nt) Wallace rule: 2*(A+T) + 4*(G+C)
        short = "ATGC" # 2 A/T, 2 G/C -> 2*2 + 4*2 = 12
        self.assertEqual(estimate_tm(short), 12)
        # Long sequence (>=20 nt) Marmur-Doty formula
        long_seq = "G" * 30
        tm = estimate_tm(long_seq)
        self.assertTrue(tm > 70.0)

class TestORFScannerAndTranslation(unittest.TestCase):
    def test_translate_codons(self):
        dna = "ATGAAACCCGGGTAG"
        peptide = translate_codons(dna)
        self.assertEqual(peptide, "MKPG")

    def test_protein_mw_and_pi(self):
        peptide = "MKPG"
        mw = calculate_protein_mw(peptide)
        self.assertTrue(300 < mw < 600)
        pi = estimate_pi(peptide)
        self.assertTrue(8.0 < pi < 11.0) # Lysine makes it basic

    def test_insulin_orf_detection(self):
        ins = BENCHMARKS['insulin']
        orfs = find_orfs_6_frames(ins)
        self.assertTrue(len(orfs) >= 1)
        top = orfs[0]
        self.assertEqual(top['frame'], '+1')
        self.assertEqual(top['start'], 1)
        self.assertTrue(top['peptide'].startswith("MGSPRPALLL"))

    def test_reverse_strand_orf(self):
        # A sequence whose reverse complement has ATG ... TAA (in frame)
        # Fwd: TTA + T*18 + CAT -> RevComp: ATG + A*18 + TAA
        fwd_dna = "TTATTTTTTTTTTTTTTTTTTCAT"
        orfs = find_orfs_6_frames(fwd_dna, min_len=15)
        rev_orfs = [o for o in orfs if o['strand'] == '-']
        self.assertTrue(len(rev_orfs) >= 1)
        self.assertEqual(rev_orfs[0]['frame'], '-1')
        self.assertEqual(rev_orfs[0]['peptide'], 'MKKKKKK')

class TestMotifScanner(unittest.TestCase):
    def test_tata_and_hindiii_motifs(self):
        tata_seq = BENCHMARKS['tata']
        motifs = scan_motifs_catalog(tata_seq, 50.0)
        labels = [m['label'] for m in motifs]
        self.assertIn("TATA box", labels)
        self.assertIn("HindIII site", labels)

class TestBiologicalSynthesis(unittest.TestCase):
    def test_insulin_synthesis_archetype(self):
        clean, profile = run_stage_1(BENCHMARKS['insulin'])
        orfs, motifs = run_stage_2(clean, profile)
        report = run_stage_3(clean, profile, orfs, motifs)
        self.assertIn("Preproinsulin", report['moleculeType'])
        self.assertTrue(len(report['analysis']) > 50)

    def test_p53_synthesis_archetype(self):
        clean, profile = run_stage_1(BENCHMARKS['p53'])
        orfs, motifs = run_stage_2(clean, profile)
        report = run_stage_3(clean, profile, orfs, motifs)
        self.assertIn("TP53", report['moleculeType'])

    def test_novel_sequence_heuristic_synthesis(self):
        novel = "ATG" + "GCT" * 25 + "TAA"
        clean, profile = run_stage_1(novel)
        orfs, motifs = run_stage_2(clean, profile)
        report = run_stage_3(clean, profile, orfs, motifs)
        self.assertIn("Protein-Coding", report['moleculeType'])
        self.assertTrue(len(report['analysis']) > 50)

class TestPipelineEndToEnd(unittest.TestCase):
    def test_full_pipeline_run(self):
        result = run_pipeline(BENCHMARKS['insulin'], compile_ui_flag=True)
        self.assertIn('profile', result)
        self.assertIn('orfs', result)
        self.assertIn('motifs', result)
        self.assertIn('synthesis', result)
        self.assertIsNotNone(result['html'])
        self.assertTrue(os.path.exists(result['html']))
        self.assertTrue(os.path.getsize(result['html']) > 50000)

if __name__ == '__main__':
    unittest.main()
