'use client';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {Gallery} from './Gallery';
import {albums,site} from '@/content/site';
import {editionRecords} from '@/content/editions';
import {photos as exhibitionPhotos} from '@/content/media';
import media from '@/content/homepage-media.json';
import inauguration from '@/content/inaugurations.json';
import day2024 from '@/content/legacy-day-1-images.json';
import type {Photo} from '@/content/types';

const allPhotos:Photo[]=[...inauguration.photos,...media.photos.map(photo=>({...photo,category:'Governing Council',caption:photo.edition+' Governing Council meeting'})),...exhibitionPhotos,...day2024.map(photo=>({...photo,edition:2024,category:'Conference',caption:'2024 conference · Day 1'}))];
export function EditionGallery() {
 const [year,setYear]=useState(site.edition.year);
 const tabs=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const requested=Number(new URLSearchParams(location.search).get('year'));
  if(editionRecords.some(edition=>edition.year===requested))setYear(requested);
 },[]);
 const select=(next:number)=>{setYear(next);const url=new URL(location.href);url.searchParams.set('year',String(next));history.replaceState(null,'',url.pathname+url.search+url.hash);};
 const navigate=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%editionRecords.length;
  else if(event.key==='ArrowLeft')next=(index+editionRecords.length-1)%editionRecords.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=editionRecords.length-1;
  else return;
  event.preventDefault();select(editionRecords[next].year);tabs.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
 };
 const selected=allPhotos.filter(photo=>photo.edition===year);
 return <>
  <div ref={tabs} className="edition-photo-tabs" role="tablist" aria-label="Photo edition">{editionRecords.map((edition,index)=><button key={edition.year} id={'photo-tab-'+edition.year} role="tab" tabIndex={year===edition.year?0:-1} aria-selected={year===edition.year} aria-controls="edition-photo-panel" onClick={()=>select(edition.year)} onKeyDown={event=>navigate(event,index)}>{edition.year}{edition.year===site.edition.year?' · Latest':' · Archive'}</button>)}</div>
  <div id="edition-photo-panel" role="tabpanel" aria-labelledby={'photo-tab-'+year} tabIndex={0}>
   <h2>{year} photographs</h2>
   {year===2026&&<p>The available photographs show the 2026 Governing Council meetings. Inauguration photographs will be added when available.</p>}
   <Gallery key={year} photos={selected}/>
   <section className="album-section"><h2>{year} official albums</h2><div className="album-grid">{albums.filter(album=>album.edition===year).map(album=><a className="album-link" key={album.url} href={album.url}><span>{year}</span><h3>{album.title}</h3><span className="text-link">Open official album</span></a>)}</div></section>
  </div>
 </>;
}
