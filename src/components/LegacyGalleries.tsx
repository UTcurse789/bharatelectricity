'use client';

import Image from 'next/image';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {Pause,Play,Images} from '@phosphor-icons/react';
import CircularCarousel from './CircularCarousel';
import InfiniteSpiral from './InfiniteSpiral';
import type {LegacyDay,LegacyImage} from '@/content/legacy';

function useMotionPreference(){
 const [reduced,setReduced]=useState<boolean|null>(null);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 return reduced;
}

export function LegacyStaticGallery({images,grayscale=false}:{images:LegacyImage[];grayscale?:boolean}){
 return <div className={'legacy-static-gallery'+(grayscale?' is-grayscale':'')}>
  {images.map(image=><figure key={image.src}><Image src={image.src} alt={image.alt} width={800} height={600} sizes="(max-width:767px) 90vw, 400px" loading="lazy"/></figure>)}
 </div>;
}

export function LegacyDayGallery({year,days}:{year:number;days:LegacyDay[]}){
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(true),[focused,setFocused]=useState(false);
 const reduced=useMotionPreference();
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number){
  let next:number;
  if(event.key==='ArrowRight')next=(index+1)%days.length;
  else if(event.key==='ArrowLeft')next=(index-1+days.length)%days.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=days.length-1;
  else return;
  event.preventDefault();setActive(next);tabs.current[next]?.focus();
 }
 return <div className="legacy-day-gallery">
  <div className="legacy-gallery-toolbar">
   <div className="legacy-day-tabs" role="tablist" aria-label={`${year} event highlights`}>
    {days.map((day,index)=><button key={day.id} ref={node=>{tabs.current[index]=node;}} id={`legacy-tab-${year}-${day.id}`} type="button" role="tab" aria-selected={active===index} aria-controls={`legacy-panel-${year}-${day.id}`} tabIndex={active===index?0:-1} onClick={()=>{setActive(index);setFocused(false);}} onKeyDown={event=>navigate(event,index)}>{day.tabLabel||day.label}</button>)}
   </div>
   {!!days[active]?.images.length&&reduced===false&&<button className="legacy-animation-control" type="button" onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={18} aria-hidden="true"/>:<Play size={18} aria-hidden="true"/>}{playing?'Pause':'Resume'} day gallery</button>}
  </div>
  {days.map((day,index)=><div key={day.id} id={`legacy-panel-${year}-${day.id}`} role="tabpanel" aria-labelledby={`legacy-tab-${year}-${day.id}`} hidden={active!==index} className="legacy-day-panel">
   {active===index&&<>
    {day.themes!==undefined&&<div className="legacy-day-themes"><h3>{day.label} key themes</h3>{day.themes.length?<ul>{day.themes.map(theme=><li key={theme}>{theme}</li>)}</ul>:<p>Day-wise themes will be added soon.</p>}{!!day.sessions?.length&&<ul>{day.sessions.map(session=><li key={session}>{session}</li>)}</ul>}</div>}
    {!!day.images.length&&<h3 className="legacy-day-title">{day.label} Glimpse</h3>}
    {!day.images.length?<div className="legacy-day-stage legacy-gallery-empty"><Images size={36} weight="light" aria-hidden="true"/><h3>{day.label} photographs</h3><p>The {year} {day.label.toLowerCase()} photographs will be added to this archive.</p></div>:
     reduced!==false?<LegacyStaticGallery images={day.images}/>:
     <div className="legacy-day-stage" onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false);}}>
      <CircularCarousel key={day.id} items={day.images} preset="cylinder" intro="rise" cardWidth={220} aspectRatio={1} speed={14} captions={false} gap={25} tilt={-5} curve={1} perspective={2500} autoplay={focused?'off':'drift'} paused={!playing&&!focused} interval={3} direction="left" momentum={0.6} snap pauseOnHover focusOnClick draggable parallax={0.3} stretch={0.5} fadeColor="#000000" depthFade={0.55} innerShade={0.6} cornerRadius={12}/>
     </div>}
   </>}
  </div>)}
 </div>;
}

export function LegacyAwardsGallery({images}:{images:LegacyImage[]}){
 const [playing,setPlaying]=useState(true);
 const reduced=useMotionPreference();
 if(!images.length)return <div className="legacy-gallery-empty legacy-awards-stage"><Images size={36} weight="light" aria-hidden="true"/><p>Original awards photographs will be added to this archive.</p></div>;
 return <div className="legacy-awards-gallery">
  {reduced===false&&<div className="legacy-awards-toolbar"><button className="legacy-animation-control" type="button" onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={18} aria-hidden="true"/>:<Play size={18} aria-hidden="true"/>}{playing?'Pause':'Resume'} awards animation</button></div>}
  {reduced!==false?<LegacyStaticGallery images={images} grayscale/>:
   <div className="legacy-awards-stage">
    <InfiniteSpiral items={images} paused={!playing} animationMode="auto" speed={0.55} radius={170} cardWidth={100} cardHeight={100} verticalSpacing={60} perspective={1000} cardRadius={10} centerScale={1.2} edgeBlur={6} cardsPerTurn={7} pauseOnHover direction="up" rotation={0} cardTilt={0} edgeFade={0.3} imageFit="cover" grayscale={1}/>
   </div>}
 </div>;
}

export function LegacyEntrance(){
 useEffect(()=>{
  const elements=document.querySelectorAll<HTMLElement>('.legacy-page [data-legacy-reveal]');
  const query=matchMedia('(prefers-reduced-motion: reduce)');
  if(query.matches)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){(entry.target as HTMLElement).dataset.legacyVisible='true';observer.unobserve(entry.target);}}),{threshold:0.06});
  elements.forEach(element=>{if(element.getBoundingClientRect().top>innerHeight){element.dataset.legacyVisible='false';observer.observe(element);}});
  return()=>{observer.disconnect();elements.forEach(element=>delete element.dataset.legacyVisible);};
 },[]);
 return null;
}
