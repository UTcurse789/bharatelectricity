# Media Enquiries and Post Show Report

The original routes remain `/media-hub/media/` and `/media-hub/postshowreport/`. Both pages have Montserrat regular/semibold/bold, a static green masthead, white content areas, orange accents, Media section links and responsive layouts.

Media Enquiries follows the supplied [reference page](https://www.powergen-india.com/media-hub/media): media/association partnerships, four areas of support, authentic media photography and press accreditation. Partnership and accreditation actions open email enquiries to the existing event contacts. Accreditation copy relates to future editions rather than promising attendance at the completed 2026 event.

Post Show Report follows the supplied [report reference](https://www.powergen-india.com/media-hub/postshowreport), with the genuine 2025 report cover and exhibition photograph on the left and the hosted form on the right. The current organiser-supplied BharatElectricity2027 Zoho URL uses `QueryType=Post%20Show%20Report%20Download`, with no additional tracking parameters. See [current forms](ZOHO-FORMS.md). Its iframe is 100% wide and 1200px tall, with a descriptive title and an alternative link to the same form. The form is handled by Zoho/ITEN Media. No download PDF, submission API or success confirmation is invented.

Artwork comes from the existing verified source manifest: `PSR-2025.png`, `IMG_6869.jpg` and `IMG_0770.JPG`. The cover's 2025 edition is clearly labelled. The screenshots' animated background is replaced with the static visual language established for the site's redesigned sections.

`scripts/check-media-pages.mjs` checks both routes at 1440, 375 and 320px, WCAG A/AA accessibility, image loading, Montserrat, overflow, contact actions, Media menu navigation, the exact embed URL and 1200px height. The production build and internal-link/asset checks also cover the pages. Read-only hosted-form verification uses no personal data and submits no request.
