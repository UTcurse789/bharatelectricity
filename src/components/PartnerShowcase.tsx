import {LogoImage} from './LogoImage';
export interface PartnerArtwork {name:string;src:string;width:number;height:number;source:string;href:string|null;file:string}
export interface PartnerGroup {title:string;logos:PartnerArtwork[]}
export function PartnerShowcase({groups,includeSupport=false,eagerFirst=false}:{groups:PartnerGroup[];includeSupport?:boolean;eagerFirst?:boolean}) {
 const Heading=includeSupport?'h2':'h3';
 const displayed=groups.filter(group=>group.title!=='Global Footprint'&&(includeSupport||!['GOVERNMENT SUPPORT','Focus States'].includes(group.title)));
 return <div className="partner-role-grid">{displayed.map((group,groupIndex)=><section key={group.title} className={'partner-role'+(group.logos.length>3?' partner-role-wide':'')+(group.title==='GOVERNMENT SUPPORT'?' partner-government':'')}>
  <Heading>{group.title==='GOVERNMENT SUPPORT'?'Government Support':group.title}</Heading>
  <div className="partner-role-logos">{group.logos.map((logo,index)=><div key={logo.src+'-'+index} className="partner-logo"><LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} sizes="(max-width:767px) 42vw, 240px" maxWidth={240} maxHeight={group.title==='GOVERNMENT SUPPORT'?180:100} loading={eagerFirst&&groupIndex<3?'eager':'lazy'}/>{group.title==='GOVERNMENT SUPPORT'&&<span className="ministry-name">{logo.name}</span>}</div>)}</div>
 </section>)}</div>;
}
