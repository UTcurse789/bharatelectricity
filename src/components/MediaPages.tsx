import Image from 'next/image';
import Link from 'next/link';
import {paths,site} from '@/content/site';
import {mediaEnquiriesPath,mediaPageTitles,mediaPartnershipBenefits,postShowReportForm} from '@/content/media-pages';
import {ZohoEnquiry} from './ZohoEnquiry';
import media from '@/content/homepage-media.json';
import './ExhibitionPages.css';
import './MediaPages.css';

export const isMediaPage=(path:string)=>!!mediaPageTitles[path];
const enquiryMail=(email:string,subject:string)=>'mailto:'+email+'?subject='+encodeURIComponent('Bharat Electricity: '+subject);

export function MediaPage({path}:{path:string}){
 const page=mediaPageTitles[path];
 return <div className="exhibition-page media-page">
  <header className="media-hero"><div className="wrap">
   <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={mediaEnquiriesPath}>Media</Link><span aria-hidden="true">/</span><span>{page.title}</span></nav>
   <p className="media-eyebrow">Bharat Electricity / Media</p><h1>{page.title}</h1><p className="media-hero-intro">{page.intro}</p>
   {path===paths.report&&<a className="button" href="#report-request">Request the report <span aria-hidden="true">↓</span></a>}
  </div></header>
  {path===paths.report?<PostShowReport/>:<MediaEnquiries/>}
 </div>;
}

function MediaEnquiries(){
 const press=site.contacts.find(contact=>contact.email==='hansika@itenmedia.in')!;
 const partnership=site.contacts.find(contact=>contact.email==='siddhartha@encis.in')!;
 return <>
  <section className="wrap media-section media-partnerships"><div>
   <p className="media-eyebrow">Reach the energy community</p><h2>Media & association partnerships</h2>
   <p>Bharat Electricity connects decision makers across power generation and utility industries. Explore opportunities to reach relevant audiences for your advertisers, subscribers and members.</p>
   <h3>How can we help you?</h3><ul>{mediaPartnershipBenefits.map(item=><li key={item}>{item}</li>)}</ul>
   <a className="button" href={enquiryMail(partnership.email,'Media and association partnership enquiry')}>Discuss a media partnership <span aria-hidden="true">↗</span></a>
  </div><figure><Image src="/assets/site-refresh/a35d100fb76894.webp" alt="A media professional filming at an energy exhibition" width={1600} height={1066} sizes="(max-width:767px) 90vw, 45vw" priority/><figcaption>Archive event photography</figcaption></figure></section>
  <section className="media-accreditation"><div className="wrap"><div><p className="media-eyebrow">Attending as media?</p><h2>Talk to us about press accreditation.</h2><p>For press access, interviews or coverage of a future edition, contact the event team. We welcome enquiries from journalists and media representatives.</p></div><div className="media-contact"><h3>{press.name}</h3><p>{press.role}</p><a href={'mailto:'+press.email}>{press.email}</a><a href={'tel:'+press.phone.replace(/[^+0-9]/g,'')}>{press.phone}</a><a className="button" href={enquiryMail(press.email,'Media accreditation enquiry')}>Request media accreditation <span aria-hidden="true">↗</span></a></div></div></section>
 </>;
}

function PostShowReport(){return <section className="wrap media-section media-report-layout">
 <div className="media-report-copy"><p className="media-eyebrow">2026 edition report</p><h2>Explore the event in review.</h2>
  <p>Bharat Electricity 2026 brought the power and utility community together around technology, industry challenges and the transition to a low-carbon future.</p>
  <p>Request the post-show report to revisit the exhibition and the conversations connecting the energy industry.</p>
  <figure className="media-report-cover"><Image src={media.report.src} alt={media.report.alt} width={media.report.width} height={media.report.height} sizes="(max-width:767px) 90vw, 45vw" priority/><figcaption>2026 Post-show Report artwork</figcaption></figure>
  <figure className="media-report-photograph"><Image src="/assets/site-refresh/4e88971c387554.webp" alt="Energy industry professionals speaking together at an exhibition stand" width={1600} height={1066} sizes="(max-width:767px) 90vw, 45vw"/><figcaption>Exhibition archive</figcaption></figure>
  <Link className="text-link" href={paths.gallery}>Explore the event photographs <span aria-hidden="true">↗</span></Link>
 </div>
 <div id="report-request" className="media-report-request"><ZohoEnquiry src={postShowReportForm} title="Submit the form for Post Show Report" height={1200}/><p className="media-form-help">Need help with your report request? <Link href={paths.contact}>Contact the event team.</Link></p></div>
 </section>;}
