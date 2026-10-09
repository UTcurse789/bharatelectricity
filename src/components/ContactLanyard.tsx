'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import {Pause, Play} from '@phosphor-icons/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import portraits from '@/content/lanyard-image.json';
import {site} from '@/content/site';
import './ContactLanyard.css';

const Lanyard = dynamic(() => import('./react-bits/Lanyard'), {ssr: false});
const team = [
 {...site.contacts[0], id: 'siddhartha', image: portraits.siddhartha, featured: true},
 {...site.contacts[2], name: 'Amit Gupta', id: 'amit', image: portraits.amit, featured: false},
 {...site.contacts[1], id: 'hansika', image: portraits.hansika, featured: false},
];

function ContactCard({member, playing, reducedMotion}: {member: typeof team[number]; playing: boolean; reducedMotion: boolean}) {
 const regionRef = useRef<HTMLElement>(null);
 const [near, setNear] = useState(false);
 const [ready, setReady] = useState(false);
 const [unavailable, setUnavailable] = useState(false);
 const onReady = useCallback(() => setReady(true), []);
 const onUnavailable = useCallback(() => {setUnavailable(true); setReady(false);}, []);

 useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
   if (entry.isIntersecting) {setNear(true); observer.disconnect();}
  }, {rootMargin: '160px'});
  if (regionRef.current) observer.observe(regionRef.current);
  return () => observer.disconnect();
 }, []);
 const image = member.image;
 return <figure ref={regionRef} className={'contact-lanyard' + (member.featured ? ' is-featured' : '')} data-person={member.id} aria-labelledby={member.id + '-contact-name'}>
  <div className="contact-lanyard-stage" data-ready={ready && !reducedMotion ? 'true' : undefined}>
   <div className="contact-lanyard-still" aria-hidden="true">
    <span className="contact-lanyard-strap"/><span className="contact-lanyard-ring"/>
    <div className="contact-lanyard-card">
     <div className="contact-lanyard-photo">{image ? <Image src={image.src} alt="" width={image.width} height={image.height} loading="lazy"/> : <span>AG</span>}</div>
     <strong>{member.name}</strong><small>{member.role}</small><span className="contact-lanyard-brand">BHARAT ELECTRICITY</span>
    </div>
   </div>
   {near && !reducedMotion && !unavailable && <Lanyard className="contact-lanyard-canvas" frontImage={image?.src} cardLabel={member.name} cardRole={member.role} ariaLabel={member.name + ' lanyard. Press Enter or Space to flip the card.'} imageFit="cover" strapColor="#08752c" metal="silver" finish="glossy" cornerRadius={.3} size={member.featured ? .64 : .59} strapLength={.35} strapWidth={.65} gravity={1} damping={.5} elasticity={.5} breeze={playing ? .5 : 0} interactive intro onReady={onReady} onUnavailable={onUnavailable}/>}
  </div>
  <figcaption className="contact-lanyard-caption">
   <h3 id={member.id + '-contact-name'}>{member.name}</h3>
   <p>{member.role}</p>
   <a href={'mailto:' + member.email}>{member.email}</a>
   <a href={'tel:' + member.phone.replace(/[^+0-9]/g, '')}>{member.phone}</a>
  </figcaption>
 </figure>;
}

export function ContactLanyard() {
 const [reducedMotion, setReducedMotion] = useState(true);
 const [playing, setPlaying] = useState(true);
 useEffect(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReducedMotion(motion.matches);
  update(); motion.addEventListener('change', update);
  return () => motion.removeEventListener('change', update);
 }, []);
 return <section className="contact-lanyards" aria-labelledby="contact-lanyards-heading">
  <div className="contact-lanyards-heading"><h2 id="contact-lanyards-heading">Meet the team</h2>
   {!reducedMotion && <button type="button" className="contact-lanyards-motion" aria-label={playing ? 'Pause automatic sway' : 'Resume automatic sway'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={19} aria-hidden="true"/> : <Play size={19} aria-hidden="true"/>}</button>}
  </div>
  <div className="contact-lanyards-grid">{team.map(member => <ContactCard key={member.id} member={member} playing={playing} reducedMotion={reducedMotion}/>)}</div>
 </section>;
}
