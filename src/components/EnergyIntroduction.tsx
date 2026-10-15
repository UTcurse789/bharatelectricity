import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight, ArrowsClockwise, Lightning} from '@phosphor-icons/react/dist/ssr';
import {paths} from '@/content/site';
import {IntroductionReveal} from './IntroductionReveal';
import './EnergyIntroduction.css';

export function EnergyIntroduction() {
 return <section className="energy-introduction" aria-labelledby="energy-introduction-heading">
  <div className="energy-introduction-layout wrap">
   <IntroductionReveal>
    <h2 id="energy-introduction-heading" data-text-reveal><span className="energy-introduction-heading-icon" aria-hidden="true"><Lightning weight="light"/><span/><span/><span/></span>About Bharat Electricity</h2>
    <p className="energy-introduction-lead" data-text-reveal>India's energy story has entered a new phase.</p>
    <p data-text-reveal>Over the past decade, the country has transformed the scale and reach of its electricity system - expanding generation capacity, accelerating renewable deployment, strengthening transmission networks, improving electricity access and introducing digital technologies across the utility ecosystem.</p>
    <p data-text-reveal>India has demonstrated that it can build at scale.</p>
    <p data-text-reveal>The next challenge is more complex.</p>
    <p data-text-reveal>As electricity demand rises, generation becomes more diverse, storage expands, grids become increasingly interconnected and consumers become more active participants in the energy system, <strong>capacity alone will no longer define progress.</strong></p>
    <Link className="text-link energy-introduction-link" href={paths.about}><span>About the event</span><span className="energy-introduction-link-arrow" aria-hidden="true"><ArrowUpRight size={26}/></span></Link>
   </IntroductionReveal>
   <figure className="energy-introduction-artwork">
    <div className="energy-introduction-scene">
     <div className="energy-introduction-backdrop" aria-hidden="true"><Lightning weight="light"/></div>
     <span className="energy-introduction-orbit energy-introduction-orbit-top" aria-hidden="true"/>
     <span className="energy-introduction-orbit energy-introduction-orbit-right" aria-hidden="true"/>
     <span className="energy-introduction-orbit energy-introduction-orbit-bottom" aria-hidden="true"/>
     <Image src="/assets/homepage/about-bharat-electricity.webp" alt="Delegates attending the Bharat Electricity Global Energy Forum" width={720} height={480} sizes="(max-width:900px) 90vw, 45vw" unoptimized/>
     <div className="energy-introduction-badge" aria-hidden="true"><ArrowsClockwise className="energy-introduction-badge-cycle" weight="light"/><Lightning className="energy-introduction-badge-bolt" weight="light"/></div>
    </div>
    <figcaption>Bharat Electricity Global Energy Forum</figcaption>
   </figure>
  </div>
 </section>;
}
