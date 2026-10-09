'use client';
import {useEffect,useRef,useState} from 'react';import Link from 'next/link';import {usePathname} from 'next/navigation';import {CaretDown, List, X} from '@phosphor-icons/react';import {navigation,paths,site,editionLabel} from '@/content/site';import {Brand} from './Brand';
export function Header(){const [open,setOpen]=useState<number|null>(null);const [mobile,setMobile]=useState(false);const ref=useRef<HTMLElement>(null);const path=usePathname();useEffect(()=>{setOpen(null);setMobile(false)},[path]);useEffect(()=>{
 if(!mobile)return;
 const old=document.body.style.overflow;
 document.body.style.overflow='hidden';
 const measure=()=>{
  const bottom=ref.current?.querySelector('.header-main')?.getBoundingClientRect().bottom || 0;
  const viewport=window.visualViewport?.height || window.innerHeight;
  ref.current?.style.setProperty('--mobile-nav-height', Math.max(120, viewport-bottom-8)+'px');
 };
 measure();
 window.addEventListener('resize',measure);
 window.visualViewport?.addEventListener('resize',measure);
 return()=>{
  document.body.style.overflow=old;
  ref.current?.style.removeProperty('--mobile-nav-height');
  window.removeEventListener('resize',measure);
  window.visualViewport?.removeEventListener('resize',measure);
 };
},[mobile]);useEffect(()=>{const close=(e:PointerEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(null)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
return <header ref={ref} className="site-header" onKeyDown={e=>{if(e.key==='Escape'){const active=document.activeElement as HTMLElement;const toggle=mobile?ref.current?.querySelector<HTMLButtonElement>('.menu-toggle'):active.closest('.nav-group')?.querySelector<HTMLButtonElement>('button');setOpen(null);setMobile(false);toggle?.focus()}}}><div className="utility-bar"><div className="wrap"><span>{editionLabel}</span><span>{site.edition.dates}<span className="utility-venue"> / {site.edition.venue}, New Delhi</span></span><Link href={paths.gallery}>Explore the archive</Link></div></div><div className="header-main wrap"><Link href="/" prefetch={false} className="brand-link" aria-label="Home"><Brand/></Link><nav className="desktop-nav" aria-label="Main navigation">{navigation.map((g,i)=><div key={g.label} className="nav-group" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(null)}}><button aria-expanded={open===i} aria-controls={'nav-'+i} onClick={()=>setOpen(open===i?null:i)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(i);setTimeout(()=>document.getElementById('nav-'+i)?.querySelector<HTMLAnchorElement>('a')?.focus(),0)}}}>{g.label}{g.links.length>1&&<CaretDown size={12}/>}</button>{open===i&&<div id={'nav-'+i} className="nav-dropdown">{g.links.map(([label,href])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{label}</Link>)}</div>}</div>)}</nav><Link className="button header-cta" href={paths.contact}>Enquire</Link><button className="menu-toggle" aria-label={mobile?'Close navigation':'Open navigation'} aria-expanded={mobile} aria-controls="mobile-navigation" onClick={()=>{setMobile(!mobile);setOpen(null)}}>{mobile?<X size={26}/>:<List size={26}/>}</button></div>{mobile&&<nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map((g,i)=><div className="mobile-group" key={g.label}><button onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} aria-controls={'mobile-group-'+i}>{g.label}<CaretDown size={18}/></button>{open===i&&<div id={'mobile-group-'+i}>{g.links.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}</div>}</div>)}<Link className="button" href={paths.contact}>Enquire</Link></nav>}</header>}
