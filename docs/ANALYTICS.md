# Google Tag Manager

The site uses the organiser-supplied container `GTM-PVRQL6FP` in `src/app/layout.tsx`. The standard bootstrap is loaded through `next/script` after hydration, once per document, and the matching zero-size `noscript` iframe is the first body element.

The original snippet's Markdown escaping was removed. Google documents both installation snippets in its [web container installation guide](https://support.google.com/tagmanager/answer/14847097?hl=en-GB). The installed Next.js documentation recommends `afterInteractive` for tag managers.

The privacy page discloses Google Tag Manager. Analytics tags, destinations and triggers are managed in the supplied GTM container. No additional analytics ID, custom conversion events or collection of enquiry form fields is added by the site code.
