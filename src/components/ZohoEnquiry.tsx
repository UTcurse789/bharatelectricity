'use client';
import {useEffect,useState} from 'react';

export function ZohoEnquiry({src,title,standPreference=false,height=600}:{src:string;title:string;standPreference?:boolean;height?:number}){
 const [stand,setStand]=useState('');
 useEffect(()=>{if(!standPreference)return;const choice=new URLSearchParams(location.search).get('stand');if(choice==='Raw Space'||choice==='Shell Scheme')setStand(choice);},[standPreference]);
 return <section className="exhibition-form" aria-label={title} data-lenis-prevent>
  <h2>{title}</h2>{stand&&<p className="exhibition-stand-preference">Selected stand: <strong>{stand}</strong>. Mention this preference in your enquiry.</p>}
  <iframe src={src} title={title+' — Zoho enquiry form'} width="100%" height={height} loading="lazy" style={{border:0,height}}/>
  <a className="text-link" href={src} target="_blank" rel="noreferrer">Open the form in a new tab <span aria-hidden="true">↗</span></a>
 </section>;
}
