> Latest update — 9 October 2026: The complete 9 October website refresh is documented in docs/WEBSITE-REFRESH.md. It includes full reference editorial pages, exhibitor manual and awards material, older participant/council/partner archives, all 19 news bodies, 26 video cards and all 11 official albums. The supplied stand images are integrated with format-specific enquiry links.

# BHARAT ELECTRICITY website

Next.js 16 App Router, TypeScript and Tailwind CSS. All event content is local; there is no database, Strapi or admin panel.

## Run

Use Node.js 22.19+ and npm.

- npm install
- npm run dev
- npm run build (creates the static multi-page website in out/)
- npm run preview (serves the production export on http://localhost:4173)
- npm run typecheck
- npm run check
- node scripts/check-motion.mjs (production preview: scrolling, anchors, keyboard focus, reduced motion, mobile gestures and scroll locks)
- node scripts/check-homepage.mjs (production preview: homepage typography, artwork, partner tabs, participant rails, accessibility and 320-1440px layouts)

## Brand and appearance

The supplied BHARAT ELECTRICITY logo is displayed prominently in the header and footer. The website uses black Outfit typography, white backgrounds and orange accents, including when the operating system requests dark mode. Original logo colours are preserved. The self-hosted variable font and its OFL license are in public/fonts. The homepage opens immediately; the first-visit introduction has been removed. Energy graphics and scroll reveals respect reduced motion. See docs/REBRAND.md for the branding, animation, image and canonical-route changes.

The homepage includes government support, focus states, all published partner categories, selected participating companies, the full 2026 council, selected 2025 speakers, international event artwork and organiser identities. Real 2025 exhibition photography is labelled with its edition. Partner tabs and manually browsable participant rails provide keyboard and touch controls. Artwork and source references are in src/content/homepage-partners.json; missing council portraits were matched by the exact names printed beside the images, with provenance in src/content/council-portrait-sources.json. Source download/optimisation scripts are scripts/prepare-homepage-content.mjs and scripts/prepare-council-portraits.mjs. The design audit and direction are recorded in research/homepage-design-brief.md.

The user-supplied government support banner appears above the navbar on every page, outside the sticky header, and scrolls away naturally. Navbar dimensions stay unchanged during scrolling; mobile menus measure the available space below the navbar at their current position. `GovernmentBanner.tsx` and `src/content/header-assets.json` define the banner. The supplied BE favicon is exported as a multi-size ICO, a 64px Next.js icon, 32/48px browser PNGs and a 180px Apple icon. `scripts/prepare-header-assets.mjs` prepares these artwork assets from the supplied local files.

The homepage's gallery strip and photo-led insights section use five additional verified 2025 exhibition images with responsive WebP variants. Provenance is in `src/content/insight-photos.json`; `scripts/prepare-insight-photos.mjs` rebuilds them from the locally cached originals. The insights link to the existing directory, published summit programme and official post-show report rather than inventing news articles. Warm orange surfaces and fuller photography give the page more visual activity while preserving black type.

Smooth wheel scrolling uses Lenis in `src/components/SmoothScroll.tsx`; touch scrolling remains native. Anchor offsets follow the actual header height, and section links preserve focus and history. Open mobile menus and photo dialogs pause page scrolling. Reduced-motion changes apply live. Scroll reveals avoid moving a section and its cards together, observe dynamically inserted directory cards and release completed animations. Text effects use batched layout reads, display-rate animation frames and time-based pointer easing; hidden or offscreen canvas effects pause. Adjust scroll interpolation (`lerp`) and reveal timing in the corresponding components.

## Edit content and editions

Edit src/content/site.ts for the active edition, status, public contacts, navigation and statistics. The approved 2026 edition is completed, dated 1-3 September 2026 at Yashobhoomi (IICC), Dwarka, New Delhi. Do not add future dates without approval. The active configuration drives the homepage, header and structured data; archived routes and historical records remain edition-specific. Update editorial content only after the new edition is approved. Edit src/content/pages.ts for editorial pages. src/content/imported.json stores master people/companies separately from edition appearances, stand allocations and partner roles. Content-access functions live in src/lib/content.ts. Public assets are local and source references are documented in docs/CONTENT-REVIEW.md and src/content/asset-sources.json.

## React Bits and Taste Skill

The requested design-taste-frontend skill is installed locally under .agents/skills/design-taste-frontend. It becomes discoverable on the next turn; its SKILL.md was read and applied during this implementation. React Bits CountUp-TS-TW was retrieved from the official registry and adapted for reduced motion and visible server-rendered values. The existing homepage hero heading uses a small CSS transform. Partner logos are static, so no moving strip needs pausing. The event carousel uses the supplied TechText, WarpText (WebGL) and VariableProximity effects, with readable server-rendered fallbacks and reduced-motion support.

components.json includes @react-bits without discarding other registry settings. A shadcn MCP connection was not available or claimed. To configure one in ~/.codex/config.toml:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

The verified registry identifier is @react-bits/CountUp-TS-TW. Registry source: https://reactbits.dev/r/CountUp-TS-TW.json. Adapted source lives in src/components/react-bits/CountUp.tsx. The project retains its registry configuration for future components.

## Submission service and Strapi

The enquiry form validates locally and explicitly states that online submission is unavailable. It never reports a false success. After validation, the visitor can prepare an email using their email application. To enable submission, provide an approved HTTPS endpoint in site.submissionEndpoint, add server-side validation, spam protection, privacy/consent handling, and an explicit {success:true} response after confirmed receipt. Update the form’s availability text when enabling the service. Never place service credentials in client code. A Next.js server/API deployment is required for an internal endpoint; the current static export can use an approved external endpoint.

For Strapi, preserve the master and edition relationship models, replace the local implementations in src/lib/content.ts with typed content fetches, and regenerate static pages at publication. Server-only API tokens belong in environment variables. Switch from static export only if live server features are needed.

## Deployment and routes

The current Sites manifest exports out/ as static assets. Set NEXT_PUBLIC_SITE_URL to the approved origin for another deployment. Most practical legacy URLs are retained; docs/ROUTES.md documents additions and aliases. Legal pages link to the organiser’s current notices rather than silently rewriting legal text.

## Verification

Production build, TypeScript, content integrity, navigation, filters, agenda, gallery, form validation, and responsive visual checks are run before delivery. See docs/VERIFICATION.md for recorded results and limitations.

## Contact lanyard

The Contact page has three React Bits Lanyard cards below the full enquiry layout: Amit Gupta on the left, a larger, raised Siddhartha Mishra card in the center, and Hansika Gupta on the right. On mobile, Siddhartha comes first. Each badge prints the person's portrait, name and role; email and telephone links sit below it. The supplied component source is in `src/components/react-bits/Lanyard.jsx`; integration and static fallbacks are in `ContactLanyard.tsx` and `ContactLanyard.css`. Three.js loads only as the cards approach the viewport. Each card supports mouse/touch dragging and clicking, or Enter/Space while focused, to flip. Entrance animation and gentle breeze use the supplied React Bits settings; an icon button pauses automatic sway. Rendering pauses off-screen and in a hidden tab, limits pixel density to 1.5, and disposes resources on unmount.

Reduced motion, unavailable WebGL, context loss and JavaScript-disabled browsing retain a static portrait badge. The three optimized local WebP portraits and their dimensions are recorded in `src/content/lanyard-image.json`; production builds do not need the original photo files. With the production preview active, run `$env:CHECK_ORIGIN='http://localhost:4173'; node scripts/check-lanyard.mjs` in PowerShell to verify it.

## Complete homepage listings

The homepage includes all 99 published companies, 49 council members and 72 unique historical speakers, with searchable swipeable rails. Government/state artwork includes readable names. Speaker coverage and original 77 artwork records are documented in `src/content/speaker-artwork-sources.json`; run `node scripts/prepare-complete-speakers.mjs` to restore source assets or missing profiles. All edition labels are preserved.

## Compact navbar and section ribbons

The navbar content is narrower and the logo is scaled to 260px desktop, 240px tablet, 210px mobile and 190px on small phones. Four homepage headings use the original React Bits repeating wave, placed immediately after each heading and tilted 8 degrees downward toward the right corner. Descriptions remain beneath their headings; mobile ribbons stay compact and right-aligned. There are no ribbon pause buttons or hover-pause controls; system reduced motion, hidden-tab and offscreen suspension remain supported. The component is in `src/components/TextLoop.tsx`, with its section configuration in `SectionRibbon.tsx`. Run `node scripts/check-text-loop.mjs` with the production preview to verify placement, animation and requested removals.

The bottom Government support and The team behind the event sections are removed, together with the organiser/partner logo block in the site footer. The supplied government banner above the navbar remains.
