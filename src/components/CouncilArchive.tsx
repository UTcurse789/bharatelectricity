'use client';
import Image from 'next/image';
import {useMemo,useState} from 'react';
import council from '@/content/council-2024.json';

export function CouncilArchive() {
 const [query,setQuery]=useState('');
 const members=useMemo(()=>council.members.filter(member=>(member.name+' '+member.position+' '+member.organisation).toLowerCase().includes(query.trim().toLowerCase())),[query]);
 return <section className="council-archive">
  <div className="archive-tools"><label><span>Search council members</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Name or organisation"/></label><a className="button secondary" href="/downloads/governing-council-2024.html" target="_blank" rel="noreferrer">Complete Council 2024 record</a></div>
  <p role="status">{members.length} of {council.members.length} council members · 2024</p>
  <div className="council-archive-grid">{members.map(member=><article key={member.name} className="council-archive-member">
   <div className="council-archive-photo"><Image src={member.photo} alt={member.name} width={400} height={400} sizes="(max-width:767px) 80vw, 280px"/></div>
   <p className="person-role">2024 / {member.role}</p><h2>{member.name}</h2><p>{member.position}</p>{member.organisation&&<p>{member.organisation}</p>}
  </article>)}</div>
  {!members.length&&<p>No matching council members. Try another name or organisation.</p>}
 </section>;
}
