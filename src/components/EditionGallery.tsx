'use client';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react';
import {Gallery} from './Gallery';
import {albums,paths,site} from '@/content/site';
import {editionRecords} from '@/content/editions';
import {photos as exhibitionPhotos} from '@/content/media';
import media from '@/content/homepage-media.json';
import inauguration from '@/content/inaugurations.json';
import day2024 from '@/content/legacy-day-1-images.json';
import type {Photo} from '@/content/types';
import './GalleryPages.css';

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
 return <div className="gallery-page photo-gallery">
  <nav className="gallery-jump-links" aria-label="Photo collections">{editionRecords.map(edition=><a key={edition.year} href={'#albums-'+edition.year}>Gallery {edition.year}</a>)}<Link href={paths.video}>Video Gallery <span aria-hidden="true">↗</span></Link></nav>
  {editionRecords.map(edition=><section className="gallery-collection" id={'albums-'+edition.year} key={edition.year} aria-labelledby={'albums-heading-'+edition.year}>
   <header className="gallery-collection-heading"><h2 id={'albums-heading-'+edition.year}>Gallery {edition.year}</h2><p>{edition.year===2026?'The 1st and 2nd Governing Council meetings.':'Bharat Electricity, Powergen India & Indian Utility Week.'}</p></header>
   <div className="gallery-album-grid">{albums.filter(album=>album.edition===edition.year).map(album=><a className="gallery-album" key={album.url} href={album.url} target="_blank" rel="noopener noreferrer" aria-label={'View '+album.title+' photo album (opens in a new tab)'}><div><h3>{album.title}</h3><p>{album.title.includes('Knowledge Hub')?'Access the Knowledge Hub 2025 gallery.':'Explore the official '+album.title+' photo gallery.'}</p><span className="text-link">View photo album</span></div><ArrowUpRight size={22} aria-hidden="true"/></a>)}</div>
  </section>)}
  <div className="gallery-switch"><p>Watch the highlights, conversations and interviews.</p><Link className="button" href={paths.video}>See our Video Gallery <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
  <section className="gallery-photo-previews" aria-labelledby="photo-previews-heading"><header className="gallery-collection-heading"><h2 id="photo-previews-heading">Selected event photographs</h2><p>Browse a preview by year, or open the full albums above.</p></header>
  <div ref={tabs} className="edition-photo-tabs" role="tablist" aria-label="Photo edition">{editionRecords.map((edition,index)=><button key={edition.year} id={'photo-tab-'+edition.year} role="tab" tabIndex={year===edition.year?0:-1} aria-selected={year===edition.year} aria-controls="edition-photo-panel" onClick={()=>select(edition.year)} onKeyDown={event=>navigate(event,index)}>{edition.year}{edition.year===site.edition.year?' · Latest':''}</button>)}</div>
  <div id="edition-photo-panel" role="tabpanel" aria-labelledby={'photo-tab-'+year} tabIndex={0}>
   <h3>{year} photographs</h3>
   {year===2026&&<p>Photographs from the 2026 Governing Council meetings.</p>}
   <Gallery key={year} photos={selected}/>
  </div>
  </section>
 </div>;
}
