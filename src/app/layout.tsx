import {SmoothScroll} from '@/components/SmoothScroll';
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import Script from 'next/script';
import {Header} from '@/components/Header';
import {GovernmentBanner} from '@/components/GovernmentBanner';
import {Footer} from '@/components/Footer';
import {defaultMetadata} from '@/lib/seo';
import {siteStructuredData} from '@/lib/structured-data';
import {JsonLd} from '@/components/JsonLd';
import 'lenis/dist/lenis.css';
import './globals.css';
import './interaction.css';

const googleTagManagerId = 'GTM-PVRQL6FP';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({children}: {children: ReactNode}) {
 return <html lang="en-IN">
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
   <JsonLd id="site-structured-data" data={siteStructuredData()}/>
   <SmoothScroll/><a href="#main-content" className="skip-link">Skip to main content</a><GovernmentBanner/><Header/>
   <main id="main-content">{children}</main><Footer/>
  </body>
 </html>;
}
