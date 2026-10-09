'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import imageLoader from '@/lib/image-loader';
import images from '@/content/carousel-images.json';
import {ReportCover} from './ReportCover';
import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {ArrowLeft, ArrowRight, Pause, Play} from '@phosphor-icons/react';

import VariableProximity from './react-bits/VariableProximity';
import './EventCarousel.css';

const TechText = dynamic(() => import('./react-bits/TechText'), {ssr: false});
const WarpText = dynamic(() => import('./react-bits/WarpText'), {ssr: false});
const slides = [
 {label: 'Post show report', background: images.reportBackground, report: true, description: 'Explore event highlights, industry insights and key moments.', effect: 'tech', lines: ['India’s flagship', 'energy business platform', 'Post show report'], actions: [{label: 'Download here', href: 'https://www.powergen-india.com/media-hub/postshowreport'}]},
 {label: 'Powering India Awards', background: images.awardsBackground, report: false, description: 'Recognising the people and organisations shaping the future of power.', effect: 'warp', lines: ['Celebrating', 'excellence in', 'Indian energy'], actions: [{label: 'Explore the gallery', href: 'https://photos.app.goo.gl/B84DWBDPtEAD4tK57'}]},
 {label: 'Power & energy solutions', background: images.powerBackground, report: false, description: '', effect: 'tech', lines: ['The only event in India', 'to bring you end-to-end', 'power & energy solutions'], actions: [{label: 'Explore more', href: 'https://www.powergen-india.com/event'}, {label: 'Request a call back', href: 'https://www.powergen-india.com/request_a_call_back'}]},
 {label: 'Energy opportunities', background: images.opportunitiesBackground, report: false, description: '', effect: 'warp', lines: ['Unlock energy opportunities', 'at Bharat Electricity 2026'], actions: []},
 {label: 'Exhibit, speak & partner', background: images.exhibitBackground, report: false, description: '', effect: 'proximity', lines: ['Amplify your thought leadership'], support: 'Catalyse your demand generation initiatives', detail: 'Join us. Exhibit at Bharat Electricity & Indian Utility Week 2026.', actions: [{label: 'Speaking enquiry', href: 'https://www.powergen-india.com/summit-overview/speaking-opportunities'}, {label: 'Partnership enquiry', href: 'https://www.powergen-india.com/become-a-sponsor'}]},
] as const;

function TechLine({text, animated, accent = false, report = false}: {text: string; animated: boolean; accent?: boolean; report?: boolean}) {
 const [ready, setReady] = useState(false);
 return <div className={'carousel-tech-line' + (accent ? ' carousel-accent-line' : '')}>
  <span className={'carousel-text-fallback' + (animated && ready ? ' is-painted' : '')}>{text}</span>
  {animated && <div className="carousel-canvas-layer"><TechText text={text} fontFamily="Outfit, sans-serif" align="left" fontWeight={750} fontSize={report ? 52 : 70} letterSpacing={-.045} color={accent ? '#b94a06' : '#181818'} accentColor="#b94a06" reach={160} softness={.7} strokeWidth={1.5} dashLength={4} dashGap={2} specks={15} reveal="letter" lineStyle="dashed" selection labels draggable sweep speed={.65} style={{height: '100%'}} onReady={() => setReady(true)}/></div>}
 </div>;
}

function SlideTitle({slide, animated}: {slide: typeof slides[number]; animated: boolean}) {
 const containerRef = useRef<HTMLDivElement>(null);
 const [ready, setReady] = useState(false);
 const title = slide.lines.join(' ');
 const proximity = (label: string, className: string) => animated ? <VariableProximity label={label} className={className} containerRef={containerRef} fromFontVariationSettings="'wght' 600" toFontVariationSettings="'wght' 800" radius={160} falloff="linear" style={{fontFamily: 'Outfit, sans-serif'}}/> : <span className={className}>{label}</span>;
 return <>
  <h2 className="sr-only">{title}</h2>
  <div ref={containerRef} className={'carousel-title carousel-title-' + slide.effect} aria-hidden="true">
   {slide.effect === 'tech' && slide.lines.map((line, index) => <TechLine key={line} text={line} animated={animated} accent={index === slide.lines.length - 1} report={slide.report}/>)}
   {slide.effect === 'warp' && <>
    <div className={'carousel-warp-fallback carousel-text-fallback' + (animated && ready ? ' is-painted' : '')}>{slide.lines.map(line => <span key={line}>{line}</span>)}</div>
    {animated && <div className="carousel-canvas-layer"><WarpText align="left" text={slide.lines.join('\n')} color="#181818" warpStrength={.06} warpScale={1.7} speed={.55} pointerInfluence={.42} pointerStrength={.38} refraction={.012} ripple fontSize="clamp(2rem, 4.2vw, 3.8rem)" fontWeight={800} fontFamily="Outfit, sans-serif" letterSpacing="-0.045em" lineHeight={1.15} style={{height: '100%', minHeight: 0}} onReady={() => setReady(true)}/></div>}
   </>}
   {slide.effect === 'proximity' && <>
    <div className="carousel-proximity-heading">{proximity(title, 'carousel-variable')}</div>
    <p className="carousel-proximity-support">{proximity(slide.support, 'carousel-variable')}</p>
    <p className="carousel-proximity-detail">{proximity(slide.detail, 'carousel-variable')}</p>
   </>}
  </div>
  {slide.effect === 'proximity' && <p className="sr-only">{slide.support} {slide.detail}</p>}
 </>;
}

export function EventCarousel() {
 const [active, setActive] = useState(0);
 const [effectsReady, setEffectsReady] = useState(false);
 const [playing, setPlaying] = useState(true);
 const [reducedMotion, setReducedMotion] = useState(true);
 const [focused, setFocused] = useState(false);
 const [visible, setVisible] = useState(false);
 const regionRef = useRef<HTMLElement>(null);
 const paginationRef = useRef<HTMLDivElement>(null);
 const start = useRef<{x: number; y: number} | null>(null);
 const slide = slides[active];
 const awards = active === 1;
 const rotating = playing && !reducedMotion && !focused && visible;

 useEffect(() => {
  const pagination = paginationRef.current;
  const selected = pagination?.children[active] as HTMLElement | undefined;
  if (!pagination || !selected || pagination.scrollWidth <= pagination.clientWidth) return;
  pagination.scrollTo({left: selected.offsetLeft - pagination.offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth'});
 }, [active, reducedMotion]);

 useEffect(() => {
  let cancelled = false;
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const ready = () => {
   if (cancelled) return;
   if (window.requestIdleCallback) idle = window.requestIdleCallback(() => setEffectsReady(true), {timeout: 1500});
   else timer = setTimeout(() => setEffectsReady(true), 16);
  };
  document.fonts.ready.then(ready, ready);
  return () => {
   cancelled = true;
   if (idle !== undefined) window.cancelIdleCallback(idle);
   if (timer !== undefined) clearTimeout(timer);
  };
 }, []);
 useEffect(() => {
  const query = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReducedMotion(query.matches);
  update();
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
 }, []);
 useEffect(() => {
  let inView = true;
  const update = () => setVisible(inView && !document.hidden);
  const observer = new IntersectionObserver(([entry]) => {inView = entry.isIntersecting; update();}, {threshold: .15});
  if (regionRef.current) observer.observe(regionRef.current);
  document.addEventListener('visibilitychange', update);
  update();
  return () => {observer.disconnect(); document.removeEventListener('visibilitychange', update);};
 }, []);
 useEffect(() => {
  if (!rotating) return;
  const timer = setInterval(() => setActive(index => (index + 1) % slides.length), 3000);
  return () => clearInterval(timer);
 }, [rotating, active]);
 useEffect(() => {
  const connection = (navigator as Navigator & {connection?: {saveData?: boolean; effectiveType?: string}}).connection;
  if (!visible || reducedMotion || !playing || connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
  const loadNext = () => {
   const next = slides[(active + 1) % slides.length].background;
   const image = new window.Image();
   image.decoding = 'async';
   image.fetchPriority = 'low';
   image.sizes = '100vw';
   image.srcset = [480, 768, 1200, 1800].map(width => imageLoader({src: next.src, width}) + ' ' + width + 'w').join(', ');
   image.src = next.src;
  };
  if (window.requestIdleCallback) {
   const task = window.requestIdleCallback(loadNext, {timeout: 2000});
   return () => window.cancelIdleCallback(task);
  }
  const timer = setTimeout(loadNext, 500);
  return () => clearTimeout(timer);
 }, [active, visible, reducedMotion, playing]);
 const choose = (index: number) => setActive((index + slides.length) % slides.length);
 const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
  if (!start.current) return;
  const dx = event.clientX - start.current.x, dy = event.clientY - start.current.y;
  start.current = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(active + (dx < 0 ? 1 : -1));
 };
 return <section ref={regionRef} className="event-carousel" data-awards={awards ? "true" : undefined} data-report={slide.report ? "true" : undefined} aria-label="Event highlights" aria-roledescription="carousel" onPointerDownCapture={() => setFocused(false)} onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);}} onKeyDown={event => {
  setFocused(true);
  if (event.key === 'ArrowRight') {event.preventDefault(); choose(active + 1);}
  else if (event.key === 'ArrowLeft') {event.preventDefault(); choose(active - 1);}
  else if (event.key === 'Home') {event.preventDefault(); choose(0);}
  else if (event.key === 'End') {event.preventDefault(); choose(slides.length - 1);}
 }}>
  {!awards && <div key={slide.background.src} className="carousel-background" aria-hidden="true">
   <Image src={slide.background.src} alt="" fill sizes="100vw" loading="lazy" className="carousel-background-image"/>
   <div className="carousel-background-wash"/>
  </div>}
  <div className="wrap">
   <div className="carousel-stage" onPointerDown={event => {if (event.pointerType === 'touch' && !(event.target as Element).closest('a,button')) start.current = {x: event.clientX, y: event.clientY};}} onPointerUp={finishSwipe} onPointerCancel={() => {start.current = null;}}>
    <div key={active} id="event-carousel-slide" className={'carousel-slide' + (slide.report ? ' carousel-slide-report' : '') + (awards ? ' carousel-slide-awards' : '')} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${slides.length}: ${slide.label}`}>
     <div className="carousel-copy">
      {awards ? <>
       <p className="carousel-awards-label">Powering India Awards</p>
       <h2 className="carousel-title carousel-awards-title">{slide.lines.map(line => <span key={line}>{line}</span>)}</h2>
      </> : <SlideTitle slide={slide} animated={effectsReady && !reducedMotion && visible}/>}
      {slide.description && <p className="carousel-description">{slide.description}</p>}
      <div className="carousel-actions">{slide.actions.map((action, index) => <a key={action.href} href={action.href} className={'button' + (index > 0 ? ' secondary' : '')}>{action.label}<ArrowRight size={18} aria-hidden="true"/></a>)}</div>
     </div>
     {awards && <div className="carousel-awards-photo">
      <Image src={images.awardsBackground.src} alt="Powering India Awards recipients on stage with their certificates" fill sizes="(max-width:767px) 665px, (min-width:2234px) 60vw, 1330px" loading="eager" className="carousel-awards-image"/>
     </div>}
     {slide.report && <div className="carousel-report-art">
      <ReportCover/>
     </div>}
    </div>
   </div>
   <div className="carousel-controls">
    <div ref={paginationRef} className="carousel-pagination" aria-label="Choose a highlight">{slides.map((item, index) => <button key={item.label} type="button" aria-label={`Show slide ${index + 1}: ${item.label}`} aria-current={index === active ? 'true' : undefined} aria-controls="event-carousel-slide" onClick={() => choose(index)}><span className="carousel-marker"/><span className="carousel-pagination-label">{item.label}</span></button>)}</div>
    <div className="carousel-transport">
     <span className="carousel-count" aria-label={`Slide ${active + 1} of ${slides.length}`}>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
     {!reducedMotion && <button type="button" className="carousel-icon-button" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={19} aria-hidden="true"/> : <Play size={19} aria-hidden="true"/>}</button>}
     <button type="button" className="carousel-icon-button" aria-label="Previous slide" onClick={() => choose(active - 1)}><ArrowLeft size={21} aria-hidden="true"/></button>
     <button type="button" className="carousel-icon-button" aria-label="Next slide" onClick={() => choose(active + 1)}><ArrowRight size={21} aria-hidden="true"/></button>
    </div>
   </div>
   <p className="sr-only" role="status" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">Slide {active + 1} of {slides.length}: {slide.label}</p>
  </div>
 </section>;
}

