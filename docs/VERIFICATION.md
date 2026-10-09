> Latest update — 9 October 2026: Latest verification: production build and TypeScript passed; 288 HTML files, 6,046 internal links and 3,526 image/stylesheet references passed integrity checks. The comprehensive browser suite and 10 additional desktop/mobile page checks recorded no browser errors or final Axe violations. Mobile on-demand video, desktop autoplay, live reduced-motion pause and the preserved legacy/welcome routes passed. Reports are in research/qa/site-refresh. Existing Sites project lookup returned project_not_found; this build has not been deployed.

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

## Event carousel and immediate loading update

The introduction was removed. Production hydration checks passed for fresh and returning visits, mobile, reduced motion and an extension-injected body attribute, with zero console or hydration errors. The carousel now precedes the existing homepage hero and uses the supplied report artwork plus five original-site background photographs, all hosted locally as responsive, fingerprinted WebP files. The original 2,173,639-byte report PNG is reduced to 172,566 bytes at the desktop default width and 41,680 bytes at 480px.

Carousel checks covered all five slides at 1440px, 375px and 320px: images load, only current/next assets load initially, slide heights remain stable, external CTA destinations are preserved, and there is no horizontal overflow. Keyboard navigation, autoplay/pause, wraparound, swipe, reduced motion, no-JavaScript text, no-WebGL fallback and an Axe scan passed. Production build and content checks passed across 205 HTML pages, 3,985 internal link references and 1,953 asset references.

Final isolated cold mobile Lighthouse audit of the local production export: performance 92, accessibility 100, best practices 100 and SEO 100; LCP 2.72s, CLS 0.0007, total blocking time 224.9ms, with no console errors. The simulated LCP remains slightly above 2.5 seconds; hosted performance depends on delivery and client hardware. This audit includes the text effects and has no first-visit introduction. The first-slide images and the existing local font are preloaded; other slide backgrounds are mounted on demand with optional idle prefetch of one following slide.

Raw audit and responsive captures are excluded from source control under research/qa/carousel. Asset generation and re-run instructions are in STATIC-EXPORT.md.

## Contact portrait lanyard

Added the supplied React Bits Lanyard below the Contact form, with the supplied portrait printed on the card, a green strap and silver hardware. The original 115,913-byte JPEG is locally encoded as a 60,626-byte, 768-by-1024 WebP. Three.js is dynamically loaded near the viewport. Entrance motion and continuous breeze are disabled; animation pauses off-screen or in a hidden tab, with GPU resources disposed on unmount.

Production build and standalone typecheck passed. Export integrity checks passed across 205 HTML pages, 3,985 internal links and 2,156 asset references. `scripts/check-lanyard.mjs` passed at 1440px, 375px and 320px: correct position below the form, portrait readiness, no horizontal overflow, delayed canvas mounting, mouse dragging, keyboard flipping, native touch dragging and unchanged form validation. An Axe scan of the desktop Contact layout found no violations. Reduced motion, no JavaScript, unavailable WebGL and simulated context loss retained the static portrait card. Browser console and hydration errors: zero. Visual captures are local under `research/qa/lanyard`.

## Three contact lanyards

The single-card integration above is superseded by a full-width team section below the form and contact details. Siddhartha Mishra is larger and raised in the center; Amit Gupta and Hansika Gupta occupy equally sized left and right positions at the same height. Mobile presents Siddhartha first, then Amit and Hansika. Each card carries the matching supplied portrait, name and published role, with email and phone links below. The visible drag instructions and Flip card button were removed; the canvas itself remains keyboard accessible. The supplied React Bits physics, entrance motion and breeze are enabled, with a control to pause automatic sway.

Amit's supplied screenshot is encoded as a 12,388-byte, 425-by-426 WebP; the matching organiser portrait for Hansika is encoded as a 19,978-byte, 500-by-500 WebP. Together with Siddhartha's portrait, the three local files total 92,992 bytes. Component readiness was fixed so the animated cards reliably replace their static fallbacks, and portrait framing preserves the top of each image.

Production build, TypeScript and export integrity checks passed: 205 HTML pages, 3,985 internal links and 2,160 asset references. The dedicated production browser checks passed at 1440px, 768px, 375px and 320px: ordering and position, all three portraits and contact destinations, mouse dragging and keyboard flipping, native touch dragging, no horizontal overflow, lazy canvas mounting, sway pause/resume and enquiry validation. Axe found zero violations in the Contact layout and team section. Reduced motion, unavailable WebGL, context loss and JavaScript-disabled browsing retain static cards and usable contact links. Console and hydration errors: zero. Final desktop/mobile/tablet captures and the raw performance sample are local under `research/qa/lanyard`.

An isolated five-second local headless Chrome sample with all three animated cards visible averaged 30 frames per second, with a 33.5ms 95th-percentile frame interval and zero long tasks. A separate repeat averaged 30fps while the same browser's no-canvas baseline averaged 46fps; these measurements describe this local environment, not a guaranteed device frame rate. Instrumented WebGL drawing recorded zero draw calls after all cards were scrolled off-screen. Physical simulation retains the supplied React Bits settings; rendering remains capped at 1.5 device pixels and stops when hidden or settled with automatic sway paused.

## Homepage redesign - 9 October 2026

The homepage now uses enlarged original branding, black Outfit typography, verified exhibition photographs and varied section compositions. Source artwork covers 30 government/state/partner/global groups with 101 unique local images. Forty-two missing council portraits were matched to the exact accompanying names on the official homepage; four previously omitted council records were added. The full local master directory has 51 people. Speaker appearances and photographs from 2025 remain explicitly historical, and the completed September 2026 event status is preserved.

Final production build and TypeScript passed. `npm run check` passed across 209 exported HTML pages, 4,165 local link references and 2,558 asset references, with 99 companies, 51 people, 29 sessions and 164 partnership records. `git diff --check` found no whitespace errors.

`scripts/check-homepage.mjs` passed at 1440px, 768px, 375px and 320px: the variable font loads, primary headings are black, the supplied logo is enlarged, all eight government artworks and six focus states are present, every council member has a portrait, partner category tabs support keyboard navigation, participating-company/council/global rails respond to controls, and there is no horizontal overflow. All partner-panel images loaded successfully. The Axe WCAG 2 A/AA scan found zero violations. Reduced motion applies live; a dark system preference retains the intended white page; server-rendered content remains readable without JavaScript. Browser console and runtime errors: zero.

Production regressions passed for smooth scrolling, anchor offsets and focus with the enlarged responsive header, keyboard interruption, live reduced motion, dynamic card reveals, modal and mobile-menu scroll locks, native touch and JavaScript-disabled scrolling. All five carousel slides passed at 1440px, 375px and 320px, including artwork loading, stable layout height, typography effects, autoplay/pause, keyboard navigation, swipe, accessibility and readable no-WebGL/reduced-motion fallbacks. Three contact lanyards passed at 1440px, 768px, 375px and 320px with the updated font, including mouse/touch dragging, keyboard flipping, pause/resume, contact destinations, form validation and static fallbacks. No browser errors were recorded.

Visual review covered desktop and mobile opening, government artwork, photo hero, partner grids, event mosaic, council, speakers and organiser logos. One revision corrected the secondary photo stacking and balanced the last partner-grid row; subsequent captures were rechecked. Screenshots and the raw accessibility report are local under `research/qa/homepage`. Prior Lighthouse scores above describe earlier builds; no new performance score is claimed for this redesign.

## Government banner, supplied favicon and insights imagery

The supplied government banner now precedes the sticky navbar on every page. Browser checks at 1440px, 768px, 375px and 320px verified that the banner is visible initially, leaves the viewport after scrolling, and the navbar stays at the top with exactly the same height. Mobile navigation fits the available viewport both with the banner visible and after scrolling, closes with Escape and restores page scrolling. The supplied favicon is exported as a multi-size ICO and 32/48/64/180px PNGs; the favicon URLs and page metadata passed browser checks.

Five additional verified 2025 exhibition photographs now appear in the gallery strip and insights section with local responsive WebP variants. Insight links lead to the existing company directory, published 2026 agenda and official post-show report. Archive photography is labelled. Desktop, tablet and mobile screenshots were inspected; the tablet heading proportions and tall-photo image resolution were refined after that review.

Final production build and TypeScript passed. Export integrity passed for 209 HTML pages, 4,177 local link references and 2,779 asset references. The homepage checks passed at all four widths, including new artwork, sticky behavior, menus, partner tabs, rails, no horizontal overflow, live reduced motion, dark-system white-theme behavior and no-JavaScript content. Axe WCAG 2 A/AA violations: zero. Browser console/runtime errors: zero. Smooth-scroll regression checks passed, including a new mid-native-scroll reduced-motion case: stopping Lenis before destruction prevents its queued velocity reset from restoring classes after smoothing has been disabled. Final captures are under `research/qa/homepage`.

## Complete company, government and speaker listings

Final production build and TypeScript passed. Export integrity checked 259 HTML pages, 5,445 internal links and 3,603 asset references, with no missing routes or assets. All 99 company names were matched to the official homepage image labels. All 77 speaker source cards map to 72 unique speaker profiles, with portraits for every speaker; council coverage remains 49 members. Homepage browser checks passed at 1440px, 768px, 375px and 320px: complete default lists, company/speaker/council search, zero-result recovery, native rails, sticky banner behavior, favicon, partner tabs, no overflow and reduced motion. WCAG 2 A/AA scan: zero violations. Console/runtime errors: zero. JavaScript-disabled browsing retains all homepage companies and speakers. The full speaker directory was checked through all Show more steps to 72 entries, followed by searching Sunil Nair and opening his internal profile. Desktop and mobile source-backed portraits and government caption spacing were reviewed in final screenshots under `research/qa/homepage`.

## Compact navigation and React Bits TextLoop

Installed `@react-bits/TextLoop-TS-CSS` via the requested shadcn registry, retaining the supplied component code and adding coordinated pause behavior. Navbar content width is capped at 1,180px; the header main row is 88px desktop, 82px tablet, 74px mobile and 70px on small phones, with logo widths 260/240/210/190px. Four section headers carry forward wave ribbons with white text and the supplied purple background.

Production build and TypeScript passed. Export checks passed for 259 pages, 5,445 internal links and 3,603 asset references. `scripts/check-text-loop.mjs` passed at 1440/768/375/320px: all four ribbons move forward, hover and manual pause preserve position, reduced-motion changes stop animation, and offscreen ribbons suspend. Homepage checks passed at all four widths, including compact navigation, menus, sticky support-banner separation, complete directory search/rails, no horizontal overflow and no-JavaScript content. Axe WCAG 2 A/AA violations: zero. Smooth-scrolling checks passed, including responsive header clearance, keyboard interruption, mobile menu and gallery locks, native touch and live reduced motion. Runtime errors: zero. Navbar and all four ribbon placements were inspected in desktop, tablet and mobile screenshots under `research/qa/text-loop`.

## Descending sketch-style brand ribbons

The four section ribbons now follow the supplied descending hand sketch: a steeper opening on the left and gentler bends toward the lower right. Partners/council use brand orange with black text; companies/speakers use brand green with white text. Pause controls have clearance beneath the contour. This supersedes the purple wave treatment above.

Production build and TypeScript passed. Focused browser checks passed at 1440px, 768px, 375px and 320px for the descending contour, orange/green palette, forward scrolling, hover/manual pause, live reduced motion, offscreen suspension and zero horizontal overflow. Axe WCAG 2 A/AA scan: zero violations. Browser runtime errors: zero. Desktop and mobile screenshots were inspected under `research/qa/text-loop`.

## Original wave, enlarged alignment and requested removals

Restored the original React Bits repeating wave and applied an 8-degree clockwise tilt to the whole SVG. The ribbons span the section width and start at the heading left edge, with extra vertical clearance to preserve the full wave curves. Orange/green colouring is retained. Ribbon pause buttons and hover pause are removed as requested; system reduced-motion/offscreen handling remains. Removed the bottom Government support and The team behind the event sections, plus the organiser/partner logo block in the site footer. The government banner above navigation remains.

Final build and TypeScript passed. Export integrity passed across 259 pages, 5,445 internal local links and 2,804 asset references. Focused checks passed at 1440/768/375/320px for original wave geometry, larger section-width placement, heading alignment, downward tilt, colour, continuous hover behavior, system reduced motion, no page overflow and all requested removals. Axe WCAG 2 A/AA violations: zero. Runtime errors: zero. After visual review, desktop/tablet vertical clearance was increased and verified against sampled transformed ribbon edges; final screenshots show the full curves.

## Ribbon placement after the heading

The ribbons now begin immediately after the heading text and occupy the remaining space toward the right corner. In Governing Council this places the ribbon after 2026. Description text remains directly beneath the title. Mobile uses a compact right-aligned ribbon instead of a full-width band. Original wave, 8-degree downward tilt, logo colours, no ribbon pause controls and prior removals remain in place. This supersedes the full-width layout above.

Production build and TypeScript passed. Browser checks passed at 1440/768/375/320px for placement after the heading, alignment with the right corner, original wave, tilt, animation, reduced motion and no page overflow. Accessibility violations and runtime errors: zero. Council desktop/tablet/mobile screenshots were visually reviewed.
