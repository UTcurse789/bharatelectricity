import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr';
import media from '@/content/homepage-media.json';
import {paths} from '@/content/site';
import {IntroductionReveal} from './IntroductionReveal';
import './EnergyIntroduction.css';

export function EnergyIntroduction() {
 const photo = media.photos[0];
 return <section className="energy-introduction" aria-labelledby="energy-introduction-heading">
  <div className="energy-introduction-layout wrap">
   <IntroductionReveal>
    <h2 id="energy-introduction-heading" data-text-reveal>About Bharat Electricity</h2>
    <p className="energy-introduction-lead" data-text-reveal>India's energy story has entered a new phase.</p>
    <p data-text-reveal>Over the past decade, the country has transformed the scale and reach of its electricity system — expanding generation capacity, accelerating renewable deployment, strengthening transmission networks, improving electricity access and introducing digital technologies across the utility ecosystem.</p>
    <p data-text-reveal>India has demonstrated that it can build at scale.</p>
    <p data-text-reveal>The next challenge is more complex.</p>
    <p data-text-reveal>As electricity demand rises, generation becomes more diverse, storage expands, grids become increasingly interconnected and consumers become more active participants in the energy system, <strong>capacity alone will no longer define progress.</strong></p>
    <Link className="text-link" href={paths.about}>About the event <ArrowUpRight size={19} aria-hidden="true"/></Link>
   </IntroductionReveal>
   <figure className="energy-introduction-artwork">
    <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:767px) 90vw, 48vw"/>
    <figcaption>Connections at the 2026 Governing Council meeting</figcaption>
   </figure>
  </div>
 </section>;
}
