# Static export compatibility

Next.js 16.4 emits nested static segment files while its client prefetch requests flattened filenames for catch-all routes. scripts/finalize-export.mjs runs as npm postbuild and copies the emitted segments to matching flattened aliases. Original files remain intact. This makes Next.js Link prefetch and client navigation work on a plain static host without 404s.

Responsive image sizes are generated locally and selected through src/lib/image-loader.ts. The photos use fixed supported widths 160, 320, 480, 768, 1200 and 1800. All source-independent final assets are tracked under public/, so npm run build does not require the untracked research downloads.

## Carousel photographs

The five slide backgrounds are downloaded from the original event website and hosted locally. Source URLs and output dimensions are recorded in `src/content/carousel-images.json`. The report artwork is the supplied 2025 cover, preserved without changing its printed edition.

`scripts/prepare-carousel-assets.mjs` generates responsive WebP variants and content-hashed filenames. To regenerate them, run `node scripts/prepare-carousel-assets.mjs "path/to/original-report.png"`. Original downloads are cached in the ignored `research/assets-candidates/carousel` directory. The checked-in WebP files and metadata suffice for a production build; regeneration is optional.

Only the active slide is mounted. The report artwork and small first-slide background are preloaded with high priority because the background is the largest painted element on mobile. When idle, the browser may prefetch one following background, with this prefetch disabled for reduced motion, data saving, slow connections or an off-screen carousel. The report has reserved dimensions, slide heights remain stable, and below-fold hero photography loads lazily. The local preview serves fingerprinted carousel assets with immutable cache headers; configure equivalent headers on the production host.

After `npm run build`, start `npm run preview` and run `$env:CHECK_ORIGIN='http://localhost:4173'; node scripts/check-carousel.mjs` in PowerShell. The check covers image loading, initial request scope, stable slide heights, responsive layouts, interactions, accessibility and text fallbacks.
