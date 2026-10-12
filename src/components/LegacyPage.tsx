import {AboutHero,AboutNavigation,AboutCTA} from './AboutShell';
import {InaugurationGallery} from './InaugurationGallery';
import Link from 'next/link';
import Image from 'next/image';
import {paths} from '@/content/site';
import {Handshake,Blueprint,PresentationChart,UsersThree,Bank,MicrophoneStage,Users,Clock,GraduationCap,Globe,ArrowRight,MapTrifold,Trophy,Lightning,Brain,Circuitry,ArrowsClockwise,Wind,Network} from '@phosphor-icons/react/dist/ssr';
import {legacyEditions,type LegacyMetric,type LegacyPavilion,type LegacyReference,type LegacyEdition,type LegacyChart,type LegacySpeakerQuote} from '@/content/legacy';
import {LegacyDayGallery,LegacyAwardsGallery,LegacyEntrance} from './LegacyGalleries';
import {LegacyYearNavigation} from './LegacyYearNavigation';
import './LegacyPage.css';

const icons={edition:Handshake,area:Blueprint,exhibitors:PresentationChart,attendees:UsersThree,government:Bank,speakers:MicrophoneStage,delegates:Users,time:Clock,students:GraduationCap,countries:Globe,states:MapTrifold,awards:Trophy};
const themeIcons=[Lightning,Brain,ArrowsClockwise,Circuitry,Network,Wind];
const editions=[...legacyEditions].sort((a,b)=>b.year-a.year);
const editionNavigation=editions.map(edition=>({year:edition.year,label:(edition.statistics.find(metric=>metric.icon==='edition')?.value||'')+' in-person edition'}));
function Metrics({items,className=''}:{items:LegacyMetric[];className?:string}){
 return <dl className={'legacy-metrics '+className}>{items.map(item=>{const Icon=item.icon&&icons[item.icon];return <div key={item.label}>{Icon&&<Icon size={28} weight="light" aria-hidden="true"/>}<dt>{item.label}</dt><dd>{item.value}</dd></div>;})}</dl>;
}
function PercentageValues({values,decimals=false}:{values:{label:string;value:number}[];decimals?:boolean}){
 return <dl className="legacy-chart-values">{values.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{decimals?item.value.toFixed(2):item.value}%</dd></div>)}</dl>;
}
function SourceReference({id,year,reference,title,description}:{id:string;year:number;reference:LegacyReference;title:string;description:string}){
 return <details className="legacy-source-reference" id={'legacy-source-'+year+'-'+id}><summary>{title}</summary><div><p>{description}</p><Image src={reference.src} alt={description} width={reference.width} height={reference.height} sizes="(max-width:767px) 90vw, 1100px" loading="lazy"/><p className="legacy-source-caption">Supplied {year} source reference. The original labels and figures are preserved here.</p></div></details>;
}
function FeedbackChart({chart,edition}:{chart:LegacyChart;edition:LegacyEdition}){
 return <figure className={'legacy-chart'+(chart.sourceOnly?' legacy-chart-source-only':'')}><figcaption><h3>{chart.title}</h3></figcaption>
  {chart.sourceOnly?<>
   {!!chart.values.length&&<><p className="legacy-transcription-label">Legible values from the source</p><dl className="legacy-chart-values">{chart.values.map(value=><div key={value.label}><dt>{value.label}</dt><dd>{value.value.toFixed(2)}%</dd></div>)}</dl></>}
   {chart.unlabelledValues&&<p className="legacy-chart-unlabelled">Printed percentages: {chart.unlabelledValues.map(value=>value.toFixed(2)+'%').join(' · ')}</p>}
   {chart.categories&&<p className="legacy-source-caption">Source categories: {chart.categories.join(' · ')}</p>}
  </>:<PercentageValues values={chart.values} decimals/>}
  {chart.note&&<p className="legacy-source-caption">{chart.note}</p>}
  {chart.partial&&<p className="legacy-source-caption">Partial transcription. <a href={'#legacy-source-'+edition.year+'-'+chart.source}>Remaining values are in the original source reference.</a></p>}
  {chart.reference&&<SourceReference id={chart.reference} year={edition.year} reference={edition.references[chart.reference]} title="View original chart" description={`Original ${edition.year} chart: ${chart.title}.`}/>}
 </figure>;
}
function GovernmentSupport({edition}:{edition:LegacyEdition}){
 const support=edition.government;
 if(!support)return null;
 return <section className="legacy-milestone legacy-government" aria-labelledby={'legacy-government-heading-'+edition.year} data-legacy-reveal>
  <div className="legacy-section-heading"><p>{support.label}</p><h2 id={'legacy-government-heading-'+edition.year}>Government support</h2></div>
  <ul className="legacy-government-grid">{[...support.organisations,...support.marks].map(organisation=><li key={organisation.name}><div className="legacy-government-logo"><Image src={organisation.image.src} alt={organisation.image.alt} width={organisation.image.width} height={organisation.image.height} sizes="180px" loading="lazy"/></div><h3>{organisation.name}</h3>{organisation.note&&<p>{organisation.note}</p>}</li>)}</ul>
  <SourceReference id={support.reference} year={edition.year} reference={edition.references[support.reference]} title="View original government support reference" description={`Government support and marks as supplied for the ${edition.year} edition.`}/>
 </section>;
}
function SpeakerQuote({speaker}:{speaker:LegacySpeakerQuote}){
 return <figure className="legacy-speaker-quote">{speaker.image&&<Image src={speaker.image.src} alt={speaker.image.alt} width={490} height={430} sizes="100px" loading="lazy"/>}<blockquote><p>{speaker.quote}</p></blockquote><figcaption><strong>{speaker.name}</strong>{speaker.designation.map(line=><span key={line}>{line}</span>)}</figcaption></figure>;
}
function Pavilion({pavilion,year,reference}:{pavilion:LegacyPavilion;year:number;reference:LegacyReference}){
 return <section className="legacy-milestone legacy-pavilion" id={'legacy-'+year+'-'+pavilion.id} aria-labelledby={'legacy-'+year+'-'+pavilion.id+'-heading'} data-legacy-reveal>
  <div className="legacy-section-heading"><p>Special pavilions</p><h2 id={'legacy-'+year+'-'+pavilion.id+'-heading'}>{pavilion.title}</h2></div>
  <div className="legacy-pavilion-overview"><div><h3>{pavilion.heading}</h3>{pavilion.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><div className="legacy-pavilion-support"><p>{pavilion.supportLabel}</p><strong>{pavilion.supportName}</strong>{pavilion.recognition&&<p className="legacy-recognition">Recognised as <strong>“{pavilion.recognition}”</strong></p>}</div></div>
  <Metrics items={pavilion.metrics} className="legacy-pavilion-metrics"/>
  <p className="legacy-source-caption">“Business expected” is the forecast published for the pavilion, not realised revenue.</p>
  {!!pavilion.images.length&&<div className="legacy-pavilion-photos">{pavilion.images.map(image=><Image src={image.src} alt={image.alt} key={image.src} width={800} height={600} loading="lazy"/>)}</div>}
  <SourceReference id={pavilion.reference} year={year} reference={reference} title={`View original ${pavilion.title} reference`} description={`The supplied ${pavilion.title} reference, including pavilion photographs, metrics and supporting organisation.`}/>
 </section>;
}

export function LegacyPage(){
 return <div className="legacy-page about-legacy">
  <LegacyEntrance/>
  <AboutHero title="The Legacy" intro="Explore the moments, conversations and collaborations that shaped the platform across previous editions."/><AboutNavigation active={paths.legacy}/>
  <div className="legacy-timeline wrap">
   <nav className="legacy-latest-edition" aria-label="Latest edition"><Link href="/editions/2026">Explore the latest 2026 edition</Link></nav>
   <LegacyYearNavigation editions={editionNavigation}>{editions.map(edition=><article className="legacy-edition" key={edition.year} id={'legacy-'+edition.year} data-year={edition.year} aria-labelledby={'legacy-edition-heading-'+edition.year}>
    <header className="legacy-edition-header"><nav className="legacy-archive-links" aria-label={edition.year+' archive sections'}><Link href={edition.year===2025?'/participants-2025':'/2024-exhibitors'}>Participants</Link><Link href={edition.year===2025?'/governing-council-2025':'/meet-our-confirm-advisory-committee'}>Governing Council</Link><Link href={edition.year===2025?'/partners-2025':'/partner/partner-e6vb'}>Partners</Link>{edition.year===2025&&<Link href={paths.speakers}>Speakers</Link>}</nav><span className="legacy-mobile-year">{edition.year}</span>{edition.eyebrow?<><p className="legacy-edition-eyebrow">{edition.eyebrow}</p><h2 className="legacy-edition-title" id={'legacy-edition-heading-'+edition.year}>{edition.names}</h2></>:<><h2 id={'legacy-edition-heading-'+edition.year}>{edition.year} edition</h2><p>{edition.names}</p></>}</header>
    {!!edition.recap.length&&<section className="legacy-milestone legacy-recap" aria-labelledby={'legacy-recap-heading-'+edition.year} data-legacy-reveal><div className="legacy-section-heading"><h2 id={'legacy-recap-heading-'+edition.year}>Conference recap</h2></div><div className="legacy-prose">{edition.recap.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><ul className="legacy-themes" aria-label="Conference themes">{edition.themes.map(theme=><li key={theme}>{theme}</li>)}</ul></section>}
    {edition.quote&&<section className="legacy-milestone legacy-insights" aria-labelledby={'legacy-insights-heading-'+edition.year} data-legacy-reveal><h2 id={'legacy-insights-heading-'+edition.year}>{edition.quote.heading}</h2><blockquote>{edition.quote.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<footer><strong>{edition.quote.name}</strong><span>{edition.quote.role}</span><span>{edition.quote.ministry}</span></footer></blockquote>{edition.quote.image&&<Image src={edition.quote.image.src} alt={edition.quote.image.alt} width={400} height={400} loading="lazy"/>}</section>}
    <InaugurationGallery year={edition.year}/>
    <GovernmentSupport edition={edition}/>
    {edition.government&&<section className="legacy-milestone legacy-focus" aria-labelledby={'legacy-focus-heading-'+edition.year} data-legacy-reveal><h2 id={'legacy-focus-heading-'+edition.year}>Conference focus areas</h2><ul className="legacy-focus-grid">{edition.themes.map((theme,index)=>{const Icon=themeIcons[index%themeIcons.length];return <li key={theme}><Icon size={34} weight="light" aria-hidden="true"/><span>{theme}</span></li>;})}</ul></section>}
    <section className="legacy-milestone legacy-numbers" aria-labelledby={'legacy-numbers-heading-'+edition.year} data-legacy-reveal><div className="legacy-section-heading"><p>{edition.year} edition</p><h2 id={'legacy-numbers-heading-'+edition.year}>{edition.year} in numbers</h2></div><Metrics items={edition.statistics}/></section>
    <section className="legacy-milestone legacy-audience" aria-labelledby={'legacy-audience-heading-'+edition.year} data-legacy-reveal><div className="legacy-section-heading"><h2 id={'legacy-audience-heading-'+edition.year}>{edition.audience?.heading||'Audience and industry feedback'}</h2><p className="legacy-heading-description">The people, priorities and perspectives behind the {edition.year} edition.</p></div><Metrics items={edition.demographics} className="legacy-demographics"/>
     <div className="legacy-sector-chart"><h3>{edition.audience?.chartTitle||'Sector representation'}</h3><PercentageValues values={edition.sectors}/>{edition.audience?.note&&<p className="legacy-source-caption">{edition.audience.note}</p>}</div><SourceReference id="demographics" year={edition.year} reference={edition.references['demographics']} title="View original demographics reference" description={edition.audience?.sourceDescription||'The supplied demographics reference reports 19+ countries represented. The main statistics reference separately reports 20+ countries; these figures have not been reconciled.'}/>
     {!!edition.feedback.length&&<><div className="legacy-feedback-charts">{edition.feedback.map(chart=><FeedbackChart key={chart.title} chart={chart} edition={edition}/>)}</div>
     <div className="legacy-survey-references"><h3>Original survey references</h3><p>Some source values are too small to read reliably. The participant-segment chart, the business-generated chart’s “If Please” option, the repeated question with Yes/No responses, and incomplete location percentages are retained below without reinterpretation.</p><SourceReference id="feedback-1" year={edition.year} reference={edition.references['feedback-1']} title="View original industry feedback: first reference" description="Original participant segments, event value, registration, panel discussions and the ambiguously labelled Yes/No survey."/><SourceReference id="feedback-2" year={edition.year} reference={edition.references['feedback-2']} title="View original industry feedback: second reference" description="Original exhibitor quality, business generated, networking, next-edition attendance and location suggestions."/></div></>}
    </section>
    <section className="legacy-milestone legacy-highlights" aria-labelledby={'legacy-highlights-heading-'+edition.year} data-legacy-reveal><div className="legacy-section-heading"><h2 id={'legacy-highlights-heading-'+edition.year}>Three days of ideas, connections and progress</h2></div><LegacyDayGallery year={edition.year} days={edition.days}/><div className="legacy-album-links">{edition.albums.map(album=><a className="text-link" key={album.url} href={album.url}>{album.label}<ArrowRight size={16} aria-hidden="true"/></a>)}</div></section>
    {edition.feedbackGroups&&<section className="legacy-milestone legacy-industry-feedback" aria-labelledby={'legacy-feedback-heading-'+edition.year} data-legacy-reveal><h2 id={'legacy-feedback-heading-'+edition.year}>Industry feedback</h2>{edition.feedbackGroups.map((group,index)=><section className="legacy-feedback-group" key={group.title} aria-labelledby={`legacy-feedback-group-${edition.year}-${index}`}><h3 id={`legacy-feedback-group-${edition.year}-${index}`}>{group.title}</h3><div className="legacy-feedback-charts">{group.charts.map(chart=><FeedbackChart key={chart.title} chart={chart} edition={edition}/>)}</div><SourceReference id={index===0?'feedback-1':'feedback-2'} year={edition.year} reference={edition.references[index===0?'feedback-1':'feedback-2']} title={`View original ${group.title.toLowerCase()} reference`} description={`Original ${edition.year} industry feedback: ${group.title.toLowerCase()}.`}/></section>)}</section>}
    {edition.voices&&<section className="legacy-milestone legacy-voices" aria-labelledby={'legacy-voices-heading-'+edition.year} data-legacy-reveal><h2 id={'legacy-voices-heading-'+edition.year}>Voices from the stage</h2><p className="legacy-heading-description">Quotations and designations as supplied for the {edition.year} edition.</p><div className="legacy-quote-grid">{edition.voices.map(speaker=><SpeakerQuote key={speaker.name} speaker={speaker}/>)}</div></section>}
    {edition.pavilions.map(pavilion=><Pavilion key={pavilion.id} pavilion={pavilion} year={edition.year} reference={edition.references[pavilion.reference]}/>)}
    <section className="legacy-milestone legacy-awards" aria-labelledby={'legacy-awards-heading-'+edition.year} data-legacy-reveal><div className="legacy-awards-copy"><p className="legacy-awards-edition">{edition.year} awards & gala</p><h2 id={'legacy-awards-heading-'+edition.year}>{edition.awards.heading}</h2><h3>{edition.awards.subheading}</h3><p>{edition.awards.description}</p>{edition.awards.galleryUrl&&<a className="legacy-gallery-link" href={edition.awards.galleryUrl}>Explore the awards gallery<ArrowRight size={18} aria-hidden="true"/></a>}</div><LegacyAwardsGallery images={edition.awards.images}/></section>
   </article>)}</LegacyYearNavigation>
  </div>
  <AboutCTA/>
 </div>;
}
