# Complete website refresh — 9 October 2026

The existing white, orange and black BHARAT ELECTRICITY design is retained and extended across the inner pages. The supplied logo, government banner, homepage video, ribbons, historical programme and previously built interactions are preserved.

## Reference coverage

Source: https://www.powergen-india.com/ and its linked pages, retrieved on 9 October 2026. The refresh adds 50 reference-page records, 897 optimised artwork/photo assets and 26 official video thumbnails. All assets are local; publication does not require the original Downloads files or live source requests.

| Area | Implemented content |
| --- | --- |
| About | Full event overview, market opportunities, global event series, organiser, existing legacy pages, historical 2024/2025 council content |
| Exhibition | Why exhibit, sector artwork, previous attendees, searchable published participant archive, 2024 exhibitor artwork, stand formats, space/floor-plan/prospectus enquiry pages |
| Stand options | User-supplied Woodward Raw Space and Camfil Shell Scheme photographs; stand selection carried into the enquiry and email |
| Exhibitor manual | Published opening hours, move-in/move-out schedules, onsite contacts, build rules and technical/operational guidance; historical rules are identified as archived |
| Visit | Full visitor/networking information, venue content, registration-interest pages |
| Conference | Published native agenda and speaker directory, full summit overview and speaking-enquiry destinations |
| Awards | Categories, eligibility, evaluation marks, jury, participation terms and previous winners; closed 2026 nomination actions are not offered as current bookings |
| Partnerships | Existing complete 2026 groups, previous partner artwork, partnership benefits and enquiry/brochure routes |
| Media | All 19 complete news bodies, 26 official video links with thumbnails, existing lightbox, all 11 official photo albums, media/report enquiry pages |
| Contact | Existing contact details and lanyards, contextual request forms, callback enquiry |

Source content is rendered as semantic React elements. Scripts, embeds and source styling are not imported. Unsupported internal reference destinations open their original official source instead of becoming broken local routes. Legal notices remain linked to the organiser's published notices.

Historical dates and source claims are identified as archived. The next edition's prices, dates, available stands and operational requirements are not inferred from old material. Some archive participant and council information is published only as artwork; it is retained rather than inventing missing names or biographies.

## Implementation

- `src/content/reference-pages.json`: page sections, links, source paths, images and video titles.
- `src/content/refresh-asset-sources.json`, `video-sources.json`: asset provenance and dimensions.
- `src/content/article-content.json`: full article bodies and original source links.
- `src/content/reference-rosters.json`: source-labelled participant archive.
- `ReferenceContent.tsx`, `ReferenceRoster.tsx`, `StandOptions.tsx`, `InnerPages.css`: responsive source content, directory, comparisons and visual system.
- Navigation includes every top-level reference destination, with existing canonical routes preserved.

To regenerate source content, first obtain the cache using `scripts/audit-reference-site.mjs` (local research, excluded from Git), then run `scripts/prepare-site-refresh.mjs`, `scripts/prepare-news-content.mjs`, `scripts/prepare-reference-roster.mjs` and `scripts/prepare-video-library.mjs`. Downloads require network permission. The production build consumes the checked-in JSON and assets only.

## Submission and deployment

No approved online submission endpoint is configured. Forms validate, preserve the chosen request/stand and prepare an email in the visitor's own mail application. They do not claim delivery. Callback requests ask the visitor to include a telephone number and preferred time.

The hosting manifest retains `appgprj_6ac77ca465348191a1f2962a1d6c1316`. The Sites connector returned `project_not_found` when reading this exact existing project. The local production export is available; deployment was not performed and access settings were not changed.

## Verification

Production build and TypeScript passed. The full export link/asset integrity check passed. Browser checks covered stand selection and email content, form errors and focus, exhibitor search/stand search/reset/load-more, speaker search, keyboard agenda navigation, lightbox navigation and focus restoration, mobile navigation, and 12 key pages at 320/375/768/1440px. These checks recorded zero browser errors and zero automated WCAG A/AA violations on the scanned pages. Additional final checks cover the photo-led overview, participant archive, historical council, video cards and full news articles at desktop/mobile sizes.

Screenshots and machine-readable QA/Lighthouse reports are in `research/qa/site-refresh/`, which is excluded from Git. Automated accessibility checks are not certification and localhost performance is not a hosted-network measurement.

Performance changes: compact logo artwork, responsive stand photographs and video poster, high-priority government banner, homepage code removed from unrelated inner routes, lazy archive bundle, and on-demand mobile background video. Desktop autoplay remains available, with live reduced-motion pausing.

Final simulated-mobile Lighthouse results: stand options performance 95, accessibility/best practices/SEO 100, LCP 2.455s and CLS 0. Homepage performance 78, accessibility/best practices/SEO 100, LCP 4.437s, TBT 263ms and CLS 0. The complete homepage remains slower on simulated slow connections; the 2.5s LCP target is not met there. Results describe this local run and can vary with device, CPU load and hosting.
# Logo sizing and branding correction

Logo rendering now accounts for the visible artwork bounds inside each supplied raster, rather than fitting its entire white canvas. `LogoImage` uses measured content bounds and a clipped viewport; original image files remain intact. Partner grids use shorter cards with five columns where space permits, and two columns on phones. The browser regression checks now include a minimum visible-logo size as well as the previous maximum-size checks.

Imported logos now have explicit logo metadata and use bounded image slots across partner archives, international events, organisers and exhibitors. Single-logo sections no longer inherit full-width artwork sizing. Logo images preserve their aspect ratios; photographs and information artwork retain their separate layouts.

Visible POWERGEN copy, image descriptions and metadata now use current site branding. Obsolete standalone wordmarks were removed, and the homepage/report page use a new HTML/CSS Bharat Electricity report cover. Legacy URLs and source provenance remain intact. Historical photographs and external films remain archival media.

`scripts/normalize-site-content.mjs` runs before production builds to keep human-facing imported copy and logo classifications consistent. `scripts/check-branding.mjs` audits rendered text, alt text and SEO metadata on every exported page. `scripts/qa-logo-layouts.mjs` checks image bounds, image decoding and horizontal overflow at phone, desktop and wide-screen widths.

