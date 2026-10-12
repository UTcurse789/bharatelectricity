# Partner logo loop below the homepage video

The previous-edition selector directly below `VideoHero` is replaced by the user's supplied React Bits TypeScript/CSS LogoLoop. The provided TypeScript source is retained under `src/components/react-bits/LogoLoop.tsx`; CSS comes from the official `https://reactbits.dev/r/LogoLoop-TS-CSS.json` registry. No icon library or new package dependencies are needed because the loop uses real partner images.

The strip displays unique artwork from the current 2026 partner groups, with government support retained in its existing dedicated presentation. LogoImage's content bounds keep logos readable despite different source margins. The surface and edge fade remain white. Direction is left, speed is 100px/s, logo height is 60px and the gap is 60px.

`pauseOnHover={false}` is explicit and no zero hover speed is passed. Hovering does not alter playback. Per the user's follow-up request, the partner link and pause control are removed, together with the video's archive label and playback/open-film controls. Reduced-motion users get one static, horizontally scrollable sequence; the region can be focused and scrolled with the keyboard. Fixed strip height and transform-based horizontal animation avoid layout movement.

The later partner grid and the site's edition archive pages remain available. `scripts/check-home-logo-loop.mjs` verifies placement below the video, removal of the old selector and the unwanted controls, unique actual partner images, automatic movement, uninterrupted movement while hovered, reduced-motion keyboard scrolling, stable height, accessibility and responsive overflow at 1440/375/320px.
