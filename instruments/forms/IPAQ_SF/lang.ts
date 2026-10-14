// Selects the text language of this instrument. ODC instruments can only hold
// 'en' and 'fr' text, so each instrument is declared as 'en' and
// site/scripts/build-bundles.ts replaces the LANG line to make the Spanish
// bundle. Every instrument directory has an identical copy of this file
// (the ODC bundler only resolves files in the same directory).
export type SiteLanguage = 'en' | 'es';

export const LANG = 'en' as SiteLanguage;

/** Returns the text for the language of the current bundle. */
export function t<T>(text: { en: T; es: T }): T {
  return text[LANG];
}
