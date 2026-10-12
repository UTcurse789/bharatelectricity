import {HomePartnerLogoLoop} from './HomePartnerLogoLoop';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr';
import {EventCarousel} from './EventCarousel';
import {VideoHero} from './VideoHero';
import {EnergyIntroduction} from './EnergyIntroduction';
import {ContentRail} from './ContentRail';
import {HomePartnerGrid} from './HomePartnerGrid';
import {HomeCompanies, HomePeople} from './HomeDirectories';
import {LogoImage} from './LogoImage';
import {paths, site} from '@/content/site';
import {allPartnerGroups} from '@/content/partners';
import partnerContent from '@/content/homepage-partners.json';
import media from '@/content/homepage-media.json';
import {getExhibitors, getPeople, sessions} from '@/lib/content';
import './Home.css';

export function Home() {
 const council = getPeople('council').sort((a, b) => Number(!a.role.toLowerCase().includes('honorary')) - Number(!b.role.toLowerCase().includes('honorary')));
 const speakers = getPeople('speaker');
 const exhibitors = getExhibitors();
 const global = partnerContent.groups.find(group => group.title === 'Global Footprint')!;
 const partners=allPartnerGroups.filter(group=>!['Global Footprint','GOVERNMENT SUPPORT'].includes(group.title)).flatMap(group=>group.logos.map(logo=>({name:logo.name,src:logo.src,width:logo.width,height:logo.height,role:group.title}))).filter((logo,index,all)=>all.findIndex(item=>item.src===logo.src)===index);
 const programme = sessions.filter(session => session.day === 1 && !/Tea|Lunch|Awards/.test(session.title)).slice(0, 3);
 return <div className="home-page">
  <VideoHero/>
  <HomePartnerLogoLoop partners={partners}/>
  <EnergyIntroduction/>
  <EventCarousel/>

  <section className="statistics wrap" aria-label="Published promotional statistics">
   <div className="stats-grid">{site.statistics.map(statistic => <div key={statistic.label}><strong>{statistic.value.toLocaleString('en-IN') + statistic.suffix}</strong><span>{statistic.label}</span></div>)}</div>
   <p className="small muted">{site.statisticsNote}</p>
  </section>

  <section className="section wrap floor-moments" aria-labelledby="moments-heading">
   <div className="home-section-heading"><h2 id="moments-heading">2026 Governing Council meeting</h2><p>Photographs from the second Governing Council meeting, bringing together leaders from government, utilities and industry.</p></div>
   <div className="moments-photos">{media.photos.map(photo => <Link href={paths.gallery} key={photo.src}><div><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:767px) 90vw, 30vw"/></div><span>{photo.edition} / {photo.label}<ArrowUpRight size={20} aria-hidden="true"/></span></Link>)}</div>
   <Link className="text-link" href={paths.gallery}>Explore the photo gallery <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </section>

  <section className="section event-experience" aria-labelledby="experience-heading"><div className="wrap">
   <div className="home-section-heading"><h2 id="experience-heading">Exhibition, conference and awards</h2><p>Explore the technologies, programme and recognition across India's power and energy sector.</p></div>
   <div className="event-pathways">
    <Link href={paths.exhibit}><span>Exhibition</span><h3>Discover the solutions.</h3><p>Explore technologies across generation, grids, renewables and digital utilities.</p><span className="pathway-link">Explore the exhibition <ArrowUpRight size={20} aria-hidden="true"/></span></Link>
    <Link href={paths.summit}><span>Conference</span><h3>Connect with the ideas.</h3><p>Policy, investment and practical perspectives on the future of energy.</p><span className="pathway-link">Explore the summit <ArrowUpRight size={20} aria-hidden="true"/></span></Link>
    <Link href={paths.awards}><span>Awards</span><h3>Celebrate the impact.</h3><p>Powering India Awards recognise contributions to India's power sector.</p><span className="pathway-link">Explore the awards <ArrowUpRight size={20} aria-hidden="true"/></span></Link>
   </div>
  </div></section>

  <section className="section wrap home-government-support" aria-labelledby="government-heading">
   <div className="home-section-heading"><h2 id="government-heading">Government Support</h2></div>
   <div className="support-logo-grid">{allPartnerGroups.find(group => group.title === 'GOVERNMENT SUPPORT')?.logos.map(logo => <div className="support-logo" key={logo.src}><LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} maxWidth={240} maxHeight={180} sizes="(max-width:767px) 42vw, 240px"/></div>)}</div>
  </section>

  <section className="section homepage-partners" aria-labelledby="partners-heading"><div className="wrap">
   <div className="home-section-heading"><span className="home-partner-eyebrow">OUR NETWORK</span><h2 id="partners-heading">Our valued partners</h2><p>Together, shaping the future of energy.</p></div>
   <HomePartnerGrid groups={allPartnerGroups}/>
   <Link href={paths.partners} className="text-link">Explore all partners <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </div></section>

  <section className="section participating-section" aria-labelledby="companies-heading"><div className="wrap">
   <div className="home-section-heading"><h2 id="companies-heading">Participants 2026</h2><p>Explore the 2026 exhibitor directory. Find a company by name or stand number.</p></div>
   <HomeCompanies items={exhibitors}/>
   <Link href={paths.exhibitors} className="text-link">View Participants 2026 <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </div></section>

  <section className="section council-section" aria-labelledby="council-heading"><div className="wrap">
   <div className="home-section-heading"><h2 id="council-heading">Governing Council 2026</h2><p>Bringing together perspectives from government, utilities and industry.</p></div>
   <HomePeople items={council} council/>
   <Link href={paths.council} className="text-link">Meet the full council <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </div></section>

  <section className="section speaker-section" aria-labelledby="speakers-heading"><div className="wrap">
   <div className="home-section-heading"><h2 id="speakers-heading">Speakers 2026</h2><p>Meet the industry leaders and experts sharing perspectives on India's energy sector.</p></div>
   <HomePeople items={speakers}/>
   <Link href={paths.speakers} className="text-link">View all speaker profiles <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </div></section>

  <section className="section programme-section" aria-labelledby="programme-heading"><div className="wrap programme-layout">
   <div><h2 id="programme-heading">Conference programme</h2><p>Explore the discussions across India's power and energy value chain.</p><Link href={paths.agenda} className="button secondary">Explore the programme <ArrowUpRight size={19} aria-hidden="true"/></Link></div>
   <div className="programme-sessions">{programme.map(session => <Link key={session.id} href={paths.agenda}><span>1 September 2026 / {session.time} IST</span><h3>{session.title}</h3><ArrowUpRight size={23} aria-hidden="true"/></Link>)}</div>
  </div></section>

  <section className="section wrap global-section" aria-labelledby="global-heading"><div className="home-section-heading"><h2 id="global-heading">A global energy community</h2><p>Explore the organiser's international event portfolio.</p></div>
   <ContentRail label="international events" className="global-rail">{global.logos.map(logo => <Link href="/event/power--energy-series-a-global-portfolio" key={logo.source} className="global-event">{/^POWERGEN/i.test(logo.file) ? <div className="global-event-copy"><strong>{logo.name}</strong><span>18-21 January 2027<br/>Salt Lake City, Utah</span></div> : <LogoImage src={logo.src} alt={logo.name + ': published event artwork'} width={logo.width} height={logo.height} sizes="300px" maxWidth={260} maxHeight={120} loading="lazy"/>}</Link>)}</ContentRail>
  </section>

  <section className="enquiry-cta home-enquiry"><div className="wrap"><div><h2>Exhibition and partnership enquiries</h2><p>Contact the organising team to discuss your participation.</p></div><Link href={paths.contact} className="button">Contact the team <ArrowUpRight size={21} aria-hidden="true"/></Link></div></section>
 </div>;
}
