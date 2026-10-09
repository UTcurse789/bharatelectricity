'use client';

import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from '@phosphor-icons/react';
import CircularText from './react-bits/CircularText';
import './VideoHero.css';
import Image from 'next/image';

export function VideoHero() {
 const videoRef = useRef<HTMLVideoElement>(null);
 const regionRef = useRef<HTMLElement>(null);
 const [playing, setPlaying] = useState(true);
 const [visible, setVisible] = useState(true);
 const [ready,setReady]=useState(false);

 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => {if (preference.matches) setPlaying(false);};
  const connection=(navigator as Navigator & {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
  if(innerWidth<768||connection?.saveData||/2g|3g/.test(connection?.effectiveType||''))setPlaying(false);
  reduce();
  preference.addEventListener('change', reduce);
  return () => preference.removeEventListener('change', reduce);
 }, []);

 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>setReady(true),650);return()=>clearTimeout(timer);},[playing]);
 useEffect(()=>{if(ready)videoRef.current?.load();},[ready]);

 useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  let inView = true;
  let disposed = false;
  const sync = () => {
   const active = inView && !document.hidden;
   setVisible(active);
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
  <Image className="video-hero-poster" src="/assets/bharat-electricity-2027-poster.webp" alt="" width={1600} height={900} sizes="100vw" preload fetchPriority="high"/>
  <video ref={videoRef} className="video-hero-footage" autoPlay={ready&&playing} muted loop playsInline preload="none" aria-hidden="true" onError={() => setPlaying(false)}>
   {ready&&<source src="/assets/bharat-electricity-2027.mp4" type="video/mp4"/>}
  </video>
  <div className="video-hero-shade" aria-hidden="true"/>
  <div className="video-hero-layout wrap">
   <div className="video-hero-copy">
    <h1 id="video-hero-heading"><span className="video-hero-title-line">Bharat Electricity</span><span className="video-hero-title-line">2027</span></h1>
    <p className="video-hero-tagline">WHERE ENERGY LEADERS POWER THE FUTURE</p>
   </div>
   <div className="video-hero-announcement" role="img" aria-label="Announcing Soon">
    <div aria-hidden="true"><CircularText text="ANNOUNCING SOON * ANNOUNCING SOON * " onHover="speedUp" spinDuration={20} paused={!playing || !visible} className="video-hero-circle"/></div>
    <span className="video-hero-circle-year" aria-hidden="true">2027</span>
   </div>
   <button type="button" className="video-hero-playback" aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={() => setPlaying(value => !value)}>
    {playing ? <Pause size={21} aria-hidden="true"/> : <Play size={21} aria-hidden="true"/>}
   </button>
  </div>
 </section>;
}
