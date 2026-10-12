'use client';

import {useCallback,useEffect,useMemo,useState} from 'react';
import LogoLoop,{type LogoItem} from './react-bits/LogoLoop';
import {LogoImage} from './LogoImage';
import './HomePartnerLogoLoop.css';

export type HomePartnerLogo={name:string;role:string;src:string;width:number;height:number};

export function HomePartnerLogoLoop({partners}:{partners:HomePartnerLogo[]}){
 const [reducedMotion,setReducedMotion]=useState(true);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReducedMotion(preference.matches);
  update();preference.addEventListener('change',update);
  return()=>preference.removeEventListener('change',update);
 },[]);
 const logos=useMemo(()=>partners.map(partner=>({src:partner.src,alt:partner.name,title:partner.name+' · '+partner.role,width:partner.width,height:partner.height})),[partners]);
 const renderPartner=useCallback((item:LogoItem)=>'src' in item?<div className="home-loop-artwork" title={item.title}><LogoImage src={item.src} alt={item.alt||''} width={item.width} height={item.height} maxWidth={190} maxHeight={60} sizes="190px"/></div>:item.node,[]);
 return <section className="home-partner-logo-loop" aria-labelledby="home-loop-heading" data-playing={!reducedMotion} data-reduced-motion={reducedMotion}>
  <div className="wrap home-loop-heading"><h2 id="home-loop-heading">Our 2026 partners</h2></div>
  <LogoLoop logos={logos} speed={!reducedMotion?100:0} direction="left" logoHeight={60} gap={60} pauseOnHover fadeOut fadeOutColor="#ffffff" renderItem={renderPartner} ariaLabel="2026 event partner logos"/>
 </section>;
}
