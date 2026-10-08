# Route migration

Retained: /event, /event/legacy, /governing-council-2026, /exhibit-at-powergen-india, /exhibit-at-powergen-india/stand-options, /exhibitor-guide, /why-visit, /venue, /summit-overview, /summit-overview/2026-summit-agenda, /2025-speakers, /knowledge-hub, /awards, /partners-2026-o1rs, /media-hub/event-news--press-releases, /media-hub/gallery, /video-gallery, /about-powergen-india/contact-us, /privacy-policy, /terms--conditions.

Added: /exhibitors (searchable 2026 directory), /registration-options (closed/pending registration state), /speakers/{master-person-id} (person detail).

Exhibitor detail slugs are retained from the official modal listings under /exhibitors/{slug}. News detail slugs are retained under /industry-news/{slug}. Current 2026 entries replace the old navigation’s misleading Exhibitor List link to Participants 2025; historical participation has not been reassigned.

Convenience aliases: /welcome, /about, /about-the-event, /legacy, /speakers, /agenda, /gallery, /contact, /partners, /news, /terms, /why-exhibit, /visit. Aliases render the canonical content and emit canonical metadata. Static exports cannot issue server redirects; configure HTTP 301 redirects at the final host if needed.

No unsupported past council or participant URLs are silently mapped to a different edition. Add those archives only after their content is approved.
