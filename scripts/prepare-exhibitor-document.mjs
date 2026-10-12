import fs from 'node:fs/promises';
import {load} from 'cheerio';

// Read-only extraction of the user's Word document. Never execute embedded HTML.
const source=JSON.parse((await fs.readFile('research/document-source/structured.json','utf8')).replace(/^\uFEFF/,''));
// The Word file uses bold throughout. These are its actual internal subheadings.
const subheadings=new Set([120,128,132,159,160,186,188,190,191,193,199,201,209,214,216,218,221,223,226,228,230,232,236,239,245,249,260,262,264,266,268,270,272]);
const paragraphs=source.paragraphs.map(p=>{
 return {index:p.index,text:p.text,bullet:!!p.numberingId,heading:subheadings.has(p.index),images:p.images};
});
const range=(first,last)=>paragraphs.filter(p=>p.index>=first&&p.index<=last&&(p.text.trim()||p.images.length));
const frames=source.paragraphs.filter(p=>p.text.includes('<iframe')).map(p=>{
 const $=load(p.text),frame=$('iframe');
 const src=frame.attr('src');
 if(!src?.startsWith('https://forms.zohopublic.in/'))throw new Error('Unexpected form source');
 return {title:source.paragraphs[p.index-1].text,src,height:frame.attr('style')?.includes('650px')?650:600};
});
const forms=[...new Map(frames.map(f=>[f.src,f])).values()];
const orderForms=source.paragraphs.filter(p=>p.links.length).map((p,i)=>{
 const label=p.text.split(/CLICK HERE|DOMESTIC/)[0].trim().replace(/\s+/g,' ');
 return {number:i+1,label,links:p.links.map(l=>({label:l.label.trim().replace(/\s+/g,' '),href:l.href}))};
});
const data={sourceFile:source.sourceFile,edition:2026,forms,
 introduction:range(27,28),
 schedules:[[29,33],[34,37],[38,49],[50,58]].map(([a,b])=>({id:'schedule-'+a,title:paragraphs[a].text,paragraphs:range(a+1,b)})),
 notes:{title:paragraphs[59].text,paragraphs:range(60,70)},
 contacts:[[72,74],[75,77],[78,80],[81,82]].map(([a,b])=>({title:paragraphs[a].text,paragraphs:range(a+1,b)})),
 construction:[[85,109],[110,123],[127,163],[166,182],[185,237],[238,257],[259,273]].map(([a,b],i)=>({id:'construction-'+(i+1),title:paragraphs[a].text,paragraphs:range(a+1,b)})),
 images:[{id:'rId5',src:'/assets/manual-2026/image1.jpeg',alt:'Shell scheme furniture and electrical inclusions by stand area'},{id:'rId6',src:'/assets/manual-2026/image2.png',alt:'Shell scheme stand diagram, fascia, wall panels and counter dimensions'}],
 shellSchemeRows:[[9,1,3,3,1,1],[12,1,3,4,1,1],[15,1,5,5,1,1],[18,2,6,6,2,2],[21,2,6,7,2,2],[24,2,6,8,2,2],[27,3,9,9,2,2],[30,3,9,10,2,2],[36,4,12,12,3,3]],
 orderForms
};
if(forms.length!==6||orderForms.length!==15||orderForms.flatMap(f=>f.links).length!==19)throw new Error('Document extraction incomplete');
await fs.writeFile('src/content/exhibitor-document.json',JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({uniqueForms:forms.length,orderForms:orderForms.length,orderLinks:19,manualParagraphs:[...data.introduction,...data.schedules.flatMap(s=>s.paragraphs),...data.notes.paragraphs,...data.contacts.flatMap(c=>c.paragraphs),...data.construction.flatMap(c=>c.paragraphs)].length}));
