# Year-wise content review

Reviewed on 12 October 2026. The site's configured latest edition remains 2026, with the completed-edition status retained. The homepage and banners explicitly identify their editions; 2025 speakers and the 2025 report/awards/exhibition imagery are labelled as archive material.

## Edition structure

`src/content/editions.ts` provides 2026, 2025 and 2024 edition hubs at `/editions/{year}`. Council, participants, speakers, partners and gallery pages use shared year navigation. Photo tabs separate inauguration, conference, exhibition and Governing Council photographs by year. Existing historical URLs remain available, including `/exhibitor-list`, which resolves to `/participants-2025`.

The 2026 participant page and homepage link are titled Participants 2026. The 2025 speaker archive remains separate from the 2026 speaker page, which states that the complete directory is not yet available. The completed edition does not offer a live registration claim in the hero.

## Governing Council 2024

Source: [the organiser's published 2024 council](https://www.powergen-india.com/meet-our-confirm-advisory-committee), with the corresponding saved HTML in `research/site-refresh/meet-our-confirm-advisory-committee.html`.

All 27 published members are now represented in `src/content/council-2024.json` with their names, historical positions, organisations and matching portraits. The page displays readable text beside the portraits instead of a flattened list and an unrelated image grid. A complete standalone record is available at `/downloads/governing-council-2024.html`.

Formatting corrections remove duplicate organisation strings, stray commas and the misplaced New Age Markets company fragment from S. K. Soonee's entry. The original position/organisation strings are retained in the data for changed entries. These are historical designations, not current appointments. The first four undated generic images on the historical council source pages are omitted from the 2025 presentation; they are not reassigned as council photographs for a named edition.

## Participant records

Source: [the organiser page headed Participants 2025](https://www.powergen-india.com/exhibitor-list). Its 99 published names and artwork are stored separately in `src/content/participants-2025.json` and rendered in a searchable 2025 archive. The existing 2026 directory remains separate.

The public 2025 page shares the live exhibitor catalogue. No independently dated 2025 register was available, and the public archival-snapshot request timed out. The 2025 archive therefore withholds stand allocations and clearly states that they await confirmation. Original published stand strings remain in `publishedStand` for review; they are not presented as verified historical allocations. An original 2025 register is needed to confirm those details and independently audit the historical participant list.

## Inauguration photographs

Verified source albums:

- [Bharat Electricity 2024 Conference](https://photos.app.goo.gl/gJk2Wdu3nVE87hFe8): ceremony photograph with Shri Pralhad Joshi and a photograph of him on the inaugural stage.
- [Bharat Electricity 2025 Conference](https://photos.app.goo.gl/LdDGSEzkTrC4wWFc8): ceremonial lamp lighting and the inaugural group photograph.

The album titles were checked, contact sheets were inspected, and full-resolution source photographs were saved as local WebP assets. `src/content/inaugurations.json` retains each album URL, individual image URL, verified album title, caption, dimensions and edition. They appear in the matching edition hubs, Our Legacy panels and year-filtered photo gallery.

No verified inauguration photograph for the September 2026 edition was found in the supplied materials or the organiser albums. The 2026 council-meeting images retain their actual category, and the inauguration section states that photographs will be added when available. The distinct March 2026 Bharat Electricity Summit is not used to fill this September event's archive. The user confirmed that the original files are not available right now.

## Validation

`scripts/check-edition-content.mjs` verifies council completeness and portrait loading, standalone record readability, year-specific participant labels, historical URL aliases, inauguration provenance, gallery year filters and lightbox captions, responsive overflow and WCAG A/AA accessibility. Production build, content/asset integrity and branding checks cover the complete static export. Screenshots and results are saved under `research/qa/editions/`.
