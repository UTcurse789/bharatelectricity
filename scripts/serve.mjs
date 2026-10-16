import http from 'node:http';import fs from 'node:fs/promises';import {createReadStream} from 'node:fs';import path from 'node:path';import {brotliCompressSync,constants} from 'node:zlib';
const root=path.resolve('out'),port=Number(process.env.PORT||4173);const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4'};
const cache=new Map();
const {redirects:redirectRules}=JSON.parse(await fs.readFile(new URL('../vercel.json',import.meta.url),'utf8'));
const redirects=new Map(redirectRules.map(rule=>[rule.source,rule]));
function redirectLegacyPath(req,res){
 const url=new URL(req.url,'http://localhost'),rule=redirects.get(url.pathname);
 if(!rule)return false;
 res.writeHead(rule.permanent?308:307,{Location:rule.destination+url.search});
 res.end();return true;
}
function serveVideo(req,res,target,size,headers) {
 let start=0,end=size-1;
 if(req.headers.range) {
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if(!match||(!match[1]&&!match[2])) {res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
  if(!match[1]) start=Math.max(0,size-Number(match[2]));
  else {start=Number(match[1]);if(match[2]) end=Math.min(end,Number(match[2]));}
  if(start>=size||start>end||(!match[1]&&Number(match[2])===0)) {res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
  headers['Content-Range']=`bytes ${start}-${end}/${size}`;
 }
 headers['Accept-Ranges']='bytes';
 headers['Content-Length']=end-start+1;
 res.writeHead(req.headers.range?206:200,headers);
 if(req.method==='HEAD') {res.end();return;}
 createReadStream(target,{start,end}).on('error',()=>res.destroy()).pipe(res);
}
http.createServer(async(req,res)=>{try{if(redirectLegacyPath(req,res))return;const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+route);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);res.end();return}let stat=await fs.stat(target).catch(()=>null);if(stat?.isDirectory()){target=path.join(target,'index.html');stat=await fs.stat(target).catch(()=>null)}if(!stat){const missing=await fs.readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Page not found'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:missing);return}const extension=path.extname(target);if(extension==='.mp4'){serveVideo(req,res,target,stat.size,{'Content-Type':'video/mp4','Cache-Control':'public, max-age=86400'});return}const compress=/\.(html|js|css|txt|xml|json|svg)$/.test(target)&&(req.headers['accept-encoding']||'').includes('br');const key=target+':'+stat.mtimeMs+':'+compress;let bytes=cache.get(key);if(!bytes){bytes=await fs.readFile(target);if(compress)bytes=brotliCompressSync(bytes,{params:{[constants.BROTLI_PARAM_QUALITY]:4}});cache.set(key,bytes)}const headers={'Content-Type':mime[extension]||'application/octet-stream','Cache-Control':route.startsWith('/_next/static/')||route.startsWith('/fonts/')||route.startsWith('/assets/carousel/')?'public, max-age=31536000, immutable':route.startsWith('/assets/')?'public, max-age=86400':'no-cache','Vary':'Accept-Encoding'};if(compress)headers['Content-Encoding']='br';res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:bytes)}catch{if(res.headersSent){res.destroy();return;}res.writeHead(500);res.end('Unable to serve request')}}).listen(port,'0.0.0.0',()=>console.log('Preview ready at http://localhost:'+port));
