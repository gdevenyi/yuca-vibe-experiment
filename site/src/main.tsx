import React from 'react';
import ReactDOM from 'react-dom/client';

import { i18n } from '@douglasneuroinformatics/libui/i18n';
import { createZodErrorMaps, localizeZodErrors } from '@opendatacapture/react-core';

import { App } from './App';

import '@opendatacapture/react-core/globals.css';

// Instrument bundles import the ODC runtime from the absolute path '/runtime/v1/...'.
// GitHub Pages serves this site under a sub-path, so map those imports to it.
(globalThis as { __resolveImport?: (name: string) => string }).__resolveImport = (name) =>
  name.startsWith('/runtime/') ? import.meta.env.BASE_URL + name.slice(1) : name;

i18n.init({ translations: {} });

// Validation messages in the interface language, as the ODC web app does. localizeZodErrors()
// can only reach the runtime zod at '/runtime/v1/...', so the site registers the maps on the
// runtime zod itself, at the same sub-path URL that the instrument bundles import.
void localizeZodErrors({ targets: ['app'], translator: i18n });
const importRuntimeModule = new Function('url', 'return import(url)') as <TModule>(url: string) => Promise<TModule>;
const zodErrorMaps = createZodErrorMaps(i18n);
await Promise.all([
  importRuntimeModule<typeof import('/runtime/v1/zod@3.x/index.js')>(`${import.meta.env.BASE_URL}runtime/v1/zod@3.x/index.js`),
  importRuntimeModule<typeof import('/runtime/v1/zod@3.x/v4.js')>(`${import.meta.env.BASE_URL}runtime/v1/zod@3.x/v4.js`)
]).then(([runtimeV3, runtimeV4]) => {
  runtimeV3.z.setErrorMap(zodErrorMaps.v3);
  runtimeV4.z.config({ customError: zodErrorMaps.v4 });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
