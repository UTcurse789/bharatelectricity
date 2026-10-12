import homepage from './homepage-partners.json';
import imported from './imported.json';
import upgrades from './partner-artwork-upgrades.json';
import type {PartnerGroup} from '@/components/PartnerShowcase';
// Alternate source files for the same partner should not repeat within a role.
const artworkAliases:Record<string,string>={
 webpartnerutility2:'webpartnerutility3',
 exchangepartner2:'rpg',
 investmentfacilitationpartner3:'investmentfacilitationpartner2',
 mediapartner242:'mediapartner241',
};
const assetKey=(value:string)=>{
 const key=value.replace(/^partner-/, '').replace(/(?:\.|-)(png|webp|jpg)$/i,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 return artworkAliases[key]||key;
};
const known=new Set(homepage.groups.flatMap(group=>group.logos.map(logo=>assetKey(logo.file))));
const additional:PartnerGroup[]=[];
const groups:PartnerGroup[]=homepage.groups.filter(group=>group.title!=='Global Footprint').map(group=>({...group,logos:group.logos.map(logo=>{
 const upgrade=upgrades.find(item=>item.previousSrc===logo.src);
 return upgrade?{...logo,src:upgrade.src,width:upgrade.width,height:upgrade.height}:logo;
})}));
const roleNames:Record<string,string>={'FOCUS STATE 2026':'Focus States','PARTNER UTILITY 2026':'Partner Utility','EXCHANGE PARTNERS 2026':'Exchange Partners','INVESTMENT FACILITATION PARTNER 2026':'Investment Facilitation Partner','MEDIA PARTNERS':'Media Partners'};
const importedArtworkNames:Record<string,string>={
 'partner-1-focus-state-partner-2026-revised-png':'Government of Gujarat, Energy and Petrochemicals Department',
 'partner-2-focus-state-partner-2026-png':'Gujarat Urja Vikas Nigam Limited (GUVNL)',
 'partner-4-focus-state-partner-2026-png':'Invest UP',
 'partner-7-focus-state-partner-2026-png':'Energy Department, Government of Karnataka',
 'partner-6-focus-state-partner-2026-png':'Karnataka Renewable Energy Development Limited (KREDL)',
};
for(const record of imported.partnerships) {
 if(record.role==='PARTICIPATING COMPANIES 2026')continue;
 const company=imported.partnerCompanies.find(item=>item.id===record.companyId);
 if(!company||known.has(assetKey(company.id)))continue;
 known.add(assetKey(company.id));
 let group=groups.find(item=>item.title===roleNames[record.role])||additional.find(item=>item.title===record.role);
 if(!group){group={title:record.role,logos:[]};additional.push(group);}
 group.logos.push({name:importedArtworkNames[company.id]||(company.name==='Published partner logo'?record.role+' published partner':company.name),src:company.logo,width:260,height:140,source:company.source,href:null,file:company.id});
}
export const allPartnerGroups:PartnerGroup[]=[...groups,...additional];
