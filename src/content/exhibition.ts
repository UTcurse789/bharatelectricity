import {paths} from './site';
import exhibitorDocument from './exhibitor-document.json';

export const exhibitionPaths={
 why:paths.exhibit,who:'/exhibit-at-powergen-india/who-exhibits-at-powergen-india',previous:'/exhibit-at-powergen-india/previous-attendees',stands:paths.stands,
 enquiry:'/exhibit-at-powergen-india/make-a-stand-enquiry',reserve:'/space-application-form',floor:'/exhibit-at-powergen-india/view-the-floor-plan-92u6',brochure:'/exhibit-at-powergen-india/request-the-event-prospectus',partnership:'/request-the-partnership-brochure',network:'/visiting/networking'
};
export const exhibitionLinks=[['Why Exhibit',exhibitionPaths.why],['Who Exhibits',exhibitionPaths.who],['Previous Attendees',exhibitionPaths.previous],['Stand Options',exhibitionPaths.stands],['Participants',paths.exhibitors],['Exhibitor Manual',paths.manual]];
export const visitorLinks=[['Why Visit',paths.visit],['Participants',paths.exhibitors],['Networking',exhibitionPaths.network],['Register',paths.registration],['Venue & Travel',paths.venue]];
export const participantYears=[{year:2026,href:paths.exhibitors},{year:2025,href:'/participants-2025'},{year:2024,href:'/2024-exhibitors'}];

export const exhibitSectors=[
 {name:'Generation & equipment',items:['Turbines, boilers & steam generator suppliers','Generation technology & component vendors','Diesel / gas engine manufacturers','CSP equipment companies','Nuclear plant equipment & services','Hydro turbines & component vendors','Wind turbines & component providers','Biomass application & equipment suppliers','PV equipment providers','Back-up power systems & inverter suppliers']},
 {name:'Grids, utilities & storage',items:['Transmission & distribution','Microgrids','Metering','AMI infrastructure','Solar control systems','Solar control systems technology','Renewable integration','Energy storage','Energy storage companies','Future energy systems']},
 {name:'Digital energy & intelligence',items:['Blockchain trading systems','CRM & billing','Customer engagement','Geospatial information systems','Virtual power plants','Predictive analytics','Digital transformation','Cloud solutions','Artificial intelligence','Internet of Things (IoT)']},
 {name:'Services, operations & project delivery',items:['Field service management','Mobility transformation','Energy services & energy management','Energy efficiency','Maintenance & asset management','Measurement, controls & tracking systems','Power plant / asset management','Developers & consulting engineers','EPC contractors','Energy transition consultants','Asset management']}
];
export const attendeeTypes=['Utilities','Municipalities','Power producers','EPCs','Commercial & industrial energy users','Developers','Investors & financiers','Consultancies','Policymakers','Regulators','Distributors & resellers','OEMs','Solution providers'];

const zohoBase='https://forms.zohopublic.in/itenmedia1/form/ITENMediaBharatElectricity/formperma/7yd-z5A5Z-NpJ5xZa0scRFP94W_P41_v2Qob4QIEW1w';
export const zohoForms={
 brochure:exhibitorDocument.forms[0].src,
 floor:exhibitorDocument.forms[1].src,
 exhibit:exhibitorDocument.forms[2].src,
 partnership:zohoBase+'?QueryType=Partnership%20Brochure%20Download'
};
export const exhibitionTitles:Record<string,{title:string;intro:string;visitor?:boolean}>={
 [exhibitionPaths.why]:{title:'Why Exhibit?',intro:'Bring your technology, expertise and business to the people shaping India’s power and utility sector.'},
 [exhibitionPaths.who]:{title:'Who Exhibits',intro:'Explore the suppliers, technologies and services represented across the complete energy value chain.'},
 [exhibitionPaths.previous]:{title:'Previous Attendees',intro:'Discover the utilities, power producers and energy organisations featured in the organiser’s historical attendee records.'},
 [exhibitionPaths.stands]:{title:'Stand Options',intro:'Choose a stand format that fits your brand, your technology and the conversations you want to create.'},
 [exhibitionPaths.enquiry]:{title:'Make a Stand Enquiry',intro:'Tell the exhibition team about your products, preferred stand format and participation goals.'},
 [exhibitionPaths.reserve]:{title:'Reserve Your Space',intro:'Start a conversation about exhibition space and discuss your requirements with the sales team.'},
 [exhibitionPaths.floor]:{title:'Request the Floor Plan',intro:'Ask the team for the latest approved floor plan and discuss a location that works for your business.'},
 [exhibitionPaths.brochure]:{title:'Request the Event Brochure',intro:'Explore exhibition, summit and participation opportunities with Bharat Electricity.'},
 [exhibitionPaths.partnership]:{title:'Request the Partnership Brochure',intro:'Explore brand visibility, thought leadership and opportunities to connect with the energy community.'},
 [paths.manual]:{title:'Exhibitor Manual',intro:'Revisit the published 2026 exhibitor guidance, schedules and stand planning information.'},
 [paths.exhibitors]:{title:'Participants 2026',intro:'Explore the published companies and stand allocations from the completed 2026 edition.'},
 '/participants-2025':{title:'Participants 2025',intro:'Explore the complete published participant archive for the 2025 edition.'},
 '/2024-exhibitors':{title:'Participants 2024',intro:'Browse the participant logos published for the 2024 exhibition.'},
 [paths.visit]:{title:'Why Visit?',intro:'Discover energy technology, meet industry professionals and explore the ideas connecting the power and utility sectors.',visitor:true},
 [paths.registration]:{title:'Register',intro:'Find registration information for visitors and summit delegates.',visitor:true},
 [paths.venue]:{title:'Venue & Travel',intro:'Yashobhoomi (IICC), Dwarka, New Delhi hosted the completed 2026 edition.',visitor:true},
 [exhibitionPaths.network]:{title:'Networking',intro:'Make connections across the energy community, from the exhibition floor to industry conversations.',visitor:true},
 [paths.contact]:{title:'Contact Us',intro:'Talk to the team about exhibiting, partnerships, speaking or your next visit.'}
};
