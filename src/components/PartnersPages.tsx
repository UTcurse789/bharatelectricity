import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr';
import {PageIntro} from './Shared';
import {EditionNavigation} from './EditionNavigation';
import {PartnerShowcase,type PartnerGroup} from './PartnerShowcase';
import {allPartnerGroups} from '@/content/partners';
import main2025 from '@/content/main-partners-2025.json';
import reference from '@/content/reference-pages.json';
import upgrades from '@/content/partner-artwork-upgrades.json';
import {paths} from '@/content/site';
import type {ContentPage} from '@/content/types';
import './PartnersPages.css';

const archive=reference.find(page=>page.path==='/partners-2025')!;
const archivedGroups:PartnerGroup[]=[];
for(const artwork of main2025) {
 let group=archivedGroups.find(group=>group.title===artwork.role);
 if(!group){group={title:artwork.role,logos:[]};archivedGroups.push(group);}
 group.logos.push({...artwork,href:null});
}
for(const section of archive.sections.slice(4)) {
 const title=section.title.toLowerCase().replace(/\b\w/g,letter=>letter.toUpperCase());
 archivedGroups.push({title,logos:section.images.filter(image=>!('unavailable' in image&&image.unavailable)).map((image,index)=>({name:title+' artwork '+(index+1),src:image.src,width:image.width,height:image.height,source:image.source,href:null,file:image.source}))});
}
const mainRoleOrder=['Energy Security Partner','Cybersecurity Partner','Technology Partner','Host Utilities','Co-Host Utility','Partner Utility'];
const currentGroups=[...allPartnerGroups].sort((a,b)=>{
 const aIndex=mainRoleOrder.indexOf(a.title),bIndex=mainRoleOrder.indexOf(b.title);
 return (aIndex<0?mainRoleOrder.length:aIndex)-(bIndex<0?mainRoleOrder.length:bIndex);
});
export function PartnersPage({page}:{page:ContentPage}) {
 const year=page.edition||2026;
 const board=upgrades.find(item=>/14-10-2025-partners/.test(item.source));
 return <div className="partners-page"><PageIntro {...page}/><div className="wrap page-body">
  <EditionNavigation year={year} collection="partners"/>
  <div className="all-partners"><PartnerShowcase groups={year===2025?archivedGroups:currentGroups} includeSupport eagerFirst/></div>
  {year===2025&&board&&<p className="partner-original-link"><a href={board.src} target="_blank" rel="noreferrer">View the original 2025 main partner board<ArrowUpRight size={17} aria-hidden="true"/></a></p>}
  <section className="partners-contact"><h2>Partnership and sponsorship enquiries</h2><p>Contact the organising team about partnership roles, sponsorship options and exhibition participation.</p><div><Link className="button" href={paths.partnership}>Partnership Opportunities<ArrowUpRight size={18} aria-hidden="true"/></Link><Link className="button secondary" href={paths.exhibitors}>Participants 2026<ArrowUpRight size={18} aria-hidden="true"/></Link></div></section>
 </div></div>;
}
