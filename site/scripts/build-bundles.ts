/**
 * Bundles every instrument in ../instruments once per language and writes one
 * SeriesInstrumentBundleContainer per language to public/bundles/<lang>.json.
 *
 * Each instrument directory has a `lang.ts` file. ODC instruments can only hold
 * 'en' and 'fr' text, so we make the Spanish bundle by replacing `lang.ts`
 * with a copy that selects the Spanish strings.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import { bundle, BUNDLER_FILE_EXT_REGEX, inferLoader } from '@opendatacapture/instrument-bundler';
import type { BundlerInput } from '@opendatacapture/instrument-bundler';


const LANGUAGES = ['en', 'es'] as const;
type SiteLanguage = (typeof LANGUAGES)[number];

// scripts/build.sh sets this, because the site is built from a copy inside .odc/.
const instrumentsDir = path.resolve(process.env.YUCA_INSTRUMENTS_DIR ?? path.resolve(import.meta.dirname, '../../instruments'));
const outDir = path.resolve(import.meta.dirname, '../public/bundles');

async function readInputs(dir: string, lang: SiteLanguage): Promise<BundlerInput[]> {
  const filenames = (await fs.promises.readdir(dir)).filter((name) => BUNDLER_FILE_EXT_REGEX.test(name));
  if (!filenames.includes('lang.ts')) {
    throw new Error(`Missing lang.ts in ${dir}`);
  }
  return Promise.all(
    filenames.map(async (name) => {
      const filepath = path.join(dir, name);
      if (name === 'lang.ts') {
        const content = await fs.promises.readFile(filepath, 'utf-8');
        const replaced = content.replace(/export const LANG[^\n]*/, `export const LANG = '${lang}' as SiteLanguage;`);
        if (replaced === content && lang !== 'en') {
          throw new Error(`Could not set language in ${filepath}`);
        }
        return { content: replaced, name };
      }
      const loader = inferLoader(filepath);
      const content = await fs.promises.readFile(filepath, loader === 'dataurl' ? null : 'utf-8');
      return { content: content instanceof Uint8Array ? new Uint8Array(content) : content, name };
    })
  );
}

async function bundleDir(dir: string, lang: SiteLanguage): Promise<string> {
  try {
    return await bundle({ inputs: await readInputs(dir, lang) });
  } catch (err) {
    throw new Error(`Failed to bundle ${path.relative(instrumentsDir, dir)} (${lang})`, { cause: err });
  }
}

type SeriesConfig = { SERIES_DIR: string; SERIES_ITEMS: readonly { edition: number; name: string }[] };
// tsx loads items.ts as CommonJS (it is outside any "type": "module" package), so the exports may sit on `default`.
const seriesModule = (await import(path.join(instrumentsDir, 'series/YUCA_SERIES/items.ts'))) as SeriesConfig & {
  default?: SeriesConfig;
};
const { SERIES_DIR, SERIES_ITEMS } = seriesModule.default ?? seriesModule;

// With --check, bundle every instrument directory (also ones not in the series) and write nothing.
if (process.argv.includes('--check')) {
  let failed = 0;
  for (const kind of ['forms', 'series']) {
    for (const name of (await fs.promises.readdir(path.join(instrumentsDir, kind))).sort()) {
      for (const lang of LANGUAGES) {
        try {
          await bundleDir(path.join(instrumentsDir, kind, name), lang);
          console.log(`ok   ${kind}/${name} (${lang})`);
        } catch (err) {
          failed++;
          console.error(`FAIL ${kind}/${name} (${lang})`, err);
        }
      }
    }
  }
  process.exit(failed ? 1 : 0);
}

await fs.promises.mkdir(outDir, { recursive: true });

for (const lang of LANGUAGES) {
  const items = [];
  for (const { name } of SERIES_ITEMS) {
    items.push({
      bundle: await bundleDir(path.join(instrumentsDir, 'forms', name), lang),
      id: `${name}-${lang}`,
      kind: 'FORM'
    });
  }
  const container = {
    bundle: await bundleDir(path.join(instrumentsDir, 'series', SERIES_DIR), lang),
    id: `${SERIES_DIR}-${lang}`,
    items,
    kind: 'SERIES'
  };
  const outFile = path.join(outDir, `${lang}.json`);
  await fs.promises.writeFile(outFile, JSON.stringify(container));
  console.log(`${lang}: ${items.length} items -> ${path.relative(process.cwd(), outFile)}`);
}
