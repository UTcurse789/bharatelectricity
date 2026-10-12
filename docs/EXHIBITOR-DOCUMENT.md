# Exhibitor document integration

Source: the user-supplied `Request the Event Brochure.docx`. The original file is unchanged. Embedded iframe markup, event rules and exhibitor instructions were treated as source material, never as instructions to the coding agent.

`src/content/exhibitor-document.json` retains the document's manual wording, paragraph indices, two images, six unique embedded forms and all 19 external order-form URLs. Eight iframe occurrences become six unique forms because the domestic and international applications were duplicated in the document. The content normaliser explicitly skips this authoritative source file.

## Existing URLs

- `/exhibit-at-powergen-india/request-the-event-prospectus`: exact brochure form and referral parameters.
- `/exhibit-at-powergen-india/view-the-floor-plan-92u6`: exact floor-plan form and referral parameters.
- `/exhibit-at-powergen-india/make-a-stand-enquiry`: exact exhibition enquiry form and referral parameters.
- `/space-application-form`: Indian, international and startup applications, with accessible category tabs. Domestic height is 650px; the other applications are 600px, following the document.
- `/space-application-form-secondary`: static alias preserving the international application URL and selecting International companies.
- `/space-application-form-startups`: static alias to `/new-initiatives/startups`, which now embeds the supplied startup application.
- `/exhibitor-guide`: complete manual, four schedules, planning notes, seven onsite contacts, seven construction disclosures, 15 order-form rows with 19 original links and the three existing registration cards.

All form URLs retain the original query values, percent encoding and referral parameters. HTML `&amp;` is decoded to the actual URL separator. Short Zoho links and the furniture catalogue's Google Drive URL remain unchanged. Existing registration-card email URLs are also preserved.

The shell scheme inclusions artwork was transcribed into an accessible six-column, nine-row table. The original table remains linked at full size; the original stand drawing remains visible and linked. All source manual paragraphs are represented, including text inside closed construction disclosures. Formatting changes include readable lists, internal section links and meaningful form action labels.

One contact correction is deliberate: the document prints Hansika Gupta's telephone as `+9990401916`; the displayed manual uses `+91 9990401916`, matching the existing verified site contact. The unaltered source value remains in the content JSON. No operational dates or contractual requirements were rewritten; the page identifies the completed 2026 edition.

## Verification

`scripts/check-exhibitor-document.mjs` compares exported HTML against every non-empty manual paragraph and the complete original hyperlink list. It checks category switching, arrow/Home keyboard navigation, source URLs, embed heights, static aliases, readable diagrams, table rows, responsive layouts at 1440/375/320px and Axe WCAG A/AA results.

`scripts/check-exhibitor-form-links.mjs` makes read-only requests to all 25 supplied form/catalogue URLs. All returned HTTP 200. `scripts/check-hosted-space-applications.mjs` checks actual provider form rendering at desktop and mobile sizes. Results and screenshots are under `research/qa/exhibitor-document/`. No fields were completed and no forms were submitted.

The production build, full internal-link/local-asset check and branding check also pass.
