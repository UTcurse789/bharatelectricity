'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {MagnifyingGlass} from '@phosphor-icons/react';
import {LogoImage} from './LogoImage';

type Entry={id?:string;name?:string;logo:string;stand?:string|null};
export function ExhibitionCompanies({items,year}:{items:Entry[];year:number}){
 const [query,setQuery]=useState(''),[limit,setLimit]=useState(24);
 const searchable=items.every(x=>!!x.name);
 const results=useMemo(()=>items.filter(x=>((x.name||'')+' '+(x.stand||'')).toLowerCase().includes(query.trim().toLowerCase())),[items,query]);
 const reset=()=>{setQuery('');setLimit(24);};
 return <div className="exhibition-company-directory">
  {searchable&&<div className="exhibition-search"><label htmlFor={'company-search-'+year}>Search Participants {year}</label><div><MagnifyingGlass size={20} aria-hidden="true"/><input id={'company-search-'+year} type="search" placeholder="Company name or stand number" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}}/></div><button className="text-button" onClick={reset}>Reset search</button></div>}
  <p className="exhibition-result-count" role="status">{results.length} {searchable?'companies':'published participant logos'}</p>
  {results.length?<><div className="exhibition-company-grid">{results.slice(0,limit).map((item,i)=>{const content=<><div className="exhibition-company-logo">{item.logo?<LogoImage src={item.logo} alt={item.name||year+' published participant logo '+(i+1)} maxWidth={180} maxHeight={85}/>:<span>Logo not supplied</span>}</div>{item.name&&<div className="exhibition-company-copy"><p>{year} edition{item.stand&&' / Stand '+item.stand}</p><h3>{item.name}</h3>{item.id&&<span className="exhibition-card-link">View company <span aria-hidden="true">↗</span></span>}</div>}</>;return item.id?<Link className="exhibition-company-card" href={'/exhibitors/'+item.id} key={item.id}>{content}</Link>:<article className="exhibition-company-card" key={item.name||item.logo}>{content}</article>;})}</div>{limit<results.length&&<div className="exhibition-more"><button className="button secondary" onClick={()=>setLimit(limit+24)}>Show more {searchable?'companies':'logos'}</button><span>Showing {Math.min(limit,results.length)} of {results.length}</span></div>}</>:<div className="exhibition-empty"><h2>No matching companies</h2><p>Try another name or clear your search.</p><button className="button secondary" onClick={reset}>Clear search</button></div>}
 </div>;
}
