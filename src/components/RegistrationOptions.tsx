'use client';

import {useEffect,useState} from 'react';
import {ArrowRight} from '@phosphor-icons/react';
import {registrationFormLinks} from '@/content/registration';
import {EnquiryForm} from './EnquiryForm';

const delegateCategories=['Domestic delegate','International delegate','Domestic student delegate','International student delegate'];
const categoryAnchor=(name:string)=>'delegate-registration-enquiry-'+name.toLowerCase().replaceAll(' ','-');

export function RegistrationOptions({delegate=false}:{delegate?:boolean}) {
 const [audience,setAudience]=useState('Domestic delegate');
 useEffect(()=>{
  if(!delegate)return;
  const sync=()=>{const selected=delegateCategories.find(name=>location.hash==='#'+categoryAnchor(name));if(selected)setAudience(selected);};
  sync();window.addEventListener('hashchange',sync);
  return()=>window.removeEventListener('hashchange',sync);
 },[delegate]);
 const groups=delegate?[
  {name:'Domestic delegate',description:'For professionals based in India.',url:registrationFormLinks.indianDelegate},
  {name:'International delegate',description:'For professionals travelling from outside India.',url:registrationFormLinks.internationalDelegate},
  {name:'Domestic student delegate',description:'For students based in India.',url:registrationFormLinks.indianStudentDelegate},
  {name:'International student delegate',description:'For students travelling from outside India.',url:registrationFormLinks.internationalStudentDelegate}
 ]:[
  {name:'Indian visitors',description:'For attendees based in India, exploring exhibitors and business opportunities.',url:registrationFormLinks.indianVisitor},
  {name:'International visitors',description:'For attendees travelling from outside India to visit the exhibition.',url:registrationFormLinks.internationalVisitor}
 ];
 return <>
  <div className={'registration-audiences'+(delegate?' registration-delegate-categories':'')}>{groups.map((group,index)=><section key={group.name} className={'registration-audience '+(index%2?'international':'domestic')}>
   <h3>{group.name}</h3><p>{group.description}</p>
   {delegate&&<p className="registration-availability">{group.url?'Registration form available':'Registration details coming soon'}</p>}
   <a className="button" href={delegate?(group.url||'#'+categoryAnchor(group.name)):'#visitor-registration-form'} onClick={()=>setAudience(group.name)} {...(delegate&&group.url?{target:'_blank',rel:'noreferrer'}:{})}>{delegate?(group.url?'Open registration form':'Enquire about this pass'):'View visitor form'}<ArrowRight size={18} aria-hidden="true"/></a>
  </section>)}</div>
  {delegate&&<section id="delegate-registration-enquiry" className="registration-enquiry" aria-labelledby="delegate-enquiry-heading">{delegateCategories.map(name=><span key={name} id={categoryAnchor(name)} className="registration-category-target" aria-hidden="true"/>)}<h2 id="delegate-enquiry-heading">Delegate registration enquiry</h2><p>Contact the team about delegate access, registration details and group bookings. This enquiry does not issue a ticket.</p><label className="registration-audience-select"><span>Delegate category</span><select value={audience} onChange={event=>setAudience(event.target.value)}>{groups.map(group=><option key={group.name}>{group.name}</option>)}</select></label><EnquiryForm initialTopic="Conference & speaking" request={audience+' registration enquiry'}/></section>}
 </>;
}
