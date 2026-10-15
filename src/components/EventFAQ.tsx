import Link from 'next/link';
import {eventFaq,eventSummary} from '@/content/event-faq';
import './EventFAQ.css';

export function EventFAQ(){return <section className="section wrap event-faq" aria-labelledby="event-faq-heading">
 <div className="event-faq-intro"><p className="eyebrow">Plan your participation</p><h2 id="event-faq-heading">Bharat Electricity 2027: key information</h2><p>{eventSummary}</p></div>
 <div className="event-faq-questions">{eventFaq.map(item=><details key={item.question}><summary>{item.question}</summary><div><p>{item.answer}</p>{item.links.length>0&&<div className="event-faq-links">{item.links.map(link=><Link key={link.href} href={link.href} className="text-link">{link.label}<span aria-hidden="true"> ↗</span></Link>)}</div>}</div></details>)}</div>
 </section>;}
