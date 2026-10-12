import Image from 'next/image';
import {PageIntro} from './Shared';
import {ZohoEnquiry} from './ZohoEnquiry';
import './SpeakingOpportunities.css';

export const speakingFormUrl='https://forms.zohopublic.in/itenmedia1/form/ITENMediaBharatElectricity/formperma/7yd-z5A5Z-NpJ5xZa0scRFP94W_P41_v2Qob4QIEW1w?QueryType=Speaking%20Opportunities';

export function SpeakingOpportunities() {
 return <div className="speaking-page">
  <PageIntro category="Conference" title="Speaking Opportunities" intro="Share your experience and expertise at Bharat Electricity."/>
  <section className="speaking-section wrap" aria-labelledby="speaking-summit-heading">
   <h2 id="speaking-summit-heading">Be part of the summit</h2>
   <div className="speaking-layout">
    <div className="speaking-copy">
     <h3>Submit your speaking enquiry</h3>
     <p>Speaking at Bharat Electricity offers an opportunity to share your corporate and personal experience with an international audience of power and energy professionals.</p>
     <p>Highlight your work in the industry, share your market knowledge and connect with commercial and technical executives across the region's power value chain.</p>
     <Image src="/assets/site-refresh/04eb0b6611c130.webp" alt="Speaker sharing insights on stage at Bharat Electricity" width={1379} height={919} sizes="(max-width:767px) calc(100vw - 40px), 50vw"/>
    </div>
    <ZohoEnquiry src={speakingFormUrl} title="Speaking enquiry" height={600}/>
   </div>
  </section>
 </div>;
}
