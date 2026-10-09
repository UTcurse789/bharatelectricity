import {LogoImage} from './LogoImage';
﻿import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr';
import {EventCarousel} from './EventCarousel';
import {VideoHero} from './VideoHero';
import {EnergyIntroduction} from './EnergyIntroduction';
import {ContentRail} from './ContentRail';
import {PartnerShowcase, type PartnerArtwork} from './PartnerShowcase';
import {HomeCompanies, HomePeople} from './HomeDirectories';
import {SectionRibbon} from './SectionRibbon';
import CountUp from './react-bits/CountUp';
import {paths, site, editionLabel} from '@/content/site';
import {photos} from '@/content/media';
import partnerContent from '@/content/homepage-partners.json';
import insightContent from '@/content/insight-photos.json';
import {getExhibitors, getPeople, sessions} from '@/lib/content';
import './Home.css';

function Artwork({logo}: {logo: PartnerArtwork}) {
 return <div className="partner-logo"><LogoImage src={logo.src} alt={logo.name} width={logo.width} height={logo.height} sizes="(max-width:767px) 42vw, 240px" loading="lazy"/><span className="logo-name">{logo.name}</span></div>;
}

export function Home() {
 const groups = partnerContent.groups;
 const states = groups.find(group => group.title === 'Focus States')!;
 const global = groups.find(group => group.title === 'Global Footprint')!;
 const insightPhotos = insightContent.photos;
 const council = getPeople('council').sort((a, b) => Number(!a.role.toLowerCase().includes('honorary')) - Number(!b.role.toLowerCase().includes('honorary')));
 const speakers = getPeople('speaker');
 const exhibitors = getExhibitors();
 const programme = sessions.filter(session => session.day === 1 && !/Tea|Lunch|Awards/.test(session.title)).slice(0, 3);
 return <div className="home-page">
  <VideoHero/>
  <EnergyIntroduction/>
  <EventCarousel/>
  <div className="event-ribbon wrap"><div><span>{editionLabel}</span><strong>{site.edition.dates}</strong></div><div><span>The venue</span><strong>{site.edition.venue}, New Delhi</strong></div><Link href={paths.contact}>Enquire <ArrowUpRight size={19} aria-hidden="true"/></Link></div>

  <section className="floor-moments wrap" aria-labelledby="moments-heading"><div className="moments-intro"><p className="eyebrow">People. Ideas. Possibilities.</p><h2 id="moments-heading">The industry,<br/>in motion.</h2><p>Step inside the 2025 exhibition archive.</p><Link className="text-link" href={paths.gallery}>Explore the gallery <ArrowUpRight size={18} aria-hidden="true"/></Link></div><div className="moments-photos" data-lenis-prevent-horizontal>{[{photo: insightPhotos[1], label: 'Meet the people'}, {photo: insightPhotos[3], label: 'Feel the momentum'}, {photo: insightPhotos[4], label: 'Explore the floor'}].map(({photo, label}) => <Link href={paths.gallery} key={photo.src}><div><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:767px) 72vw, (max-width:1279px) 30vw, 24vw"/></div><span>{label}<ArrowUpRight size={17} aria-hidden="true"/></span></Link>)}</div></section>

  <section className="hero"><div className="wrap hero-layout"><div className="hero-content"><p className="eyebrow">BHARAT ELECTRICITY / GLOBAL ENERGY FORUM</p><h2 className="hero-heading">Where energy leaders power the future.</h2><p className="hero-description">One meeting place for the people, technologies and partnerships shaping India's energy future.</p><div className="hero-actions"><Link className="button" href={paths.contact}>Enquire <ArrowUpRight size={19} aria-hidden="true"/></Link><Link className="button secondary" href={paths.about}>About the Event</Link></div></div><div className="hero-photo-stack"><figure className="hero-figure"><Image src={photos[0].src} alt={photos[0].alt} width={1200} height={800} sizes="(max-width:767px) 90vw, 48vw" className="hero-photo"/></figure><figure className="hero-detail"><Image src={photos[3].src} alt={photos[3].alt} width={768} height={512} sizes="(max-width:767px) 45vw, 22vw"/></figure><p className="archive-caption">From the 2025 exhibition floor</p></div></div></section>

  <section className="statistics wrap" aria-label="Published promotional statistics"><div className="stats-grid">{site.statistics.map(statistic => <div key={statistic.label}><strong><span className="sr-only">{statistic.value.toLocaleString('en-IN') + statistic.suffix}</span><span aria-hidden="true"><CountUp to={statistic.value} separator="," duration={1.2}/>{statistic.suffix}</span></strong><span>{statistic.label}</span></div>)}</div><p className="small muted">{site.statisticsNote}</p></section>

  <section className="section focus-states wrap" aria-labelledby="focus-heading"><h2 id="focus-heading">Our focus states</h2><div className="state-logos">{states.logos.map(logo => <Artwork key={logo.source} logo={logo}/>)}</div><p className="source-note">Focus states published for the 2026 edition.</p></section>

  <section className="section event-experience wrap" aria-labelledby="experience-heading"><h2 id="experience-heading">The whole energy industry.<br/>A world of opportunity.</h2><p className="section-description">Discover technology on the exhibition floor, policy at the summit and the people advancing the energy transition.</p><div className="experience-mosaic"><Link href={paths.exhibit} className="experience-main"><Image src={photos[1].src} alt={photos[1].alt} width={1200} height={800} sizes="(max-width:767px) 100vw, 60vw"/><div><h3>Exhibition</h3><p>Meet the companies behind the technology.</p><span>Explore the exhibition <ArrowUpRight size={22} aria-hidden="true"/></span></div></Link><Link href={paths.summit} className="experience-summit"><h3>Ideas that move<br/>the industry forward.</h3><p>Power generation, smart grids, clean energy and digital utilities.</p><span>Explore the summit <ArrowUpRight size={22} aria-hidden="true"/></span></Link><Link href={paths.awards} className="experience-awards"><h3>Powering India Awards</h3><p>Celebrating the people and organisations contributing to India's power sector.</p><span>Explore the awards <ArrowUpRight size={22} aria-hidden="true"/></span></Link></div></section>

  <section className="section insights-section" aria-labelledby="insights-heading"><div className="wrap"><div className="insights-heading"><div><p className="eyebrow">Inside the energy ecosystem</p><h2 id="insights-heading">A closer look.<br/>A wider perspective.</h2></div><p>Explore the technology, market discussions and connections that bring this community together.</p></div><div className="insights-layout"><Link href={paths.exhibitors} className="insight-feature"><div className="insight-image"><Image src={insightPhotos[0].src} alt={insightPhotos[0].alt} width={insightPhotos[0].width} height={insightPhotos[0].height} sizes="(max-width:767px) 100vw, (max-width:1279px) 110vw, 55vw"/></div><div className="insight-copy"><p className="eyebrow">Technology & innovation</p><h3>Meet the people behind the solutions.</h3><p>Explore the published exhibitor directory, from generation equipment to digital utility technologies.</p><span>Discover participating companies <ArrowUpRight size={21} aria-hidden="true"/></span></div></Link><div className="insight-stories"><Link href={paths.agenda} className="insight-story"><div className="insight-image"><Image src={insightPhotos[1].src} alt={insightPhotos[1].alt} width={insightPhotos[1].width} height={insightPhotos[1].height} sizes="(max-width:767px) 100vw, 24vw"/></div><div className="insight-copy"><p className="eyebrow">Markets, investment & policy</p><h3>Follow the conversations shaping energy.</h3><p>Revisit the 2026 summit programme.</p><span>Explore the agenda <ArrowUpRight size={19} aria-hidden="true"/></span></div></Link><Link href="https://www.powergen-india.com/media-hub/postshowreport" className="insight-story"><div className="insight-image"><Image src={insightPhotos[2].src} alt={insightPhotos[2].alt} width={insightPhotos[2].width} height={insightPhotos[2].height} sizes="(max-width:767px) 100vw, 24vw"/></div><div className="insight-copy"><p className="eyebrow">Event insights</p><h3>Take the exhibition story further.</h3><p>Explore the official post-show report.</p><span>View the report <ArrowUpRight size={19} aria-hidden="true"/></span></div></Link></div></div><p className="archive-caption">Photography from the 2025 exhibition archive. Programme links refer to the published 2026 edition.</p></div></section>

  <section className="section homepage-partners ribbon-section" aria-labelledby="partners-heading"><SectionRibbon text="Our valued partners"/><div className="wrap"><div className="directory-section-heading"><p className="eyebrow">The 2026 partner network</p><h2 id="partners-heading">Our valued partners</h2><p className="section-description">Utilities, technology companies, exchanges and industry institutions. Explore the roles published by the event organiser.</p></div><PartnerShowcase groups={groups}/><div className="section-links"><Link href={paths.partners} className="text-link">Explore 2026 Partners</Link><a href={partnerContent.source} className="source-note">Official event source <ArrowUpRight size={15} aria-hidden="true"/></a></div></div></section>

  <section className="section participating-section ribbon-section" aria-labelledby="companies-heading"><SectionRibbon text="Participating companies" tone="green"/><div className="wrap"><div className="directory-section-heading"><h2 id="companies-heading">Participating companies</h2><p className="section-description">Browse every company in the published 2026 exhibitor directory. Search by name or stand number.</p></div><HomeCompanies items={exhibitors}/><Link href={paths.exhibitors} className="text-link">Full exhibitor directory</Link></div></section>

  <section className="section council-section ribbon-section" aria-labelledby="council-heading"><SectionRibbon text="Governing Council 2026"/><div className="wrap"><div className="directory-section-heading"><h2 id="council-heading">Governing Council 2026</h2><p className="section-description">Industry, government and utility perspectives at one table.</p></div><HomePeople items={council} council/><Link href={paths.council} className="text-link">Meet the full council</Link></div></section>

  <section className="section speaker-section ribbon-section" aria-labelledby="speakers-heading"><SectionRibbon text="Energy voices" tone="green"/><div className="wrap"><div className="directory-section-heading"><h2 id="speakers-heading">Voices shaping the energy conversation</h2><p className="section-description">The complete published 2025 speaker lineup. Search by name or organisation. Roles reflect the historical event records.</p></div><HomePeople items={speakers}/><Link href={paths.speakers} className="text-link">Full speaker directory</Link></div></section>

  <section className="section programme-section" aria-labelledby="programme-heading"><div className="wrap programme-layout"><div><p className="eyebrow">The 2026 summit</p><h2 id="programme-heading">The agenda<br/>behind the action.</h2><p>Explore discussions across India's power and energy value chain.</p><Link href={paths.agenda} className="button secondary">Explore the Programme</Link></div><div className="programme-sessions">{programme.map(session => <Link key={session.id} href={paths.agenda}><span>1 September / {session.time} IST</span><h3>{session.title}</h3><ArrowUpRight size={23} aria-hidden="true"/></Link>)}</div></div></section>

  <section className="section wrap global-section" aria-labelledby="global-heading"><h2 id="global-heading">A global energy community</h2><p className="section-description">International events featured in the organiser's global footprint.</p><ContentRail label="international events" className="global-rail">{global.logos.map(logo => <a href={partnerContent.source} key={logo.source} className="global-event">{/^POWERGEN/i.test(logo.file)?<div className="global-event-copy"><strong>{logo.name}</strong><span>18–21 January 2027<br/>Salt Lake City, Utah</span></div>:<LogoImage src={logo.src} alt={logo.name + ': published event artwork'} width={logo.width} height={logo.height} sizes="300px" maxWidth={280} maxHeight={140} loading="lazy"/>}</a>)}</ContentRail></section>

  <section className="event-story section" aria-labelledby="story-heading"><div className="wrap"><div className="story-copy"><h2 id="story-heading">See the connections.<br/>Feel the energy.</h2><p>Explore real conversations, equipment demonstrations and the exhibition floor through the official event archive.</p><div className="hero-actions"><Link href={paths.gallery} className="button">View Event Highlights</Link><a className="text-link" href="https://www.powergen-india.com/media-hub/postshowreport">Post-show report <ArrowUpRight size={18} aria-hidden="true"/></a></div></div><div className="story-photos"><Image src={photos[2].src} alt={photos[2].alt} width={1200} height={800} sizes="(max-width:767px) 100vw, 60vw"/><Image src={photos[3].src} alt={photos[3].alt} width={768} height={512} sizes="(max-width:767px) 45vw, 28vw"/></div><p className="archive-caption">Photography from the verified 2025 exhibition archive.</p></div></section>



  <section className="enquiry-cta home-enquiry"><div className="wrap"><div><h2>Your next connection<br/>starts here.</h2><p>Talk to the team about exhibition and partnership opportunities.</p></div><Link href={paths.contact} className="button">Enquire <ArrowUpRight size={21} aria-hidden="true"/></Link></div></section>
 </div>;
}
