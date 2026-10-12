import Link from 'next/link';
import {paths} from '@/content/site';
import {exhibitionLinks,exhibitionPaths,visitorLinks} from '@/content/exhibition';
import './ExhibitionPages.css';

export function ExhibitionHero({title,intro,visitor=false}:{title:string;intro:string;visitor?:boolean}){
 return <header className="exhibition-hero"><div className="wrap"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={visitor?paths.visit:paths.exhibit}>{visitor?'Visit':'Exhibition'}</Link><span aria-hidden="true">/</span><span>{title}</span></nav><p className="exhibition-eyebrow">{visitor?'Explore the energy community':'Exhibit at Bharat Electricity'}</p><h1>{title}</h1><p className="exhibition-hero-intro">{intro}</p></div></header>;
}
export function ExhibitionNavigation({active,visitor=false}:{active:string;visitor?:boolean}){
 return <nav className="exhibition-navigation" aria-label={visitor?'Visitor section':'Exhibition section'}><div className="wrap">{(visitor?visitorLinks:exhibitionLinks).map(([label,href])=><Link key={href} href={href} aria-current={active===href||(href===paths.exhibitors&&['/participants-2025','/2024-exhibitors'].includes(active))?'page':undefined}>{label}</Link>)}</div></nav>;
}
export function ExhibitionActions({active}:{active?:string}){return <nav className="exhibition-actions" aria-label="Exhibition enquiries"><div className="wrap">{[['Request the event brochure',exhibitionPaths.brochure],['Request the floor plan',exhibitionPaths.floor],['Make a stand enquiry',exhibitionPaths.enquiry]].filter(([,href])=>href!==active).map(([label,href],i)=><Link key={href} className={'button'+(i?' secondary':'')} href={href}>{label}<span aria-hidden="true">↗</span></Link>)}</div></nav>;}
export function ExhibitionCTA(){return <section className="exhibition-cta"><div className="wrap"><div><p className="exhibition-eyebrow">Your next industry connection</p><h2>Let’s plan your participation.</h2><p>Tell the team what you want to achieve across the energy platform.</p></div><Link className="button" href={paths.contact}>Contact the team <span aria-hidden="true">↗</span></Link></div></section>;}
