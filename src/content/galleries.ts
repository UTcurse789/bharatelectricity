export type GalleryVideo = {
 id: string;
 title: string;
 url: string;
 description?: string;
};

type VideoSection = {
 id: string;
 title: string;
 navLabel: string;
 description?: string;
 videos: GalleryVideo[];
};

export const videoSections: VideoSection[] = [
 {
  id: 'highlights-2025', title: '2025 Event Highlights', navLabel: '2025 Highlights', videos: [
   {id: 'Y1w-aDKpl10', title: 'Event Highlights', description: 'Energy Reimagined – Together', url: 'https://youtu.be/Y1w-aDKpl10?si=heHcM1Q8GH3MzoXf'},
   {id: 'xGBsKNcw_JA', title: 'Governing Council Highlights', description: 'Together, Reimagining the Future of Energy', url: 'https://youtu.be/xGBsKNcw_JA?si=wAAtJnI1yj6oA5N1'}
  ]
 },
 {
  id: 'highlights-2024', title: '2024 Event Highlights', navLabel: '2024 Highlights', videos: [
   {id: 'MkyH3IMQQcc', title: 'Expo Highlights', description: 'Bharat Electricity, POWERGEN India & Indian Utility Week — Where Innovation Meets Collaboration in Energy', url: 'https://www.youtube.com/embed/MkyH3IMQQcc?si=6IfLXblrjgpXIH8g'},
   {id: '2iaJB_6xznw', title: 'Summit Highlights', description: 'Bharat Electricity, POWERGEN India & Indian Utility Week — Empowering Connections, Energizing the Future', url: 'https://www.youtube.com/embed/2iaJB_6xznw?si=WNOUyy7QE6rPXyXn'}
  ]
 },
 {
  id: 'council-2024', title: 'Bharat Electricity, PGID & IUW 2024 Governing Council Meet', navLabel: '2024 Council', videos: [
   {id: 'ckUEjrhNyeA', title: 'Governing Council Meet 2024 — Video 1', url: 'https://www.youtube.com/embed/ckUEjrhNyeA?si=6RqmQgAe_6GmUoJJ'},
   {id: 'eVUN2GTGj6U', title: 'Governing Council Meet 2024 — Video 2', url: 'https://www.youtube.com/embed/eVUN2GTGj6U?si=PM2QXFFYJgm0wbsU'},
   {id: '0CjZYU5auhM', title: 'Governing Council Meet 2024 — Video 3', url: 'https://www.youtube.com/embed/0CjZYU5auhM?si=JisrMXAsK8bmKiRA'},
   {id: 'KxDnXmO5Eo0', title: 'Governing Council Meet 2024 — Video 4', url: 'https://www.youtube.com/embed/KxDnXmO5Eo0?si=Y-nyKm-N-fbBEDJg'}
  ]
 },
 {
  id: 'highlights-2022', title: '2022 Event Highlights', navLabel: '2022 Highlights', videos: [
   {id: 'MQmCsHgPUDE', title: 'Combined Highlights', url: 'https://www.youtube.com/embed/MQmCsHgPUDE'},
   {id: 'pABpdbMDNzk', title: 'Day I', url: 'https://www.youtube.com/embed/pABpdbMDNzk?controls=0'},
   {id: 'QAk2rdLQPo4', title: 'Day II', url: 'https://www.youtube.com/embed/QAk2rdLQPo4?controls=0'},
   {id: 'G0Y0l0QTsII', title: 'Day III', url: 'https://www.youtube.com/embed/G0Y0l0QTsII?controls=0'}
  ]
 },
 {
  id: 'interviews-2022', title: '2022 Advisory Committee Interviews', navLabel: '2022 Interviews', videos: [
   {id: 'C6y3MdrGAYk', title: 'Anil Razdan', description: 'Chair of the POWERGEN India 2022 Advisory Committee | Former Secretary of Power and Special Secretary / Additional Secretary of Petroleum and Natural Gas, GoI', url: 'https://www.youtube.com/embed/C6y3MdrGAYk'},
   {id: 'tecPj_Kw82E', title: 'Atul Sobti', description: 'Director General, Standing Conference of Public Enterprises – SCOPE', url: 'https://www.youtube.com/embed/tecPj_Kw82E'},
   {id: 'uhQrBqjTcwU', title: 'Arun Kumar Mishra', description: 'Director, NPMU, National Smart Grid Mission', url: 'https://www.youtube.com/embed/uhQrBqjTcwU'},
   {id: 'CHZGqGQSRFg', title: 'Saibal Kundu', description: 'Industry Solutions Leader – Energy Environment & Utilities, IBM', url: 'https://www.youtube.com/embed/CHZGqGQSRFg'},
   {id: 'fz-Smwffmfw', title: 'Arun Kumar', description: 'CEO, Kreate Energy (I) Pvt. Ltd.', url: 'https://www.youtube.com/embed/fz-Smwffmfw'},
   {id: 'H0RVKyKkDjQ', title: 'Ashish Malik', description: 'Secretary General, Solar Energy Society of India', url: 'https://www.youtube.com/embed/H0RVKyKkDjQ'}
  ]
 },
 {
  id: 'india-market', title: 'POWERGEN India & Indian Utility Week Videos', navLabel: 'India Market', videos: [
   {id: 'BWadfBg2Nug', title: 'What are the opportunities in the Indian market?', url: 'https://www.youtube.com/embed/BWadfBg2Nug?rel=0'},
   {id: 'ClK6nzuRPaA', title: 'Opportunities in emerging markets: India focus', url: 'https://www.youtube.com/embed/ClK6nzuRPaA?rel=0'}
  ]
 },
 {
  id: 'global-events', title: 'Our Clarion Energy Global Reach', navLabel: 'Global Events', description: 'Check out our other event videos.', videos: [
   {id: 'NQQBP7ts1Bg', title: 'POWERGEN Asia & Asian Utility Week 2019 Highlights', url: 'https://www.youtube.com/embed/NQQBP7ts1Bg'},
   {id: 'okmOOFF0Evs', title: 'POWERGEN Asia 2018 Recap & Highlights Video', url: 'https://www.youtube.com/embed/okmOOFF0Evs'},
   {id: 'CdK15TA7Kxo', title: 'POWERGEN Europe & European Utility Week 2019 Wrap-Up', url: 'https://www.youtube.com/embed/CdK15TA7Kxo'},
   {id: '1O8b--IA2q0', title: 'POWERGEN Europe & European Utility Week 2019 Promotion Video', url: 'https://www.youtube.com/embed/1O8b--IA2q0'},
   {id: 'byFAU4Z2tOM', title: 'POWERGEN Africa & African Utility Week 2019 Wrap-Up and Highlights', url: 'https://www.youtube.com/embed/byFAU4Z2tOM'},
   {id: '0FipznAg0zE', title: 'POWERGEN International 2019 Promotion Video', url: 'https://www.youtube.com/embed/0FipznAg0zE'}
  ]
 }
];
