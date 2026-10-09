import Image from 'next/image';
import './EnergyIntroduction.css';

export function EnergyIntroduction() {
 return <section className="energy-introduction" aria-labelledby="energy-introduction-heading">
  <div className="energy-introduction-layout wrap">
   <div className="energy-introduction-copy">
    <p className="energy-introduction-edition">Bharat Electricity 2027</p>
    <h2 id="energy-introduction-heading"><span>Where energy<br/>leaders</span><span className="energy-introduction-accent">Power the future</span></h2>
    <div className="energy-introduction-description">
     <p>Bharat Electricity 2027 will bring the global energy community together to explore India’s advances in the power sector. A platform for industry leaders to address the challenges and opportunities in the energy landscape, and discuss the transition towards a low-carbon future.</p>
     <p>Together, we will exchange insights, build collaborations and shape the path towards a sustainable and resilient energy ecosystem.</p>
    </div>
   </div>
   <div className="energy-introduction-artwork">
    <Image src="/assets/energy-introduction/energy-landscape.webp" alt="" width={1536} height={1024} sizes="(max-width:559px) calc(100vw - 40px), (max-width:900px) 520px, (max-width:1279px) 50vw, 634px" loading="lazy"/>
   </div>
  </div>
 </section>;
}
