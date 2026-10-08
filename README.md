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

## Brand and appearance

The supplied BHARAT ELECTRICITY logo is used in the header and footer. The website uses white backgrounds with orange and green accents, including when the operating system requests dark mode. The exact user-supplied Lottie plays once on first visit; Skip introduction bypasses it. Orange/green energy graphics and scroll reveals respect reduced motion. See docs/REBRAND.md for the branding, animation, image and canonical-route changes.

## Edit content and editions

Edit src/content/site.ts for the active edition, status, public contacts, navigation and statistics. The approved 2026 edition is completed, dated 1-3 September 2026 at Yashobhoomi (IICC), Dwarka, New Delhi. Do not add future dates without approval. The active configuration drives the homepage, header and structured data; archived routes and historical records remain edition-specific. Update editorial content only after the new edition is approved. Edit src/content/pages.ts for editorial pages. src/content/imported.json stores master people/companies separately from edition appearances, stand allocations and partner roles. Content-access functions live in src/lib/content.ts. Public assets are local and source references are documented in docs/CONTENT-REVIEW.md and src/content/asset-sources.json.

## React Bits and Taste Skill

The requested design-taste-frontend skill is installed locally under .agents/skills/design-taste-frontend. It becomes discoverable on the next turn; its SKILL.md was read and applied during this implementation. React Bits CountUp-TS-TW was retrieved from the official registry and adapted for reduced motion and visible server-rendered values. Homepage heading motion is a small CSS transform. Partner logos are static, so no moving strip needs pausing. No WebGL or scroll hijacking is used.

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
