import {SmoothScroll} from '@/components/SmoothScroll';
import {ScrollEffects} from '@/components/ScrollEffects';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {Header} from '@/components/Header';
import {GovernmentBanner} from '@/components/GovernmentBanner';
import {Footer} from '@/components/Footer';
import {site} from '@/content/site';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
 metadataBase: new URL(site.origin),
 title: {default: 'BHARAT ELECTRICITY', template: '%s | BHARAT ELECTRICITY'},
 description: 'Explore the completed 2026 energy exhibition and summit: participating companies, published programme, industry leaders and event archives.',
 openGraph: {type: 'website', siteName: site.name, locale: 'en_IN', images: [{url: '/assets/exhibition-2025-014.webp', width: 1800, height: 1200, alt: '2025 exhibition archive'}]},
 twitter: {card: 'summary_large_image'},
 icons: {icon: [{url: '/favicon-32.png', sizes: '32x32', type: 'image/png'}, {url: '/favicon-48.png', sizes: '48x48', type: 'image/png'}], apple: [{url: '/favicon-180.png', sizes: '180x180', type: 'image/png'}]}
};

export default function RootLayout({children}: {children: ReactNode}) {
 return <html lang="en"><head><link rel="preload" href="/fonts/outfit.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body suppressHydrationWarning>{/* Browser extensions can add body attributes before React hydrates. */}<SmoothScroll/><ScrollEffects/><a href="#main-content" className="skip-link">Skip to main content</a><GovernmentBanner/><Header/><main id="main-content">{children}</main><Footer/></body></html>;
}
