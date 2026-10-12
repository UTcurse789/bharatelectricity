import {Gallery} from './Gallery';
import inaugurations from '@/content/inaugurations.json';

export function InaugurationGallery({year}:{year:number}) {
 const photos=inaugurations.photos.filter(photo=>photo.edition===year);
 return <section className="inauguration-section" aria-labelledby={'inauguration-heading-'+year}><h2 id={'inauguration-heading-'+year}>Inauguration {year}</h2>
  {photos.length?<Gallery photos={photos}/>:<p>Inauguration photographs for {year} will be added here when available.</p>}
 </section>;
}
