# YUCA questionnaires on Open Data Capture

A static demonstration site that gives the YUCA questionnaires step by step,
as a real [Open Data Capture](https://opendatacapture.org) (ODC) deployment
would. The questionnaires are ODC form instruments, joined in one ODC series
instrument. The site uses the ODC form renderer (`@opendatacapture/react-core`).

The site does not store or send data. After each questionnaire, it shows the
answers and the scores in the browser only.

## Questionnaires

The series gives them in this order (`instruments/series/YUCA_SERIES/items.ts`).
The source PDFs are not in the repository, because of copyright.

| # | Instrument | Directory | Source |
|---|---|---|---|
| 1 | PHQ-9 | `PHQ_9` | ODC_Instruments (reused) |
| 2 | GAD-7 | `GAD_7` | ODC_Instruments (reused) |
| 3 | PQ-B | `PQ_B` | `PQ-B.pdf` |
| 4 | WHODAS 2.0, 12 items | `WHODAS_2_12` | `WHODAS2.0_12itemsSELF.pdf` |
| 5 | SIDAS | `SIDAS` | ODC_Instruments (reused, scoring fix) |
| 6 | WHO ASSIST v3.0 | `WHO_ASSIST_V3` | `WHO-ASSIST.pdf` |
| 7 | Revised UCLA Loneliness Scale | `UCLA_LONELINESS_SCALE` | `ucla-loneliness-scale-sample.pdf` |
| 8 | PSYCHLOPS (pre-therapy) | `PSYCHLOPS_PRE` | `psychlops-pre-therapy.pdf` |
| 9 | G-SAS | `G_SAS` | `G-SAS.pdf` |
| 10 | Sleep Health Index | `SLEEP_HEALTH_INDEX` | `SHI.pdf` |
| 11 | Insomnia Severity Index | `ISI` | `Insomnia Severity Index (ISI).pdf` |
| 12 | IPAQ short form | `IPAQ_SF` | `IPAQ-TM.pdf` |
| 13 | WHO-5 | `WHO_5` | `who-5_english-original.pdf` |
| 14 | Additional questions | `YUCA_ADDITIONAL_QUESTIONS` | `Additional_questions_and_notes.md` |

## Languages

The site has an English series and a Spanish series. ODC instruments can only
hold English and French text. Thus each instrument has one source file with
`t({ en, es })` text, and the build makes an English bundle and a Spanish
bundle from it. The Spanish text is a machine translation, not a validated
version. See `instruments/README.md`.

## Routes

- `#/` — start page
- `#/en`, `#/es` — the full series
- `#/en/<DIRECTORY>`, `#/es/<DIRECTORY>` — one questionnaire, for example `#/en/PHQ_9`

## Build

Requirements: Node.js 24 or later, pnpm 10, git, rsync.

```sh
scripts/build.sh check   # type-check and bundle every instrument
scripts/build.sh build   # build the site into dist/
scripts/build.sh dev     # vite dev server
```

`@opendatacapture/react-core` is not published on npm. Thus `scripts/build.sh`
gets the OpenDataCapture repository at a pinned commit into `.odc/`, copies
`site/` into it as a workspace app, and builds there. The pinned commit is
after v2.5.2, because v2.5.2 has no Spanish interface text. Set `ODC_REF` to
use a different commit.

The site is served under `/yuca-vibe-experiment/` by default. Set `SITE_BASE`
for a different path. To preview a build locally:

```sh
mkdir -p /var/tmp/yuca-serve && ln -sfn "$PWD/dist" /var/tmp/yuca-serve/yuca-vibe-experiment
python3 -m http.server -d /var/tmp/yuca-serve 8765
# open http://127.0.0.1:8765/yuca-vibe-experiment/
```

## Deploy

`.github/workflows/pages.yml` builds the site and deploys it to GitHub Pages
on each push to `main`. In the repository settings, set
**Pages → Build and deployment → Source** to **GitHub Actions**.

## Known limitations

- The Spanish summary page shows "Idioma: Inglés", because each instrument is
  declared as English (see Languages).
- ODC shows number options in ascending order with the number before the
  label. For this reason WHO-5 shows 0 to 5, while the PDF shows 5 to 0.
- PHQ-9, GAD-7 and SIDAS are the ODC_Instruments versions, with their small
  wording differences from the PDFs. GAD-7 has an optional "difficulty" item
  that the supplied PDF does not have. The SIDAS scale anchors are in the
  help (?) popover.
- G-SAS has no severity bands, and the Sleep Health Index has no composite
  score, because the PDFs do not give them.
- The total printed on the UCLA sample PDF does not agree with its own scoring
  key. The form uses the key (items 1, 5, 6, 9, 10, 15, 16, 19 and 20 reversed).

## Copyright

Some questionnaires are copyrighted (for example the Sleep Health Index,
PSYCHLOPS, PQ-B and WHODAS 2.0). Each instrument has its copyright notice in
its description. Make sure that you have permission before you publish them.
