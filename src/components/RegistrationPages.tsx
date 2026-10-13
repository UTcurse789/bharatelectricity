import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight} from '@phosphor-icons/react/dist/ssr';
import {paths,site} from '@/content/site';
import {exhibitionPaths} from '@/content/exhibition';
import {registrationPaths,visitorWidgetUrl} from '@/content/registration';
import type {ContentPage} from '@/content/types';
import {RegistrationOptions} from './RegistrationOptions';
import './RegistrationPages.css';

export const isRegistrationPage=(path:string)=>Object.values(registrationPaths).includes(path);
const mail=(email:string,subject:string)=>'mailto:'+email+'?subject='+encodeURIComponent('Bharat Electricity: '+subject);
const highlights=[
 {title:'15,000+ attendees',image:'/assets/site-refresh/17ed2f9b1221db.webp',copy:'Equipment demonstrations, technology and business connections across the energy ecosystem.'},
 {title:'250+ exhibitors',image:'/assets/site-refresh/bb05fecf691459.webp',copy:'Organisations and solutions spanning the complete power and utility value chain.'},
 {title:'Cutting-edge content',image:'/assets/site-refresh/5bde81ebb4e461.webp',copy:'Strategic summit discussions and technical expertise across the industry.'},
 {title:'150+ expert speakers',image:'/assets/site-refresh/7b2735f0349070.webp',copy:'Industry perspectives from power, technology, utilities and policy.'}
];

export function RegistrationPage({page}:{page:ContentPage}) {
 const hub=page.path===registrationPaths.hub,visitor=page.path===registrationPaths.visitor;
 return <div className="registration-page">
  <header className="registration-hero"><div className="wrap"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span>{!hub&&<><Link href={registrationPaths.hub}>Register</Link><span aria-hidden="true">/</span></>}<span>{hub?'Register':visitor?'Visitor Registration':'Delegate Registration'}</span></nav><h1>{hub?'Register':visitor?'Visitor Registration 2026':'Delegate Registration'}</h1></div></header>
  <nav className="registration-navigation" aria-label="Registration options"><div className="wrap">
   <Link className="button" href={exhibitionPaths.enquiry}>Make a stand enquiry</Link>
   <Link className="button" href={registrationPaths.delegate} aria-current={page.path===registrationPaths.delegate?'page':undefined}>Delegate registration</Link>
   <Link className="button" href={registrationPaths.visitor} aria-current={visitor?'page':undefined}>Visitor registration</Link>
   <Link className="registration-booking-link" href={registrationPaths.booking}>Exhibition space booking <ArrowRight size={17} aria-hidden="true"/></Link>
  </div></nav>
  {hub?<>
   <section className="registration-meeting"><div className="wrap"><p className="registration-eyebrow">Bharat Electricity</p><h2>The meeting place for the global power &amp; utility industry</h2><p>Connect with the people, technology and ideas shaping the energy sector. Choose visitor access, summit participation or exhibition space, with dedicated registration options for each.</p><p className="registration-edition-note">Next edition: <strong>1–3 September 2027</strong>, Yashobhoomi, IICC, Dwarka, New Delhi. Visitor registration currently links to the 2026 edition. Registration details for 2027 will be announced.</p><div className="registration-inline-actions"><Link className="button" href={exhibitionPaths.brochure}>Request event prospectus</Link><Link className="button secondary" href={paths.about}>About the event</Link><Link className="button secondary" href={paths.summit}>Summit overview</Link></div></div></section>
   <section className="registration-highlights wrap"><h2>Event highlights across our co-located events</h2><p className="registration-section-note">{site.statisticsNote}</p><div className="registration-highlight-grid">{highlights.map(item=><article key={item.title}><Image src={item.image} alt={item.title+' — archive event photography'} width={1600} height={1066} sizes="(max-width:767px) 90vw, (max-width:1023px) 45vw, 25vw"/><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div></section>
  </>:visitor?<section className="registration-visitor wrap"><div className="registration-section-heading"><p className="registration-eyebrow">Exhibition visitor access</p><h2>Visitor registration</h2><p>Visitor passes cover exhibition access across Bharat Electricity. Conference access requires the appropriate delegate pass.</p><p className="registration-edition-note">This form is for <strong>1–3 September 2026</strong>, an edition that has ended. Visitor registration for 2026 is closed; this form is retained for reference.</p></div><RegistrationOptions/><section id="visitor-registration-form" className="registration-widget" aria-labelledby="visitor-form-heading" data-lenis-prevent><h2 id="visitor-form-heading">Visitor registration form · 2026</h2><iframe allow="payment" height={700} id="konfhub-widget" src={visitorWidgetUrl} title="Register for Bharat Electricity 2026" width="100%" loading="lazy"/><a className="text-link" href={visitorWidgetUrl} target="_blank" rel="noreferrer">Open visitor form in a new tab <ArrowRight size={18} aria-hidden="true"/></a></section></section>:<section className="registration-delegates wrap"><div className="registration-section-heading"><p className="registration-eyebrow">Summit participation</p><h2>Choose your delegate registration</h2><p>Choose the pass category that fits your attendance. Contact the organiser for current prices, summit access and registration details.</p></div><RegistrationOptions delegate/></section>}
  <RegistrationHelp/>
  <div className="registration-bottom"><div className="wrap"><Link className="button" href={registrationPaths.delegate}>Delegate registration</Link><Link className="button" href={registrationPaths.visitor}>Visitor registration</Link></div></div>
 </div>;
}

function RegistrationHelp() {
 const options=[
  {title:'Looking for a group booking?',image:'/assets/site-refresh/eac46e266d2039.webp',copy:'Planning to attend with colleagues or a delegation? Contact the team for group registration information.',href:mail(site.contacts[1].email,'Group registration enquiry'),action:'Contact the group booking team'},
  {title:'Are you an exhibitor?',image:'/assets/site-refresh/f1c4f302fa2487.webp',copy:'For booth staff registration or exhibitor delegate upgrades, use the form shared by your event contact.',href:mail(site.contacts[2].email,'Exhibitor staff and delegate registration'),action:'Contact the exhibitor team'},
  {title:'Are you press or media?',image:'/assets/site-refresh/9ae8ac88eb6e95.webp',copy:'For press registration, interviews and media access, get in touch with the organising team.',href:mail(site.contacts[1].email,'Press and media registration'),action:'Contact the media team'}
 ];
 return <section className="registration-help wrap" aria-labelledby="registration-help-heading"><h2 id="registration-help-heading">Other registration options</h2><div className="registration-help-grid">{options.map(item=><article key={item.title}><Image src={item.image} alt={item.title+' — archive event photography'} width={1600} height={1067} sizes="(max-width:767px) 90vw, 33vw"/><div><h3>{item.title}</h3><p>{item.copy}</p><a href={item.href}>{item.action}<ArrowRight size={18} aria-hidden="true"/></a></div></article>)}</div></section>;
}
