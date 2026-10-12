import Link from 'next/link';
import {editionRecords,editionStatus} from '@/content/editions';
import {paths,site} from '@/content/site';
import './EditionNavigation.css';

type Collection='council'|'participants'|'speakers'|'partners'|'edition';
export function EditionNavigation({year,collection='edition'}:{year:number;collection?:Collection}) {
 return <div className="edition-context"><p><strong>{year}</strong> {editionStatus(year)}</p><nav aria-label={collection==='edition'?'Browse editions':'Browse '+collection+' by year'}>{editionRecords.map(edition=>{
  const href=collection==='edition'?'/editions/'+edition.year:edition[collection];
  return href&&<Link key={edition.year} href={href} aria-current={edition.year===year?'page':undefined}>{edition.year}{edition.year===site.edition.year?' · Latest':' · Archive'}</Link>;
 })}</nav></div>;
}

export function EditionOverview({year}:{year:number}) {
 const edition=editionRecords.find(record=>record.year===year)!;
 return <nav className="edition-overview" aria-label={year+' edition sections'}>
  <Link href={edition.council}><h2>Governing Council {year}</h2><p>Names, portraits and designations for this edition.</p></Link>
  <Link href={edition.participants}><h2>Participants {year}</h2><p>Explore the exhibition’s published participant record.</p></Link>
  {edition.speakers&&<Link href={edition.speakers}><h2>Speakers {year}</h2><p>Speaker information recorded for this edition.</p></Link>}
  <Link href={paths.gallery+'?year='+year}><h2>Photographs {year}</h2><p>Inauguration, conference and available event photographs.</p></Link>
  <Link href={edition.partners}><h2>Partners {year}</h2><p>The partner network published for this edition.</p></Link>
  {year!==site.edition.year&&<Link href={paths.legacy+'#legacy-'+year}><h2>{year} in Our Legacy</h2><p>Revisit the highlights and conversations.</p></Link>}
 </nav>;
}
