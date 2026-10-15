import {site} from '@/content/site';
import {organisers} from '@/content/about';
import {eventSummary} from '@/content/event-faq';
import {canonicalUrl,siteUrl,socialImage} from './seo';

const organizationId=siteUrl('/#organization');
const websiteId=siteUrl('/#website');

export function siteStructuredData(){return {
 '@context':'https://schema.org',
 '@graph':[
  {'@type':'Organization','@id':organizationId,name:site.name,url:siteUrl('/'),logo:{'@type':'ImageObject',url:siteUrl('/assets/bharat-electricity-logo-compact.webp')},contactPoint:site.contacts.map(contact=>({'@type':'ContactPoint',name:contact.name,contactType:contact.role,email:contact.email,telephone:contact.phone.replace(/\s/g,''),areaServed:'IN'}))},
  {'@type':'WebSite','@id':websiteId,name:site.name,url:siteUrl('/'),inLanguage:'en-IN',publisher:{'@id':organizationId}}
 ]
};}

export function pageStructuredData({path,title,description,entity,pageType='WebPage'}:{path:string;title:string;description:string;entity?:Record<string,unknown>;pageType?:string}) {
 const url=canonicalUrl(path),breadcrumbId=url+'#breadcrumb',webpageId=url+'#webpage';
 return {'@context':'https://schema.org','@graph':[
  {'@type':pageType,'@id':webpageId,url,name:title,description,inLanguage:'en-IN',isPartOf:{'@id':websiteId},breadcrumb:{'@id':breadcrumbId},...(entity?{mainEntity:{'@id':entity['@id']}}:{})},
  {'@type':'BreadcrumbList','@id':breadcrumbId,itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteUrl('/')},{'@type':'ListItem',position:2,name:title,item:url}]},
  ...(entity?[entity]:[])
 ]};
}

export function homeStructuredData(){
 const edition=site.nextEdition,eventId=siteUrl('/#event-'+edition.year);
 return {'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':siteUrl('/#webpage'),url:siteUrl('/'),name:site.name+' '+edition.year,description:eventSummary,inLanguage:'en-IN',isPartOf:{'@id':websiteId},mainEntity:{'@id':eventId}},
  {'@type':'Event','@id':eventId,name:site.name+' '+edition.year,description:eventSummary,url:siteUrl('/'),startDate:edition.start,endDate:edition.end,eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',image:[socialImage.url],location:{'@type':'Place',name:edition.venue,address:{'@type':'PostalAddress',addressLocality:'Dwarka, New Delhi',addressRegion:'Delhi',addressCountry:'IN'}},organizer:organisers.map(organiser=>({'@type':'Organization',name:organiser.name,url:organiser.href}))}
 ]};
}

export function publishedDate(value?:string){
 if(!value)return undefined;
 const match=value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
 const month=match?['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].toLowerCase()):-1;
 if(!match||month<0)return undefined;
 const iso=`${match[3]}-${String(month+1).padStart(2,'0')}-${match[1].padStart(2,'0')}`;
 return Number.isNaN(Date.parse(iso))?undefined:iso;
}
