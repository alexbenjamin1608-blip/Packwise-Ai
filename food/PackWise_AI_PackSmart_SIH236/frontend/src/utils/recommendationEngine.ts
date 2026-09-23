import { FoodCommodity, PackagingMaterial, RecommendationInput, RecommendationResultData } from '../types/packaging';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';
import { INDIAN_COMMODITIES } from '../data/indianCommodities';

export function runPackagingRecommendation(input: RecommendationInput): RecommendationResultData {
  const food = INDIAN_COMMODITIES.find((c) => c.id === input.foodId) || INDIAN_COMMODITIES[0];

  // Target calculations based on food biology and climate
  let targetOtr = 100;
  let targetWvtr = 5.0;
  let optimalThickness = 75;
  let recommendedMaterialId = food.recommendedMaterialId;

  // Respiration considerations:
  if (food.respirationRate === 'Extremely High' || food.respirationRate === 'High') {
    if (input.priority === 'map' || input.storageCondition === 'Chilled') {
      recommendedMaterialId = 'pet-pe-multilayer';
      targetOtr = 60;
      targetWvtr = 4.5;
    } else {
      recommendedMaterialId = 'micro-perf-pe';
      targetOtr = 1200;
      targetWvtr = 35.0;
    }
  } else if (food.oxygenSensitivity === 'Critical' || food.fatOilContent > 20) {
    if (food.category === 'Dairy' || food.category === 'Chilled/Frozen') {
      recommendedMaterialId = 'high-barrier-evoh';
      targetOtr = 1.5;
      targetWvtr = 1.8;
      optimalThickness = 90;
    } else if (food.lightSensitivity === 'High') {
      recommendedMaterialId = 'alu-foil-laminate';
      targetOtr = 0.05;
      targetWvtr = 0.02;
      optimalThickness = 105;
    } else {
      recommendedMaterialId = 'metallized-bopp-pet';
      targetOtr = 15.0;
      targetWvtr = 1.2;
      optimalThickness = 65;
    }
  } else if (food.category === 'Grains' || food.category === 'Pulses') {
    if (input.priority === 'recyclable' || input.priority === 'eco-friendly') {
      recommendedMaterialId = 'mono-pe-recyclable';
      targetOtr = 45;
      targetWvtr = 2.8;
      optimalThickness = 80;
    } else {
      recommendedMaterialId = 'metallized-bopp-pet';
      targetOtr = 20;
      targetWvtr = 1.5;
    }
  }

  // Override by priority
  if (input.priority === 'eco-friendly') {
    if (food.respirationRate === 'None' && food.fatOilContent < 5) {
      recommendedMaterialId = 'bopp-paper-kraft';
      optimalThickness = 110;
    } else if (food.category === 'Fresh Fruits' || food.category === 'Vegetables') {
      recommendedMaterialId = 'biodegradable-pla';
      optimalThickness = 60;
    } else {
      recommendedMaterialId = 'mono-pe-recyclable';
      optimalThickness = 80;
    }
  } else if (input.priority === 'low-cost') {
    if (food.category === 'Fresh Fruits' || food.category === 'Vegetables') {
      recommendedMaterialId = 'micro-perf-pe';
    } else {
      recommendedMaterialId = 'ldpe-flexible';
    }
    optimalThickness = 55;
  } else if (input.priority === 'max-shelf-life') {
    if (food.respirationRate === 'None') {
      recommendedMaterialId = 'high-barrier-evoh';
      optimalThickness = 100;
    } else {
      recommendedMaterialId = 'pet-pe-multilayer';
      optimalThickness = 85;
    }
  }

  // Adjust thickness based on transit and humidity
  if (input.transportType === 'Standard Truck' && input.distanceKm > 600) {
    optimalThickness += 15;
  }
  if (input.relativeHumidityPercent > 75) {
    targetWvtr = Math.max(0.5, targetWvtr * 0.7); // Tighter moisture barrier needed in humid climates
  }

  const material = PACKAGING_MATERIALS.find((m) => m.id === recommendedMaterialId) || PACKAGING_MATERIALS[0];

  // Compatibility score calculation
  let score = 94;
  if (input.priority === 'eco-friendly' && material.ecoScore > 85) score += 3;
  if (input.priority === 'max-shelf-life' && (material.id === 'high-barrier-evoh' || material.id === 'alu-foil-laminate')) score += 4;
  if (input.storageCondition === 'Ambient' && input.relativeHumidityPercent > 80 && material.wvtr > 10) score -= 8;
  score = Math.min(98, Math.max(78, score));

  // Shelf-life gain
  const shelfLifeGainDays = Math.max(
    1,
    Math.round(food.maxShelfLifePackagedDays - food.defaultShelfLifeUnpackagedDays)
  );

  // Cost estimate per pack (assuming 0.04 m² pouch for standard 250g-500g pouch + processing overhead)
  const baseAreaM2 = 0.045;
  const estimatedCostPerPackINR = Number(
    ((material.relativeCostPerM2INR * baseAreaM2 * (optimalThickness / material.defaultThicknessMicrons)) + 0.45).toFixed(2)
  );

  // Rationalized "Why this package?" text
  const reasons: string[] = [];
  if (food.respirationRate !== 'None') {
    reasons.push(`Selected to balance active respiration rate (${food.respirationRate}) with controlled gas permeation`);
  } else {
    reasons.push(`Selected for high oxygen barrier (OTR ~ ${material.otr} cc/m²·day) to prevent auto-oxidative rancidity`);
  }
  if (food.moistureContent === 'High' || food.waterActivity > 0.85) {
    reasons.push(`provides moisture containment preventing weight shrinkage without excessive internal condensation`);
  } else {
    reasons.push(`ensures WVTR barrier (<${material.wvtr} g/m²·day) protecting against humidity caking and sogginess in ${input.region}`);
  }
  if (material.mapSuitability === 'Excellent' || material.mapSuitability === 'Good') {
    reasons.push(`compatible with ${input.storageCondition.toLowerCase()} cold-chain logistics and protective gas packaging`);
  }

  const whyThisPackage = reasons.join('; ') + '.';

  const risksMitigated = food.keyRisks.slice(0, 3);

  return {
    food,
    material,
    compatibilityScore: score,
    requiredOtr: `< ${targetOtr.toFixed(1)} cc/m²·day·atm`,
    requiredWvtr: `< ${targetWvtr.toFixed(2)} g/m²·day`,
    optimalThicknessMicrons: optimalThickness,
    sealability: material.sealability,
    mechanicalStrength: `${material.tensileStrengthMpa} MPa (Tensile)`,
    mapSuitability: material.mapSuitability,
    whyThisPackage,
    shelfLifeGainDays,
    estimatedCostPerPackINR,
    ecoScore: material.ecoScore,
    fssaiComplianceStatus: material.foodContactSuitability === 'Approved' ? 'Verified in database' : 'Requires verification',
    bisReference: material.bisStandard,
    risksMitigated,
  };
}
