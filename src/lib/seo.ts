import type {Metadata} from 'next';
import {site,paths} from '@/content/site';
import type {ContentPage} from '@/content/types';
import {canonicalPath} from './routes';

export const siteUrl=(path='/')=>new URL(path,site.origin+'/').href;
export const canonicalUrl=(path:string)=>siteUrl(canonicalPath(path));
export const seoTitle='Bharat Electricity 2027 | Energy Exhibition & Summit, New Delhi';
export const seoDescription='Bharat Electricity 2027 brings the power and energy community to Yashobhoomi, New Delhi, on 1–3 September. Explore visitor, delegate and exhibitor registration.';
export const socialImage={url:siteUrl('/opengraph-image.png'),width:1200,height:630,alt:'Bharat Electricity — Global Energy Forum: exhibition, conference and industry connections'};

const titles:Record<string,string>={
 [paths.about]:'About the Energy Exhibition & Summit',
 [paths.exhibit]:'Exhibit in 2027',
 [paths.stands]:'Exhibition Stand Options',
 [paths.summit]:'Summit Overview',
 [paths.knowledge]:'Knowledge Hub',
 [paths.awards]:'Powering India Awards',
 [paths.news]:'Energy Event News & Press Releases',
 [paths.contact]:'Contact & Callback Requests',
 [paths.legacy]:'Past Editions & Event Archives',
 [paths.gallery]:'Photo Gallery — 2026, 2025 & 2024',
 [paths.video]:'Video Gallery — Event Highlights & Interviews'
};

export function conciseDescription(text:string) {
 const clean=text.replace(/\s+/g,' ').trim();
 if(clean.length<=170)return clean;
 const cut=clean.lastIndexOf(' ',167);
 return clean.slice(0,cut>100?cut:167).replace(/[.,;:]$/,'')+'…';
}

export function contentSeo(page:ContentPage) {
 return {title:titles[page.path]||page.title,description:conciseDescription(page.intro)};
}

export function pageMetadata({path,title,description,article=false,image=socialImage}:{path:string;title:string;description:string;article?:boolean;image?:typeof socialImage}):Metadata {
 const url=canonicalUrl(path),summary=conciseDescription(description);
 return {
  title,description:summary,alternates:{canonical:url},
  openGraph:{title,description:summary,url,type:article?'article':'website',siteName:site.name,locale:'en_IN',images:[image]},
  twitter:{card:'summary_large_image',title,description:summary,images:[{url:image.url,alt:image.alt}]}
 };
}

export const defaultMetadata:Metadata={
 metadataBase:new URL(site.origin),
 applicationName:site.name,
 title:{default:seoTitle,template:'%s | Bharat Electricity'},
 description:seoDescription,
 openGraph:{type:'website',siteName:site.name,title:seoTitle,description:seoDescription,locale:'en_IN',images:[socialImage]},
 twitter:{card:'summary_large_image',title:seoTitle,description:seoDescription,images:[{url:socialImage.url,alt:socialImage.alt}]},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 verification:{google:process.env.GOOGLE_SITE_VERIFICATION,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:undefined},
 icons:{icon:[{url:'/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/favicon-48.png',sizes:'48x48',type:'image/png'}],apple:[{url:'/apple-icon.png',sizes:'180x180',type:'image/png'}]}
};
