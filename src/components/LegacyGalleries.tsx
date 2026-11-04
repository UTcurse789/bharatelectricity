'use client';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {Gallery} from './Gallery';
import type {LegacyDay,LegacyImage} from '@/content/legacy';

export function LegacyStaticGallery({images,year=2026}:{images:LegacyImage[];year?:number;grayscale?:boolean}){
 return <Gallery photos={images.map(image=>({...image,edition:year,caption:image.alt}))}/>;
}
export function LegacyDayGallery({year,days}:{year:number;days:LegacyDay[]}){
 const [active,setActive]=useState(0);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number){
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%days.length;
  else if(event.key==='ArrowLeft')next=(index+days.length-1)%days.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=days.length-1;
  else return;
  event.preventDefault();setActive(next);tabs.current[next]?.focus();
 }
 return <div className="legacy-day-gallery"><div className="legacy-day-tabs" role="tablist" aria-label={year+' event highlights'}>
 {days.map((day,index)=><button key={day.id} ref={node=>{tabs.current[index]=node;}} id={'legacy-tab-'+year+'-'+day.id} role="tab" aria-selected={active===index} aria-controls={'legacy-panel-'+year+'-'+day.id} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>navigate(event,index)}>{day.label} Glimpse</button>)}
 </div>{days.map((day,index)=><div key={day.id} id={'legacy-panel-'+year+'-'+day.id} role="tabpanel" aria-labelledby={'legacy-tab-'+year+'-'+day.id} hidden={active!==index} className="legacy-day-panel">
 {active===index&&<>{!!day.themes?.length&&<div className="legacy-day-themes"><h3>{day.label} key themes</h3><ul>{day.themes.map(theme=><li key={theme}>{theme}</li>)}</ul></div>}{day.images.length?<LegacyStaticGallery images={day.images} year={year}/>:<p className="legacy-photo-pending">The {year} {day.label} photo collection will be published here when available.</p>}</>}
 </div>)}</div>;
}
export function LegacyAwardsGallery({images,year=2026}:{images:LegacyImage[];year?:number}){
 return images.length?<div className="legacy-awards-gallery"><LegacyStaticGallery images={images} year={year}/></div>:<p className="legacy-photo-pending">The {year} Awards & Gala photo collection will be published here when available.</p>;
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
