'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight, Play} from '@phosphor-icons/react';
import {videoSections, type GalleryVideo} from '@/content/galleries';
import {paths} from '@/content/site';
import videoSources from '@/content/video-sources.json';
import './GalleryPages.css';

const thumbnails = new Map(videoSources.map(video => [video.id, video.thumbnail]));

function playerUrl(video: GalleryVideo) {
 const url = new URL(video.url);
 url.hostname = 'www.youtube.com';
 url.pathname = '/embed/' + video.id;
 url.searchParams.set('autoplay', '1');
 return url.toString();
}

export function VideoGallery() {
 const [activeVideo, setActiveVideo] = useState<string | null>(null);
 const player = useRef<HTMLIFrameElement>(null);
 useEffect(() => {if (activeVideo) player.current?.focus();}, [activeVideo]);

 return <div className="gallery-page video-gallery">
  <nav className="gallery-jump-links" aria-label="Video collections">
   {videoSections.map(section => <a key={section.id} href={'#' + section.id}>{section.navLabel}</a>)}
  </nav>
  {videoSections.map(section => <section className="gallery-collection" id={section.id} key={section.id} aria-labelledby={section.id + '-heading'}>
   <header className="gallery-collection-heading"><h2 id={section.id + '-heading'}>{section.title}</h2>{section.description && <p>{section.description}</p>}</header>
   <div className="gallery-video-grid">{section.videos.map(video => <article className="gallery-video" key={video.id}>
    <div className="gallery-video-frame">
     {activeVideo === video.id ? <iframe ref={player} src={playerUrl(video)} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <button className="gallery-video-play" aria-label={'Play ' + video.title} onClick={() => setActiveVideo(video.id)}>
      {thumbnails.get(video.id) && <Image src={thumbnails.get(video.id)!} alt="" width={480} height={360} sizes="(max-width:767px) 90vw, 45vw" loading="lazy"/>}
      <span><Play size={28} weight="fill" aria-hidden="true"/></span>
     </button>}
    </div>
    <h3>{video.title}</h3>{video.description && <p>{video.description}</p>}
    <a className="text-link" href={video.url} target="_blank" rel="noopener noreferrer" aria-label={'Open ' + video.title + ' on YouTube (opens in a new tab)'}>Open on YouTube <ArrowUpRight size={16} aria-hidden="true"/></a>
   </article>)}</div>
  </section>)}
  <div className="gallery-switch"><p>Explore more moments from the event.</p><Link className="button" href={paths.gallery}>See our Photo Gallery <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
 </div>;
}
