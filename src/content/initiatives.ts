import {paths} from './site';
import type {ContentPage} from './types';

export const initiatives = [
 {
  slug:'nuclearx', name:'NuclearX', title:'Global Forum on Nuclear Investment',
  intro:'Civil nuclear energy, investment and strategic partnerships.',
  description:"NuclearX is a platform for advancing investment in India's civil nuclear sector, aligned with the country's ambition to achieve 100 GW of nuclear power capacity by 2047. It brings together policymakers, global nuclear companies, investors, financial institutions and technology providers to explore financing opportunities, technology collaboration and partnerships.",
  topics:['Nuclear investment','SMRs and advanced technologies','Policy and regulation','Global partnerships'],
  question:'How can India mobilise investment, technology and partnerships for civil nuclear expansion?',
  artwork:{src:'/assets/initiatives/nuclearx.png',width:362,height:258,alt:'NuclearX 2026: The Global Nuclear Investment Forum'}
 },
 {
  slug:'financex', name:'FinanceX', title:'Energy Finance and Investment',
  intro:'Mobilising capital for energy infrastructure and the energy transition.',
  description:"FinanceX addresses the financing requirements of India's evolving energy sector by connecting project developers, utilities, banks, institutional investors, multilateral development institutions and financial service providers. The platform explores how capital can be mobilised for conventional and renewable power, grid modernisation and emerging energy technologies.",
  topics:['Project finance','Green finance','Infrastructure investment','Risk mitigation','Innovative financing models'],
  question:'How can energy infrastructure and transition projects secure the capital they need?',
  artwork:{src:'/assets/initiatives/financex.png',width:400,height:97,alt:'FinanceX: The Energy Capital Platform'}
 },
 {
  slug:'storagex', name:'StorageX', title:'Energy Storage and Grid Flexibility',
  intro:'Scaling energy storage to support reliable, flexible and renewable-powered electricity systems.',
  description:"StorageX focuses on the technologies, business models and policies needed to integrate energy storage into India's power system. It provides a platform for battery manufacturers, storage developers, utilities, technology companies and investors to discuss the role of storage in balancing renewable generation and meeting peak demand.",
  topics:['Battery energy storage systems (BESS)','Pumped storage','Grid balancing','Long-duration storage','Storage economics'],
  question:'How can energy storage improve grid flexibility, reliability and renewable integration?',
  artwork:{src:'/assets/initiatives/storagex.jpeg',width:600,height:335,alt:'StorageX: The Energy Storage Platform'}
 },
 {
  slug:'transitionx', name:'TransitionX', title:'Energy Transition and Startup Innovation',
  intro:'Accelerating the adoption and commercialisation of emerging clean-energy solutions.',
  description:'TransitionX provides a platform for startups, innovators, technology companies, investors and industry leaders to showcase solutions that can accelerate the energy transition. It can help bridge the gap between promising technologies and commercial deployment through industry engagement, partnerships and investment opportunities.',
  topics:['Energy-transition startups','Clean technology','Green hydrogen','Decarbonisation','Innovation and commercialisation'],
  question:'How can emerging technologies and startups accelerate the energy transition?',
  artwork:{src:'/assets/initiatives/transitionx.png',width:358,height:121,alt:'TransitionX: The Energy Startup Arena'}
 }
];

export const initiativeOverview = 'The four platforms complement one another within the broader energy ecosystem, while aligning with the integrated approach of Bharat Electricity Global Energy Forum.';

const startupPage:ContentPage = {
 path:paths.startups,title:'Startups',intro:'A place for emerging energy businesses to explore exhibition, speaking and partnership opportunities.',category:'New Initiatives',kind:'initiative',
 sections:[{title:'Explore startup opportunities',body:'Discuss these areas with the Bharat Electricity team.',items:['Showcase emerging energy solutions','Connect with utilities and technology companies','Discuss startup participation with the event team']},{title:'Get involved',body:'Contact the team about exhibiting, sharing expertise or partnering. Programme details and participation arrangements will be confirmed by the organiser.',link:{label:'Explore Speaking Opportunities',href:paths.speaking}}]
};

export const initiativePages:ContentPage[] = [
 {path:paths.initiatives,title:'New Initiatives',intro:'Four platforms connecting investment, finance, storage and innovation within Bharat Electricity Global Energy Forum.',category:'New Initiatives',kind:'initiatives',sections:[]},
 ...initiatives.map(initiative=>({path:paths.initiatives+'/'+initiative.slug,title:initiative.name,intro:initiative.intro,category:'New Initiatives',kind:'initiative',sections:[]})),
 startupPage
];

// Consolidated pages remain available at earlier URLs in the static export.
export const consolidatedRoutes:Record<string,string> = {
 '/speaking-opportunities':paths.speaking,
 '/summit-overview/speaking-opportunities':paths.speaking,
 '/summit-overview/speaking-opportunities-bharat-electricity':paths.speaking,
 '/summit-overview/speaking-opportunities-indian-utility-week':paths.speaking,
 '/become-sponsor-indian-utility-week':paths.partnership,
};
