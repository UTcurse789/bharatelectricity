import {LogoImage} from './LogoImage';
import type {PartnerGroup} from './PartnerShowcase';
import './HomePartnerGrid.css';

export function HomePartnerGrid({groups}:{groups:PartnerGroup[]}) {
 const partners=groups.filter(group=>!['GOVERNMENT SUPPORT','Global Footprint'].includes(group.title)).flatMap(group=>group.logos.map(logo=>({role:group.title,logo})));
 return <div className="home-partner-grid">{partners.map(({role,logo},index)=><article className="home-partner-card" key={role+'-'+logo.src} aria-labelledby={'home-partner-role-'+index}>
  <h3 className="home-partner-label" id={'home-partner-role-'+index}>{role}</h3>
  <div className="home-partner-box"><LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} maxWidth={200} maxHeight={90} sizes="(max-width:767px) 40vw, 200px"/></div>
 </article>)}</div>;
}
