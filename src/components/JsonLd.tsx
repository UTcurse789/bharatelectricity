export function JsonLd({id,data}:{id:string;data:unknown}) {
 const json=JSON.stringify(data);
 if(!json)return null;
 return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{__html:json.replace(/</g,'\\u003c')}}/>;
}
