import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Play} from '@phosphor-icons/react/dist/ssr';
import reference from '@/content/reference-pages.json';
import {EnquiryForm} from './EnquiryForm';
import {ReferenceRoster} from './ReferenceRoster';
import {ReportCover} from './ReportCover';
import {LogoImage} from './LogoImage';

type Block={type:string;text?:string;items?:string[];ordered?:boolean;rows?:string[][]};
type Artwork={src:string;source:string;alt:string;width:number;height:number;unavailable?:boolean;kind?:'logo'};
type Section={id:string;title:string;blocks:Block[];images:Artwork[];links:{label:string;href:string}[];collapsible:boolean};
type ReferencePage={path:string;sourcePath:string;source:string;title:string;sections:Section[];videos:{id:string;title:string;thumbnail?:string}[]};
const requests:Record<string,{topic:string;request:string}>={
 '/exhibit-at-powergen-india/make-a-stand-enquiry':{topic:'Exhibiting',request:'Stand enquiry'},
 '/exhibit-at-powergen-india/make-stand-enquiry-indian-utility-week':{topic:'Exhibiting',request:'Utility Week stand enquiry'},
 '/space-application-form':{topic:'Exhibiting',request:'Reserve exhibition space'},
 '/exhibit-at-powergen-india/view-the-floor-plan-92u6':{topic:'Exhibiting',request:'Request the floor plan'},
 '/exhibit-at-powergen-india/request-the-event-prospectus':{topic:'Exhibiting',request:'Request the event prospectus'},
 '/summit-overview/speaking-opportunities-bharat-electricity':{topic:'Conference & speaking',request:'Bharat Electricity speaking enquiry'},
 '/summit-overview/speaking-opportunities':{topic:'Conference & speaking',request:'Power generation speaking enquiry'},
 '/summit-overview/speaking-opportunities-indian-utility-week':{topic:'Conference & speaking',request:'Utility Week speaking enquiry'},
 '/become-a-sponsor':{topic:'Partnership',request:'Partnership enquiry'},
 '/become-sponsor-indian-utility-week':{topic:'Partnership',request:'Utility Week partnership enquiry'},
 '/request-the-partnership-brochure':{topic:'Partnership',request:'Request the partnership brochure'},
 '/media-hub/media':{topic:'Media',request:'Media enquiry'},
 '/media-hub/postshowreport':{topic:'Other enquiry',request:'Request the post-show report'},
 '/request_a_call_back':{topic:'Other enquiry',request:'Request a call back'},
 '/visitor-registration':{topic:'Visiting',request:'Visitor registration interest'},
 '/summit-overview/register':{topic:'Conference & speaking',request:'Delegate registration interest'}
};
export const hasReference=(path:string)=>reference.some(page=>page.path===path);
function Blocks({blocks}:{blocks:Block[]}){return <>{blocks.map((block,i)=>block.type==='heading'?<h3 key={i}>{block.text}</h3>:block.type==='list'?(block.ordered?<ol key={i}>{block.items?.map((item,j)=><li key={j}>{item}</li>)}</ol>:<ul key={i}>{block.items?.map((item,j)=><li key={j}>{item}</li>)}</ul>):block.type==='table'?<div className="reference-table" tabIndex={0} role="region" aria-label="Published event information" key={i}><table><tbody>{block.rows?.map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>:<p key={i}>{block.text}</p>)}</>;}
function SectionBody({section}:{section:Section}){
 const images=section.images.filter(image=>!image.unavailable);
 const logos=images.length>0&&images.every(image=>image.kind==='logo');
 const artwork=images.length>4||images.every(image=>image.width===image.height||image.width>image.height*2.4);
 return <><div className="reference-prose"><Blocks blocks={section.blocks}/></div>{images.length>0&&<div className={'reference-images '+(logos?'reference-logo-grid':artwork?'reference-artwork-grid':'reference-photo-grid')}>{images.map((image,i)=><figure className={image.kind==='logo'?'reference-logo':undefined} key={image.src+'-'+i}>{image.kind==='logo'?<LogoImage {...image} sizes="(max-width:767px) 42vw, 220px"/>:<Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={artwork?'(max-width:767px) 45vw, 300px':'(max-width:767px) 100vw, 55vw'} loading="lazy"/>}</figure>)}</div>}{section.links.length>0&&<div className="reference-actions">{section.links.filter(link=>!link.href.includes('zfrmz')&&!/registration|register now|submit your nomination/i.test(link.label)).map(link=><Link className="text-link" href={link.href} key={link.href}>{link.label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div>}</>;
}
export function ReferenceContent({path}:{path:string}){
 const page=(reference as ReferencePage[]).find(item=>item.path===path);if(!page)return null;
 const request=requests[path];const historicalCouncil=/governing-council-2025|meet-our-confirm-advisory-committee/.test(path);const manual=path==='/exhibitor-guide';
 const archiveYear=/2024|advisory-committee|partner-e6vb/.test(path+' '+page.title)?2024:/2025/.test(path+' '+page.title)?2025:2026;
 return <div className="reference-content">
  <div className="reference-context"><span>{archiveYear} event archive</span><p>{request?'Tell the team what you need for the next edition.': 'Published event information, preserved for reference.'} Dates, rules and offers below relate to the published edition.</p></div>
  {path==='/media-hub/postshowreport'&&<ReportCover/>}
  {path==='/exhibitor-list'?<ReferenceRoster/>:path==='/video-gallery'?<div className="video-library">{page.videos.map((video,i)=><a href={'https://www.youtube.com/watch?v='+video.id} target="_blank" rel="noreferrer" className="video-library-card" key={video.id}><div className="video-library-preview">{video.thumbnail&&<Image src={video.thumbnail} alt="" width={480} height={360} sizes="(max-width:767px) 100vw, 50vw"/>}<span><Play size={25} weight="fill" aria-hidden="true"/></span><p>{i<2?'2025':i<5?'2024':'Event archive'}</p></div><h2>{video.title}</h2><span className="text-link">Watch on YouTube<ArrowUpRight size={17} aria-hidden="true"/></span></a>)}</div>:
  <div className={'reference-sections'+(historicalCouncil?' reference-profiles':'')}>{page.sections.map((section,i)=>(section.collapsible||(manual&&i>0))?<details className="reference-accordion" key={section.id} open={i===1}><summary>{section.title||section.blocks.find(b=>b.type==='paragraph')?.text?.slice(0,100)||'Event information'}</summary><SectionBody section={section}/></details>:<section className={'reference-section '+(historicalCouncil&&section.images.length===1?'reference-profile':section.images.length===1&&section.blocks.length?'reference-section-feature':'')} key={section.id}>{section.title&&<h2>{section.title}</h2>}<SectionBody section={section}/></section>)}</div>}
  {request&&<section className="reference-request" id="enquiry"><h2>{request.request}</h2><p>Prepare a message for the event team. For a call back, include your phone number and preferred time.</p><EnquiryForm initialTopic={request.topic} request={request.request}/></section>}
 </div>;
}
