# Instruments

Open Data Capture (ODC) instruments for the YUCA demonstration site.

- `forms/<NAME>/` — one FORM instrument per directory.
- `series/YUCA_SERIES/` — the series instrument. `items.ts` sets the order of
  the forms in the series.
- `lang.ts` — the language helper. Each instrument directory has an identical
  copy, because the ODC bundler only resolves files in the same directory.

## Rules for each instrument

1. The directory contains `index.ts` and a copy of `../../lang.ts`. Do not
   change `lang.ts`.
2. Import local files with the `.ts` extension: `import { t } from './lang.ts';`.
   The ODC bundler cannot resolve `./lang`.
3. Set `language: 'en'`. ODC instruments can only hold `en` and `fr` text, so
   each instrument is declared as English and every text value is written as
   `t({ en: '...', es: '...' })`. The site build replaces `LANG` in `lang.ts`
   to make a Spanish bundle. Do not use `{ en, fr }` objects.
4. Write Spanish for every text that the participant sees: titles,
   descriptions, instructions, labels, option text, and measure labels. The
   Spanish is a machine translation (not a validated version), so make it
   neutral Latin American Spanish.
5. Set `internal: { name: '<DIRECTORY_NAME>', edition: 1 }`. The name must be
   the same as the directory name and the entry in `series/YUCA_SERIES/items.ts`.
6. Use `license: 'UNLICENSED'` for copyrighted instruments and put the
   copyright notice from the PDF in `details.description` (or the
   instructions). Use `license: 'PUBLIC-DOMAIN'` only when the source says so.
7. Keep the item wording and the response options exactly as in the PDF.
8. Add `measures` for the scores that the PDF defines (totals, subscales,
   reverse-scored items). Add a `const` measure for each item only when it is
   useful.
9. Use a `validationSchema` (zod 3, from `/runtime/v1/zod@3.x`) that matches
   the data exactly. Optional fields must be `.optional()`.
10. Use `kind: 'dynamic'` fields for skip logic (return `null` to hide a
    field). Hidden fields must be optional in the validation schema.

`forms/WHO_5/index.ts` is the reference example.

The full ODC authoring guide is at
`.odc/packages/instrument-guidelines/AGENTS.md` after you run
`scripts/build.sh`.

## Check

```sh
scripts/build.sh check   # type-check all instruments and bundle the series
```
