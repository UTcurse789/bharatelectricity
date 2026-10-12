'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {Pause, Play} from '@phosphor-icons/react';
import {LogoImage} from './LogoImage';
import type {PartnerGroup} from './PartnerShowcase';

export function PartnerLogoLoop({groups}: {groups: PartnerGroup[]}) {
 const rootRef = useRef<HTMLDivElement>(null);
 const [playing, setPlaying] = useState(true);
 const [visible, setVisible] = useState(false);
 const [activated, setActivated] = useState(false);
 const [reducedMotion, setReducedMotion] = useState(true);
 const logos = groups.filter(group => !['Global Footprint', 'GOVERNMENT SUPPORT'].includes(group.title)).flatMap(group => group.logos.map(logo => ({...logo, role: group.title}))).filter((logo, index, all) => all.findIndex(item => item.src === logo.src) === index);
 useEffect(() => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotion = () => setReducedMotion(media.matches);
  let inView = false;
  const updateVisibility = () => {setVisible(inView && !document.hidden); if (inView) setActivated(true);};
  const observer = new IntersectionObserver(([entry]) => {inView = entry.isIntersecting; updateVisibility();}, {threshold: .1});
  if (rootRef.current) observer.observe(rootRef.current);
  updateMotion();
  media.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateVisibility);
  return () => {observer.disconnect(); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility);};
 }, []);
 return <div ref={rootRef} className="partner-logo-loop" data-running={playing && visible && !reducedMotion ? 'true' : 'false'} style={{'--logo-loop-duration': `${Math.max(60, logos.length * 3)}s`} as CSSProperties}>
  <div className="logo-loop-controls"><span>{logos.length} partners across the energy ecosystem</span>{!reducedMotion && <button type="button" aria-label={(playing ? 'Pause' : 'Resume') + ' partner logo loop'} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={18} aria-hidden="true"/> : <Play size={18} aria-hidden="true"/>}<span>{playing ? 'Pause' : 'Play'}</span></button>}</div>
  <div className="logo-loop-window" tabIndex={0} role="region" aria-label="Event partner logos" data-native-scroll>
   <div className="logo-loop-track">
    {[0, 1].map(copy => <div className="logo-loop-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{(activated ? logos : logos.slice(0, 12)).map(logo => <div className="logo-loop-item" key={logo.src} title={logo.name + ' · ' + logo.role}><LogoImage src={logo.src} alt={copy === 0 ? logo.name : ''} width={logo.width} height={logo.height} maxWidth={190} maxHeight={90} sizes="190px"/></div>)}</div>)}
   </div>
  </div>
 </div>;
}
