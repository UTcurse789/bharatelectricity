# Speaking Opportunities

The Conference menu now opens `/summit-overview/speaking-opportunities-bharat-electricity`, matching the path supplied by the user. `/speaking-opportunities` and the other consolidated speaking URLs remain available with the same page and canonical destination.

The layout follows https://www.powergen-india.com/summit-overview/speaking-opportunities-bharat-electricity: a summit introduction, speaking enquiry copy and the original speaker photograph alongside the supplied Zoho form. The existing local asset `/assets/site-refresh/04eb0b6611c130.webp` is the original page's YVP_2302 photograph. The form retains the supplied permanent ID and `QueryType=Speaking Opportunities`; undefined click IDs and POWERGEN referral tracking are omitted. The iframe is 600px tall, stacks below the content on phones, and has a direct form link as a fallback. No enquiry was submitted during verification.

`node scripts/check-speaking-opportunities.mjs` checks 1440, 768, 375 and 320px layouts, image decoding, the embedded form destination, the older URL and canonical metadata. Local accessibility issues fail the check; findings inside the third-party Zoho iframe are recorded separately in `research/qa/speaking-opportunities/results.json`. Low-contrast dropdown placeholders in the provider-owned form require changes to its Zoho theme.
