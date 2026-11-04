import Link from 'next/link';
import {LogoImage} from './LogoImage';
import {paths} from '@/content/site';
import './HomePartnerLogoLoop.css';

export type HomePartnerLogo={name:string;role:string;src:string;width:number;height:number};
export function HomePartnerLogoLoop({partners}:{partners:HomePartnerLogo[]}){
 const roles=['Energy Security Partner','Cybersecurity Partner','Technology Partner','Host Utilities','Co-Host Utility'];
 const featured=partners.filter(partner=>roles.includes(partner.role));
 return <section className="home-partner-logo-loop" aria-labelledby="home-loop-heading"><div className="wrap">
  <div className="home-loop-heading"><h2 id="home-loop-heading">Our 2026 partners</h2><Link href={paths.partners} className="text-link">View all partners <span aria-hidden="true">↗</span></Link></div>
  <ul className="home-featured-partners">{featured.map(partner=><li key={partner.src}><span>{partner.role}</span><div className="home-loop-artwork"><LogoImage src={partner.src} alt={partner.name} width={partner.width} height={partner.height} maxWidth={160} maxHeight={74} sizes="(max-width:767px) 40vw, 160px"/></div></li>)}</ul>
 </div></section>;
}
