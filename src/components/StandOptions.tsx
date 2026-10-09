import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Check} from '@phosphor-icons/react/dist/ssr';

export function StandOptions(){
 return <div className="stand-options">
  <div className="stand-opening"><h2>Fit your budget.<br/>Match your business goals.</h2><p>Two ways to make your mark on the exhibition floor. Choose a ready-built stand or create a space around your brand.</p></div>
  <div className="stand-formats">{[
   {name:'Raw Space',image:'raw-space',alt:'Woodward custom-built exhibition stand supplied as a Raw Space example',width:1250,height:919,copy:'Showcase your brand to the max and stand out from your competitors. A custom-built stand can reflect your brand identity while attracting more attendees.',features:['A space built around your brand','Freedom to plan your own layout','Room for equipment and demonstrations']},
   {name:'Shell Scheme',image:'shell-scheme',alt:'Camfil modular exhibition stand supplied as a Shell Scheme example',width:1379,height:919,copy:'The simplest package, ideal when you want a straightforward exhibition setup. Dress your stand with printed graphics, TVs or comfortable furniture.',features:['A straightforward stand format','Personalise with printed graphics','Discuss furniture and display extras']}
  ].map(option=><article className="stand-format" key={option.name}><div className="stand-format-photo"><Image src={'/assets/site-refresh/'+option.image+'.webp'} alt={option.alt} width={option.width} height={option.height} sizes="(max-width:767px) 100vw, 50vw" loading="lazy"/></div><div className="stand-format-copy"><h2>{option.name}</h2><p>{option.copy}</p><ul>{option.features.map(item=><li key={item}><Check size={17} aria-hidden="true"/>{item}</li>)}</ul><Link className="button" href={'/exhibit-at-powergen-india/make-a-stand-enquiry?stand='+encodeURIComponent(option.name)}>Enquire about {option.name}<ArrowUpRight size={18} aria-hidden="true"/></Link></div></article>)}</div>
  <section className="stand-planning"><h2>Once you have a stand.</h2><div>{[
   ['Size','The bigger your stand, the bigger the team you can bring and the greater the impact your brand can make.','Talk to us for advice','/contact'],
   ['Location','Prefer the main entrance, plenary or lunch and networking areas? Discuss premium locations with the team.','Request the floor plan','/exhibit-at-powergen-india/view-the-floor-plan-92u6'],
   ['Optional extras','Explore speaking, branding, awards and partnership opportunities alongside your stand.','Request partnership brochure','/request-the-partnership-brochure']
  ].map(([title,body,label,href])=><article key={title}><h3>{title}</h3><p>{body}</p><Link className="text-link" href={href}>{label}<ArrowUpRight size={17} aria-hidden="true"/></Link></article>)}</div></section>
  <p className="source-note">Images supplied by the event team. Stand rates, inclusions and availability for the next edition are confirmed directly with the organiser.</p>
 </div>;
}
