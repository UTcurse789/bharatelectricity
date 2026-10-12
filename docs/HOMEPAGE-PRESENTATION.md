# Homepage presentation

The homepage preserves the Bharat Electricity green and orange brand, Montserrat typography, existing navigation, page routes and year-specific records. The October 12 revision uses a white event-site layout with real photography, consistent spacing and stationary partner artwork.

## Design audit

Mode: redesign, preserve. DESIGN_VARIANCE 4, MOTION_INTENSITY 2, VISUAL_DENSITY 5. The audience is government, utilities and industry visitors, so readability and source attribution take priority over decorative effects. Existing accessible controls, directory search and edition navigation are retained. Endless logo scrolling, card entrance movement, the fabricated report cover and repeated slogan headings were retired. The Co-located Events, New Initiatives and Meet the Team blocks were removed from the homepage; their dedicated pages and navigation remain available.

## Government and partner highlights

The header uses the user-supplied **Header For BE.png**, with optimized WebP copies rather than the original 14314 × 2657 image download. Desktop artwork shares the header's centered 1180px navigation container and displays at its natural aspect ratio. Phones and tablets show the same complete artwork scaled to their available width, including all ministries and Mission LiFE, with no separate ministry text disclosure. The separate homepage Government Support section and the Focus States partner entries retain the original logos. The header and mobile navigation use a Register button linked to the Register page. The video hero replaces Explore event highlights with two rectangular registration links: Book your delegate pass in brand orange and Register as a visitor in brand green. They sit side by side on desktop and stack on phones, linking to the existing delegate and visitor registration pages.

Our valued partners follows the user's supplied logo-grid reference: one role label above each equal white logo box, with a thin blue/teal border. The grid uses five columns on large screens, four on smaller desktops, three on tablets and two on phones. All 94 partner placements, including Focus States, are retained. There are no duplicated marquee tracks or hover-induced motion. Two filenames containing the same CESC artwork are treated as aliases. Dedicated partner directories keep their existing layout.

## Media and report

The video hero now uses the user's 2027 cover copy: Bharat Electricity with POWERGEN India and Indian Utility Week, 1–3 September 2027 at Yashobhoomi, IICC, Dwarka, New Delhi. The theme is India's Next Energy Advantage, with From Capacity to Capability and the three supplied pillars. Header event information and homepage metadata/structured data use `site.nextEdition`; archived records remain tied to the completed 2026 edition.

The About Bharat Electricity introduction uses the user's new energy-system narrative, with the corrected opening “India's energy story has entered a new phase.” A small native Web Animations API reveal runs once on its heading and paragraphs when the text enters view. It only changes opacity and transforms, preserves the section's dimensions, and is disabled or cancelled for reduced-motion preferences.

- The existing 34-second, 1280 × 720 local film is playable. Its historical filename is `bharat-electricity-2027.mp4`; it is labelled **Archive footage**, not a verified 2026 highlight film. A verified complete 2026 film remains unavailable.
- Desktop playback is muted and inline. Phones, reduced-motion preferences and data-saving connections start with the poster and a Play film control. Playback pauses when the hero leaves the viewport or the tab is hidden. Open film provides the browser's native player.
- Three homepage photographs are from the official **2026 second Governing Council meeting** album: https://photos.app.goo.gl/dkJmB5x7vYMugAsg7. Individual sources and dimensions are in `src/content/homepage-media.json`.
- The report panel uses a genuine 2025 exhibition photograph and a clear **2025 Post-show Report** title. Its action is **Request the report**, linking to the existing enquiry page. No downloadable PDF has been supplied.
- Awards and exhibition photographs retain their explicit **2025 archive** labels. No unavailable 2026 content is presented as verified.

## Interaction and performance

The hero film and the one-time introduction text reveal are the homepage's automatic motion. Highlights and company, council and speaker rows start stationary, with manual controls; the highlight slideshow can be enabled explicitly. Directory rows initially render eight cards and add the rest when they enter the viewport, retaining reserved heights. Partner images load lazily. Promotional statistics remain static.

Wheel smoothing remains available, with native touch scrolling and reduced-motion handling. Scroll-triggered card and section transforms have been removed globally to eliminate unnecessary visual movement. The highlight stage reserves enough room for every slide so controls and adjacent content stay in place.

## Verification

Run `npm run typecheck`, `npx next build`, `node scripts/finalize-export.mjs`, `npm run check`, `node scripts/check-branding.mjs`, and `node scripts/check-homepage-cleanup.mjs` against the preview server. The previous `check-homepage-presentation.mjs` entry point forwards to the current checks.

Browser verification covers 320, 375, 768, 1024, 1440 and 1920px: real media decoding, play/pause/resume, offscreen pausing, range requests, reduced motion, complete government artwork at every width, stationary partner hover, all five highlight layouts, stable page height, company search and manual navigation. WCAG A/AA scans run at mobile and desktop widths. Screenshots and results are in `research/qa/homepage-cleanup/`.
