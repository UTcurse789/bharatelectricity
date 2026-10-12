import Image from 'next/image';
import media from '@/content/homepage-media.json';
import './ReportCover.css';

export function ReportCover(){return <figure className="report-cover">
 <Image src={media.report.src} alt={media.report.alt} width={media.report.width} height={media.report.height} sizes="(max-width:767px) 90vw, 40vw"/>
 <figcaption>Bharat Electricity · {media.report.edition} Post-show Report</figcaption>
 </figure>;}
