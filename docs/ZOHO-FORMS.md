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

Each URL uses the supplied permanent ID `CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk`, with only its supplied `QueryType` parameter. Both callback entries supplied by the user refer to the same URL.

Visitor registration now uses the 2027 Zoho form. All four delegate categories use the supplied delegate URL, with a shared embedded registration form. Partnership and callback pages also submit through their supplied hosted forms.

Space applications use four separate organiser-supplied URLs in `spaceApplicationFormUrls`: Indian companies, international companies, startups and MSMEs. The booking page exposes all four categories, with matching embeds and direct links. The international alias opens the international category, and the startup page and its alias use the new startup form. The imported exhibitor content also records these current application URLs.

Exhibitor service/order forms and Clarion international event forms retain their existing destinations. Historical source manifests record the original URLs.

After building, run `node scripts/check-zoho-forms.mjs` to check all ten enquiry types, four space application categories, aliases, matching fallback links and old-link removal across the static export. Add `--browser` for responsive layout and local accessibility checks, or `--browser --space-only` for the space application checks alone. Browser checks replace provider frames with local placeholders and submit no data.
