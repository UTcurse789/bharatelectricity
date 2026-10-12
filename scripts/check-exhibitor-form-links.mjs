import fs from 'node:fs/promises';
const data=JSON.parse(await fs.readFile('src/content/exhibitor-document.json','utf8'));
const urls=[...new Set([...data.forms.map(f=>f.src),...data.orderForms.flatMap(f=>f.links.map(l=>l.href))])];
const results=[];
for(let i=0;i<urls.length;i+=4){
 const batch=await Promise.allSettled(urls.slice(i,i+4).map(async url=>{
  const response=await fetch(url,{signal:AbortSignal.timeout(25000)});
  const body=await response.text();
  return {url,status:response.status,finalUrl:response.url,formMarkup:/<form\b|zf_[A-Za-z]|zohoforms|formperma/i.test(body),frameRestriction:response.headers.get('x-frame-options'),contentLength:body.length};
 }));
 batch.forEach((r,j)=>results.push(r.status==='fulfilled'?r.value:{url:urls[i+j],error:r.reason.message}));
 console.log(JSON.stringify({checked:results.length,total:urls.length}));
}
await fs.mkdir('research/qa/exhibitor-document',{recursive:true});
await fs.writeFile('research/qa/exhibitor-document/hosted-links.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({total:results.length,successful:results.filter(r=>r.status===200).length,issues:results.filter(r=>r.status!==200)}));
