import {paths} from '@/content/site';
import {consolidatedRoutes} from '@/content/initiatives';

const legacyDestinations:Record<string,string> = {
 '/event':paths.about,
 '/why-exhibit':paths.exhibit,
 '/stand-options':paths.stands,
 '/contact':paths.contact,
 '/space-application-form-startups':paths.startups,
 '/msme-space-application-form':'/space-application-form',
 '/visitor-registration-2026':'/visitor-registration',
 '/summit-overview/submit-abstract-powergen-india':paths.speaking,
 '/summit-overview/submit-abstract-indian-utility-week':paths.speaking,
 '/exhibit-at-powergen-india/request-a-call-back':'/request_a_call_back'
};

export function siteHref(href:string) {
 if(href.startsWith('mailto:'))return href.replace(/POWERGEN(?:%20India)?/gi,'Bharat%20Electricity');
 if(href.startsWith('/')&&!href.startsWith('//')) {
  const url=new URL(href,'https://bharat.local');
  const path=url.pathname.replace(/\/$/,'')||'/';
  return (consolidatedRoutes[path]||legacyDestinations[path]||path)+url.search+url.hash;
 }
 try {
  const url=new URL(href);
  if(/(^|\.)powergen-india\.com$/i.test(url.hostname)) {
   if(url.hostname==='register.powergen-india.com')return paths.registration;
   return siteHref(url.pathname+url.search+url.hash);
  }
  // Keep international event information within the local portfolio page.
  if(/(^|\.)powergen\.com$/i.test(url.hostname))return '/event/power--energy-series-a-global-portfolio';
 } catch { /* Relative anchors and non-HTTP links remain valid. */ }
 return href;
}
