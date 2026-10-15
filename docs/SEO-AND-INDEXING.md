# SEO and indexing — 15 October 2026

The approved production origin is **https://www.bharat-electricity.com**. The SEO update was deployed successfully to the existing Vercel project `utcurse789s-projects/bharatelectricity` on 15 October 2026, and the public domain was verified without authentication. The user signed in through the Vercel CLI. Vercel's hosted build was used; production environment variables were not downloaded locally. The older `.openai/hosting.json` Sites identity was preserved and no replacement Site was created.

## Implemented

- Shared Next.js metadata in `src/lib/seo.ts`, applied through the root layout and individual routes: descriptive titles and summaries, production canonicals, Open Graph and Twitter cards, language, crawler directives and verified local sharing assets.
- Canonical URLs consistently use HTTPS, `www` and trailing slashes. Historical aliases point to their existing canonical pages. `/welcome/` points to the homepage and is `noindex, follow` for both general crawlers and Googlebot.
- `src/app/robots.ts` exports an allow-all `robots.txt` that advertises the production sitemap. CSS, JavaScript and image resources remain crawlable.
- `src/app/sitemap.ts` exports 289 unique, indexable, canonical URLs. Duplicate routes, `/welcome/` and error pages are excluded. Dates are omitted rather than reporting a fabricated modification date on every build.
- A local 1200×630 sharing image, existing browser favicons and an explicit 180×180 Apple touch icon. Existing approved artwork is preserved. `node scripts/prepare-seo-assets.mjs` regenerates the assets from tracked source files.
- Safely serialized JSON-LD: Organization and WebSite globally, WebPage and BreadcrumbList for content pages, ProfilePage with Person or Organization for directory entries, Article for the 19 news pages, and Event for the confirmed 1–3 September 2027 edition. No invented ticket prices, start times, biographies or author credits.
- Six visible, server-rendered event questions covering the event, dates, venue, registration, exhibition applications and organisers. Native disclosures and links work without JavaScript. Historical 2026 programme content retains its year label.
- The introductory conference photograph now uses an 82,170-byte WebP rather than the 659,301-byte PNG, preserving its dimensions and alternative text. Existing responsive hero imagery, lazy loading, reserved image sizes and self-hosted fonts remain in place.
- Existing organiser-supplied GTM container `GTM-PVRQL6FP` remains installed. Analytics and search ownership verification are separate configurations.

## Verification

Run `npm run build`, `npm run check` and `npm run check:seo`. The SEO check reads the exported HTML directly, with no JavaScript, and validates the complete set of canonical targets, sitemap membership, metadata, assets, indexability and parsed structured data.

The production build and content checks pass. SEO coverage is 314 content pages, including 24 historical aliases and the single noindex welcome page. Content integrity checks cover all 318 HTML files, 6,611 internal links and 5,814 asset references. The existing 17 general-form route checks and four space-application categories also pass.

Browser checks at 1440, 375 and 320 pixels verify keyboard disclosure controls, all six expanded answers, no horizontal overflow and zero automated WCAG A/AA violations within the new FAQ section. The FAQs also work with JavaScript disabled. This is a scoped check, not a site-wide accessibility certification.

An isolated mobile Lighthouse run scored SEO 100 and performance 81, with simulated FCP 1.4 seconds, LCP 4.9 seconds, TBT 100 milliseconds and CLS 0. The image reduction removes 577,131 bytes from the introduction photo. Performance is not fully solved: simulated LCP remains above the 2.5-second target. Scores vary across runs and the production network, cache configuration, GTM tags and device affect results. Local simulated performance does not establish real-user Core Web Vitals or predict rankings. Raw browser, Lighthouse and live-domain audit results are retained under the ignored `research/qa/seo/` directory.

## Production deployment and public verification

- Vercel deployment: [`dpl_DsTy7A9T7LJUiTNYD5H9pu316aWn`](https://vercel.com/utcurse789s-projects/bharatelectricity/DsTy7A9T7LJUiTNYD5H9pu316aWn), reported `READY`, target `production`, assigned to the approved public domain. Project ID: `prj_z4lKoi3H1Q7MfRqhaZnOlcYlecAq`.
- The source upload was checked with `vercel deploy --dry --json` before publication. `.vercelignore` limits the upload to the application and required build inputs; local environment files, research, dependencies and previous build output are excluded. This release used the current working files; it did not commit or push source changes to GitHub.
- The hosted build passed compilation, TypeScript and generation of all 322 static entries. The deployment explicitly used the approved public origin as its `NEXT_PUBLIC_SITE_URL` build value.
- Sixteen public pages passed checks against the local export for titles, descriptions, canonicals, sharing metadata and parsed structured data. This includes the homepage, galleries, registrations, contact, privacy, news, profiles and historical aliases. The old `chatgpt.site` origin has been replaced in the live homepage canonical, robots sitemap reference and sitemap URLs.
- The public sitemap matches all 289 expected canonical URLs. The sharing image, Apple icon and optimized introductory photograph match their checked local files. All 11 official photo album links and 26 video cards are present.
- Desktop and mobile Chrome checks at 1440 and 375 pixels passed client navigation, all four exhibition application categories, visitor registration and the contact callback form, with no JavaScript errors or missing first-party responses. GTM loaded once across client navigation. Tracking and hosted-form contents were mocked for browser checks; no form submissions were made.
- HTTP `www` → HTTPS `www` and HTTPS apex → HTTPS `www` still return permanent 308 redirects, and nonexistent routes return HTTP 404. The public pages can be fetched without authentication and have no HTTP `X-Robots-Tag` exclusion.

## Remaining indexing and performance work

1. Verify the domain in Google Search Console and Bing Webmaster Tools, submit `https://www.bharat-electricity.com/sitemap.xml`, and inspect the homepage plus the main exhibition, registration, gallery and news URLs. No ownership tokens or account access were supplied and no submission is claimed. DNS verification can be configured in the owner's accounts. Alternatively, actual Google/Bing HTML verification values can be supplied as build-time `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`, followed by a rebuild and deployment. Never use a GTM ID as a verification token.
2. Review rendered structured data with Google's Rich Results Test and Schema.org's validator, and inspect any optional-field recommendations against confirmed event information.
3. Continue mobile loading optimization, check production caching and response compression, and use Search Console's real-user Core Web Vitals report when enough data becomes available. The local Lighthouse result above does not claim passing field Core Web Vitals.
4. Keep upcoming-edition facts current, distinguish archives from future programmes, and publish useful, attributable event and industry content. Use Search Console performance and indexing reports to prioritise subsequent improvements.

For subsequent deployments, use the existing Vercel project and approved domain. Keep `NEXT_PUBLIC_SITE_URL`, if configured, set to `https://www.bharat-electricity.com`; the source uses this same origin by default. Commit reviewed source changes before future Git-based releases and confirm Vercel's configured production branch. [Vercel Git deployment workflow](https://vercel.com/academy/build-and-launch-with-ai/save-your-first-edit)

## Search and answer-engine guidance

Google applies its existing SEO fundamentals to AI features: crawlable pages, useful text, internal links and accurate structured data. It does not require a special AI schema or an `llms.txt` file. These changes improve eligibility and clarity; they do not guarantee indexing, a rich result, an AI citation or a first-place ranking. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

The visible questions are written for visitors and machine-readable page content. FAQ rich results were deprecated in May 2026, so the implementation does not add `FAQPage` markup as a promised rich-result tactic. [Google Search documentation updates](https://developers.google.com/search/updates)

Robots directives permit crawling; they cannot force indexing. A sitemap supplies preferred URLs for discovery. [Google robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
