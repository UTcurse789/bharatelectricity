'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {LogoImage} from './LogoImage';
import type {PartnerArtwork} from './PartnerShowcase';

export function HomePartnerRow({logos, label}: {logos: PartnerArtwork[]; label: string}) {
 const viewport = useRef<HTMLDivElement>(null);
 const list = useRef<HTMLDivElement>(null);
 const [overflow, setOverflow] = useState(false);
 const [duration, setDuration] = useState(60);
 const [inView, setInView] = useState(false);
 const [reducedMotion, setReducedMotion] = useState(true);
 const [artworkHeight, setArtworkHeight] = useState(96);

 useEffect(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReducedMotion(preference.matches);
  update();
  preference.addEventListener('change', update);
  return () => preference.removeEventListener('change', update);
 }, []);

 useEffect(() => {
  const windowElement = viewport.current;
  const listElement = list.current;
  if (!windowElement || !listElement) return;
  const measure = () => {
   const items = Array.from(listElement.children);
   const box = items[0] as HTMLElement | undefined;
   if (box) {
    const style = getComputedStyle(box);
    const availableHeight = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    setArtworkHeight(Math.max(1, Math.min(96, availableHeight)));
   }
   const gap = parseFloat(getComputedStyle(listElement).columnGap) || 0;
   const width = items.reduce((total, item) => total + item.getBoundingClientRect().width, 0) + gap * Math.max(0, items.length - 1);
   setOverflow(width > windowElement.clientWidth + 1);
   // Include the final gap so the repeated sequence meets the first seamlessly.
   setDuration((width + gap) / 24);
  };
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(windowElement);
  measure();
  const intersectionObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
  intersectionObserver.observe(windowElement);
  return () => {
   resizeObserver.disconnect();
   intersectionObserver.disconnect();
  };
 }, [logos]);

 const looping = overflow && !reducedMotion;
 const renderLogos = (duplicate: boolean) => logos.map((logo, index) => <div className="home-partner-box" key={`${logo.src}-${index}`}>
  <LogoImage src={logo.src} alt={duplicate ? '' : logo.name} width={logo.width} height={logo.height}
   maxWidth={176} maxHeight={artworkHeight}
   sizes="(max-width:767px) 140px, 200px" loading={looping ? 'eager' : 'lazy'}/>
 </div>);

 return <div className="home-partner-logos" ref={viewport} data-overflow={overflow} data-playing={looping && inView}
  tabIndex={looping ? 0 : undefined} role="group" aria-label={`${label} logos`}>
  <div className="home-partner-track" style={{'--partner-loop-duration': `${duration}s`} as CSSProperties}>
   <div className="home-partner-logo-list" ref={list}>{renderLogos(false)}</div>
   {looping && <div className="home-partner-logo-list home-partner-logo-copy" aria-hidden="true">{renderLogos(true)}</div>}
  </div>
 </div>;
}
