import Link from 'next/link';
import {paths} from '@/content/site';
import './AboutPages.css';

export function AboutHero({title,intro,eyebrow='About Bharat Electricity'}:{title:string;intro:string;eyebrow?:string}){
 return <header className="about-hero"><div className="wrap">
  <nav className="about-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={paths.about}>About</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
  <p className="about-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="about-hero-intro">{intro}</p>
 </div></header>;
}
export function AboutCTA(){return <section className="about-cta"><div className="wrap"><div><p className="about-eyebrow">Be part of the conversation</p><h2>Connect with the energy community.</h2><p>Talk to the team about exhibiting, partnerships and future editions.</p></div><Link className="button" href={paths.contact}>Get in touch <span aria-hidden="true">↗</span></Link></div></section>;}
