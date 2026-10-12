# Mobile navigation

The hamburger menu opens below the header as an overlay, rather than expanding the sticky header in the document flow. The page height and scroll position remain unchanged when opening or closing it. The panel scrolls independently within the available visual viewport, including landscape orientation.

A backdrop dismisses the menu on an outside tap and returns focus to the toggle. Escape, navigation and resizing to the desktop layout also close the panel and release its body scroll lock. Keyboard tabbing stays within the header and its open navigation. Existing nested council and exhibition navigation remains available.

The mobile scroll lock uses `overflow: clip` on the body. Using `hidden` creates a scroll container that breaks the sticky header after scrolling, hiding the navigation while leaving its backdrop visible. Lenis recognizes the clip lock and pauses until the menu closes.

Run `node scripts/check-mobile-navigation.mjs` against the preview after completing the build and static-export finalization. The check covers 320, 375, 390, 768 and 844px viewports, opening at the top, with the banner partially scrolled and at a deep page position, stable geometry, nested-menu scrolling, keyboard focus, all dismissal paths and desktop resizing. Results and screenshots are saved in `research/qa/mobile-navigation/`.
