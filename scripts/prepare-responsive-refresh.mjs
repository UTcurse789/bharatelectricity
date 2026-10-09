import fs from 'node:fs/promises';import sharp from 'sharp';
for(const name of ['raw-space','shell-scheme'])for(const width of [160,320,480,768,1200,1800])await sharp('public/assets/site-refresh/'+name+'.webp').resize({width,withoutEnlargement:true}).webp({quality:80}).toFile('public/assets/site-refresh/'+name+'-'+width+'.webp');
await sharp('public/assets/bharat-electricity-2027-poster.jpg').resize({width:1600,withoutEnlargement:true}).webp({quality:80}).toFile('public/assets/bharat-electricity-2027-poster.webp');
for(const width of [160,320,480,768,1200,1800])await sharp('public/assets/bharat-electricity-2027-poster.jpg').resize({width,withoutEnlargement:true}).webp({quality:78}).toFile('public/assets/bharat-electricity-2027-poster-'+width+'.webp');
await sharp('public/assets/bharat-electricity-logo.webp').resize({width:780,withoutEnlargement:true}).webp({quality:88}).toFile('public/assets/bharat-electricity-logo-compact.webp');
