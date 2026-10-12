# Navigation and structure update

The site now has six top-level navigation groups: About, Exhibition, Conference, New Initiatives, Partners and Media. Exhibition and visitor information share the Exhibition menu; awards sit within Conference; contact information is available through the enquiry action and footer.

- The About menu now uses The Legacy and a nested council menu for 2026, 2025 and 2024. About the Events uses `/about-events`; Global Series is included alongside Market Opportunities and Organiser. See `docs/ABOUT-SECTION.md`. The 2025 and 2024 year tabs show one edition at a time, newest first, with participants, council, partners and available speakers linked from that year's archive. Percentage figures use text values instead of generated bar charts; original source images remain available in optional disclosures.
- Register replaces Registration Options and links to dedicated Visitor Registration, Delegate Registration and Exhibition Space Booking pages. Visitor and delegate routes display their own information and enquiries. The site's existing completed-edition status is retained, with new registration URLs awaiting the user.
- Participants 2026 replaces the exhibitor directory label in navigation, the page heading and homepage/footer links.
- `/new-initiatives` links to dedicated NuclearX, TransitionX, FinanceX, StorageX and Startups pages. These contain introductory topics and participation enquiries without invented schedules, packages or speaker allocations.
- `/speaking-opportunities` combines the three speaking pages and uses one enquiry form. The old URLs render the consolidated content and identify the new canonical URL.
- `/partner/sponsor` includes Indian Utility Week partnership information. `/become-sponsor-indian-utility-week` renders that shared page.
- The partner directory displays every available 2026 partner group, government support and focus-state artwork together. Matching artwork is deduplicated across the homepage and imported partner records. Participant-company records remain in Participants 2026. Historical partner lists are accessible through Our Legacy.
- The About overview identifies Bharat Electricity, POWERGEN India and Indian Utility Week. `/event/co-located-events` also remains available.

Links to the legacy POWERGEN India website use local destinations. The About Global Series portfolio links directly to the international POWERGEN event website as shown in the supplied reference. The Official Event Source link beneath Our Valued Partners was removed. Historical source URLs remain in the content manifests for provenance. POWERGEN social profiles were removed because Bharat Electricity replacements were not supplied. The legal pages offer contact links to request current organiser documents instead of linking back to POWERGEN; they do not invent replacement legal terms.

## Verification

`npm run typecheck`, the production static export and `npm run check` validate compilation, routes, internal links and local assets. `node scripts/check-navigation-structure.mjs` checks every exported anchor for POWERGEN destinations, desktop/mobile navigation, initiative pages, canonical aliases, year-tab keyboard/hash behavior, complete partner visibility, responsive overflow and WCAG A/AA accessibility. Screenshots and results are saved under `research/qa/navigation/`.

A mobile Lighthouse audit of New Initiatives reported accessibility, best practices and SEO at 100, performance at 74 and cumulative layout shift at 0. The remaining performance cost includes shared site scripts and the existing government banner.
