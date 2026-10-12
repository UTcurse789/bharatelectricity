'use client';
import {paths,site} from '@/content/site';
import Image from 'next/image';
import imageLoader from '@/lib/image-loader';
import images from '@/content/carousel-images.json';
import media from '@/content/homepage-media.json';
import {ReportCover} from './ReportCover';
import {useEffect, useRef, useState, type PointerEvent} from 'react';
import {ArrowLeft, ArrowRight, Pause, Play} from '@phosphor-icons/react';
import './EventCarousel.css';

const slides = [
 {label: '2025 post-show report', background: images.reportBackground, report: true, description: 'Request the report for a review of the 2025 exhibition and conference.', lines: ['2025 Post-show Report'], actions: [{label: 'Request the report', href: paths.report}]},
 {label: 'Powering India Awards', background: images.awardsBackground, report: false, description: 'Recognising outstanding contributions to the future of Indian energy.', lines: ['Celebrating excellence', 'in Indian energy.'], actions: [{label: 'Explore the awards', href: paths.awards}]},
 {label: 'Power & energy solutions', background: images.powerBackground, report: false, description: 'From generation to the grid. Discover the technologies powering a more resilient energy future.', lines: ['Power & energy', 'solutions.', 'One connected ecosystem.'], actions: [{label: 'Explore solutions', href: paths.about}, {label: 'Talk to the team', href: paths.contact}]},
 {label: 'Energy opportunities', background: images.opportunitiesBackground, report: false, description: 'Meet the utilities, innovators and decision-makers moving the industry forward.', lines: ['The right people.', 'New possibilities.'], actions: [{label: 'Meet the participants', href: paths.exhibitors}]},
 {label: 'Exhibit, speak & partner', background: images.exhibitBackground, report: false, description: 'Connect your expertise with an influential energy community.', lines: ['Bring your expertise', 'to the conversation.'], actions: [{label: 'Speaking enquiry', href: paths.speaking}, {label: 'Partnership enquiry', href: paths.partnership}]},
] as const;

export function EventCarousel() {
 const [active, setActive] = useState(0);
 const [playing, setPlaying] = useState(false);
 const [reducedMotion, setReducedMotion] = useState(true);
 const [focused, setFocused] = useState(false);
 const [visible, setVisible] = useState(false);
 const regionRef = useRef<HTMLElement>(null);
 const paginationRef = useRef<HTMLDivElement>(null);
 const start = useRef<{x: number; y: number} | null>(null);
 const slide = slides[active];
 const awards = active === 1;
 const power = active === 2;
 const rotating = playing && !reducedMotion && !focused && visible;

 useEffect(() => {
  const pagination = paginationRef.current;
  const selected = pagination?.children[active] as HTMLElement | undefined;
  if (!pagination || !selected || pagination.scrollWidth <= pagination.clientWidth) return;
  pagination.scrollTo({left: selected.offsetLeft - pagination.offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth'});
 }, [active, reducedMotion]);

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
  const timer = setInterval(() => setActive(index => (index + 1) % slides.length), 9000);
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
 return <section ref={regionRef} className="event-carousel" data-awards={awards ? "true" : undefined} data-report={slide.report ? "true" : undefined} data-power={power ? "true" : undefined} aria-label="Event highlights" aria-roledescription="carousel" onPointerEnter={() => setFocused(true)} onPointerLeave={event => setFocused(event.currentTarget.contains(document.activeElement))} onFocusCapture={() => setFocused(true)} onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);}} onKeyDown={event => {
  setFocused(true);
  if (event.key === 'ArrowRight') {event.preventDefault(); choose(active + 1);}
  else if (event.key === 'ArrowLeft') {event.preventDefault(); choose(active - 1);}
  else if (event.key === 'Home') {event.preventDefault(); choose(0);}
  else if (event.key === 'End') {event.preventDefault(); choose(slides.length - 1);}
 }}>
  {!awards && !power && <div key={slide.background.src} className="carousel-background" aria-hidden="true">
   <Image src={slide.background.src} alt="" fill sizes="100vw" loading="lazy" className="carousel-background-image"/>
   <div className="carousel-background-wash"/>
  </div>}
  <div className="wrap">
   <div className="carousel-stage" onPointerDown={event => {if (event.pointerType === 'touch' && !(event.target as Element).closest('a,button')) start.current = {x: event.clientX, y: event.clientY};}} onPointerUp={finishSwipe} onPointerCancel={() => {start.current = null;}}>
    <div key={active} id="event-carousel-slide" className={'carousel-slide' + (slide.report ? ' carousel-slide-report' : '') + (awards ? ' carousel-slide-awards' : '')} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${slides.length}: ${slide.label}`}>
     <div className="carousel-copy">
      <p className="carousel-awards-label">{slide.report?'2025 edition archive':awards?'Powering India Awards '+media.awards.edition:power?media.power.edition+' exhibition archive':site.edition.year+' edition'}</p>
      <h2 className="carousel-title">{slide.lines.map((line, index) => <span className={power && index === 1 ? 'power-neon-text' : ''} key={line}>{line}</span>)}</h2>
      {slide.description && <p className="carousel-description">{slide.description}</p>}
      <div className="carousel-actions">{slide.actions.map((action, index) => <a key={action.href} href={action.href} className={'button' + (index > 0 ? ' secondary' : '')}>{action.label}<ArrowRight size={18} aria-hidden="true"/></a>)}</div>
     </div>
     {awards && <figure className="carousel-feature-photo carousel-awards-photo">
      <Image src={media.awards.src} alt={media.awards.alt} width={media.awards.width} height={media.awards.height} sizes="(max-width:767px) 90vw, 48vw" className="carousel-awards-image"/>
      <figcaption>{media.awards.edition} awards archive</figcaption>
     </figure>}
     {power && <figure className="carousel-feature-photo carousel-power-photo">
      <Image src={media.power.src} alt={media.power.alt} width={1800} height={1200} sizes="(max-width:767px) 90vw, 48vw"/>
      <figcaption>{media.power.edition} exhibition archive</figcaption>
     </figure>}
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

