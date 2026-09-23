import { BISStandardInfo } from '../types/packaging';

export const BIS_STANDARDS: BISStandardInfo[] = [
  {
    code: 'IS 9845',
    title: 'Method of analysis for the determination of specific and overall migration of constituents of plastics',
    scope: 'Prescribes migration simulant tests (Distilled water, 3% Acetic acid, 15% Ethanol, n-Heptane / Rectified Olive Oil) with overall migration limit not exceeding 60 mg/kg or 10 mg/dm².',
    complianceKey: 'Overall Migration Limit (OML)',
    status: 'Verified in database',
  },
  {
    code: 'IS 10146',
    title: 'Polyethylene for its safe use in contact with foodstuffs, pharmaceuticals and drinking water',
    scope: 'Specifies positive list of constituents, manufacturing additives, catalysts, and purity benchmarks for LDPE, LLDPE, and HDPE resins in direct food contact.',
    complianceKey: 'Positive List & Additives',
    status: 'Verified in database',
  },
  {
    code: 'IS 10142',
    title: 'Polypropylene for its safe use in contact with foodstuffs, pharmaceuticals and drinking water',
    scope: 'Specifications for homopolymer and copolymer PP films (BOPP, CPP) ensuring absence of toxic heavy metals, phthalates, and non-approved slip agents.',
    complianceKey: 'Food-grade PP Monomer Residuals',
    status: 'Verified in database',
  },
  {
    code: 'IS 12252',
    title: 'Polyalkylene terephthalates (PET) for their safe use in contact with foodstuffs and pharmaceuticals',
    scope: 'Mandates limits for acetaldehyde migration, antimony catalyst residuals (<0.04 ppm), and heavy metal extractables in PET bottles, sheets, and multilayer barrier structures.',
    complianceKey: 'Acetaldehyde & Antimony Limits',
    status: 'Verified in database',
  },
  {
    code: 'IS 15392',
    title: 'Aluminium and aluminium alloys - Bare and laminated foils for food packaging',
    scope: 'Purity of aluminium alloy (min 99.0% Al), pinhole count per m², wettability grade A for adhesion, and absence of lead and cadmium impurities.',
    complianceKey: 'Aluminium Foil Purity & Pinholes',
    status: 'Verified in database',
  },
  {
    code: 'IS 14534',
    title: 'Guidelines for the recovery and recycling of plastics',
    scope: 'Marking codes (RIC 1 through 7), traceability protocols, and prohibition of using post-consumer mechanically recycled plastics in direct food contact unless specially authorized by FSSAI.',
    complianceKey: 'Recycled Plastic Food-Contact Ban',
    status: 'Verified in database',
  },
  {
    code: 'IS/ISO 17088',
    title: 'Specifications for compostable plastics',
    scope: 'Mandates >90% biodegradation within 180 days in compost, ecotoxicity plant germination checks, and fluorine/heavy metals limits for PLA, PBAT, and PHA films.',
    complianceKey: 'Compostability & Non-Toxicity',
    status: 'Verified in database',
  },
  {
    code: 'PWM Rules 2022',
    title: 'Plastic Waste Management (Amendment) Rules, Ministry of Environment, Forest & Climate Change',
    scope: 'Strict minimum thickness of 120 microns for standalone carry bags; mandatory Extended Producer Responsibility (EPR) recycling targets and phase-out of non-recyclable multi-layered plastics (MLP) without recovery avenues.',
    complianceKey: 'EPR & Single-use Plastic Phase-out',
    status: 'Verified in database',
  },
];
