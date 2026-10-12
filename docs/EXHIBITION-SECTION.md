# Exhibition section redesign

The header now uses **Exhibition**, following the supplied reference menu. Why Exhibit links to its overview and has a separate submenu toggle for Who Exhibits, Previous Attendees and Stand Options. Participants List exposes 2026, 2025 and 2024. Visit exposes visitor information, participants, registration, networking and venue information. The long Exhibition dropdown scrolls within the available viewport; nested links remain accessible with the keyboard on desktop and mobile.

The pages share Montserrat regular, semibold and bold, dark green mastheads, white content areas, clear enquiry actions and restrained orange accents. No animated background text is introduced.

## Routes

- `/exhibit-at-powergen-india`: Why Exhibit.
- `/exhibit-at-powergen-india/who-exhibits-at-powergen-india`: native text sector lists, audience types and historical exhibitor/partner artwork with full-size links.
- `/exhibit-at-powergen-india/previous-attendees`: all 45 Indian and eight Asian attendee logos with readable company labels.
- `/exhibit-at-powergen-india/stand-options`: Raw Space and Shell Scheme, with stand enquiry links and planning actions.
- `/exhibitors`, `/participants-2025`, `/2024-exhibitors`: edition-specific participant directories. The 2026/2025 records have searchable names. The 2024 source publishes 104 logo images without verified text company names, so the artwork is retained without inventing a searchable roster.
- `/exhibit-at-powergen-india/make-a-stand-enquiry`: Zoho exhibition enquiry, retaining the selected Raw Space/Shell Scheme preference in a visible website note.
- `/space-application-form`: Indian, international and startup space applications supplied in the user's Word document. Submitting an application does not confirm a reservation.
- `/exhibit-at-powergen-india/view-the-floor-plan-92u6`: floor plan request form.
- `/exhibit-at-powergen-india/request-the-event-prospectus`: event brochure request, including the exact supplied Zoho URL and referral parameters.
- `/request-the-partnership-brochure`: partnership brochure request.
- `/exhibitor-guide`: the complete user-supplied 2026 manual, including schedules, onsite contacts, seven construction disclosures, original diagrams and 15 order forms with 19 original links. Completed-edition schedules are labelled as an archive.
- `/why-visit`, `/visiting/networking`, `/registration-options`, `/venue`: visitor pages in the shared design. The completed 2026 registration status is retained.
- `/about-powergen-india/contact-us`: the three verified team contacts with email/phone links, enquiry actions and the existing optional email preparation form.

`/why-exhibit`, `/stand-options` and `/contact` remain available as static aliases with canonical URLs pointing to the new primary routes. The exact five slugs supplied by the user are available locally. No HTTP redirects are claimed for the static export.

## Forms and content

The [brochure](https://www.powergen-india.com/exhibit-at-powergen-india/request-the-event-prospectus), [floor plan](https://www.powergen-india.com/exhibit-at-powergen-india/view-the-floor-plan-92u6), [stand enquiry](https://www.powergen-india.com/exhibit-at-powergen-india/make-a-stand-enquiry) and [partnership brochure](https://www.powergen-india.com/request-the-partnership-brochure) pages use the published Zoho enquiry form with distinct `QueryType` values. The first three now use the exact URLs and referral parameters from the Word document. Space applications use the separate domestic, international and startup forms supplied in that document. See [the document integration record](EXHIBITOR-DOCUMENT.md) for coverage, source handling and verification.

The supplied Zoho form returned HTTP 200 with form markup and no `X-Frame-Options` restriction. Each embed has a descriptive title, 600px height and an alternative new-tab link. The website cannot restyle the cross-origin form; its typography and submission behaviour are managed by Zoho/ITEN Media. With network access enabled, browser QA confirmed visible form fields at 1440px and 375px with no horizontal overflow inside the embedded form. Submission was not tested. No enquiries were sent.

Sector categories were transcribed from the organiser's original Who Exhibits artwork; repeated labels were removed. Historical exhibitor composites remain intact on white backgrounds. Existing authentic exhibition photographs are used with archive captions. New photographs and next-edition booking details have not been invented. The privacy page distinguishes local email preparation from the external Clarion and Zoho forms.

## Verification

`npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd run check` and `node scripts/check-branding.mjs` check compilation, the production export, internal links/local assets and branding. `node scripts/check-exhibition-section.mjs` checks all 18 pages at desktop/mobile widths, additional narrow layouts, expanded navigation at 1440/1280/375px, accessible headings, Montserrat, responsive overflow, searchable archives, pagination, selected stand preferences, manual disclosures, form URLs and canonical aliases. Axe WCAG A/AA checks cover page content and expanded menus, excluding the externally hosted iframe contents.

About-section and shared-navigation checks are also run to verify the header changes. Results and screenshots are stored under `research/qa/exhibition/`, `research/qa/about/` and `research/qa/navigation/`.
