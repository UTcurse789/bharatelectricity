import {SmoothScroll} from '@/components/SmoothScroll';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import Script from 'next/script';
import {Header} from '@/components/Header';
import {GovernmentBanner} from '@/components/GovernmentBanner';
import {Footer} from '@/components/Footer';
import {site} from '@/content/site';
import 'lenis/dist/lenis.css';
import './globals.css';
import './interaction.css';

const googleTagManagerId = 'GTM-PVRQL6FP';

export const metadata: Metadata = {
 metadataBase: new URL(site.origin),
 title: {default: 'BHARAT ELECTRICITY', template: '%s | BHARAT ELECTRICITY'},
 description: 'Explore the completed 2026 energy exhibition and summit: participating companies, published programme, industry leaders and event archives.',
 openGraph: {type: 'website', siteName: site.name, locale: 'en_IN', images: [{url: '/assets/exhibition-2025-014.webp', width: 1800, height: 1200, alt: '2025 exhibition archive'}]},
 twitter: {card: 'summary_large_image'},
 icons: {icon: [{url: '/favicon-32.png', sizes: '32x32', type: 'image/png'}, {url: '/favicon-48.png', sizes: '48x48', type: 'image/png'}], apple: [{url: '/favicon-180.png', sizes: '180x180', type: 'image/png'}]}
};

export default function RootLayout({children}: {children: ReactNode}) {
 return <html lang="en">
  <head><link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head>
  <body suppressHydrationWarning>
   <noscript><iframe src={'https://www.googletagmanager.com/ns.html?id='+googleTagManagerId} title="Google Tag Manager" height="0" width="0" style={{display:'none',visibility:'hidden'}}/></noscript>
   <Script id="google-tag-manager" strategy="afterInteractive">{`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${googleTagManagerId}');
   `}</Script>
   {/* Browser extensions can add body attributes before React hydrates. */}
   <SmoothScroll/><a href="#main-content" className="skip-link">Skip to main content</a><GovernmentBanner/><Header/>
   <main id="main-content">{children}</main><Footer/>
  </body>
 </html>;
}
