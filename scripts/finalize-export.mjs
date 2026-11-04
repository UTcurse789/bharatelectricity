import fs from 'node:fs/promises';import path from 'node:path';let aliases=0;async function visit(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(!e.isDirectory())continue;if(e.name.startsWith('__next.')){async function flatten(current){for(const f of await fs.readdir(current,{withFileTypes:true})){const file=path.join(current,f.name);if(f.isDirectory())await flatten(file);else if(f.name.endsWith('.txt')){const rel=path.relative(dir,file).split(path.sep).join('.');await fs.copyFile(file,path.join(dir,rel));aliases++;}}}await flatten(p);}else await visit(p);}}await visit('out');console.log(JSON.stringify({staticPrefetchAliases:aliases}));

// Static hosts may not read Vercel redirects. Keep legacy URLs compatible there too.
const routeMoves=JSON.parse(await fs.readFile('src/content/url-migrations.json','utf8'));
const staticRouteRedirects={...routeMoves,'/exhibitors':'/participants','/participants-2026':'/participants?year=2026','/participants-2025':'/participants?year=2025','/exhibitor-list':'/participants?year=2025','/2024-exhibitors':'/participants?year=2024'};
let migrated=0;
for(const [previous,destination] of Object.entries(staticRouteRedirects)){
 const file=path.join('out',previous.slice(1),'index.html');
 const html=await fs.readFile(file,'utf8').catch(()=>null);
 if(!html)continue;
 const target=destination.includes('?')?destination.replace('?', '/?'):destination+'/';
 const refresh='<meta http-equiv="refresh" content="0;url='+target.replaceAll('&','&amp;')+'"/>';
 await fs.writeFile(file,html.replace('</head>',refresh+'</head>'));migrated++;
}
console.log(JSON.stringify({staticRouteRedirects:migrated}));
