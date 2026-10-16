import {paths} from './site';
import type {ContentPage} from './types';
import {zohoFormUrls} from './zoho-forms';

export const registrationPaths = {hub:paths.registration,visitor:'/visitor-registration',delegate:'/summit-overview/register',booking:'/space-application-form'};
export const registrationThankYouPath='/thankyou-for-registrating-in-bharatelectricity2027';
export const visitorRegistrationFormUrl=zohoFormUrls.visitor;
export const registrationFormLinks:{indianVisitor:string|null;internationalVisitor:string|null;indianDelegate:string|null;internationalDelegate:string|null;indianStudentDelegate:string|null;internationalStudentDelegate:string|null;exhibition:string|null} = {
 indianVisitor:zohoFormUrls.visitor,internationalVisitor:zohoFormUrls.visitor,indianDelegate:zohoFormUrls.delegate,internationalDelegate:zohoFormUrls.delegate,indianStudentDelegate:zohoFormUrls.delegate,internationalStudentDelegate:zohoFormUrls.delegate,exhibition:zohoFormUrls.exhibit
};
export const registrationOptions = [
 {title:'Visitor Registration',description:'Visit the exhibition, meet suppliers and explore power and energy technologies.',href:registrationPaths.visitor,image:'/assets/exhibition-2025-063.webp',alt:'Visitors meeting exhibitors at the 2025 exhibition',action:'Visitor registration options'},
 {title:'Delegate Registration',description:'Explore summit participation, delegate passes and group registration enquiries.',href:registrationPaths.delegate,image:'/assets/inaugurations/2025-8.webp',alt:'Industry leaders at the 2025 conference inauguration',action:'Delegate registration options'},
 {title:'Exhibition Space Booking',description:'Discuss exhibition space, stand formats and participation requirements with the team.',href:registrationPaths.booking,image:'/assets/exhibition-2025-082.webp',alt:'Power equipment displayed at the 2025 exhibition',action:'Exhibition space booking form'}
];
export const registrationPages:ContentPage[] = [
 {path:registrationPaths.visitor,title:'Visitor Registration 2027',intro:'Register your interest in visiting Bharat Electricity 2027 using the organiser’s visitor registration form.',category:'Register',kind:'visitor-registration',sections:[]},
 {path:registrationPaths.delegate,title:'Delegate Registration',intro:'Explore summit registration for Indian and international delegates, group bookings and exhibitor delegates.',category:'Register',kind:'delegate-registration',sections:[]},
 {path:registrationPaths.booking,title:'Exhibition Space Booking',intro:'Find the right exhibition space for your organisation and discuss stand options with the organising team.',category:'Register',kind:'exhibition-booking',sections:[]}
];
