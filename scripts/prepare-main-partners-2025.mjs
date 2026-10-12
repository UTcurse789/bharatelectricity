import fs from 'node:fs/promises';
import sharp from 'sharp';

const upgrades = JSON.parse(await fs.readFile('src/content/partner-artwork-upgrades.json', 'utf8'));
const board = upgrades.find(item => /14-10-2025-partners/.test(item.source));
const rows = [
 [['GE Vernova','Diamond Partner'],['ISGEC','Gold Partners'],['Suzlon','Gold Partners']],
 [['Polycab','Safety Partner'],['NTPC','Industry Partner'],['ReNew','Decarbonisation Partner']],
 [['BSES Rajdhani Power Limited','Host Utilities'],['BSES Yamuna Power Limited','Host Utilities'],['Kreate','VIP Elite Lounge Partner']],
 [['GE Vernova','Delegate Kit Partner'],['Envision','Registration Desk Partner'],['nasscom IT-ITeS SSC and FutureSkills Prime','National Digital Skilling Partner']],
 [['Grid India','Associate Partners'],['Force MTU','Associate Partners'],['Woodward','Associate Partners']],
 [['Indian Gas Exchange','Exchange Partners'],['Indian Energy Exchange','Exchange Partners'],['MCX','Exchange Partners']],
 [['Council on Energy, Environment and Water','Knowledge Partners'],['The Energy and Resources Institute','Knowledge Partners'],['U.S.-India Business Council','Knowledge Partners']]
];
const tops = [150, 620, 1080, 1550, 1990, 2460, 2910];
const lefts = [72, 738, 1406];
const heights = [250,230,230,230,230,230,225];
await fs.mkdir('public/assets/partners-2025', {recursive:true});
const records = [];
for (const [row, entries] of rows.entries()) for (const [column, [name, role]] of entries.entries()) {
 const src = `/assets/partners-2025/main-${row+1}-${column+1}.webp`;
 const width=column===2?510:520, height=heights[row];
 await sharp('public' + board.src).extract({left:lefts[column],top:tops[row],width,height}).webp({lossless:true}).toFile('public'+src);
 records.push({name,role,src,width,height,source:board.source,file:`2025-${row}-${column}`});
}
await fs.writeFile('src/content/main-partners-2025.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({mainPartnerArtwork:records.length}));
