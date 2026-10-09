import Image from 'next/image';
import assets from '@/content/header-assets.json';

export function GovernmentBanner() {
 return <div className="government-banner" role="region" aria-label="Government support">
  <Image src={assets.banner.src} width={assets.banner.width} height={assets.banner.height} sizes="(max-width:1440px) 100vw, 1400px" preload fetchPriority="high" alt="Supported by Government of India: Ministry of New and Renewable Energy; Ministry of Power; Ministry of Heavy Industries; Economic Diplomacy Division, Ministry of External Affairs; Ministry of Electronics and Information Technology; Ministry of Environment, Forest and Climate Change; and Mission LiFE."/>
 </div>;
}
