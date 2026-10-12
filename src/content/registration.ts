import {paths} from './site';
import type {ContentPage} from './types';

export const registrationPaths = {hub:paths.registration,visitor:'/visitor-registration',delegate:'/summit-overview/register',booking:'/space-application-form'};
// Add the organiser's new, approved form URLs here when provided.
export const visitorWidgetUrl='https://konfhub.com/widget/bharat-electricity-powergen-india-indian-utility-week-2026?desc=false&secondaryBg=F7F7F7&ticketBg=F7F7F7&borderCl=F7F7F7&bg=FFFFFF&fontColor=1e1f24&ticketCl=1e1f24&btnColor=002E6E&fontFamily=Hind&borderRadius=10&widget_type=quick&screen=2&tickets=114966&ticketId=114966%7C0';
export const registrationFormLinks:{indianVisitor:string|null;internationalVisitor:string|null;indianDelegate:string|null;internationalDelegate:string|null;indianStudentDelegate:string|null;internationalStudentDelegate:string|null;exhibition:string|null} = {
 indianVisitor:visitorWidgetUrl,internationalVisitor:visitorWidgetUrl,indianDelegate:null,internationalDelegate:null,indianStudentDelegate:null,internationalStudentDelegate:null,exhibition:null
};
export const registrationOptions = [
 {title:'Visitor Registration',description:'Visit the exhibition, meet suppliers and explore power and energy technologies.',href:registrationPaths.visitor,image:'/assets/exhibition-2025-063.webp',alt:'Visitors meeting exhibitors at the 2025 exhibition',action:'Visitor registration options'},
 {title:'Delegate Registration',description:'Explore summit participation, delegate passes and group registration enquiries.',href:registrationPaths.delegate,image:'/assets/inaugurations/2025-8.webp',alt:'Industry leaders at the 2025 conference inauguration',action:'Delegate registration options'},
 {title:'Exhibition Space Booking',description:'Discuss exhibition space, stand formats and participation requirements with the team.',href:registrationPaths.booking,image:'/assets/exhibition-2025-082.webp',alt:'Power equipment displayed at the 2025 exhibition',action:'Exhibition space booking form'}
];
export const registrationPages:ContentPage[] = [
 {path:registrationPaths.visitor,title:'Visitor Registration 2026',intro:'Visitor access information for Indian and international attendees, with the organiser-supplied KonfHub form for the completed 2026 edition.',category:'Register',kind:'visitor-registration',sections:[]},
 {path:registrationPaths.delegate,title:'Delegate Registration',intro:'Explore summit registration for Indian and international delegates, group bookings and exhibitor delegates.',category:'Register',kind:'delegate-registration',sections:[]},
 {path:registrationPaths.booking,title:'Exhibition Space Booking',intro:'Find the right exhibition space for your organisation and discuss stand options with the organising team.',category:'Register',kind:'exhibition-booking',sections:[]}
];
