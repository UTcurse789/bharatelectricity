# Google Tag Manager

The site uses the organiser-supplied container `GTM-PVRQL6FP` in `src/app/layout.tsx`. The standard bootstrap is loaded through `next/script` after hydration, once per document, and the matching zero-size `noscript` iframe is the first body element.

The original snippet's Markdown escaping was removed. Google documents both installation snippets in its [web container installation guide](https://support.google.com/tagmanager/answer/14847097?hl=en-GB). The installed Next.js documentation recommends `afterInteractive` for tag managers.

The privacy page discloses Google Tag Manager. Analytics tags, destinations and triggers are managed in the supplied GTM container. No additional analytics ID, custom conversion events or collection of enquiry form fields is added by the site code.

# Zoho SalesIQ

The organiser-supplied India-region SalesIQ widget is installed globally in `src/app/layout.tsx`. The `zoho-salesiq-bootstrap` script runs through `next/script` after hydration, initializes the supplied `$zoho.salesiq.ready` callback, and then appends the deferred provider script with the exact supplied URL and `zsiqscript` ID. Existing Zoho configuration is preserved. The script ID guard and persistent root layout prevent duplicate widgets during client-side navigation.

The privacy page identifies SalesIQ as the live chat and visitor engagement service. Chat appearance, operator availability and visitor engagement settings remain managed in the organiser's SalesIQ account. No chat messages or visitor form fields are supplied by the site code. [Zoho installation guidance](https://help.zoho.com/portal/en/kb/salesiq-2-0/for-administrators/setup-brand/articles/setting-up-the-website-channel)

Published on 15 October 2026 through Vercel deployment `dpl_71RhHGeLAwZ6ibc8z2WBMdrePMv2`. Checks covered 317 application HTML pages, a single widget request across four client-side pages at desktop/mobile sizes, initialization order, preservation of existing Zoho configuration and continued site use when the widget is blocked. The real provider script returned HTTP 200, invoked its ready callback and displayed its launcher on the public domain, with no browser errors. No chat messages were sent during verification. Local reports are in the ignored `research/qa/salesiq/` directory.
