import {paths} from './site';

export const mediaEnquiriesPath='/media-hub/media';
export const postShowReportForm='https://forms.zohopublic.in/itenmedia1/form/ITENMediaBharatElectricity/formperma/7yd-z5A5Z-NpJ5xZa0scRFP94W_P41_v2Qob4QIEW1w?QueryType=Post%20Show%20Report%20Download&gclid=undefined&utm_source=www.powergen-india.com&utm_medium=referral';
export const mediaPageTitles:Record<string,{title:string;intro:string}>={
 [mediaEnquiriesPath]:{title:'Media Enquiries',intro:'Connect with the team for media partnerships, press accreditation, interviews and event information.'},
 [paths.report]:{title:'2026 Post-show Report',intro:'Revisit the technology, business conversations and industry connections from the 2026 event.'}
};
export const mediaSectionLinks=[['News & Press',paths.news],['Photo Gallery',paths.gallery],['Video Gallery',paths.video],['Media Enquiries',mediaEnquiriesPath],['Post Show Report',paths.report]];
export const mediaPartnershipBenefits=[
 'Exposure through integrated marketing campaigns, including direct mail, email, trade advertising, PR, online and social media.',
 'Communications to the event database, connecting with attendees from established industry events.',
 'Brand visibility and awareness through a presence at the exhibition.',
 'Press accreditation for conference access and conversations with the energy community.'
];
