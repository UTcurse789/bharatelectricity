import Link from 'next/link';
import {paths} from '@/content/site';
import './AboutPages.css';

export const aboutLinks=[
 ['About the Events',paths.about],['The Legacy',paths.legacy],['Governing Council',paths.council],
 ['Market Opportunities','/event/market-opportunities-in-india'],['Global Series','/event/power--energy-series-a-global-portfolio'],['Organiser','/event/organiser']
];
export function AboutHero({title,intro,eyebrow='About Bharat Electricity'}:{title:string;intro:string;eyebrow?:string}){
 return <header className="about-hero"><div className="wrap">
  <nav className="about-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={paths.about}>About</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
  <p className="about-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="about-hero-intro">{intro}</p>
 </div></header>;
}
export function AboutNavigation({active}:{active:string}){
 return <nav className="about-navigation" aria-label="About section"><div className="wrap">{aboutLinks.map(([label,href])=><Link key={href} href={href} aria-current={active===href||(href===paths.council&&/council|advisory-committee/.test(active))?'page':undefined}>{label}</Link>)}</div></nav>;
}
export function AboutCTA(){return <section className="about-cta"><div className="wrap"><div><p className="about-eyebrow">Be part of the conversation</p><h2>Connect with the energy community.</h2><p>Talk to the team about exhibiting, partnerships and future editions.</p></div><Link className="button" href={paths.contact}>Get in touch <span aria-hidden="true">↗</span></Link></div></section>;}
