'use client';
import {useEffect,useId,useState} from 'react';
import type {KeyboardEvent} from 'react';
import {spaceApplicationForms} from '@/content/zoho-forms';
import {ZohoEnquiry} from './ZohoEnquiry';
import './ExhibitorManual.css';

const applications=spaceApplicationForms;
const categories=applications.map(form=>form.category);
export function SpaceApplicationForms({initialCategory=0}:{initialCategory?:number}){
 const [selected,setSelected]=useState(initialCategory);
 useEffect(()=>{if(location.pathname.replace(/\/$/,'')==='/space-application-form-secondary')setSelected(1);},[]);
 const id=useId();
 function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number){
  const count=applications.length;
  const next=event.key==='ArrowRight'?(index+1)%count:event.key==='ArrowLeft'?(index+count-1)%count:event.key==='Home'?0:event.key==='End'?count-1:-1;
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
