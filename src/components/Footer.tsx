import Image from 'next/image';
import Link from 'next/link';
import {Brand} from './Brand';
import {paths, site, navigation} from '@/content/site';
import './Footer.css';

export function Footer() {
 return (
  <footer className="site-footer">
   <div className="wrap footer-grid">
    <div className="footer-identity">
     <Link href="/" prefetch={false} aria-label="BHARAT ELECTRICITY home"><Brand/></Link>
     <p>Connecting the complete energy ecosystem.</p>
     <div className="footer-partners">
      <section aria-labelledby="footer-organisers">
       <h3 id="footer-organisers">Organisers</h3>
       <div className="footer-organiser-logos">
        <Image src="/assets/footer/iten.webp" alt="ITEN" width={280} height={81} sizes="110px" unoptimized/>
        <Image src="/assets/footer/encis.webp" alt="ENCIS — The Energy & Climate Initiatives Society" width={560} height={139} sizes="210px" unoptimized/>
       </div>
      </section>
      <hr className="footer-partner-separator"/>
      <section aria-labelledby="footer-host-publication">
       <h3 id="footer-host-publication">Host publication</h3>
       <Image className="footer-publication-logo" src="/assets/footer/energdive.webp" alt="ENERGDIVE — Insights and Market Intelligence" width={660} height={103} sizes="260px" unoptimized/>
      </section>
     </div>
    </div>
    <div>
     <h3>Explore</h3>
     {navigation.slice(0, 4).map(g => <Link key={g.label} href={g.links[0][1]}>{g.label}</Link>)}
     <Link href={paths.gallery}>Event highlights</Link>
    </div>
    <div>
     <h3>Stay involved</h3>
     <Link href={paths.exhibitors}>Participants 2026</Link>
     <Link href={paths.agenda}>Summit programme</Link>
     <Link href={paths.awards}>Awards</Link>
     <Link href={paths.partners}>Partners</Link>
     <Link href={paths.contact}>Enquire</Link>
    </div>
    <div>
     <h3>Contact the team</h3>
     <a href={'mailto:' + site.contacts[0].email}>{site.contacts[0].email}</a>
     <a href="tel:+919999913164">+91 9999913164</a>
     <p className="small">For exhibition and partnership enquiries.</p>
     <div className="social-links">{site.socials.map(s => <a href={s.url} key={s.name}>{s.name}</a>)}</div>
    </div>
   </div>
   <div className="wrap footer-bottom">
    <span>© {site.edition.year} BHARAT ELECTRICITY</span>
    <div><Link href={paths.privacy}>Privacy Policy</Link><Link href={paths.terms}>Terms & Conditions</Link></div>
   </div>
  </footer>
 );
}
