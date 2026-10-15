import {ArrowRight} from '@phosphor-icons/react/dist/ssr';
import {registrationFormLinks} from '@/content/registration';
import {zohoFormUrls} from '@/content/zoho-forms';
import {ZohoEnquiry} from './ZohoEnquiry';

const delegateCategories=['Domestic delegate','International delegate','Domestic student delegate','International student delegate'];
const categoryAnchor=(name:string)=>'delegate-registration-enquiry-'+name.toLowerCase().replaceAll(' ','-');

export function RegistrationOptions({delegate=false}:{delegate?:boolean}) {
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
   <a className="button" href={delegate?(group.url||'#'+categoryAnchor(group.name)):'#visitor-registration-form'} {...(delegate&&group.url?{target:'_blank',rel:'noreferrer'}:{})}>{delegate?(group.url?'Open registration form':'Enquire about this pass'):'View visitor form'}<ArrowRight size={18} aria-hidden="true"/></a>
  </section>)}</div>
  {delegate&&<section id="delegate-registration-enquiry" className="registration-enquiry" aria-label="Delegate registration form">{delegateCategories.map(name=><span key={name} id={categoryAnchor(name)} className="registration-category-target" aria-hidden="true"/>)}<p>Complete the organiser’s form for delegate registration and summit participation.</p><ZohoEnquiry src={zohoFormUrls.delegate} title="Delegate registration" height={700}/></section>}
 </>;
}
