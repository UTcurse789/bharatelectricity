'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {ArrowRight,Check} from '@phosphor-icons/react';
import {registrationFormLinks} from '@/content/registration';
import {ZohoEnquiry} from './ZohoEnquiry';

export function RegistrationOptions({delegate=false}:{delegate?:boolean}) {
 const [selected,setSelected]=useState<number|null>(null);
 const panel=useRef<HTMLElement>(null);
 const id=useId();
 const panelId=id+'-form';
 function focusForm(){
  panel.current?.focus({preventScroll:true});
  panel.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function reveal(index:number){
  setSelected(index);
  if(index===selected)focusForm();
 }
 useEffect(()=>{
  if(selected===null)return;
  focusForm();
 },[selected]);
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
   {delegate?<button type="button" className="button" aria-expanded={selected===index} aria-controls={panelId} onClick={()=>reveal(index)}>{selected===index?'Form selected':'Open registration form'}{selected===index?<Check size={18} aria-hidden="true"/>:<ArrowRight size={18} aria-hidden="true"/>}</button>:<a className="button" href="#visitor-registration-form">View visitor form<ArrowRight size={18} aria-hidden="true"/></a>}
  </section>)}</div>
  {delegate&&<section ref={panel} id={panelId} className="registration-enquiry" aria-label="Delegate registration form" tabIndex={-1} hidden={selected===null}>{selected!==null&&<><p className="registration-selected-category" role="status">Selected category: <strong>{groups[selected].name}</strong></p><p>Complete your delegate registration below. You can fill in and submit the form here on the Bharat Electricity website.</p>{groups[selected].url&&<ZohoEnquiry src={groups[selected].url} title={groups[selected].name+' registration'} height={700}/>}</>}</section>}
 </>;
}
