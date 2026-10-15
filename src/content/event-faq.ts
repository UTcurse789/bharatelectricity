import {site,paths} from './site';
import {registrationPaths} from './registration';

export const eventSummary=`Bharat Electricity 2027 is a power and energy exhibition and summit taking place on ${site.nextEdition.dates} at ${site.nextEdition.venue}, ${site.nextEdition.location}, India.`;
export const eventFaq=[
 {question:'What is Bharat Electricity?',answer:'Bharat Electricity is an exhibition and summit for India’s power, electricity and energy ecosystem. It connects technology suppliers, utilities, policymakers and industry professionals.',links:[{label:'About the event',href:paths.about}]},
 {question:'When is Bharat Electricity 2027?',answer:`The next edition takes place on ${site.nextEdition.dates}.`,links:[]},
 {question:'Where is the event held?',answer:`Bharat Electricity 2027 takes place at ${site.nextEdition.venue}, ${site.nextEdition.location}, India.`,links:[]},
 {question:'How can I register as a visitor or delegate?',answer:'Use the visitor or delegate registration page to open the organiser’s dedicated 2027 registration form.',links:[{label:'Visitor registration',href:registrationPaths.visitor},{label:'Delegate registration',href:registrationPaths.delegate}]},
 {question:'How can my company apply for exhibition space?',answer:'The exhibition space booking page has separate application forms for Indian companies, international companies, startups and MSMEs. Select your company category and complete the organiser’s form.',links:[{label:'Apply for exhibition space',href:registrationPaths.booking}]},
 {question:'Who organises Bharat Electricity?',answer:'Bharat Electricity is organised by the Energy & Climate Initiatives Society (ENCIS) and ITEN Media.',links:[{label:'Meet the organisers',href:'/event/organiser'}]}
];
