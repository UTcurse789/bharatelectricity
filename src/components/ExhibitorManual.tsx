import Image from 'next/image';
import Link from 'next/link';
import type {ReactNode} from 'react';
import documentContent from '@/content/exhibitor-document.json';
import referencePages from '@/content/reference-pages.json';
import {paths,site} from '@/content/site';
import './ExhibitorManual.css';

type Paragraph={index:number;text:string;bullet:boolean;heading:boolean;images:string[]};
const subheadingText=(text:string)=>text.replace(/\s+/g,' ').trim();
// Repair the Word file's missing country prefix using the existing site contact.
const contactText=(p:Paragraph)=>p.index===73?p.text.replace('+9990401916',site.contacts.find(contact=>contact.email==='hansika@itenmedia.in')!.phone):p.text;
function LinkedText({text}:{text:string}){
 // Only create email and clearly specified Indian telephone links from plain text.
 return text.split(/([\w.+-]+@[\w.-]+\.[a-z]{2,}|\+91[\s-]*\d[\d\s-]{8,}\d)/gi).map((part,index)=>part.includes('@')?<a key={index} href={'mailto:'+part}>{part}</a>:/^\+91/.test(part)?<a key={index} href={'tel:'+part.replace(/[^+\d]/g,'')}>{part}</a>:part);
}
function ShellInclusions(){return <figure className="manual-inclusions">
 <div className="manual-table-scroll" role="region" aria-label="Shell scheme inclusions table" tabIndex={0} data-lenis-prevent>
  <table><caption>Shell scheme inclusions</caption><thead><tr><th scope="col">Stand area (m²)</th><th scope="col">Reception counter</th><th scope="col">Chairs</th><th scope="col">Spotlights</th><th scope="col">15A / 220V sockets</th><th scope="col">Waste baskets</th></tr></thead><tbody>{documentContent.shellSchemeRows.map(row=><tr key={row[0]}>{row.map((value,index)=>index===0?<th key={index} scope="row">{value}</th>:<td key={index}>{value}</td>)}</tr>)}</tbody></table>
 </div><a className="text-link" href={documentContent.images[0].src} target="_blank" rel="noreferrer">View the original inclusions table <span aria-hidden="true">↗</span></a>
 </figure>;}
function DocumentBlocks({paragraphs}:{paragraphs:Paragraph[]}){
 const elements:ReactNode[]=[];
 for(let i=0;i<paragraphs.length;i++){
  const p=paragraphs[i];
  if(p.images.length){elements.push(<div key={p.index} data-source-paragraph={p.index}>{p.images.map(id=>id==='rId5'?<ShellInclusions key={id}/>:<figure className="manual-stand-diagram" key={id}><Image src={documentContent.images[1].src} alt={documentContent.images[1].alt} width={1379} height={1017} sizes="(max-width:767px) 90vw, 850px"/><figcaption>Original shell scheme diagram: 2.5m stand height, 1m wall panels and an information counter 94cm wide, 43cm deep and 67cm high.</figcaption><a className="text-link" href={documentContent.images[1].src} target="_blank" rel="noreferrer">View the full-size stand diagram <span aria-hidden="true">↗</span></a></figure>)}</div>);continue;}
  if(p.heading){elements.push(<h3 key={p.index} data-source-paragraph={p.index}>{subheadingText(p.text)}</h3>);continue;}
  if(p.bullet){const items:Paragraph[]=[p];while(paragraphs[i+1]?.bullet&&!paragraphs[i+1]?.heading){items.push(paragraphs[++i]);}elements.push(<ul key={p.index}>{items.map(item=><li key={item.index} data-source-paragraph={item.index}><LinkedText text={item.text}/></li>)}</ul>);continue;}
  elements.push(<p key={p.index} data-source-paragraph={p.index}><LinkedText text={p.text}/></p>);
 }
 return elements;
}
const otherOptions=referencePages.find(p=>p.path===paths.manual)!.sections.slice(-3);
export function ExhibitorManual(){return <div className="wrap exhibition-section exhibition-manual">
 <div className="exhibition-archive-note"><strong>2026 edition archive</strong><p>This manual records the schedules and operating requirements for the completed 2026 event. Contact the team for guidance for the next edition.</p><Link className="text-link" href={paths.contact}>Request the current manual <span aria-hidden="true">↗</span></Link></div>
 <div className="manual-introduction"><DocumentBlocks paragraphs={documentContent.introduction}/></div>
 <nav className="manual-contents" aria-label="Exhibitor manual contents">{[['Schedules','#manual-schedules'],['Planning notes','#manual-notes'],['Onsite contacts','#manual-contacts'],['Stand construction','#manual-construction'],['Order forms','#manual-order-forms'],['Registration options','#manual-registration']].map(([label,href])=><a href={href} key={href}>{label}<span aria-hidden="true">↓</span></a>)}</nav>
 <section id="manual-schedules" className="manual-section"><p className="exhibition-eyebrow">01 / Plan your time</p><h2>Exhibition schedules</h2><div className="manual-schedules">{documentContent.schedules.map((schedule,index)=><article key={schedule.id} className={index>1?'manual-schedule-wide':''}><h3>{schedule.title}</h3><DocumentBlocks paragraphs={schedule.paragraphs}/></article>)}</div></section>
 <section id="manual-notes" className="manual-section manual-planning-notes"><p className="exhibition-eyebrow">02 / Before you arrive</p><h2>{documentContent.notes.title}</h2><DocumentBlocks paragraphs={documentContent.notes.paragraphs}/></section>
 <section id="manual-contacts" className="manual-section"><p className="exhibition-eyebrow">03 / Your onsite team</p><h2>Exhibitor onsite contacts</h2><div className="manual-contact-groups">{documentContent.contacts.map(group=><section key={group.title}><h3>{group.title}</h3>{group.paragraphs.map(p=><article key={p.index} data-source-paragraph={p.index}><p><LinkedText text={contactText(p)}/></p></article>)}</section>)}</div></section>
 <section id="manual-construction" className="manual-section"><p className="exhibition-eyebrow">04 / Build your stand</p><h2>Stand constructions</h2><div className="manual-construction-guides">{documentContent.construction.map(section=><details className="exhibition-manual-section" key={section.id} id={section.id}><summary>{section.title}</summary><div><DocumentBlocks paragraphs={section.paragraphs}/></div></details>)}</div></section>
 <section id="manual-order-forms" className="manual-section"><p className="exhibition-eyebrow">05 / Complete your requirements</p><h2>Additional order forms</h2><p className="manual-section-description">Select the form you need. Domestic and international options are provided where available.</p><ol className="manual-order-forms">{documentContent.orderForms.map(form=><li key={form.number}><div><span className="manual-form-number">Form {String(form.number).padStart(2,'0')}</span><h3>{form.label.replace(/^FORM \d+:\s*/,'')}</h3></div><div className="manual-order-actions">{form.links.map(link=><a className="button secondary" key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label==='CLICK HERE'?'Open '+form.label:link.label+' — '+form.label}>{link.label==='CLICK HERE'?'Open form':link.label==='FURNITURE CATALOGUE'?'Furniture catalogue':link.label==='DOMESTIC'?'Domestic':'International'}<span aria-hidden="true">↗</span></a>)}</div></li>)}</ol></section>
 <section id="manual-registration" className="manual-section"><p className="exhibition-eyebrow">06 / Join the event</p><h2>Other registration options</h2><div className="manual-registration-cards">{otherOptions.map((option,index)=><article key={option.id}><figure><Image src={option.images[0].src} alt={['Event attendees meeting with colleagues','Exhibition booth staff speaking with a visitor','Media representative at an energy exhibition'][index]} width={1600} height={1067} sizes="(max-width:767px) 90vw, 30vw"/><figcaption>Archive event photography</figcaption></figure><div><h3>{['Group bookings','Exhibitor staff & delegates','Press & media'][index]}</h3>{option.blocks.map((block,i)=>'text' in block&&<p key={i}>{block.text}</p>)}<a className="text-link" href={option.links[0].href}>Contact the team <span aria-hidden="true">↗</span></a></div></article>)}</div></section>
 </div>;}
