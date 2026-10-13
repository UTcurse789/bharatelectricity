import {visitorCountries,summitLocation} from '@/content/visitor-countries';
import {GlobeCdn} from './ui/cobe-globe-cdn';
import './GlobalVisitors.css';

const markers=[...visitorCountries.map(country=>({...country,region:country.name,flag:`/assets/visitor-flags/${country.id}.svg`})),{id:'delhi',location:summitLocation,region:'New Delhi'}];
const connections=visitorCountries.map(country=>({id:country.id,from:country.location,to:summitLocation}));

export function GlobalVisitors(){
 return <section className="section global-visitors" aria-labelledby="global-visitors-heading">
  <div className="wrap global-visitors-heading"><span className="global-visitors-eyebrow">Global participation</span><h2 id="global-visitors-heading">Visitors from around the world</h2><p>People from across the world visited Bharat Electricity, connecting the global energy community in New Delhi.</p></div>
  <div className="global-visitors-stage"><GlobeCdn markers={markers} arcs={connections}/></div>
 </section>;
}
