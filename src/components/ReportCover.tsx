import Image from 'next/image';
import './ReportCover.css';

export function ReportCover(){return <figure className="report-cover">
 <Image src="/assets/exhibition-2025-063.webp" alt="Visitors meeting exhibitors at Bharat Electricity 2025" width={1800} height={1200} sizes="(max-width:767px) 90vw, 40vw"/>
 <figcaption>Bharat Electricity · 2025 exhibition archive</figcaption>
 </figure>;}
