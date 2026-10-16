# Current Zoho forms

The organiser supplied the BharatElectricity2027 form URLs on 15 October 2026. `src/content/zoho-forms.ts` is the current URL configuration for embeds and direct links.

| Enquiry | QueryType |
| --- | --- |
| Event brochure | Brochure Download |
| Post-show report | Post Show Report Download |
| Partnership brochure | Partnership Brochure Download |
| Floor plan | Floor Plan Download |
| Exhibition enquiry | Exhibit |
| Callback | Request a call back |
| Delegate registration | Delegate Registration |
| Speaking | Speaking Opportunities |
| Partnership enquiry | Partnership Opportunities |
| Visitor registration | Visit |

Each enquiry URL uses the supplied permanent ID `CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk` and its supplied `QueryType` parameter. Embeds add Zoho's `zf_rszfm=1` flag for automatic sizing. Both callback entries supplied by the user refer to the same URL.

Visitor registration uses the 2027 Zoho form. Selecting any of the four delegate categories reveals the shared organiser-supplied delegate form on the same page. Categories use the same supplied URL; no unsupported category-prefill parameter is added. Changing category keeps the shared form mounted, preserving entered details. Partnership and callback pages also submit through their supplied hosted forms.

`ZohoEnquiry` automatically adjusts iframe height using Zoho's `permalink|height[|scroll]` messages. It validates the exact origin, source window and form ID, then applies the reported height with a small safety margin. Resizing responds to mobile layouts, conditional fields and validation. There is no inner scrollbar or new-tab fallback link. The form is in the normal document flow, so the website has a single page scrollbar. See [Zoho's automatic-height embed documentation](https://help.zoho.com/portal/en/kb/forms/embedding-forms/embedding-forms-in-webpages/articles/embed-using-javascript).

## Registration thank-you destination

The website includes `/thankyou-for-registrating-in-bharatelectricity2027/`, using the requested spelling in lowercase. It uses the site theme, offers home/summit/contact links, and is marked `noindex` and excluded from the sitemap. The previous mixed-case URL redirects permanently to the lowercase URL through `vercel.json`; the local preview uses the same redirect rules. Other static hosts need the equivalent redirect configured.

To connect it after successful registration, set **Settings → General → Thank You Page & Redirection → Redirect To → Website** in the Zoho form builder. Use `https://www.bharat-electricity.com/thankyou-for-registrating-in-bharatelectricity2027/` and select **Parent Window**, so the website opens the thank-you page in the existing tab. Configure any category-specific rules to use that destination as appropriate. This is a provider-side setting and cannot be changed by the static website code. Do not infer submission success from iframe loads or height changes. See [Zoho's redirect documentation](https://help.zoho.com/portal/en/kb/forms/form-settings/general-settings/articles/thank-you-page-redirection).

The shared form is also used for brochure, callback and other enquiries; review any Zoho redirect rules before applying a single destination to every query type. The website's surrounding UI uses existing green/orange tokens and Montserrat. Colours and fonts *inside* the cross-origin Zoho form must be changed in Zoho's form theme builder.

Space applications use four separate organiser-supplied URLs in `spaceApplicationFormUrls`: Indian companies, international companies, startups and MSMEs. The booking page exposes all four categories with automatically sized embeds. The international alias opens the international category, and the startup page and its alias use the new startup form. The imported exhibitor content also records these current application URLs.

Exhibitor service/order forms and Clarion international event forms retain their existing destinations. Historical source manifests record the original URLs.

After building, run `node scripts/check-zoho-forms.mjs` to check all ten enquiry types, four space application categories, aliases, fallback removal and old-link removal across the static export. Add `--browser` for responsive layout and local accessibility checks, or `--browser --space-only` for the space application checks alone. `node scripts/check-inline-registration.mjs` checks selection, automatic sizing, message validation, same-tab navigation and the thank-you page. Browser regression checks replace provider frames with controlled fixtures and submit no data.
