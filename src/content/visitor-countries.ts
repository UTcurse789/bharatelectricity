export interface VisitorCountry {
 id: string;
 name: string;
 location: [number, number];
}

// Representative locations for the visitor countries and territories.
export const visitorCountries: VisitorCountry[] = [
 {id:'af',name:'Afghanistan',location:[34.56,69.21]},
 {id:'ax',name:'Åland Islands',location:[60.1,19.94]},
 {id:'al',name:'Albania',location:[41.33,19.82]},
 {id:'dz',name:'Algeria',location:[36.75,3.06]},
 {id:'ad',name:'Andorra',location:[42.51,1.52]},
 {id:'ao',name:'Angola',location:[-8.84,13.23]},
 {id:'au',name:'Australia',location:[-33.87,151.21]},
 {id:'at',name:'Austria',location:[48.21,16.37]},
 {id:'bd',name:'Bangladesh',location:[23.81,90.41]},
 {id:'bt',name:'Bhutan',location:[27.47,89.64]},
 {id:'cn',name:'China',location:[39.9,116.41]},
 {id:'dk',name:'Denmark',location:[55.68,12.57]},
 {id:'fr',name:'France',location:[48.86,2.35]},
 {id:'de',name:'Germany',location:[52.52,13.41]},
 {id:'gt',name:'Guatemala',location:[14.63,-90.51]},
 {id:'hu',name:'Hungary',location:[47.5,19.04]},
 {id:'ir',name:'Iran',location:[35.69,51.39]},
 {id:'il',name:'Israel',location:[32.09,34.78]},
 {id:'it',name:'Italy',location:[41.9,12.5]},
 {id:'jp',name:'Japan',location:[35.68,139.65]},
 {id:'ly',name:'Libya',location:[32.89,13.19]},
 {id:'np',name:'Nepal',location:[27.72,85.32]},
 {id:'om',name:'Oman',location:[23.59,58.41]},
 {id:'pl',name:'Poland',location:[52.23,21.01]},
 {id:'ru',name:'Russia',location:[55.76,37.62]},
 {id:'sa',name:'Saudi Arabia',location:[24.71,46.68]},
 {id:'sk',name:'Slovakia',location:[48.15,17.11]},
 {id:'kr',name:'South Korea',location:[37.57,126.98]},
 {id:'es',name:'Spain',location:[40.42,-3.7]},
 {id:'lk',name:'Sri Lanka',location:[6.93,79.86]},
 {id:'sd',name:'Sudan',location:[15.5,32.56]},
 {id:'ae',name:'United Arab Emirates',location:[25.2,55.27]},
 {id:'gb',name:'United Kingdom',location:[51.51,-0.13]},
 {id:'us',name:'United States (USA)',location:[38.91,-77.04]},
];

export const summitLocation: [number, number] = [28.61,77.21];
