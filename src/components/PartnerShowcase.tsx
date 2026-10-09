'use client';
import {LogoImage} from './LogoImage';

import Image from 'next/image';
import {useRef, useState, type KeyboardEvent} from 'react';

export interface PartnerArtwork {name: string; src: string; width: number; height: number; source: string; href: string | null; file: string}
export interface PartnerGroup {title: string; logos: PartnerArtwork[]}
const categories = [
 {label: 'Energy & utilities', titles: ['Energy Security Partner', 'Cybersecurity Partner', 'Technology Partner', 'Host Utilities', 'Co-Host Utility', 'Partner Utility', 'Solar Ecosystem Partner', 'Renewable Energy Partner', 'Integrated Energy Security Partner', 'Industry Partner', 'Decarbonisation Partner']},
 {label: 'Investment, markets & skills', titles: ['Exchange Partners', 'Investment Facilitation Partner', 'National Skilling Partner', 'Digital Skilling Partner', 'Nuclear-X Partner', 'Transition-X Partner', 'Finance-X Partner']},
 {label: 'Industry & event community', titles: ['Associate Partners', 'Strategic Partners', 'Policy & Governance Partners', 'Knowledge Partners', 'Media Partners', 'Host Publication', 'Lanyard & Badge Partner', 'Delegate Kit Partner', 'VIP Elite Lounge Partner']}
];

export function PartnerShowcase({groups}: {groups: PartnerGroup[]}) {
 const [active, setActive] = useState(0);
 const tabs = useRef<HTMLDivElement>(null);
 const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
  else if (event.key === 'ArrowLeft') next = (index + categories.length - 1) % categories.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = categories.length - 1;
  else return;
  event.preventDefault(); setActive(next);
  tabs.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
 };
 return <>
  <div ref={tabs} className="partner-tabs" role="tablist" aria-label="Partner categories">{categories.map((category, index) => <button key={category.label} id={'partner-tab-' + index} role="tab" aria-selected={active === index} aria-controls={'partner-panel-' + index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKey(event, index)}>{category.label}</button>)}</div>
  {categories.map((category, index) => <div key={category.label} id={'partner-panel-' + index} role="tabpanel" aria-labelledby={'partner-tab-' + index} hidden={active !== index} tabIndex={0} className="partner-panel">
   <div className="partner-role-grid">{category.titles.map(title => groups.find(group => group.title === title)).filter((group): group is PartnerGroup => !!group).map(group => <section key={group.title} className={'partner-role' + (group.logos.length > 3 ? ' partner-role-wide' : '')}>
    <h3>{group.title}</h3>
    <div className="partner-role-logos" data-lenis-prevent-horizontal>{group.logos.map(logo => <div key={logo.source} className="partner-logo"><LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} sizes="(max-width:767px) 42vw, 220px" loading="lazy"/></div>)}</div>
   </section>)}</div>
  </div>)}
 </>;
}
