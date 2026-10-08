# BHARAT ELECTRICITY rebrand

Applied the user-supplied Bharat Electricity logo TM.png without redrawing or removing its tagline/TM mark. The original PNG is retained, with a 1600px WebP for the website. Header and footer preserve its full aspect ratio.

All rendered event branding, title metadata and programme labels now use BHARAT ELECTRICITY. Removed the three-event identity block and changed the fourth statistic to the verified three programme days. Programme areas use descriptive Power Generation and Grids & Utilities labels; the original session titles, dates and source links remain intact.

All website surfaces are white. Green and orange come from the supplied logo; darker green/orange text shades maintain readable contrast. Dark mode, dark overlays and dark lightbox surfaces are removed. Archived news screenshots carrying the old event brands are omitted; article titles, excerpts and source links are retained. Exhibition photos were reselected from the verified 2025 album to avoid prominent co-brand signage.

New canonical navigation: /why-exhibit, /stand-options, /contact. Existing legacy URLs remain aliases with canonical metadata so prior links continue to work. Existing verified external reference/social destinations remain valid URLs; no replacement destinations were invented.

The supplied Lottie handoff was resolved to its exact public animation asset and saved locally in public/animations. The introduction plays once per browser profile using a localStorage flag, closes after completion or within 5.5 seconds, offers Skip introduction / Escape, and is skipped for reduced motion. A 6.5-second bootstrap failsafe restores the page even if hydration fails. No external player iframe, analytics or Lottie-host requests are needed at runtime.

Original orange/green energy linework, hand-drawn headline strokes, a typography band and scroll-triggered section/grid reveals add visual energy. SVG linework is decorative and hidden from assistive technology. Native Web Animations use transforms/opacity only, start from readable states and stop under reduced motion. Decorative parallax uses Motion scroll values; it does not override scrolling.
