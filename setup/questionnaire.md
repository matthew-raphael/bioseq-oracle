# Setup Questionnaire

> Configuration preferences for BioSeq Oracle workspace

---

## Runtime Configuration

| Setting                  | Default    | Options                        |
| :----------------------- | :--------- | :----------------------------- |
| Engine mode              | Anti-Gravity Native | Anti-Gravity Native (offline) |
| External API fallback    | Disabled   | Disabled / Enabled             |
| Maximum sequence length  | 5,000 nt   | Configurable in `_config/thresholds.md` |
| Minimum ORF length       | 15 nt      | Configurable in `_config/thresholds.md` |
| Max ORFs reported        | 6          | Configurable in `_config/thresholds.md` |

---

## Customization Options

1. **Add custom motifs**: Edit `_config/motifs.json` to add new regex patterns
2. **Add gene archetypes**: Edit `stages/03_biological_synthesis/references/gene_archetypes.md`
3. **Adjust thresholds**: Edit `_config/thresholds.md`
4. **Modify color scheme**: Edit `_config/design_system.css`

---

## Notes

- All analysis runs client-side with zero external dependencies
- No API key is needed for any functionality
- The workspace is designed for Anti-Gravity agentic operation
