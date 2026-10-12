import Image from 'next/image';
import {EnvelopeSimple, Phone} from '@phosphor-icons/react/dist/ssr';
import portraits from '@/content/lanyard-image.json';
import {site} from '@/content/site';
import './ContactLanyard.css';

const team = [
 {...site.contacts[0], id: 'siddhartha', image: portraits.siddhartha},
 {...site.contacts[1], id: 'hansika', image: portraits.hansika},
 {...site.contacts[2], id: 'amit', image: portraits.amit},
];

export function ContactLanyard() {
 return <section className="contact-lanyards" aria-labelledby="contact-lanyards-heading">
  <div className="contact-lanyards-heading"><h2 id="contact-lanyards-heading">Meet the team</h2><p>The people behind your next energy connection.</p></div>
  <div className="contact-lanyards-grid">{team.map(member => <figure key={member.id} className="team-photo-card" data-person={member.id}>
   <div className="team-portrait"><Image src={member.image.src} alt={member.name} width={member.image.width} height={member.image.height} sizes="(max-width:767px) 90vw, 30vw" loading="lazy"/></div>
   <figcaption><h3>{member.name}</h3><p>{member.role}</p><a href={'mailto:' + member.email}><EnvelopeSimple size={18} aria-hidden="true"/>{member.email}</a><a href={'tel:' + member.phone.replace(/[^+0-9]/g, '')}><Phone size={18} aria-hidden="true"/>{member.phone}</a></figcaption>
  </figure>)}</div>
 </section>;
}
