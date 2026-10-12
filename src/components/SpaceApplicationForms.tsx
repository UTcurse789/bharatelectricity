'use client';
import {useEffect,useId,useState} from 'react';
import type {KeyboardEvent} from 'react';
import documentContent from '@/content/exhibitor-document.json';
import {ZohoEnquiry} from './ZohoEnquiry';
import './ExhibitorManual.css';

const applications=documentContent.forms.slice(3);
const categories=['Indian companies','International companies','Startups'];
export function SpaceApplicationForms({initialCategory=0}:{initialCategory?:number}){
 const [selected,setSelected]=useState(initialCategory);
 useEffect(()=>{if(location.pathname.replace(/\/$/,'')==='/space-application-form-secondary')setSelected(1);},[]);
 const id=useId();
 function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number){
  const next=event.key==='ArrowRight'?(index+1)%3:event.key==='ArrowLeft'?(index+2)%3:event.key==='Home'?0:event.key==='End'?2:-1;
  if(next<0)return;
  event.preventDefault();setSelected(next);
  document.getElementById(id+'-tab-'+next)?.focus();
 }
 const form=applications[selected];
 return <section className="space-applications" aria-label="Exhibition space applications">
  <p className="space-application-label">Choose your company category</p>
  <div className="space-application-tabs" role="tablist" aria-label="Company category">
   {categories.map((label,index)=><button key={label} type="button" role="tab" id={id+'-tab-'+index} aria-selected={index===selected} aria-controls={id+'-panel'} tabIndex={index===selected?0:-1} onClick={()=>setSelected(index)} onKeyDown={event=>navigate(event,index)}>{label}</button>)}
  </div>
  <div role="tabpanel" id={id+'-panel'} aria-labelledby={id+'-tab-'+selected} tabIndex={0}>
   <ZohoEnquiry key={selected} src={form.src} height={form.height} title={'Space application — '+categories[selected]}/>
  </div>
 </section>;
}
