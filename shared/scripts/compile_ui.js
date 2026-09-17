/**
 * BioSeq Oracle — UI Compiler
 * Shared mechanical script for Stage 4: UI Assembly
 *
 * Reads all pipeline outputs and templates, then compiles them into
 * a single self-contained bioseq-oracle.html file.
 *
 * Usage (Node.js):
 *   node shared/scripts/compile_ui.js
 *
 * Reads from:
 *   - shared/templates/viewer_template.html
 *   - _config/design_system.css
 *   - _config/motifs.json
 *   - shared/scripts/bio_profiler.js
 *   - shared/scripts/orf_scanner.js
 *   - shared/scripts/synthesis_engine.js
 *
 * Writes to:
 *   - stages/04_ui_assembly/output/bioseq-oracle.html
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

function compile() {
  console.log('Compiling BioSeq Oracle...');

  // Load components
  const template    = readFile('shared/templates/viewer_template.html');
  const designCSS   = readFile('_config/design_system.css');
  const motifsJSON  = readFile('_config/motifs.json');
  const profilerJS  = readFile('shared/scripts/bio_profiler.js');
  const scannerJS   = readFile('shared/scripts/orf_scanner.js');
  const synthesisJS = readFile('shared/scripts/synthesis_engine.js');

  // Strip Node.js module.exports lines for browser embedding
  const cleanJS = (js) => js.replace(/\/\/ ── Export[\s\S]*$/m, '').trim();

  // Assemble the final HTML by replacing template placeholders
  let html = template;
  html = html.replace('/* {{DESIGN_SYSTEM_CSS}} */',   designCSS);
  html = html.replace('/* {{MOTIFS_JSON}} */',          'const MOTIF_DEFS = ' + motifsJSON.trim() + ';');
  html = html.replace('/* {{BIO_PROFILER_JS}} */',      cleanJS(profilerJS));
  html = html.replace('/* {{ORF_SCANNER_JS}} */',       cleanJS(scannerJS));
  html = html.replace('/* {{SYNTHESIS_ENGINE_JS}} */',  cleanJS(synthesisJS));

  // Write output
  const outDir  = path.join(ROOT, 'stages', '04_ui_assembly', 'output');
  const outPath = path.join(outDir, 'bioseq-oracle.html');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');

  console.log('✓ Compiled → ' + outPath);
  console.log('  Size: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
}

compile();
