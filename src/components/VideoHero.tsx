'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight} from '@phosphor-icons/react';
import Link from 'next/link';
import {site} from '@/content/site';
import {registrationPaths} from '@/content/registration';
import media from '@/content/homepage-media.json';
import './VideoHero.css';
import Image from 'next/image';

export function VideoHero() {
 const edition=site.nextEdition;
 const videoSrc = media.hero.videoSrc as string | null;
 const videoRef = useRef<HTMLVideoElement>(null);
 const regionRef = useRef<HTMLElement>(null);
 const [playing, setPlaying] = useState(false);
 const [ready,setReady]=useState(false);
 const [started,setStarted]=useState(false);
 const [failed,setFailed]=useState(false);

 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => {if (preference.matches) setPlaying(false);};
  const connection=(navigator as Navigator & {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
  if(videoSrc && innerWidth>=768 && !preference.matches && !connection?.saveData && !/2g|3g/.test(connection?.effectiveType||''))setPlaying(true);
  reduce();
  preference.addEventListener('change', reduce);
  return () => preference.removeEventListener('change', reduce);
 }, []);

 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>setReady(true),650);return()=>clearTimeout(timer);},[playing]);

 useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  let inView = true;
  let disposed = false;
  const sync = () => {
   const active = inView && !document.hidden;
   if (ready && playing && active) video.play().catch(() => {if (!disposed) setPlaying(false);});
   else video.pause();
  };
  const observer = new IntersectionObserver(([entry]) => {inView = entry.isIntersecting && entry.intersectionRatio > .05; sync();}, {threshold: .05});
  if (regionRef.current) observer.observe(regionRef.current);
  document.addEventListener('visibilitychange', sync);
  sync();
  return () => {disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause();};
 }, [playing,ready]);

 return <section ref={regionRef} className="video-hero" aria-labelledby="video-hero-heading">
  <Image className="video-hero-poster" src={media.hero.poster} alt={media.hero.posterAlt} width={1600} height={900} sizes="(max-width:767px) 1200px, 100vw" preload fetchPriority="high"/>
  {videoSrc && <video ref={videoRef} src={ready ? videoSrc : undefined} className="video-hero-footage" data-started={started && !failed} width={1280} height={720} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => {setStarted(true);setFailed(false);}} onError={() => {setPlaying(false);setFailed(true);}}/>}
  <div className="video-hero-shade" aria-hidden="true"/>
  <div className="video-hero-layout wrap">
   <div className="video-hero-copy">
    <h1 id="video-hero-heading">BHARAT ELECTRICITY</h1>
    <p className="video-hero-event-info"><strong>{edition.dates.toUpperCase()}</strong><span>{edition.venue.toUpperCase()}, {edition.location.toUpperCase()}</span></p>
    <h2 className="video-hero-theme">INDIA'S NEXT ENERGY ADVANTAGE</h2>
    <p className="video-hero-subtheme">From Capacity to Capability</p>
    <p className="video-hero-pillars">Integrated Systems • State-Led Execution • Global Competitiveness</p>
    <p className="video-hero-positioning">India's flagship platform for the power, electricity and energy ecosystem</p>
    <div className="video-hero-actions">
     <Link className="video-hero-cta video-hero-cta-delegate" href={registrationPaths.delegate}>Book your delegate pass <ArrowUpRight size={19} aria-hidden="true"/></Link>
     <Link className="video-hero-cta video-hero-cta-visitor" href={registrationPaths.visitor}>Register as a visitor <ArrowUpRight size={19} aria-hidden="true"/></Link>
    </div>
   </div>
  </div>
 </section>;
}
