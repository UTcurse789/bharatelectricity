'use client';
import {useEffect,useRef,useState} from 'react';

export function ZohoEnquiry({src,title,standPreference=false,height=600}:{src:string;title:string;standPreference?:boolean;height?:number}){
 const [stand,setStand]=useState('');
 const [formHeight,setFormHeight]=useState(height);
 const [embedSrc,setEmbedSrc]=useState<string>();
 const frame=useRef<HTMLIFrameElement>(null);
 const embedUrl=new URL(src);
 embedUrl.searchParams.set('zf_rszfm','1');
 const formUrl=embedUrl.href;
 useEffect(()=>{
  const url=new URL(src),permalink=url.pathname.split('/formperma/')[1];
  setFormHeight(height);
  // Zoho's auto-height embed sends "permalink|height[|scroll]" messages.
  // Match the origin, source window and form so other embeds cannot resize this one.
  const resize=(event:MessageEvent)=>{
   if(event.origin!==url.origin||event.source!==frame.current?.contentWindow||typeof event.data!=='string')return;
   const [formId,pixels,action]=event.data.split('|');
   const nextHeight=Number(pixels);
   if(formId!==permalink||!Number.isFinite(nextHeight)||nextHeight<100||nextHeight>50000)return;
   setFormHeight(Math.ceil(nextHeight)+20);
   if(action==='scroll')frame.current?.scrollIntoView({block:'start',behavior:'instant'});
  };
  window.addEventListener('message',resize);
  // Start loading only after the listener exists, including on cached/static pages.
  setEmbedSrc(formUrl);
  return ()=>window.removeEventListener('message',resize);
 },[src,height,formUrl]);
 useEffect(()=>{if(!standPreference)return;const choice=new URLSearchParams(location.search).get('stand');if(choice==='Raw Space'||choice==='Shell Scheme')setStand(choice);},[standPreference]);
 return <section className="exhibition-form" aria-label={title}>
  <h2>{title}</h2>{stand&&<p className="exhibition-stand-preference">Selected stand: <strong>{stand}</strong>. Mention this preference in your enquiry.</p>}
  <iframe ref={frame} src={embedSrc} data-form-src={formUrl} title={title+' — Zoho enquiry form'} width="100%" height={formHeight} scrolling="no" loading="lazy" style={{border:0,height:formHeight,scrollMarginTop:'var(--scroll-header-offset,140px)'}}/>
  <noscript><p>Please enable JavaScript to load and complete this form.</p></noscript>
 </section>;
}
