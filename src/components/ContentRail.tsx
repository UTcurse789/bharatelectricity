'use client';

import {Children, useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, Pause, Play} from '@phosphor-icons/react';

export function ContentRail({label, children, className = '', autoPlay = false, deferUntilVisible = false}: {label: string; children: ReactNode; className?: string; autoPlay?: boolean; deferUntilVisible?: boolean}) {
 const ref = useRef<HTMLDivElement>(null);
 const rootRef = useRef<HTMLDivElement>(null);
 const [playing, setPlaying] = useState(true);
 const [reducedMotion, setReducedMotion] = useState(true);
 const [visible, setVisible] = useState(false);
 const [activated, setActivated] = useState(false);
 const [interacting, setInteracting] = useState(false);
 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReducedMotion(preference.matches);
  update();
  preference.addEventListener('change', update);
  return () => preference.removeEventListener('change', update);
 }, []);
 useEffect(() => {
  if (!autoPlay && !deferUntilVisible) return;
  let inView = false;
  const update = () => {setVisible(inView && !document.hidden); if (inView) setActivated(true);};
  const observer = new IntersectionObserver(([entry]) => {inView = entry.isIntersecting; update();}, {threshold: .2});
  if (rootRef.current) observer.observe(rootRef.current);
  document.addEventListener('visibilitychange', update);
  return () => {observer.disconnect(); document.removeEventListener('visibilitychange', update);};
 }, [autoPlay, deferUntilVisible]);
 useEffect(() => {
  if (!autoPlay || !playing || reducedMotion || !visible || interacting) return;
  const timer = setInterval(() => {
   const rail = ref.current;
   if (!rail || rail.scrollWidth <= rail.clientWidth) return;
   if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4) rail.scrollTo({left: 0, behavior: 'instant'});
   else rail.scrollBy({left: rail.clientWidth * .85, behavior: 'smooth'});
  }, 6500);
  return () => clearInterval(timer);
 }, [autoPlay, playing, reducedMotion, visible, interacting]);
 const move = (direction: number) => {
  const rail = ref.current;
  if (!rail) return;
  rail.scrollBy({left: direction * rail.clientWidth * .85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 };
 return <div ref={rootRef} className={'content-rail ' + className} data-automatic={autoPlay ? 'true' : undefined} onPointerEnter={() => setInteracting(true)} onPointerLeave={() => setInteracting(rootRef.current?.contains(document.activeElement) ?? false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => {if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);}}>
  <div className="rail-tools"><span>{autoPlay ? 'Explore the lineup' : 'Use the arrows or swipe'}</span><div>
   {autoPlay && !reducedMotion && <button type="button" aria-label={(playing ? 'Pause' : 'Resume') + ' automatic ' + label} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={20} aria-hidden="true"/> : <Play size={20} aria-hidden="true"/>}</button>}
   <button type="button" aria-label={'Previous ' + label} onClick={() => move(-1)}><ArrowLeft size={22}/></button>
   <button type="button" aria-label={'Next ' + label} onClick={() => move(1)}><ArrowRight size={22}/></button>
  </div></div>
  <div ref={ref} className="rail-track" data-lenis-prevent-horizontal tabIndex={0} role="region" aria-label={label} aria-live="off">{(autoPlay || deferUntilVisible) && !activated ? Children.toArray(children).slice(0, 8) : children}</div>
 </div>;
}
