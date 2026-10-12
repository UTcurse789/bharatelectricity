import {HomePartnerRow} from './HomePartnerRow';
import type {PartnerGroup} from './PartnerShowcase';
import './HomePartnerGrid.css';

// Follow the reference's hierarchy; retain the other published partner roles.
const referenceOrder = [
 'Focus States',
 'Energy Security Partner', 'Cybersecurity Partner', 'Technology Partner',
 'Host Utilities', 'Co-Host Utility', 'Partner Utility', 'Solar Ecosystem Partner',
 'Renewable Energy Partner', 'Lanyard & Badge Partner', 'Integrated Energy Security Partner', 'Industry Partner',
 'Decarbonisation Partner', 'VIP Elite Lounge Partner', 'National Skilling Partner', 'Investment Facilitation Partner',
 'Exchange Partners', 'Policy & Governance Partners', 'Knowledge Partners', 'Strategic Partners', 'Media Partners',
 'Delegate Kit Partner', 'Digital Skilling Partner', 'Nuclear-X Partner',
 'Transition-X Partner', 'Finance-X Partner', 'Associate Partners',
 'Host Publication',
];
const featuredRoles = new Set(['Energy Security Partner', 'Cybersecurity Partner', 'Technology Partner', 'Delegate Kit Partner', 'Digital Skilling Partner', 'Nuclear-X Partner']);
const fullWidthRoles = new Set(['Focus States', 'Exchange Partners', 'Policy & Governance Partners', 'Knowledge Partners', 'Strategic Partners', 'Media Partners', 'Associate Partners']);
const halfWidthRoles = new Set(['Transition-X Partner', 'Finance-X Partner']);
const referenceMediaOrder = ['Media-Partner-2.1.png', 'Media-Partner-15.1.png', 'Media-Partner-17.png', 'Media-Partner-20.png', 'Media-Partner-3.1.png'];

export function HomePartnerGrid({groups}: {groups: PartnerGroup[]}) {
 const partners = groups.filter(group => !['GOVERNMENT SUPPORT', 'Global Footprint'].includes(group.title)).map(group => {
  if (group.title !== 'Media Partners') return group;
  const order = (file: string) => {
   const index = referenceMediaOrder.indexOf(file);
   return index < 0 ? referenceMediaOrder.length : index;
  };
  return {...group, logos: [...group.logos].sort((a, b) => order(a.file) - order(b.file))};
 });
 const ordered = [...partners].sort((a, b) => {
  const position = (title: string) => {
   const index = referenceOrder.indexOf(title);
   return index < 0 ? referenceOrder.length - 1 : index;
  };
  return position(a.title) - position(b.title);
 });

 return <div className="home-partner-grid">{ordered.map((group, index) => {
  const variant = group.title === 'Host Publication' ? 'publication'
   : fullWidthRoles.has(group.title) ? 'wide'
   : halfWidthRoles.has(group.title) ? 'half'
   : featuredRoles.has(group.title) ? 'featured' : 'compact';
  const headingId = `home-partner-role-${index}`;
  return <section
   className={`home-partner-category home-partner-category-${variant}${group.title === 'Focus States' ? ' home-partner-focus' : ''}`}
   key={group.title}
   aria-labelledby={headingId}
   data-partner-role={group.title}
  >
   <h3 className="home-partner-label" id={headingId}>{group.title}</h3>
   <HomePartnerRow logos={group.logos} label={group.title}/>
  </section>;
 })}</div>;
}
