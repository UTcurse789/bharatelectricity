'use client';

import {useState} from 'react';
import Link from 'next/link';
import {MagnifyingGlass} from '@phosphor-icons/react';
import {ContentRail} from './ContentRail';
import {ExhibitorCard} from './Directories';
import {Portrait} from './Shared';
import type {Company, Participation, Person, Appearance} from '@/content/types';

type Exhibitor = Company & Participation;
type Member = Person & Appearance;

function Search({label, query, setQuery, count, total}: {label: string; query: string; setQuery: (value: string) => void; count: number; total: number}) {
 return <div className="home-directory-tools"><label className="home-directory-search"><span>Search {label}</span><div><MagnifyingGlass size={20} aria-hidden="true"/><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={label === 'companies' ? 'Company name or stand number' : 'Name or organisation'}/></div></label><p role="status">{query ? `${count} of ${total}` : total} {label}</p>{query && <button type="button" className="text-button" onClick={() => setQuery('')}>Clear search</button>}</div>;
}

export function HomeCompanies({items}: {items: Exhibitor[]}) {
 const [query, setQuery] = useState('');
 const results = items.filter(item => (item.name + ' ' + (item.stand || '')).toLowerCase().includes(query.trim().toLowerCase()));
 return <><Search label="companies" query={query} setQuery={setQuery} count={results.length} total={items.length}/>{results.length ? <ContentRail key={query} label="participating companies" className="company-rail" deferUntilVisible>{results.map(item => <ExhibitorCard item={item} key={item.id}/>)}</ContentRail> : <p className="home-directory-empty">No matching companies. Try another name or clear your search.</p>}</>;
}

export function HomePeople({items, council = false}: {items: Member[]; council?: boolean}) {
 return <ContentRail label={council ? 'governing council members' : 'speakers'} className={council ? 'council-rail' : 'speaker-rail'} deferUntilVisible>{items.map(person => <Link className="person-card" href={'/speakers/' + person.id} key={person.id}><Portrait src={person.photo} name={person.name}/><p className="person-role">{person.edition} / {person.role}</p><h3>{person.name}</h3><p>{person.designation}</p><span className="person-link">View profile ↗</span></Link>)}</ContentRail>;
}
