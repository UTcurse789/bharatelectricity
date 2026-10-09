import Image from 'next/image';
import './ReportCover.css';

export function ReportCover(){return <div className="report-cover" role="img" aria-label="Bharat Electricity 2025 post-show report">
 <Image className="report-cover-brand" src="/assets/bharat-electricity-logo-compact.webp" alt="BHARAT ELECTRICITY" width={640} height={181} sizes="280px"/>
 <span className="report-cover-edition">2025 edition archive</span>
 <div className="report-cover-title"><span>Post-show</span><strong>Report.</strong></div>
 <p>The people. The technology.<br/>The energy connections.</p>
 <div className="report-cover-photo"><Image src="/assets/exhibition-2025-063.webp" alt="" fill sizes="(max-width:767px) 260px, 380px"/></div>
 <span className="report-cover-footer">India’s energy business community</span>
 </div>;}
