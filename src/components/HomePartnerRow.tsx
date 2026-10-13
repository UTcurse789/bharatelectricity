import {LogoImage} from './LogoImage';
import type {PartnerArtwork} from './PartnerShowcase';

export function HomePartnerRow({logos,label}:{logos:PartnerArtwork[];label:string}){
 return <div className="home-partner-logos" role="group" aria-label={`${label} logos`}>
  <div className="home-partner-logo-list">{logos.map((logo,index)=><div className="home-partner-box" key={`${logo.src}-${index}`}>
   <LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} maxWidth={176} maxHeight={96} sizes="(max-width:767px) 140px, 200px" loading="lazy"/>
  </div>)}</div>
 </div>;
}
