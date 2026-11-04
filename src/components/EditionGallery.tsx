'use client';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react';
import {Gallery} from './Gallery';
import {albums,paths,site} from '@/content/site';
import {editionRecords} from '@/content/editions';
import {photos as exhibitionPhotos} from '@/content/media';
import {refresh2026Photos} from '@/content/refresh-2026';
import media from '@/content/homepage-media.json';
import inauguration from '@/content/inaugurations.json';
import day2024 from '@/content/legacy-day-1-images.json';
import award2024 from '@/content/legacy-award-images.json';
import legacy2025 from '@/content/legacy-2025-assets.json';
import type {Photo} from '@/content/types';
import './GalleryPages.css';

const allPhotos:Photo[]=[...refresh2026Photos,...inauguration.photos,...media.photos.map(photo=>({...photo,category:'Governing Council',caption:photo.edition+' Governing Council meeting'})),...exhibitionPhotos,...day2024.map(photo=>({...photo,edition:2024,category:'Conference',caption:'2024 / Conference'}))];
function cover(title:string,year:number,index:number){
 if(/Knowledge Hub/i.test(title))return '/assets/site-refresh/6f947e2d8f97fc.webp';
 if(/Awards/i.test(title))return year===2025?legacy2025.awards[0].src:award2024[0].src;
 if(/Governing Council/i.test(title))return year===2026?media.photos[index%media.photos.length].src:'/assets/about/council-'+year+'-1.webp';
 if(/Exhibition/i.test(title))return year===2025?exhibitionPhotos[0].src:day2024[0].src;
 return inauguration.photos.find(photo=>photo.edition===year)?.src||day2024[0].src;
}
export function EditionGallery(){
 const [year,setYear]=useState(site.edition.year),[limit,setLimit]=useState(12);
 const tabs=useRef<HTMLDivElement>(null);
 useEffect(()=>{const requested=Number(new URLSearchParams(location.search).get('year'));if(editionRecords.some(edition=>edition.year===requested))setYear(requested);},[]);
 const select=(next:number)=>{setYear(next);setLimit(12);const url=new URL(location.href);url.searchParams.set('year',String(next));history.replaceState(null,'',url.pathname+url.search);};
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
 <div ref={tabs} className="edition-photo-tabs gallery-edition-tabs" role="tablist" aria-label="Photo edition">{editionRecords.map((edition,index)=><button key={edition.year} id={'photo-tab-'+edition.year} role="tab" tabIndex={year===edition.year?0:-1} aria-selected={year===edition.year} aria-controls="edition-photo-panel" onClick={()=>select(edition.year)} onKeyDown={event=>navigate(event,index)}>{edition.year}<span>{edition.year===2026?'Latest edition':'Event archive'}</span></button>)}</div>
 <div id="edition-photo-panel" role="tabpanel" aria-labelledby={'photo-tab-'+year} tabIndex={0}>
 <section className="gallery-photo-previews" aria-labelledby="photo-previews-heading"><header className="gallery-collection-heading"><h2 id="photo-previews-heading">Moments from {year}.</h2><p>Open any photograph for a full-size view. Use the arrow keys to explore the collection.</p></header><Gallery key={year} photos={selected.slice(0,limit)}/>{limit<selected.length&&<div className="gallery-load-more"><button className="button secondary" onClick={()=>setLimit(value=>value+12)}>Show more photographs</button><span>Showing {Math.min(limit,selected.length)} of {selected.length}</span></div>}</section>
 <section className="gallery-collection" id={'albums-'+year} aria-labelledby="official-albums-heading"><header className="gallery-collection-heading"><h2 id="official-albums-heading">Explore the full {year} albums.</h2><p>Continue to the organiser’s official photo collections.</p></header><div className="gallery-album-grid">{albums.filter(album=>album.edition===year).map((album,index)=><a className="gallery-album" key={album.url} href={album.url} target="_blank" rel="noreferrer" aria-label={'View '+album.title+' photo album (opens in a new tab)'}><figure><Image src={cover(album.title,year,index)} alt={album.title+' preview'} width={1200} height={800} sizes="(max-width:767px) 90vw, 45vw"/></figure><div><h3>{album.title}</h3><span className="text-link">View full album <ArrowUpRight size={18} aria-hidden="true"/></span></div></a>)}</div></section>
 </div><div className="gallery-switch"><p>Watch the highlights, conversations and interviews.</p><Link className="button" href={paths.video}>See our Video Gallery <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
 <noscript><h2>Official photo albums</h2>{albums.map(album=><p key={album.url}><a href={album.url}>{album.title}</a></p>)}</noscript>
 </div>;
}
