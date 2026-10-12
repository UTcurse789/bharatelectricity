# Homepage presentation

The homepage preserves the Bharat Electricity green and orange brand, Montserrat typography, existing navigation, page routes and year-specific records. The October 12 revision uses a white event-site layout with real photography, consistent spacing and original partner artwork.

## Design audit

Mode: redesign, preserve. DESIGN_VARIANCE 4, MOTION_INTENSITY 2, VISUAL_DENSITY 5. The audience is government, utilities and industry visitors, so readability and source attribution take priority over decorative effects. Existing accessible controls, directory search and edition navigation are retained. Endless logo scrolling, card entrance movement, the fabricated report cover and repeated slogan headings were retired. The Co-located Events, New Initiatives and Meet the Team blocks were removed from the homepage; their dedicated pages and navigation remain available.

## Government and partner highlights

The header uses the user-supplied **Header For BE.png**, with optimized WebP copies rather than the original 14314 × 2657 image download. Desktop artwork shares the header's centered 1180px navigation container and displays at its natural aspect ratio. Phones and tablets show the same complete artwork scaled to their available width, including all ministries and Mission LiFE, with no separate ministry text disclosure. The separate homepage Government Support section and the Focus States partner entries retain the original logos. The header and mobile navigation use a Register button linked to the Register page. The video hero replaces Explore event highlights with two rectangular registration links: Book your delegate pass in brand orange and Register as a visitor in brand green. They sit side by side on desktop and stack on phones, linking to the existing delegate and visitor registration pages.

Our valued partners follows the supplied reference: a centered navy heading, OUR NETWORK eyebrow, teal rules, a pale Focus States panel, three featured cards, three rows of four role cards, full-width partner groups, with Knowledge Partners in its own row directly below Policy & Governance. All categories use identical logo frames and the same 176px by 96px artwork limits, preserving proportions. The section is capped at 1180px with larger left/right margins, and each card has additional horizontal padding. The additional published categories are retained before the centered Host Publication card. Overflowing rows loop at 24 pixels per second with no slider arrows, dots or horizontal scrollbars; hover and keyboard focus pause the row. Offscreen rows pause, and reduced-motion preferences show all logos in a static wrapping layout. Alternate CESC, RPG, Invest India and Electrical Mirror artwork files are treated as aliases. Previously omitted focus-state department and utility logos are included, and generic artwork labels are replaced with real partner names. Original source artwork is used, including Mercados Energy Markets India for the blue knowledge-partner mark. Dedicated partner directories keep their existing layout. Run `node scripts/check-partner-reference.mjs` for desktop, reference-width and mobile layout, loop continuity and accessibility checks.

For this partner-section revision, DESIGN_VARIANCE is 3 (the reference's symmetric grid), MOTION_INTENSITY is 4 (continuous motion only where logos overflow), and VISUAL_DENSITY is 5. The supplied white reference determines the section theme. Native CSS and the existing logo component provide the layout without additional dependencies.

## Media and report

The video hero now uses the user's 2027 cover copy: Bharat Electricity with POWERGEN India and Indian Utility Week, 1–3 September 2027 at Yashobhoomi, IICC, Dwarka, New Delhi. The theme is India's Next Energy Advantage, with From Capacity to Capability and the three supplied pillars. Header event information and homepage metadata/structured data use `site.nextEdition`; archived records remain tied to the completed 2026 edition.

The About Bharat Electricity introduction uses the user's new energy-system narrative, with the corrected opening “India's energy story has entered a new phase.” The supplied About-section reference is recreated with a larger green heading and lightning icon, two columns on desktop, a rounded awards photograph with a soft shadow, pale lightning backdrop, dotted green arcs, a circular energy badge, and an underlined About the event link with a mint arrow circle. The photo remains at its original aspect ratio; smaller screens stack the copy and photo. A small native Web Animations API reveal runs once on its heading and paragraphs when the text enters view. It only changes opacity and transforms, preserves the section's dimensions, and is disabled or cancelled for reduced-motion preferences.

- The existing 34-second, 1280 × 720 local film is playable. Its historical filename is `bharat-electricity-2027.mp4`; it is labelled **Archive footage**, not a verified 2026 highlight film. A verified complete 2026 film remains unavailable.
- Desktop playback is muted and inline. Phones, reduced-motion preferences and data-saving connections start with the poster and a Play film control. Playback pauses when the hero leaves the viewport or the tab is hidden. Open film provides the browser's native player.
- Three homepage photographs are from the official **2026 second Governing Council meeting** album: https://photos.app.goo.gl/dkJmB5x7vYMugAsg7. Individual sources and dimensions are in `src/content/homepage-media.json`.
- The report panel uses the user-supplied transparent report cover artwork and the title **2026 Post-show Report**. Its action is **Request the report**, linking to the existing enquiry page, which also uses the 2026 cover and edition copy. No downloadable PDF has been supplied.
- The awards, power and energy solutions, and networking highlights use the user's supplied 2026 photographs. Their source filenames, dimensions and edition labels are recorded in `src/content/homepage-media.json`. Images retain their complete composition on desktop and mobile.

## Interaction and performance

The hero film and the one-time introduction text reveal are the homepage's automatic motion. Highlights and company, council and speaker rows start stationary, with manual controls; the highlight slideshow can be enabled explicitly. Directory rows initially render eight cards and add the rest when they enter the viewport, retaining reserved heights. Partner images load lazily. Promotional statistics remain static.

Wheel smoothing remains available, with native touch scrolling and reduced-motion handling. Scroll-triggered card and section transforms have been removed globally to eliminate unnecessary visual movement. The highlight stage reserves enough room for every slide so controls and adjacent content stay in place.

## Verification

Run `npm run typecheck`, `npx next build`, `node scripts/finalize-export.mjs`, `npm run check`, `node scripts/check-branding.mjs`, and `node scripts/check-homepage-cleanup.mjs` against the preview server. The previous `check-homepage-presentation.mjs` entry point forwards to the current checks.

Browser verification covers 320, 375, 768, 1024, 1440 and 1920px: real media decoding, play/pause/resume, offscreen pausing, range requests, reduced motion, complete government artwork at every width, stationary partner hover, all five highlight layouts, stable page height, company search and manual navigation. WCAG A/AA scans run at mobile and desktop widths. Screenshots and results are in `research/qa/homepage-cleanup/`.
