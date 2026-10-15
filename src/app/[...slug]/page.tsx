import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {pages,pageForPath} from '@/content/pages';
import {companies,people,articles,appearances} from '@/lib/content';
import {site} from '@/content/site';
import {PageContent,CompanyDetail,PersonDetail,ArticleDetail} from '@/components/PageContent';
import {JsonLd} from '@/components/JsonLd';
import {routeAliases,resolveCanonicalPath} from '@/lib/routes';
import {canonicalUrl,conciseDescription,contentSeo,pageMetadata,siteUrl} from '@/lib/seo';
import {pageStructuredData,publishedDate} from '@/lib/structured-data';
import refreshAssets from '@/content/refresh-asset-sources.json';

export const dynamicParams=false;
export function generateStaticParams(){
 return [...new Set([...pages.map(page=>page.path),...companies.map(company=>'/exhibitors/'+company.id),...people.map(person=>'/speakers/'+person.id),...articles.map(article=>'/industry-news/'+article.id),...Object.keys(routeAliases)])].map(path=>({slug:path.slice(1).split('/')}));
}
async function resolve(params:Promise<{slug:string[]}>){
 const {slug}=await params,path=resolveCanonicalPath('/'+slug.join('/'));
 return {path,page:pageForPath(path),company:path.startsWith('/exhibitors/')?companies.find(company=>path==='/exhibitors/'+company.id):undefined,person:path.startsWith('/speakers/')?people.find(person=>path==='/speakers/'+person.id):undefined,article:path.startsWith('/industry-news/')?articles.find(article=>path==='/industry-news/'+article.id):undefined};
}
type Resolved=Awaited<ReturnType<typeof resolve>>;
function details(record:Resolved){
 if(record.page)return contentSeo(record.page);
 if(record.company)return {title:record.company.name+' — Participant Profile',description:conciseDescription(record.company.description||'Explore '+record.company.name+' in the Bharat Electricity participant directory, with published edition participation and company information.')};
 if(record.person){
  const roles=appearances.filter(appearance=>appearance.personId===record.person!.id).map(appearance=>`${appearance.edition} ${appearance.kind==='speaker'?'speaker':'Governing Council'}: ${appearance.role}, ${appearance.designation}`).join('; ');
  return {title:record.person.name+' — Industry Leader Profile',description:conciseDescription(record.person.name+'. '+(roles||'Published Bharat Electricity speaker and industry leader profile.'))};
 }
 if(record.article)return {title:record.article.title,description:conciseDescription(record.article.summary||record.article.title)};
 return {title:site.name,description:'Bharat Electricity event information.'};
}
function articleImage(record:Resolved){return record.article?refreshAssets.find(image=>image.source===record.article!.image):undefined;}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{
 const record=await resolve(params),info=details(record),image=articleImage(record);
 return pageMetadata({path:record.path,...info,article:!!record.article,image:image?{url:siteUrl(image.src),width:image.width,height:image.height,alt:info.title}:undefined});
}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){
 const record=await resolve(params),info=details(record),url=canonicalUrl(record.path);
 let content,entity:Record<string,unknown>|undefined,pageType='WebPage';
 if(record.page)content=<PageContent page={record.page}/>;
 else if(record.company){
  const company=record.company;content=<CompanyDetail company={company}/>;pageType='ProfilePage';
  entity={'@type':'Organization','@id':url+'#company',name:company.name,url,description:info.description,...(company.logo?{logo:siteUrl(company.logo)}:{}),...(company.website?{sameAs:[company.website]}:{})};
 }else if(record.person){
  const person=record.person;content=<PersonDetail person={person}/>;pageType='ProfilePage';
  entity={'@type':'Person','@id':url+'#person',name:person.name,url,description:info.description,...(person.photo?{image:siteUrl(person.photo)}:{})};
 }else if(record.article){
  const article=record.article,image=articleImage(record);content=<ArticleDetail article={article}/>;
  entity={'@type':'Article','@id':url+'#article',headline:article.title,description:info.description,url,inLanguage:'en-IN',mainEntityOfPage:{'@id':url+'#webpage'},...(publishedDate(article.date)?{datePublished:publishedDate(article.date)}:{}),...(image?{image:[siteUrl(image.src)]}:{})};
 }else notFound();
 return <><JsonLd id="page-structured-data" data={pageStructuredData({path:record.path,...info,entity,pageType})}/>{content}</>;
}
