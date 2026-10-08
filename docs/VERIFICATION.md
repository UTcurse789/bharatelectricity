# Verification — 8 October 2026

## Production and content

- npm run build: passed; Next.js static export with 202 legacy/detail/alias route parameters, homepage, not-found page and metadata routes.
- TypeScript validation: passed during the production build and standalone typecheck.
- npm run check: passed across 205 HTML files, 3,985 link references and 1,952 asset references.
- Local records: 99 companies, 47 people, 29 programme entries and 164 partnership records. Edition-specific relationships remain separate from master entities.
- 18 critical external destinations returned successful responses, including organiser sites, social accounts, venue, original legal notices and official photo albums. External destinations can change after this check.

## Browser and accessibility

Playwright using installed Google Chrome tested desktop dropdowns, mobile expandable navigation and route changes; exhibitor search and sector/country/edition filters; speaker search and edition filtering; resets and empty states; agenda tabs, arrow keys, track filters, parallel sessions and details; lightbox arrow keys, Escape and focus restoration; enquiry validation and email preparation.

Responsive checks covered 375px, 768px and 1440px at homepage, exhibitor directory, agenda and enquiry routes. No horizontal overflow or browser console/page errors were found. Axe checks for WCAG 2 A/AA and 2.1 AA found zero violations on these pages at all three widths. White backgrounds under a dark operating-system preference and reduced motion also passed. These automated checks are not an accessibility certification.

Visual review covered full-page desktop/mobile/tablet composition, real photography, portrait crops, logo aspect ratios, typography, spacing, touch targets and dark mode. Important content remains visible with JavaScript disabled on the homepage, event overview, exhibitor directory, agenda and contact page. Static pages have no route loading boundary that conceals content; interactive controls retain their busy, empty and error states.

## Performance

Original pre-rebrand isolated mobile Lighthouse run against the production export on localhost: performance 91, accessibility 100, best practices 100 and SEO 100. Simulated LCP was 3.45 seconds, total blocking time 47.5ms and CLS 0.002. The slower-network LCP target of 2.5 seconds was not reached; hosted network performance may differ. Images use responsive local WebP variants, a high-priority hero, reserved dimensions and lazy loading below the fold. Fonts are self-hosted and static assets receive cache headers.

The Next.js 16.4 export-prefetch compatibility fix is documented in STATIC-EXPORT.md; final browser checks recorded no missing prefetch requests.

## Review limits

The source did not supply all requested editorial material. CONTENT-REVIEW.md lists missing biographies, attributed testimonials, registration/pricing, manuals, award details, full news bodies and future-edition information. Missing information is labelled rather than invented. Online submission is unconfigured and the form never claims delivery. The published Site is private; an official public launch and remaining content approval are separate decisions.

Re-run: npm run build, npm run typecheck, npm run check. With npm run preview active, run node scripts/qa.mjs and node scripts/no-js.mjs. Browser scripts currently point to the installed Windows Google Chrome path; adjust executablePath for another machine. QA captures and raw reports are kept locally under research/qa and excluded from the source repository.

## Logo, graphics and motion update

Rebrand verification passed after the supplied logo, white theme, energy graphics and first-visit animation were applied. All 205 exported HTML pages were scanned for rendered text, image alternatives and description/Open Graph metadata: zero old event-brand references. Legacy URL/source destinations are preserved as documented in REBRAND.md. News artwork with old event branding is no longer displayed.

Dedicated loader checks passed: exact supplied animation rendered, automatically completed, first visit remembered, repeat visits skipped, manual skip worked, reduced motion bypassed, and a failed animation request restored the page. Scroll-triggered animations were observed running. No console/page errors were recorded. Homepage and representative pages remained readable with JavaScript disabled. Final screenshots and automated accessibility checks covered 375px, 768px and 1440px; zero violations or horizontal overflow were found.

Return-visitor mobile Lighthouse audit with the introduction already seen and a warm asset cache: performance 100, accessibility 100, best practices 100 and SEO 100; LCP 1.02 seconds, CLS 0.0012 and TBT 61.5ms. This warm-cache measurement does not describe a cold first visit, which includes the requested four-second introduction.
