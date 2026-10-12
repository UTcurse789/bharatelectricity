# About section redesign

The About section uses Montserrat regular, semibold and bold, a dark green masthead, white content surfaces and orange accents. Shared navigation connects every page without animated backgrounds or layout movement.

- `/about-events`: three co-located platforms, genuine 2026 council photography, native text statistics and participation actions.
- `/event/legacy`: the existing 2025/2024 timeline, galleries, figures and year controls within the shared About layout.
- `/governing-council-2026`: 49 published entries, separated into four chairs and 45 members. The original `MEMEBR` typo is corrected for display; imported source records are preserved.
- `/governing-council-2025`: all 34 published portraits and designations, with the three chairs separated from members.
- `/governing-council-2024`: all 27 published portraits and designations, including the honorary chairperson.
- `/event/market-opportunities-in-india`: readable opportunity summaries, exhibition/conference photographs and stand/prospectus actions.
- `/event/power--energy-series-a-global-portfolio`: seven international event entries on white backgrounds and the supplied Clarion enquiry iframe, titled and sized at 600px with an alternative direct link.
- `/event/organiser`: ENCIS, ITEN and international partner Clarion, with larger photographs and logos.

`/event`, `/about`, `/about-the-event` and `/about-the-events` continue to render the overview with `/about-events` as their canonical URL. The static export does not perform an HTTP redirect. The About menu includes an accessible nested council disclosure with Arrow Right/Down, Arrow Left and Escape support on desktop and mobile.

## Source records

The content follows the organiser's [overview](https://www.powergen-india.com/event), [2025 council](https://www.powergen-india.com/governing-council-2025), [2026 council](https://www.powergen-india.com/governing-council-2026), [2024 council](https://www.powergen-india.com/meet-our-confirm-advisory-committee), [global portfolio](https://www.powergen-india.com/event/power--energy-series-a-global-portfolio) and [organiser page](https://www.powergen-india.com/event/organiser).

New photographs retain their edition and original album in `src/content/about-asset-sources.json`. The 2025 roster is stored separately in `src/content/council-2025.json`, so its historical headshots are not replaced by 2026 portraits. Global event dates are the schedule published in the organiser's portfolio, rather than a live registration feed. The 2026 statistics remain clearly labelled as promotional figures.

The Clarion form is hosted externally. The supplied URL returned HTTP 200 with form markup and no `X-Frame-Options` restriction. The local browser environment blocks external network access, so browser QA verifies the embed URL, accessible title, dimensions and direct link; it does not verify a submission or claim one was sent.

## Verification

`npm.cmd run typecheck`, `npm.cmd run build` and `npm.cmd run check` verify compilation, static routes and every exported internal link/local asset. `node scripts/check-about-section.mjs` checks all eight pages at 1440px, 375px and 320px, heading/font consistency, roster counts, responsive overflow, nested-menu keyboard interactions, canonical aliases and iframe configuration. WCAG A/AA checks run for all eight pages at desktop/mobile widths and the shared header, excluding the cross-origin form. Screenshots and results are saved in `research/qa/about/`. All About page image assets were additionally loaded and checked in the browser.
