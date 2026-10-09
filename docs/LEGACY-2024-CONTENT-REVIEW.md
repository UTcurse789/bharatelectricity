# 2024 legacy page content review

The timeline at `/event/legacy/` contains only the 2024 edition. Copy and statistics were supplied in the user's redesign brief and screenshots.

## Editorial checks

- The attributed minister's quote says **2014**. It is preserved exactly as supplied and needs verification against the original speech or transcript.
- The statistics reference says **20+ countries**. The demographics reference separately says **19+ countries represented**. Both source figures are retained without reconciliation.
- Survey charts show only legible labels and values. Partial charts are identified. No missing percentages have been inferred or normalized.
- The participant-segment chart, the business-generated response labelled **If Please**, the duplicated event-value question with Yes/No answers, and incomplete location values remain in expandable original source references.
- Pavilion **business expected** figures are forecasts, not realised revenue.

## Asset status

- Twelve original photographs were obtained from the organiser's existing [Bharat Electricity 2024 awards and gala album](https://photos.app.goo.gl/gq133LtdgFeRMj319). Per-image provenance is retained in `src/content/legacy-award-images.json`.
- Day 1 contains the six photographs supplied by the user as “Day 1 Glimpse”, mapped in `src/content/legacy-day-1-images.json`. Day 2 and Day 3 remain deliberately empty. The project's existing exhibition photographs are labelled 2025 and have not been reassigned to 2024 or to unverified days. Add additional photos to each day's `images` array in `src/content/legacy.ts`.
- No verified Shri Pralhad Joshi photograph was found in the project. The quote is text-only.
- Standalone original MSME/Startup India pavilion photographs and official logo files were not found. Their supplied source screenshots remain viewable in expandable references. Pavilion photo arrays are ready for original files; support names are editable HTML text.

## Component changes

Both actual React Bits TS/CSS components were installed through the configured registry. `CircularCarousel` has no demo-image fallback. Minimal `paused` props support explicit animation controls. The spiral stops its animation frame loop while off-screen, hidden, hovered or paused. Reduced motion uses a static, readable gallery.

Future editions can be added to the typed `LegacyEdition` data after their content and imagery have been verified. No future edition records are prepopulated.

## Validation

- Production build and TypeScript checks passed. The content check verified 259 HTML pages, 5,437 links and 2,852 assets. The project does not define a lint script.
- Browser checks cover 1440, 768, 375 and 320 pixel widths: timeline, statistics, original references, day-tab switching and keyboard navigation, six Day 1 image sources in the actual circular carousel, Day 1 rotation and pause/resume, manual keyboard slide navigation while focus pauses autoplay, awards image loading, hover pause, explicit pause/resume, off-screen pausing and reduced-motion fallback. No browser errors or demo-image requests were observed.
- Axe checks found no WCAG A/AA violations within the legacy page in animated and reduced-motion modes. Server-rendered copy and a static awards gallery remain available with JavaScript disabled.
- Mobile Lighthouse recorded performance 79, accessibility 100, best practices 100 and SEO 100, with CLS 0. The measured LCP was 3.96 seconds and TBT 231 milliseconds. Its primary image findings concern the existing shared header logo and government banner, which this redesign preserves.
- Screenshots and the Lighthouse report are retained under `research/qa/legacy/`. The mobile visual review also corrected the edition label's font size so it remains secondary to the year marker.

## Files

The page uses `src/components/LegacyPage.tsx`, `LegacyPage.css` and `LegacyGalleries.tsx`, backed by `src/content/legacy.ts` and its asset manifests. Route content is connected through `src/components/PageContent.tsx` and `src/content/pages.ts`. Actual React Bits components and their CSS live in `src/components/CircularCarousel.*` and `InfiniteSpiral.*`. Photos and source references live in `public/assets/legacy-2024/`. Repeat browser validation with `node scripts/check-legacy.mjs` against the exported preview on port 4173.
