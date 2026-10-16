import Link from 'next/link';
import type {Metadata} from 'next';
import {paths} from '@/content/site';
import {registrationThankYouPath} from '@/content/registration';
import {pageMetadata} from '@/lib/seo';
import {pageStructuredData} from '@/lib/structured-data';
import {JsonLd} from '@/components/JsonLd';
import {ThankYouCelebration} from '@/components/ThankYouCelebration';
import '@/components/RegistrationPages.css';

const details={
 path:registrationThankYouPath,
 title:'Thank you for registering for Bharat Electricity 2027',
 description:'Thank you for your interest in Bharat Electricity 2027, taking place on 1–3 September at Yashobhoomi, New Delhi.'
};

export const metadata:Metadata={
 ...pageMetadata(details),
 robots:{index:false,follow:true,googleBot:{index:false,follow:true}}
};

export default function RegistrationThankYouPage(){
 return <div className="registration-page">
  <JsonLd id="page-structured-data" data={pageStructuredData(details)}/>
  <section className="registration-thankyou wrap" aria-labelledby="registration-thankyou-heading">
   <ThankYouCelebration/>
   <p className="registration-eyebrow">Bharat Electricity 2027</p>
   <h1 id="registration-thankyou-heading">Thank you for registering</h1>
   <p>Thank you for your interest in Bharat Electricity 2027. The organising team will be in touch with registration details and next steps.</p>
   <div className="registration-thankyou-details"><p><strong>1–3 September 2027</strong></p><p>Yashobhoomi, IICC, Dwarka, New Delhi</p></div>
   <div className="registration-inline-actions"><Link className="button" href="/">Back to home</Link><Link className="button secondary" href={paths.summit}>Explore the summit</Link></div>
   <p className="registration-thankyou-help">Need help with your registration? <Link href={paths.contact}>Contact the event team</Link>.</p>
  </section>
 </div>;
}
