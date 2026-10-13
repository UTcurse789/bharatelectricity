'use client';

import {Children,useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play} from '@phosphor-icons/react';
import './InfiniteCardRail.css';

export function InfiniteCardRail({label,children,className='',speed=32}:{label:string;children:ReactNode;className?:string;speed?:number}) {
 const root=useRef<HTMLDivElement>(null);
 const windowRef=useRef<HTMLDivElement>(null);
 const track=useRef<HTMLDivElement>(null);
 const sequence=useRef<HTMLDivElement>(null);
 const duplicate=useRef<HTMLDivElement>(null);
 const [playing,setPlaying]=useState(true);
 const [visible,setVisible]=useState(false);
 const [activated,setActivated]=useState(false);
 const [reducedMotion,setReducedMotion]=useState(true);
 const [focused,setFocused]=useState(false);
 const [manual,setManual]=useState(false);
 const [overflow,setOverflow]=useState(false);
 const items=Children.toArray(children);
 const displayed=activated?items:items.slice(0,8);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReducedMotion(preference.matches);
  update();preference.addEventListener('change',update);
  return()=>preference.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  let inView=false;
  const update=()=>{setVisible(inView&&!document.hidden);if(inView)setActivated(true);};
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update();},{threshold:.1});
  if(root.current)observer.observe(root.current);
  document.addEventListener('visibilitychange',update);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
 },[]);
 useEffect(()=>{
  const update=()=>{
   if(!sequence.current||!windowRef.current||!root.current)return;
   const width=sequence.current.offsetWidth;
   setOverflow(width>windowRef.current.clientWidth+24);
   root.current.style.setProperty('--card-loop-duration',Math.max(10,width/Math.max(1,speed))+'s');
  };
  const observer=new ResizeObserver(update);
  if(sequence.current)observer.observe(sequence.current);
  if(windowRef.current)observer.observe(windowRef.current);
  update();return()=>observer.disconnect();
 },[activated,items.length,speed]);
 useEffect(()=>{
  duplicate.current?.querySelectorAll<HTMLElement>('a,button,input,[tabindex]').forEach(item=>{item.tabIndex=-1;});
 },[activated,items.length,overflow]);
 const move=(direction:number)=>{
  if(!windowRef.current)return;
  const offset=track.current?new DOMMatrix(getComputedStyle(track.current).transform).m41:0;
  const target=windowRef.current.scrollLeft-offset+direction*windowRef.current.clientWidth*.85;
  setPlaying(false);setManual(true);
  requestAnimationFrame(()=>windowRef.current?.scrollTo({left:target,behavior:reducedMotion?'instant':'smooth'}));
 };
 return <div ref={root} className={'content-rail infinite-card-rail '+className} data-running={playing&&visible&&!reducedMotion&&!focused&&!manual&&overflow} data-static={reducedMotion||focused||manual||!overflow} onFocusCapture={event=>{if(event.target instanceof HTMLElement&&event.target.matches(':focus-visible')){const target=event.target;setFocused(true);requestAnimationFrame(()=>target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'}));}}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false);}}>
  <div className="rail-tools"><span>Explore the lineup</span><div>
   {!reducedMotion&&overflow&&<button type="button" aria-label={(playing?'Pause':'Resume')+' automatic '+label} aria-pressed={!playing} onClick={()=>{if(!playing){windowRef.current?.scrollTo({left:0,behavior:'instant'});setManual(false);}setPlaying(value=>!value);}}>{playing?<Pause size={20} aria-hidden="true"/>:<Play size={20} aria-hidden="true"/>}</button>}
   <button type="button" aria-label={'Previous '+label} onClick={()=>move(-1)}><ArrowLeft size={22} aria-hidden="true"/></button>
   <button type="button" aria-label={'Next '+label} onClick={()=>move(1)}><ArrowRight size={22} aria-hidden="true"/></button>
  </div></div>
  <div ref={windowRef} className="infinite-card-window" data-lenis-prevent-horizontal tabIndex={0} role="region" aria-label={label}>
   <div ref={track} className="infinite-card-track"><div ref={sequence} className="infinite-card-group">{displayed}</div>{overflow&&<div ref={duplicate} className="infinite-card-group infinite-card-copy" aria-hidden="true">{displayed}</div>}</div>
  </div>
 </div>;
}
