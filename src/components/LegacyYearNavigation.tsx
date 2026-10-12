'use client';
import {Children,useEffect,useRef,useState,type ReactNode,type KeyboardEvent} from 'react';

export function LegacyYearNavigation({editions,children}:{editions:{year:number;label:string}[];children:ReactNode}) {
 const [active,setActive]=useState(0);
 const tabs=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const sync=()=>{
   const year=Number(window.location.hash.match(/^#legacy-(\d{4})(?:-|$)/)?.[1]);
   const index=editions.findIndex(edition=>edition.year===year);
   if(index>=0)setActive(index);
  };
  sync();window.addEventListener('hashchange',sync);
  return()=>window.removeEventListener('hashchange',sync);
 },[editions]);
 const select=(index:number)=>{setActive(index);history.replaceState(null,'','#legacy-'+editions[index].year);};
 const navigate=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%editions.length;
  else if(event.key==='ArrowLeft')next=(index+editions.length-1)%editions.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=editions.length-1;
  else return;
  event.preventDefault();select(next);tabs.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
 };
 return <>
  <div ref={tabs} className="legacy-year-tabs" role="tablist" aria-label="Edition year">{editions.map((edition,index)=><button key={edition.year} id={'legacy-year-tab-'+edition.year} role="tab" aria-selected={active===index} aria-controls={'legacy-year-panel-'+edition.year} tabIndex={active===index?0:-1} onClick={()=>select(index)} onKeyDown={event=>navigate(event,index)}>{edition.year}<span>{edition.label}</span></button>)}</div>
  <div className="legacy-editions">{Children.toArray(children).map((child,index)=><div key={editions[index].year} id={'legacy-year-panel-'+editions[index].year} role="tabpanel" aria-labelledby={'legacy-year-tab-'+editions[index].year} tabIndex={0} hidden={active!==index}>{child}</div>)}</div>
 </>;
}
