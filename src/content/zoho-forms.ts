// Organiser-supplied 2027 enquiry URLs. Keep embeds and direct links in sync.
export const zohoFormBase = 'https://forms.zohopublic.in/itenmedia1/form/BharatElectricity2027/formperma/CaEO_SoMUJ1Tlv-mISKv8t9jJWMKdg-vXOfIhl2oLQk';

const form = (queryType: string) => zohoFormBase + '?QueryType=' + encodeURIComponent(queryType);

export const zohoFormUrls = {
 brochure: form('Brochure Download'),
 postShowReport: form('Post Show Report Download'),
 partnershipBrochure: form('Partnership Brochure Download'),
 floor: form('Floor Plan Download'),
 exhibit: form('Exhibit'),
 callback: form('Request a call back'),
 delegate: form('Delegate Registration'),
 speaking: form('Speaking Opportunities'),
 partnership: form('Partnership Opportunities'),
 visitor: form('Visit')
};

export const spaceApplicationFormUrls = {
 indian: 'https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDomestic2027N/formperma/N8WS6AKNb7lC2fp_92boIq_XrEL3AOsnIDebLPjOQ9k',
 international: 'https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormInternational1/formperma/Lur470GtF_mm-smpo0Ud4RGxqiAxuw1DlPtpmmvh7H4',
 startups: 'https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormStartups2027/formperma/R7jFkslLomxLg705prhmySCq1jxhWzLQ3oUrIeMzPBg',
 msme: 'https://forms.zohopublic.in/itenmedia1/form/BharatElectricitySpaceApplicationFormDOMMSME2027NE/formperma/zqMXnmCJ_vEuHwq22o_4g1BbeoeCvBlV86DYsz3RSlQ'
};

export const spaceApplicationForms = [
 {category: 'Indian companies', src: spaceApplicationFormUrls.indian, height: 650},
 {category: 'International companies', src: spaceApplicationFormUrls.international, height: 600},
 {category: 'Startups', src: spaceApplicationFormUrls.startups, height: 600},
 {category: 'MSMEs', src: spaceApplicationFormUrls.msme, height: 600}
];
