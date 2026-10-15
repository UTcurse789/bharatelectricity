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
const salesIqWidgetUrl = 'https://salesiq.zohopublic.in/widget?wc=siqfdad8146939a2fe0ac86a3f3f5275e73a5f1330db4a90a72f548a7ac5c7a8ea4';

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
   <Script id="zoho-salesiq-bootstrap" strategy="afterInteractive">{`
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {ready:function(){}};
    if (!document.getElementById('zsiqscript')) {
     var salesIqScript = document.createElement('script');
     salesIqScript.id = 'zsiqscript';
     salesIqScript.src = '${salesIqWidgetUrl}';
     salesIqScript.defer = true;
     document.body.appendChild(salesIqScript);
    }
   `}</Script>
  </body>
 </html>;
}
