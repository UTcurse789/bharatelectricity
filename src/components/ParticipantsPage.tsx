'use client';
import {useEffect,useState} from 'react';
import {ExhibitionHero,ExhibitionActions,ExhibitionCTA} from './ExhibitionShell';
import {ExhibitionCompanies} from './ExhibitionCompanies';
import {paths} from '@/content/site';

type Collection={year:number;items:{id?:string;name?:string;logo:string;stand?:string|null}[]};
export function ParticipantsPage({collections}:{collections:Collection[]}){
 const [year,setYear]=useState(2026);
 useEffect(()=>{
  const sync=()=>{const requested=Number(new URLSearchParams(location.search).get('year'))||(/2024/.test(location.pathname)?2024:/2025|exhibitor-list/.test(location.pathname)?2025:2026);if(collections.some(item=>item.year===requested))setYear(requested);};
  sync();window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);
 },[collections]);
 const select=(next:number)=>{setYear(next);history.pushState(null,'',paths.exhibitors+'?year='+next);};
 const selected=collections.find(collection=>collection.year===year)!;
 return <div className="exhibition-page"><ExhibitionHero title={'Participants '+year} intro={'Explore the published participant archive for the '+year+' edition of Bharat Electricity.'}/><ExhibitionActions/>
 <section className="wrap exhibition-section"><nav className="exhibition-year-nav" aria-label="Participant editions">{collections.map(collection=><a href={paths.exhibitors+'?year='+collection.year} key={collection.year} aria-current={collection.year===year?'page':undefined} onClick={event=>{event.preventDefault();select(collection.year);}}>{collection.year} Participants</a>)}</nav>
 <div className="exhibition-section-heading"><h2>The companies behind the conversation.</h2></div><ExhibitionCompanies key={year} items={selected.items} year={year}/><p className="exhibition-note">Published records describe the named edition. Historical stand allocations do not indicate future availability.</p>
 </section><ExhibitionCTA/></div>;
}
