export type FoodCategory =
  | 'Fresh Fruits'
  | 'Vegetables'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Processed'
  | 'Oils'
  | 'Chilled/Frozen';

export type IndiaRegion =
  | 'North India'
  | 'South India'
  | 'East India'
  | 'West India'
  | 'Central India'
  | 'North-East India';

export interface FoodCommodity {
  id: string;
  name: string;
  hindiName: string;
  category: FoodCategory;
  moistureContent: 'Low' | 'Medium' | 'High' | 'Very High';
  waterActivity: number; // aw (0.1 to 1.0)
  fatOilContent: number; // percentage
  ph: number;
  respirationRate: 'None' | 'Low' | 'Moderate' | 'High' | 'Extremely High';
  ethyleneSensitivity: 'Low' | 'Medium' | 'High';
  oxygenSensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  lightSensitivity: 'Low' | 'Medium' | 'High';
  idealTempC: number;
  idealRhPercent: number;
  defaultShelfLifeUnpackagedDays: number;
  maxShelfLifePackagedDays: number;
  recommendedMaterialId: string;
  mapRecommendation: {
    o2Percent: number;
    co2Percent: number;
    n2Percent: number;
    suitable: boolean;
    notes: string;
  };
  keyRisks: string[];
  packagingNotes: string;
  fssaiNotes: string;
}

export interface PackagingMaterial {
  id: string;
  name: string;
  shortCode: string;
  structureType: 'Monolayer' | 'Multilayer Co-ex' | 'Laminate' | 'Bio-Polymer' | 'Paper-Based' | 'Micro-Perforated';
  foodContactSuitability: 'Approved' | 'Conditional' | 'Not Recommended';
  otr: number; // cc / m² · day · atm @ 23°C, 0% RH
  wvtr: number; // g / m² · day @ 38°C, 90% RH
  defaultThicknessMicrons: number;
  minThicknessMicrons: number;
  maxThicknessMicrons: number;
  tensileStrengthMpa: number;
  sealability: 'Fair' | 'Good' | 'Excellent';
  flexibility: 'Rigid' | 'Semi-Rigid' | 'Flexible' | 'Ultra-Flexible';
  lightBarrier: 'None (Transparent)' | 'Moderate (Hazy/Tinted)' | 'High (Metallized)' | 'Absolute (Opaque Foil)';
  recyclabilityCode: string;
  recyclabilityText: string;
  ecoScore: number; // 0 to 100
  relativeCostPerM2INR: number; // Approx INR per m²
  mapSuitability: 'Excellent' | 'Good' | 'Fair' | 'Unsuitable';
  bisStandard: string;
  description: string;
  commonApplications: string[];
  sustainabilityNotes: string;
  layers?: {
    name: string;
    role: string;
    material: string;
    thicknessMicrons: number;
    colorHex: string;
  }[];
}

export interface RecommendationInput {
  foodId: string;
  customFoodName?: string;
  moisture: 'Low' | 'Medium' | 'High' | 'Very High';
  waterActivity: number;
  fatOilPercent: number;
  ph: number;
  respirationRate: 'None' | 'Low' | 'Moderate' | 'High' | 'Extremely High';
  ethyleneSensitivity: 'Low' | 'Medium' | 'High';
  oxygenSensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  lightSensitivity: 'Low' | 'Medium' | 'High';
  desiredShelfLifeDays: number;
  // Storage & Climate
  storageCondition: 'Ambient' | 'Chilled' | 'Frozen';
  storageTempC: number;
  relativeHumidityPercent: number;
  region: IndiaRegion;
  // Transport
  transportType: 'Standard Truck' | 'Reefer Truck' | 'Rail Cargo' | 'Air Freight' | 'Local Van';
  transportDurationHours: number;
  distanceKm: number;
  vibrationLevel: 'Low' | 'Medium' | 'High';
  // Priorities
  priority: 'low-cost' | 'max-shelf-life' | 'eco-friendly' | 'recyclable' | 'premium' | 'map';
}

export interface RecommendationResultData {
  food: FoodCommodity;
  material: PackagingMaterial;
  compatibilityScore: number; // e.g. 94%
  requiredOtr: string;
  requiredWvtr: string;
  optimalThicknessMicrons: number;
  sealability: string;
  mechanicalStrength: string;
  mapSuitability: string;
  whyThisPackage: string;
  shelfLifeGainDays: number;
  estimatedCostPerPackINR: number;
  ecoScore: number;
  fssaiComplianceStatus: 'Verified in database' | 'Requires verification' | 'Not suitable';
  bisReference: string;
  risksMitigated: string[];
}

export interface BISStandardInfo {
  code: string;
  title: string;
  scope: string;
  complianceKey: string;
  status: 'Verified in database' | 'Requires verification';
}
