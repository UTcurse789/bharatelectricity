'use client';
import {useEffect,useRef,useState} from 'react';import Link from 'next/link';import {usePathname} from 'next/navigation';import {CaretDown, CaretRight, List, X} from '@phosphor-icons/react';import {navigation,paths,site,editionLabel} from '@/content/site';import {Brand} from './Brand';
import './Header.css';
export function Header(){const [subOpen,setSubOpen]=useState<string|null>(null);const [open,setOpen]=useState<number|null>(null);const [mobile,setMobile]=useState(false);const ref=useRef<HTMLElement>(null);const path=usePathname().replace(/\/$/,'')||'/';useEffect(()=>{setOpen(null);setSubOpen(null);setMobile(false)},[path]);useEffect(()=>{
 if(!mobile)return;
 const old=document.body.style.overflow;
 // Unlike hidden, clip does not create a new scroll container that sends the
 // sticky header (and its menu) offscreen when the page is already scrolled.
 document.body.style.overflow='clip';
 const measure=()=>{
  const bottom=ref.current?.querySelector('.header-main')?.getBoundingClientRect().bottom || 0;
  const viewport=window.visualViewport?.height || window.innerHeight;
  ref.current?.style.setProperty('--mobile-nav-height', Math.max(0, viewport-bottom-8)+'px');
  ref.current?.style.setProperty('--mobile-nav-top', bottom+'px');
 };
 measure();
 window.addEventListener('resize',measure);
 window.visualViewport?.addEventListener('resize',measure);
 return()=>{
  document.body.style.overflow=old;
  ref.current?.style.removeProperty('--mobile-nav-height');
  ref.current?.style.removeProperty('--mobile-nav-top');
  window.removeEventListener('resize',measure);
  window.visualViewport?.removeEventListener('resize',measure);
 };
},[mobile]);useEffect(()=>{const close=(e:PointerEvent)=>{if(!ref.current?.contains(e.target as Node))setOpen(null)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
useEffect(()=>{
 const desktop=matchMedia('(min-width:1280px)');
 const reset=()=>{if(desktop.matches){setMobile(false);setOpen(null);setSubOpen(null);}};
 desktop.addEventListener('change',reset);
 return()=>desktop.removeEventListener('change',reset);
},[]);
useEffect(()=>{
 if(!mobile)return;
 const trap=(event:KeyboardEvent)=>{
  if(event.key!=='Tab')return;
  const items=Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button,[tabindex="0"]')||[]).filter(element=>element.tabIndex>=0&&element.getClientRects().length&&!(element as HTMLButtonElement).disabled);
  const first=items[0],last=items.at(-1);
  if(!first||!last)return;
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus({preventScroll:true});}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus({preventScroll:true});}
 };
 document.addEventListener('keydown',trap);
 return()=>document.removeEventListener('keydown',trap);
},[mobile]);
useEffect(()=>{if(open===null)return;const measure=()=>{const bottom=ref.current?.querySelector('.header-main')?.getBoundingClientRect().bottom||0;ref.current?.style.setProperty('--dropdown-max-height',Math.max(120,window.innerHeight-bottom-16)+'px');};measure();window.addEventListener('resize',measure);window.addEventListener('scroll',measure,{passive:true});return()=>{window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure);};},[open]);
function closeNavigation(){setOpen(null);setSubOpen(null);setMobile(false);}
function links(g:typeof navigation[number],i:number,isMobile=false){
 return g.links.map(([label,href],index)=>{
  const children=g.submenus?.[href],id=(isMobile?'mobile-':'desktop-')+'submenu-'+i+'-'+index;
  if(!children)return <Link key={href} href={href} onClick={closeNavigation} aria-current={path===href?'page':undefined}>{label}</Link>;
  const linked=g.parentLinks?.includes(href),name=label.replace(/\?$/,'');
  const toggle=<button className="nav-submenu-toggle nav-council-toggle" aria-label={linked?'Show '+name+' submenu':undefined} aria-expanded={subOpen===id} aria-controls={id} onClick={()=>setSubOpen(subOpen===id?null:id)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();e.stopPropagation();setSubOpen(id);setTimeout(()=>document.getElementById(id)?.querySelector<HTMLAnchorElement>('a')?.focus(),0)}}}>{!linked&&label}{isMobile?<CaretDown size={14}/>:<CaretRight size={14}/>}</button>;
  return <div key={href} className="nav-subgroup">{linked?<div className="nav-subgroup-row"><Link href={href} onClick={closeNavigation} aria-current={path===href?'page':undefined}>{label}</Link>{toggle}</div>:toggle}{subOpen===id&&<div className="nav-submenu-links nav-council-links" id={id}>{children.map(([name,url])=><Link href={url} key={name+url} onClick={closeNavigation} aria-current={path===url?'page':undefined} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();setSubOpen(null);e.currentTarget.closest('.nav-subgroup')?.querySelector<HTMLButtonElement>('button')?.focus()}}}>{name}</Link>)}</div>}</div>;
 });
}
return <header ref={ref} className="site-header" data-mobile-open={mobile} onKeyDown={e=>{if(e.key==='Escape'){if(subOpen){setSubOpen(null);ref.current?.querySelector<HTMLButtonElement>('.nav-council-toggle[aria-expanded=true]')?.focus();return;}const active=document.activeElement as HTMLElement;const toggle=mobile?ref.current?.querySelector<HTMLButtonElement>('.menu-toggle'):active.closest('.nav-group')?.querySelector<HTMLButtonElement>('button');setOpen(null);setMobile(false);toggle?.focus()}}}><div className="utility-bar"><div className="wrap"><span>{site.nextEdition?'Upcoming edition: '+site.nextEdition.year:editionLabel}</span><span>{(site.nextEdition||site.edition).dates}<span className="utility-venue"> / {(site.nextEdition||site.edition).venue}, {(site.nextEdition||site.edition).location}</span></span><Link href={paths.gallery}>Explore the Past events</Link></div></div><div className="header-main wrap"><Link href="/" prefetch={false} className="brand-link" aria-label="Home"><Brand/></Link><nav className="desktop-nav" aria-label="Main navigation">{navigation.map((g,i)=><div key={g.label} className="nav-group" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(null)}}><button aria-expanded={open===i} aria-controls={'nav-'+i} onClick={()=>{setOpen(open===i?null:i);setSubOpen(null)}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(i);setTimeout(()=>document.getElementById('nav-'+i)?.querySelector<HTMLAnchorElement>('a')?.focus(),0)}}}>{g.label}{g.links.length>1&&<CaretDown size={12}/>}</button>{open===i&&<div id={'nav-'+i} className={'nav-dropdown'+(g.label==='Exhibition'?' exhibition-dropdown':'')}>{links(g,i)}</div>}</div>)}</nav><Link className="button header-cta" href={paths.registration}>Register</Link><button className="menu-toggle" aria-label={mobile?'Close navigation':'Open navigation'} aria-expanded={mobile} aria-controls="mobile-navigation" onClick={()=>{setMobile(!mobile);setOpen(null)}}>{mobile?<X size={26}/>:<List size={26}/>}</button></div>{mobile&&<><button className="mobile-nav-backdrop" aria-label="Close navigation overlay" tabIndex={-1} onClick={()=>{closeNavigation();ref.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus({preventScroll:true});}}/><nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map((g,i)=><div className="mobile-group" key={g.label}><button onClick={()=>{setOpen(open===i?null:i);setSubOpen(null)}} aria-expanded={open===i} aria-controls={'mobile-group-'+i}>{g.label}<CaretDown size={18}/></button>{open===i&&<div id={'mobile-group-'+i}>{links(g,i,true)}</div>}</div>)}<Link className="button" href={paths.registration} onClick={closeNavigation}>Register</Link></nav></>}</header>}
