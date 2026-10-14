import runtime from '@opendatacapture/vite-plugin-runtime';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// GitHub Pages serves a project site under /<repo>/. The same value is used by
// scripts/build-bundles.ts to rewrite the '/runtime/v1/' imports in each bundle.
const base = process.env.SITE_BASE ?? '/yuca-vibe-experiment/';

export default defineConfig({
  base,
  build: {
    chunkSizeWarningLimit: 2000,
    // vite-plugin-runtime copies the runtime into dist/runtime before the build.
    emptyOutDir: false,
    rollupOptions: { external: ['esbuild'] },
    target: 'es2022'
  },
  optimizeDeps: {
    esbuildOptions: { target: 'es2022' },
    include: ['react/*', 'react-dom/*']
  },
  plugins: [react(), runtime({ rootDir: import.meta.dirname }), tailwindcss()]
});
