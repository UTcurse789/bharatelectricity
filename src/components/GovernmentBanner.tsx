import Image from 'next/image';
import assets from '@/content/header-assets.json';

export function GovernmentBanner() {
 return <div className="government-banner" role="region" aria-label="Government support">
  <div className="government-desktop-wrap wrap"><Image className="government-desktop-art" src={assets.banner.src} width={assets.banner.width} height={assets.banner.height} sizes="(max-width:767px) calc(100vw - 24px), (max-width:1244px) calc(100vw - 64px), 1180px" loading="eager" alt="Supported by Government of India: Ministry of New and Renewable Energy; Ministry of Power; Ministry of Heavy Industries; Economic Diplomacy Division, Ministry of External Affairs; Ministry of Electronics and Information Technology; Ministry of Environment, Forest and Climate Change; and Mission LiFE."/></div>
 </div>;
}
