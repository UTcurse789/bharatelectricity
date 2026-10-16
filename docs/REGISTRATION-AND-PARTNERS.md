# Registration and partner pages

The Register hub at `/registration-options` is the destination of the header Register button. It links to Visitor Registration, Delegate Registration, Make a Stand Enquiry and Exhibition Space Booking. Existing route slugs are preserved.

## Registration

The redesign follows the user's four reference screenshots: a dark title banner and action strip, a meeting-place introduction, four event highlight panels and three photograph-led panels for group bookings, exhibitors and media. The original reference photographs are reused. The statistics keep their explicit 2026 promotional attribution. Visitors use a single registration form, and delegates have four categories: domestic, international, domestic student and international student.

Visitor and delegate registration now use the organiser-supplied BharatElectricity2027 Zoho forms. Indian and international visitors share the Visit URL. All four delegate category buttons reveal the supplied Delegate Registration form below the cards without leaving the page or opening a new tab. The shared form automatically resizes instead of using an inner scrollbar. The delegate/visitor shortcuts sit immediately below the title. New-tab fallback links are removed throughout the shared form component. The requested `/thankyou-for-registrating-in-bharatelectricity2027/` page is available; linking it after successful submission requires the Zoho-side Parent Window redirect setting. See [current form configuration](ZOHO-FORMS.md) for all enquiry URLs and verification.

## Partners and logos

- Partners 2026 displays all published partner roles and sponsorship artwork directly, with the principal energy, technology and utility partners first. There are no content accordions or animated logo loops.
- Partners 2025 restores 21 main partner placements from the original 2000 × 3222 partner board. Crops preserve the artwork and the published roles, including Diamond, Gold, Safety, Industry, Host Utilities and Knowledge Partners. Strategic partners, 92 key-participant logos and 25 media-partner logos remain visible below them.
- The complete original 2025 partner board is available through a full-size artwork link.
- Government-support artwork uses native **1253 × 1005** source files in lossless WebP instead of the reduced homepage versions. Ministry names also appear as readable text on Partners 2026.
- Company and historical participant directories keep their own edition-specific logo collections and search controls. CESC source-file aliases continue to prevent a duplicate partner logo.

Sources are the organiser's published registration and partner pages and their original CDN files. Per-image source URLs and native dimensions are recorded in `src/content/partner-artwork-upgrades.json` and `src/content/main-partners-2025.json`. Preparation scripts retain source pixels without upscaling or generating replacement logos.

## Design and verification

Mode: preserve the current brand and follow the reference layout. DESIGN_VARIANCE 4, MOTION_INTENSITY 2, VISUAL_DENSITY 5. Native CSS, Montserrat, dark green/charcoal panels and orange registration actions remain in use. No new animation is added. Page structure, logo display and registration actions are checked at mobile, tablet and desktop widths.

Run `npm run typecheck`, `npx next build`, `node scripts/finalize-export.mjs`, `npm run check`, `node scripts/check-branding.mjs`, and `node scripts/check-registration-partners.mjs --registration-only` against the local preview server. Registration browser checks cover 1440, 768, 375 and 320px, the header destination, all navigation choices, the 2027 Zoho visitor form, four delegate categories, matching hosted registration URLs and local WCAG A/AA accessibility. Omit the flag to include the partner and exhibitor directory checks.
