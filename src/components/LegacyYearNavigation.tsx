'use client';

import {useEffect,useRef,useState,type CSSProperties} from 'react';

export function LegacyYearNavigation({editions}:{editions:{year:number;label:string}[]}){
 const [active,setActive]=useState(editions[0]?.year);
 const [offset,setOffset]=useState(185);
 const nav=useRef<HTMLElement>(null);
 useEffect(()=>{
  const header=document.querySelector<HTMLElement>('.site-header');
  const articles=editions.map(edition=>document.getElementById('legacy-'+edition.year)).filter((article):article is HTMLElement=>!!article);
  let observer:IntersectionObserver|undefined;
  const measure=()=>{
   const offset=(header?.getBoundingClientRect().height||160)+20;
   const top=Math.min(offset+120,innerHeight-2);
   setOffset(offset);
   observer?.disconnect();
   observer=new IntersectionObserver(entries=>{
    const current=entries.find(entry=>entry.isIntersecting);
    if(current)setActive(Number(current.target.id.replace('legacy-','')));
   },{rootMargin:`-${top}px 0px -${Math.max(0,innerHeight-top-1)}px 0px`,threshold:0});
   articles.forEach(article=>observer?.observe(article));
  };
  measure();
  const resize=new ResizeObserver(measure);
  if(header)resize.observe(header);
  window.addEventListener('resize',measure);
  return()=>{observer?.disconnect();resize.disconnect();window.removeEventListener('resize',measure);};
 },[editions]);
 return <nav ref={nav} className="legacy-year-rail" aria-label="Edition year" style={{'--legacy-nav-top':offset+'px'} as CSSProperties}>
  {editions.map(edition=><a key={edition.year} href={'#legacy-'+edition.year} aria-current={active===edition.year?'location':undefined} onClick={()=>setActive(edition.year)}><strong>{edition.year}</strong><span>{edition.label}</span></a>)}
 </nav>;
}
