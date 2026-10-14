import {paths,site} from './site';
import type {ContentPage} from './types';

export const editionRecords=[
 {year:2026,dates:site.edition.dates,council:paths.council,participants:paths.exhibitors,speakers:'/2026-speakers',partners:paths.partners},
 {year:2025,dates:'2-4 September 2025',council:'/governing-council-2025',participants:'/participants-2025',speakers:paths.speakers,partners:'/partners-2025'},
 {year:2024,dates:'4-6 September 2024',council:'/meet-our-confirm-advisory-committee',participants:'/2024-exhibitors',speakers:'/2024-speakers',partners:'/partner/partner-e6vb'}
];
export const editionStatus=(year:number)=>year===site.edition.year?'Latest edition'+(site.edition.status==='completed'?' · Complete':''):'Previous edition archive';
export const editionPages:ContentPage[]=[
 ...editionRecords.map(edition=>({path:'/editions/'+edition.year,title:'Bharat Electricity '+edition.year,intro:edition.dates+' at Yashobhoomi (IICC), New Delhi. Explore the council, participants, photographs and available programme records for this edition.',category:'Edition archive',edition:edition.year,kind:'edition',sections:[]})),
 {path:'/participants-2025',title:'Participants 2025',intro:'Participant names from the organiser’s published 2025 archive. Historical stand allocations are awaiting confirmation.',category:'Exhibition',edition:2025,kind:'participants-archive',sections:[]},
 {path:'/2026-speakers',title:'Speakers 2026',intro:'Explore the speaker directory by name or organisation. The available profiles are from the 2025 edition; 2026 speakers will be added when confirmed.',category:'Conference',edition:2026,kind:'speakers-directory',sections:[]},
 {path:'/2024-speakers',title:'Speakers 2024',intro:'Speaker information for the 2024 edition.',category:'Conference',edition:2024,kind:'speakers-years',sections:[{title:'2024 speakers',body:'The approved 2024 speaker list will be added here when supplied by the organiser.'}]},
 {path:'/meet-our-confirm-advisory-committee',title:'Governing Council 2024',intro:'All 27 members in the organiser’s published 2024 council record. Names and historical designations are displayed together with the corresponding portrait.',category:'Governing Council',edition:2024,kind:'council-archive',sections:[]}
];
