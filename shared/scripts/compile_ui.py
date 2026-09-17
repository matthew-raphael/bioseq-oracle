#!/usr/bin/env python3
"""
BioSeq Oracle — UI Compiler (Python 3)
Shared mechanical script for Stage 4: UI Assembly

Reads all pipeline outputs and templates, then compiles them into
a single self-contained bioseq-oracle.html file.
Works 100% offline with zero external dependencies.

Usage:
  python3 shared/scripts/compile_ui.py
"""

import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def read_file(rel_path):
    full_path = os.path.join(ROOT, rel_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        return f.read()

def clean_js_exports(js_code):
    # Strip Node.js module.exports blocks for browser embedding
    return re.sub(r'// ── Export[\s\S]*$', '', js_code, flags=re.MULTILINE).strip()

def compile_html():
    print("Compiling BioSeq Oracle UI...")

    template     = read_file('shared/templates/viewer_template.html')
    design_css   = read_file('_config/design_system.css')
    motifs_json  = read_file('_config/motifs.json')
    profiler_js  = read_file('shared/scripts/bio_profiler.js')
    scanner_js   = read_file('shared/scripts/orf_scanner.js')
    synthesis_js = read_file('shared/scripts/synthesis_engine.js')

    html = template
    html = html.replace('/* {{DESIGN_SYSTEM_CSS}} */', design_css)
    html = html.replace('/* {{MOTIFS_JSON}} */', f'const MOTIF_DEFS = {motifs_json.strip()};')
    html = html.replace('/* {{BIO_PROFILER_JS}} */', clean_js_exports(profiler_js))
    html = html.replace('/* {{ORF_SCANNER_JS}} */', clean_js_exports(scanner_js))
    html = html.replace('/* {{SYNTHESIS_ENGINE_JS}} */', clean_js_exports(synthesis_js))

    out_dir = os.path.join(ROOT, 'stages', '04_ui_assembly', 'output')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'bioseq-oracle.html')

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = len(html.encode('utf-8')) / 1024.0
    print(f"✓ Compiled successfully → {out_path}")
    print(f"  Artifact Size: {size_kb:.1f} KB")
    return out_path

if __name__ == '__main__':
    compile_html()
