import awardImages from './legacy-award-images.json';
import referenceImages from './legacy-source-images.json';
import dayOneImages from './legacy-day-1-images.json';
import edition2025Assets from './legacy-2025-assets.json';

export interface LegacyImage {src:string;alt:string}
export interface LegacyReference {src:string;width:number;height:number}
export interface LegacyMetric {value:string;label:string;icon?:'edition'|'area'|'exhibitors'|'attendees'|'government'|'speakers'|'delegates'|'time'|'students'|'countries'|'states'|'awards'}
export interface LegacyDay {id:string;label:string;tabLabel?:string;themes?:string[];sessions?:string[];images:LegacyImage[]}
export interface LegacyChart {title:string;values:{label:string;value:number}[];partial?:boolean;source:'feedback-1'|'feedback-2';sourceOnly?:boolean;reference?:string;categories?:string[];unlabelledValues?:number[];note?:string}
export interface LegacySupport {name:string;image:LegacyImage & {width:number;height:number};note?:string}
export interface LegacySpeakerQuote {name:string;designation:string[];quote:string;image?:LegacyImage}
export interface LegacyPavilion {id:string;title:string;heading:string;paragraphs:string[];supportLabel:string;supportName:string;metrics:LegacyMetric[];images:LegacyImage[];recognition?:string;reference:string}
export interface LegacyEdition {
 year:number;names:string;eyebrow?:string;recap:string[];themes:string[];references:Record<string,LegacyReference>;
 quote?:{heading:string;paragraphs:string[];name:string;role:string;ministry:string;image?:LegacyImage};
 government?:{label:string;organisations:LegacySupport[];marks:LegacySupport[];reference:string};
 audience?:{heading:string;chartTitle:string;note?:string;sourceDescription:string};
 feedbackGroups?:{title:string;charts:LegacyChart[]}[];
 voices?:LegacySpeakerQuote[];
 statistics:LegacyMetric[];demographics:LegacyMetric[];sectors:{label:string;value:number}[];feedback:LegacyChart[];
 days:LegacyDay[];pavilions:LegacyPavilion[];
 awards:{heading:string;subheading:string;description:string;images:LegacyImage[];galleryUrl?:string};
 albums:{label:string;url:string}[];
}

// Only edition-specific, verified imagery belongs in these arrays. Replace each
// day independently when the original Day 1, Day 2 and Day 3 photos are supplied.
export const legacyEditions:LegacyEdition[]=[{
 year:2024,
 references:referenceImages,
 names:'Bharat Electricity & Indian Utility Week',
 recap:[
  "The Bharat Electricity & Indian Utility Week 2024 conference provided a comprehensive exploration of the latest advancements and emerging trends in the energy sector. This year's conference was structured around a dynamic blend of keynote sessions, breakout discussions, and hands-on workshops, offering a rich tapestry of insights and practical knowledge.",
  'Key themes included advancements in renewable energy technologies, grid modernization, and innovative approaches to energy storage and management. Notable sessions featured thought-provoking discussions on the integration of smart grids and the role of AI in energy management, which drew considerable interest from attendees.',
  "Renowned speakers and panelists, including industry leaders and academic experts, delivered impactful presentations, contributing to lively debates and valuable networking opportunities. Participant feedback highlighted a high level of engagement and appreciation for the conference's depth and relevance, with surveys reflecting strong satisfaction and actionable insights for future events."
 ],
 themes:['Renewable energy','Grid modernization','Energy storage','Smart grids & AI'],
 quote:{
  heading:'Unveiling key insights from Bharat Electricity & Indian Utility Week 2024',
  paragraphs:[
   'We are gathered here to discuss, deliberate & collaborate on one of the most critical missions of our time, the clean energy transition & our collective journey towards the sustainable future.',
   'India has made great progress in this energy sector in 2014. Thanks to our PM Shri Narendra Modi ji, we are on our way to becoming the leader in the clean energy sector.'
  ],
  name:'Shri Pralhad Joshi',role:'Union Minister',ministry:'Ministry of New and Renewable Energy'
 },
 statistics:[
  {value:'17th',label:'In-person edition',icon:'edition'},
  {value:'10,000+',label:'Square metres of energy innovation',icon:'area'},
  {value:'200+',label:'Exhibitors',icon:'exhibitors'},
  {value:'8,000+',label:'Attendees',icon:'attendees'},
  {value:'11+',label:'Government pavilions',icon:'government'},
  {value:'120+',label:'Global speakers',icon:'speakers'},
  {value:'700+',label:'Delegates',icon:'delegates'},
  {value:'72',label:'Hours of content & networking',icon:'time'},
  {value:'150',label:'Students, academics and researchers',icon:'students'},
  {value:'20+',label:'Countries',icon:'countries'}
 ],
 demographics:[
  {value:'85%',label:'New attendees'},
  {value:'85%',label:'Will follow up with exhibitors met at Bharat Electricity'},
  {value:'80%',label:'Decision makers'},
  {value:'95',label:'Utilities represented'}
 ],
 sectors:[
  {label:'Generation',value:29},{label:'Grid infrastructure (Electricity)',value:21},
  {label:'Energy efficiency',value:14},{label:'Digitalisation',value:11},
  {label:'Storage',value:8},{label:'Grid infrastructure (Gas)',value:7},
  {label:'Decarbonisation of industry',value:7},{label:'Decarbonisation of transport',value:3}
 ],
 feedback:[
  {title:'Aspects of the event people find most valuable',source:'feedback-1',partial:true,values:[{label:'Networking',value:29.54},{label:'Exhibition',value:25.16},{label:'B2B Meeting',value:25.30},{label:'Panel Discussion',value:15}]},
  {title:'Industry thoughts on registration process',source:'feedback-1',partial:true,values:[{label:'Good',value:23.40},{label:'Excellent',value:70.40}]},
  {title:'Industry thoughts on panel discussions and sessions',source:'feedback-1',partial:true,values:[{label:'Average',value:11.81},{label:'Good',value:31.63},{label:'Excellent',value:55.56}]},
  {title:'Industry views on the variety and quality of the exhibitors',source:'feedback-2',values:[{label:'Below Average',value:11.11},{label:'Average',value:11.11},{label:'Good',value:40.74},{label:'Excellent',value:37.04}]},
  {title:'Industry views on networking opportunities provided',source:'feedback-2',values:[{label:'Below Average',value:7.41},{label:'Average',value:22.22},{label:'Good',value:51.85},{label:'Excellent',value:18.52}]},
  {title:'Industry views on attending the next edition of the event',source:'feedback-2',values:[{label:'Yes',value:59.26},{label:'No',value:11.11},{label:'Maybe',value:29.63}]}
 ],
 days:[{id:'day-1',label:'Day 1',images:dayOneImages.map(({src,alt})=>({src,alt}))},{id:'day-2',label:'Day 2',images:[]},{id:'day-3',label:'Day 3',images:[]}],
 pavilions:[
  {id:'msme',title:'MSME Pavilion',heading:'Empowering growth through sustainable development',
   paragraphs:[
    'The MSME Pavilion, sponsored by the Ministry of MSME under the Procurement and Marketing Support (PMS) scheme, provided a dedicated space for micro, small and medium enterprises in the energy sector.',
    'The pavilion showcased their innovative solutions and products, and their contributions to sustainable development and energy efficiency. Attendees explored offerings from the sector and discussed the support and resources available to foster growth and innovation.'
   ],supportLabel:'Supported by',supportName:'Ministry of MSME, Government of India',
   metrics:[{value:'30',label:'SMEs participated'},{value:'3,000+',label:'Queries generated'},{value:'2,000+',label:'Foreign visitors'},{value:'10+',label:'States represented by participating SMEs'},{value:'₹75 crore+',label:'Business expected'},{value:'700',label:'Square metres of gross pavilion area'}],images:[],reference:'msme'},
  {id:'startup',title:'Startup India Pavilion',heading:'Showcasing the contributions of startups to the energy sector',
   paragraphs:[
    'The Startup India Pavilion, by the Department for Promotion of Industry and Internal Trade (DPIIT), showcased innovations and technologies emerging from India’s startup ecosystem. A curated selection of startups presented their ideas and solutions for the energy landscape.',
    'Visitors engaged directly with entrepreneurs, learned about their projects and explored their contributions to the nation’s energy transition. The pavilion provided a platform for networking, collaboration and partnerships that drive innovation in the sector.'
   ],supportLabel:'Managed by',supportName:'Startup India · DPIIT',
   metrics:[{value:'90',label:'Square metres of pavilion area'},{value:'10',label:'Startups participated'},{value:'5',label:'MOUs signed during the event'},{value:'500+',label:'Queries generated'},{value:'₹50 crore+',label:'Business expected'}],images:[],recognition:'Best Digital Experience Booth',reference:'startup'}
 ],
 awards:{heading:'Celebrating excellence',subheading:'Bharat Electricity – Powering India Awards',description:'Recognising the people and organisations contributing to India’s energy sector. Explore the moments from the 2024 awards and gala.',images:awardImages.map(({src,alt})=>({src,alt})),galleryUrl:'https://photos.app.goo.gl/gq133LtdgFeRMj319'},
 albums:[{label:'2024 conference photographs',url:'https://photos.app.goo.gl/gJk2Wdu3nVE87hFe8'},{label:'2024 exhibition photographs',url:'https://photos.app.goo.gl/VSb7ZLnTzF4oQtx56'}]
},{
 year:2025,
 eyebrow:'THE 2025 EDITION',
 names:'Bharat Electricity & Indian Utility Week',
 references:edition2025Assets.references,
 recap:[],
 themes:['Power Generation','Digital Transformation','Energy Transition','Smart Energy','Transmission & Distribution','Renewables'],
 government:{label:'Government of India',reference:'government',organisations:[
  {name:'Ministry of Power',image:{src:'/assets/homepage/mop-2026-7f272c8155.webp',alt:'Official Ministry of Power mark',width:482,height:400}},
  {name:'Ministry of New and Renewable Energy',image:{src:'/assets/homepage/mnre-government-support2-3e505f4936.webp',alt:'Official Ministry of New and Renewable Energy mark',width:432,height:400}},
  {name:'Ministry of Heavy Industries',image:{src:'/assets/homepage/government-support-mhi-b791edb053.webp',alt:'Official Ministry of Heavy Industries mark',width:546,height:400}},
  {name:'Economic Diplomacy Division, Ministry of External Affairs',image:{src:'/assets/homepage/mea-government-support2-a763caa458.webp',alt:'Official Ministry of External Affairs mark',width:506,height:400}},
  {name:'Ministry of Jal Shakti',image:{src:'/assets/legacy-2025/national-emblem.webp',alt:'Original Government of India national emblem',width:178,height:285}},
  {name:'Ministry of Electronics & Information Technology',image:{src:'/assets/homepage/government-support-meity-5e8982025b.webp',alt:'Official Ministry of Electronics and Information Technology mark',width:488,height:400}},
  {name:'Ministry of Environment, Forest and Climate Change',image:{src:'/assets/homepage/government-support-moefcc-637ff7ad71.webp',alt:'Official Ministry of Environment, Forest and Climate Change mark',width:472,height:400}}
 ],marks:[
  {name:'Nature protects if she is protected',note:'Ministry of Environment, Forest and Climate Change circular mark',image:{src:'/assets/homepage/government-support-moefcc-1-992fa12a92.webp',alt:'Original circular environment mark, Nature Protects if She is Protected',width:377,height:400}},
  {name:'LiFE',note:'Lifestyle for Environment',image:{src:'/assets/homepage/government-support-moefcc-2-7df76a4b0f.webp',alt:'Original LiFE Lifestyle for Environment mark',width:640,height:285}}
 ]},
 statistics:[
  {value:'18th',label:'In-person edition',icon:'edition'},
  {value:'12,500+',label:'Square metres of energy innovation',icon:'area'},
  {value:'200+',label:'Exhibitors',icon:'exhibitors'},
  {value:'12,000+',label:'Attendees',icon:'attendees'},
  {value:'20+',label:'States participating',icon:'states'},
  {value:'150+',label:'Global speakers',icon:'speakers'},
  {value:'1,000+',label:'Delegates',icon:'delegates'},
  {value:'72',label:'Hours of content & networking',icon:'time'},
  {value:'150',label:'Students, academics and researchers',icon:'students'},
  {value:'30+',label:'Countries',icon:'countries'},
  {value:'30+',label:'Award categories',icon:'awards'}
 ],
 demographics:[
  {value:'93%',label:'New attendees'},
  {value:'89%',label:'Will follow up with exhibitors met at Bharat Electricity'},
  {value:'82%',label:'Decision makers in 2025'},
  {value:'120+',label:'Utilities represented'}
 ],
 audience:{heading:'Audience demographics',chartTitle:'Audience interests',note:'Independent reported percentages. These figures total more than 100% and are shown without normalisation.',sourceDescription:'The supplied 2025 demographics reference reports 19+ countries represented. The 2025 statistics reference reports 30+ countries; these figures have not been reconciled.'},
 sectors:[
  {label:'Generation',value:35},{label:'Grid infrastructure (Electricity)',value:28},
  {label:'Energy efficiency',value:17},{label:'Digitalisation',value:22},
  {label:'Storage',value:9},{label:'Grid infrastructure (Gas)',value:15},
  {label:'Decarbonisation of industry',value:17},{label:'Decarbonisation of transport',value:7}
 ],
 feedback:[],
 feedbackGroups:[
  {title:'Visitor experience',charts:[
   {title:'Participating industry segments',source:'feedback-1',sourceOnly:true,reference:'chart-segments',values:[{label:'Logistics',value:4.40},{label:'Utilities',value:19.80},{label:'Govt. & NGO’s',value:15.60},{label:'EPC’s',value:13},{label:'Power',value:29.50}],categories:['Chemical','Infrastructure','Logistics','Electrical','Utilities','Distribution','Investors','Exporter & Importer','Govt. & NGO’s','Associations','EPC’s','Power','Regulatory Bodies','EV Charging'],note:'Only the legible label/value pairs are transcribed. The original chart preserves all categories; the smaller percentages have not been inferred.'},
   {title:'Most valuable event aspects',source:'feedback-1',sourceOnly:true,reference:'chart-aspects',values:[{label:'Networking',value:29.54},{label:'Exhibition',value:25.16},{label:'B2B Meeting',value:25.30},{label:'Panel Discussion',value:15}],categories:['Networking','Exhibition','B2B Meeting','Panel Discussion','Other'],note:'The Other percentage is not legible. The original chart is retained instead of reconstructing an incomplete distribution.'},
   {title:'Registration experience',source:'feedback-1',sourceOnly:true,reference:'chart-registration',values:[{label:'Good',value:23.40},{label:'Excellent',value:70.40}],categories:['Below Average','Average','Good','Excellent'],note:'The Below Average and Average percentages are not legible in the supplied reference.'},
   {title:'Panel discussions and sessions',source:'feedback-1',sourceOnly:true,reference:'chart-panels',values:[],unlabelledValues:[11.81,31.63,55.56],note:'The supplied chart shows these percentages without a response legend. No response names have been assigned.'}
  ]},
  {title:'Business and future participation',charts:[
   {title:'Variety and quality of exhibitors',source:'feedback-2',values:[{label:'Below Average',value:11.11},{label:'Average',value:11.11},{label:'Good',value:40.74},{label:'Excellent',value:37.04}]},
   {title:'Business generated',source:'feedback-2',values:[{label:'Yes',value:42.31},{label:'No',value:30.77},{label:'If Please',value:26.92}],note:'“If Please” is the third response as printed in the source. Its meaning requires editorial clarification.'},
   {title:'Networking opportunities',source:'feedback-2',values:[{label:'Below Average',value:7.41},{label:'Average',value:22.22},{label:'Good',value:51.85},{label:'Excellent',value:18.52}]},
   {title:'Attendance intentions for the next edition',source:'feedback-2',values:[{label:'Yes',value:59.26},{label:'No',value:11.11},{label:'Maybe',value:29.63}]},
   {title:'Suggested locations',source:'feedback-2',sourceOnly:true,reference:'chart-locations',values:[{label:'New Delhi',value:44},{label:'Mumbai',value:28},{label:'Bangalore',value:16},{label:'Other',value:8}],categories:['New Delhi','Mumbai','Gandhinagar','Bangalore','Chennai','Other'],note:'Gandhinagar and Chennai percentages are not legible. The original chart retains these categories without guessed values.'}
  ]}
 ],
 days:[
  {id:'day-1',label:'Day 1',tabLabel:'DAY-1 KEY THEMES',themes:[],sessions:[],images:[]},
  {id:'day-2',label:'Day 2',tabLabel:'DAY-2 KEY THEMES',themes:[],sessions:[],images:[]},
  {id:'day-3',label:'Day 3',tabLabel:'DAY-3 KEY THEMES',themes:[],sessions:[],images:[]}
 ],
 pavilions:[],
 voices:[
  {name:'Shri Bhupinder Singh Bhalla, IAS (Retd.)',designation:['Former Secretary','Ministry of New & Renewable Energy','Government of India'],quote:'Electricity will no longer flow in one direction — consumers will be our partners, not our passengers.',image:edition2025Assets.portraits.bhalla},
  {name:'Shri Ghanshyam Prasad',designation:['Chairperson','Central Electricity Authority'],quote:'What is more required in the sector are the challenges we will face in achieving those numbers and expectations—particularly in the context of the transition.',image:edition2025Assets.portraits.prasad},
  {name:'Dr. Kalirajan S.',designation:['Managing Director','EDF Nuclear Projects India Private Limited'],quote:'India is targeting a 12X nuclear capacity addition from 8.78 GW to 100 GW in just 22 years. To reach that scale, large reactors will be essential, while SMRs will play a complementary role for captive and niche needs.',image:edition2025Assets.portraits.kalirajan},
  {name:'Shri Ravindra Kumar',designation:['Director (Operations), NTPC Limited'],quote:'One, to envision for our country India. Second, to define the pathways to get there. And third, to accelerate our journey towards that vision.',image:edition2025Assets.portraits.kumar}
 ],
 awards:{heading:'Celebrating excellence',subheading:'Bharat Electricity – Powering India Awards 2025',description:'Original photographs from the 2025 awards and gala.',images:edition2025Assets.awards.map(({src,alt})=>({src,alt})),galleryUrl:'https://photos.app.goo.gl/B84DWBDPtEAD4tK57'},
 albums:[{label:'2025 conference photographs',url:'https://photos.app.goo.gl/LdDGSEzkTrC4wWFc8'},{label:'2025 exhibition photographs',url:'https://photos.app.goo.gl/pzzYYy8HeN9nVXsy8'}]
}];
