# Bharat Electricity 2027 updates

Design read: targeted refresh of an existing B2B energy event website. Retain the established light theme, white surfaces, green and orange identity, Manrope/Outfit type and real event photography.
DESIGN_VARIANCE 5 / MOTION_INTENSITY 3 / VISUAL_DENSITY 4. New photo and partner layouts are still, with motion reserved for interaction feedback.

## Content and layout

- Event dates sit with the logo on the left, including mobile. Copyright uses 2027.
- Our 2026 Partners is a visible, still board of primary sponsors and host utilities. The complete Valued Partners board has larger, aligned logo slots.
- Removed 01 beside the About page brand.
- Legacy now includes a 2026 edition, edition navigation, published dates, council links, supplied event highlights and day selectors. Day and awards galleries use full-colour grids with a keyboard-accessible full-size viewer. The superseded 2025 awards feature is removed from Legacy; genuine historical albums elsewhere retain their years.
- All 48 council entries follow the supplied Governing Council 2026 PDF in page and row order. Alok Kumar is removed from the 2026 council. P. C. Garg replaces the previous NSEFI representative; his original portrait was extracted from page 2. Other edition records are retained.
- Replaced Brainstem Technologies and Tranter India artwork with the supplied files.
- Brochure request pages use the supplied 2027 event and partnership covers. Networking uses all three supplied Bharat Electricity photographs.
- Summit Overview has a single summit photograph, focused copy, topic sections and programme links. Knowledge Hub uses the correctly identified 2025 Knowledge Hub session photograph from the existing source archive.
- Partnership Opportunities has a balanced two-column opening with the supplied brochure artwork.
- Photo Gallery has year selection, large image previews, full-size viewing, and photographic links to official albums.
- Government Support is omitted from Partners 2026.
- Venue & Travel identifies Gate No. 6 as the main entrance, includes a Google Maps embed, a directions link and the supplied location link: https://share.google/POUSKHDQPcww1YL6t

## URLs and manual visibility

Canonical exhibition routes use /exhibit-at-bharat-electricity, with readable child slugs. Summit links use /summit-overview/summit-agenda and /summit-overview/speaking-opportunities. Earlier paths retain canonical aliases and permanent Vercel redirects. The agenda remains correctly labelled as the published 2026 programme.

All participant years share /participants, with ?year=2026, ?year=2025 or ?year=2024. Earlier year paths retain compatible aliases and redirects. Company detail URLs are preserved.

The manual's reserved slug is /exhibitor-manual. Both this slug and the old /exhibitor-guide are excluded from published pages, menus and the sitemap. Source content remains available for a future approved manual; there is no separate CMS backend in this static project.

## Assets still needed

The supplied event photographs are not assigned to a particular day or labelled as awards photographs. Separate, approved 2026 Day 1, Day 2, Day 3 and Awards & Gala images or albums are still needed for those collections. They are not filled with re-labelled 2025 imagery. A separately supplied new Knowledge Hub image can replace the verified existing session image when available.

## Verification

Run npm run build, npm run typecheck, npm run check and npm run check:seo. The focused browser checks in scripts/check-2027-refresh.mjs exercise council order, routes, year selection, photo viewing, branding, manual visibility and responsive layout. QA artifacts are local under research/qa/2027-refresh.

Static exports also include meta redirects on the old URLs, so visitors reach the corrected paths on hosts that do not process Vercel configuration.

Final local verification on 4 November 2026: production build and TypeScript passed with Next.js 16.4.5. Export integrity passed for 329 HTML files, 6,953 internal link references and 5,962 asset references. SEO validation passed for 287 canonical pages and 36 aliases, with two noindex pages. Browser checks passed across 56 page/viewport combinations (1440, 768, 375 and 320 pixels), 12 WCAG A/AA scans, all 48 council positions, both supplied participant logos, year switching, lightbox keyboard controls and focus restoration, canonical migrations and manual 404s. Browser runtime errors and final accessibility violations: zero. The production dependency audit reported zero vulnerabilities. Third-party forms and analytics were excluded from layout QA; no form submissions were made.

Deployment target: existing Vercel project prj_z4lKoi3H1Q7MfRqhaZnOlcYlecAq in utcurse789s-projects, serving https://www.bharat-electricity.com. The older Sites manifest remains part of the source history. The dry run selected 2,131 source files (67,822,769 bytes) and excludes local environment files, credentials, research, dependencies and build output.

## Production publication

Published successfully on 4 November 2026 to https://www.bharat-electricity.com using the existing Vercel project. Deployment: dpl_76L9CUVGqAMvvnM5hfyiGwSSmcDF (READY, production). Generated deployment URL: https://bharatelectricity-r1b7w90hw-utcurse789s-projects.vercel.app.

Public verification passed for 13 pages, 12 permanent redirect chains, both hidden manual URLs (HTTP 404), and byte-for-byte matching of the four supplied logo/brochure assets. Live Chrome checks passed for mobile navigation to Participants 2025, preserved year selection, gallery keyboard controls and the desktop header. Browser runtime errors and failed first-party responses: zero. Production form submissions were not performed. Verification artifacts are under research/qa/2027-refresh.

Follow-up homepage refinements, 4 November 2026: removed the international event portfolio section; centered the desktop navigation between the identity/date block and Register button and enlarged labels to 16px; reduced featured partner artwork to 160px wide / 74px high; reduced footer branding and organiser artwork to a 250px block and host publication artwork to 200px. Production build/TypeScript and browser sizing checks passed at 1920, 1440, 1280, 1024, 768, 375 and 320 pixels, including mobile menu interaction.
Published as Vercel production deployment dpl_GNXwrstmidZZS5yUAhdEb1rxDw28. The same seven-width sizing and mobile navigation checks also passed against the public domain.
