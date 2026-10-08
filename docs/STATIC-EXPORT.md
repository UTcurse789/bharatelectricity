# Static export compatibility

Next.js 16.4 emits nested static segment files while its client prefetch requests flattened filenames for catch-all routes. scripts/finalize-export.mjs runs as npm postbuild and copies the emitted segments to matching flattened aliases. Original files remain intact. This makes Next.js Link prefetch and client navigation work on a plain static host without 404s.

Responsive image sizes are generated locally and selected through src/lib/image-loader.ts. The photos use fixed supported widths 160, 320, 480, 768, 1200 and 1800. All source-independent final assets are tracked under public/, so npm run build does not require the untracked research downloads.
