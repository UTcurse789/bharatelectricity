import Link from 'next/link';
import Image from 'next/image';
import {initiatives,initiativeOverview} from '@/content/initiatives';
import {paths} from '@/content/site';
import {ZohoEnquiry} from './ZohoEnquiry';
import {zohoFormUrls} from '@/content/zoho-forms';
import './InitiativeContent.css';

function InitiativeArtwork({initiative}:{initiative:typeof initiatives[number]}) {
 const {artwork}=initiative;
 return <div className={'initiative-artwork initiative-artwork--'+initiative.slug}>
  <Image src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} unoptimized/>
 </div>;
}

export function InitiativeContent({path}:{path:string}) {
 const current=initiatives.find(item=>path===paths.initiatives+'/'+item.slug);
 const overview=path===paths.initiatives;
 return <>
  {overview&&<>
   <p className="initiatives-context">{initiativeOverview}</p>
   <div className="initiative-platforms">{initiatives.map(item=><article className="initiative-platform" key={item.slug}>
    <Link href={paths.initiatives+'/'+item.slug} aria-label={'Explore '+item.name}><InitiativeArtwork initiative={item}/></Link>
    <div className="initiative-platform-copy"><h2><Link href={paths.initiatives+'/'+item.slug}>{item.name}</Link></h2><h3>{item.title}</h3><p><strong>Focus: </strong>{item.intro}</p><Link href={paths.initiatives+'/'+item.slug} className="text-link">Explore {item.name}</Link></div>
   </article>)}</div>
   <section className="initiative-comparison" aria-labelledby="initiative-comparison-heading">
    <h2 id="initiative-comparison-heading">Four platforms. One energy ecosystem.</h2>
    <div className="initiative-table-wrap"><table><caption>Core question each platform addresses</caption><thead><tr><th scope="col">Platform</th><th scope="col">Core question it addresses</th></tr></thead><tbody>{initiatives.map(item=><tr key={item.slug}><th scope="row"><Link href={paths.initiatives+'/'+item.slug}>{item.name}</Link></th><td>{item.question}</td></tr>)}</tbody></table></div>
   </section>
   <aside className="initiative-startups"><h2>Startup participation</h2><p>Explore TransitionX for energy-transition startups, clean technology and commercialisation, or apply for startup exhibition space.</p><Link className="text-link" href={paths.startups}>Explore startup participation</Link></aside>
  </>}
  {current&&<article className="initiative-detail">
   <div className="initiative-detail-opening"><InitiativeArtwork initiative={current}/><div><h2>{current.title}</h2><p>{current.description}</p></div></div>
   <div className="initiative-detail-areas"><section aria-labelledby="initiative-key-areas"><h2 id="initiative-key-areas">Key areas</h2><ul>{current.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></section><section className="initiative-question" aria-labelledby="initiative-question-heading"><h2 id="initiative-question-heading">Core question</h2><p>{current.question}</p></section></div>
   <section className="initiative-ecosystem"><h2>Part of Bharat Electricity Global Energy Forum</h2><p>{initiativeOverview}</p><Link href={paths.initiatives} className="text-link">Explore all four platforms</Link></section>
  </article>}
 </>;
}

export function OpportunityEnquiry({request}:{topic:string;request:string}) {
 return <section className="opportunity-enquiry" id="enquiry"><p>Tell the team about your organisation, area of expertise and the opportunity you are interested in.</p><ZohoEnquiry src={zohoFormUrls.partnership} title={request}/></section>;
}
