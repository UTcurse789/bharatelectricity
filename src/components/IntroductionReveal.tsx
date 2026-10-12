'use client';

import {useEffect,useRef,type ReactNode} from 'react';

export function IntroductionReveal({children}:{children:ReactNode}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=ref.current;
  if(!root||!('IntersectionObserver' in window))return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set<Animation>();
  let revealed=false;
  const observer=new IntersectionObserver(([entry])=>{
   if(!entry.isIntersecting||revealed)return;
   revealed=true;
   observer.disconnect();
   if(preference.matches)return;
   // Animate only text layers once; the section's dimensions remain unchanged.
   root.querySelectorAll<HTMLElement>('[data-text-reveal]').forEach((element,index)=>{
    const animation=element.animate([{opacity:.55,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:index*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    animations.add(animation);
    animation.onfinish=()=>animations.delete(animation);
   });
  },{threshold:.08});
  observer.observe(root);
  const reduce=()=>{if(preference.matches){animations.forEach(animation=>animation.cancel());animations.clear();}};
  preference.addEventListener('change',reduce);
  return()=>{observer.disconnect();animations.forEach(animation=>animation.cancel());preference.removeEventListener('change',reduce);};
 },[]);
 return <div ref={ref} className="energy-introduction-copy">{children}</div>;
}
