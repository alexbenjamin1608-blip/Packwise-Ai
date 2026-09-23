import { INDIAN_COMMODITIES } from '../data/indianCommodities';
import { COMMODITIES_100, ScientificCommodity } from '../data/commodities100';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';
import { SupportedLanguage } from '../i18n/translations';

export interface AiFoodAdvice {
  replyText: string;
  matchedCommodity?: string;
  category?: string;
  recommendedMaterial?: string;
  shelfLife?: string;
  storageTemp?: string;
  mapAtmosphere?: string;
}

// ─── Gemini API Integration ───────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// Use Vite dev-proxy (/gemini-api → googleapis.com) to force IPv4 and avoid
// browser-level IPv6 TCP timeout on Windows networks.
const GEMINI_ENDPOINT =
  '/gemini-api/v1beta/models/gemini-3.6-flash:generateContent';

const GEMINI_SYSTEM_PROMPT = `You are PackWise Vaani, an expert AI assistant specialized in Indian food packaging science, shelf-life extension, and post-harvest technology. You work within the PackSmart / PackWise AI platform (SIH 236).

Your expertise covers:
- Food biochemistry: respiration rates, water activity (Aw), ethylene sensitivity, lipid oxidation
- Packaging materials: BOPP, PET, LDPE, HDPE, EVOH, PLA, PHA, metallized films, MAP films
- Modified Atmosphere Packaging (MAP): gas ratios (O₂, CO₂, N₂) for specific commodities
- Cold chain logistics for Indian agri-produce
- Regulatory compliance: FSSAI 2018, BIS IS 9845, IS 10146, PWMR 2022
- Indian crops and commodities: fruits, vegetables, spices, dairy, cereals, pulses

Guidelines:
- Give concise, scientifically accurate answers (2-4 sentences max for chat)
- If user writes in Hindi (Devanagari), respond in Hindi
- For specific foods, always mention: recommended packaging material, ideal temperature, shelf-life gain, and MAP gas ratio if applicable
- Be conversational but technically precise
- Always mention FSSAI compliance when relevant
- Use specific numbers (temperatures, gas %, OTR values) not vague terms`;

/**
 * Call Gemini API and return AI-generated packaging advice text.
 * Returns null on any error so callers can fall back to local logic.
 * Uses an 8-second AbortController timeout to avoid hanging on IPv6 issues.
 */
async function callGeminiAPI(query: string, lang: SupportedLanguage): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const userMessage = lang === 'hi'
      ? `[हिंदी में उत्तर दें] ${query}`
      : query;

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: GEMINI_SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          topK: 40,
          topP: 0.95,
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.warn('[PackWise AI] Gemini API error:', response.status, errBody);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn('[PackWise AI] Gemini API timed out (IPv6/network issue) — using local fallback.');
    } else {
      console.warn('[PackWise AI] Gemini fetch failed:', err);
    }
    return null;
  }
}

/**
 * Async version: tries Gemini first, falls back to local knowledge base.
 */
export async function generateFoodPackagingAdviceAsync(
  query: string,
  lang: SupportedLanguage = 'en'
): Promise<AiFoodAdvice> {
  const geminiReply = await callGeminiAPI(query, lang);
  if (geminiReply) {
    return {
      replyText: geminiReply,
      category: 'Gemini AI',
    };
  }
  // Fallback to local scientific knowledge base
  return generateFoodPackagingAdvice(query, lang);
}

// Conversation variety tracker to prevent repetition
let callCount = 0;

// Food synonyms & multi-lingual lexicon for robust matching
const PRODUCT_ALIASES: Record<string, string[]> = {
  tomato: ['tomato', 'tomatoes', 'टमाटर', 'tamatar', 'cherry tomato', 'vine tomato', 'prod-005'],
  potato: ['potato', 'potatoes', 'आलू', 'aloo', 'batata', 'prod-006'],
  onion: ['onion', 'onions', 'प्याज', 'pyaz', 'kanda', 'shallot', 'prod-007'],
  apple: ['apple', 'apples', 'सेब', 'seb', 'kashmiri apple', 'gala apple', 'prod-023'],
  banana: ['banana', 'bananas', 'केला', 'kela', 'kele', 'cavendish', 'prod-024'],
  strawberry: ['strawberry', 'strawberries', 'स्ट्रॉबेरी', 'prod-001'],
  spinach: ['spinach', 'पालक', 'palak', 'baby spinach', 'saag', 'prod-003'],
  lettuce: ['lettuce', 'सलाद पत्ता', 'iceberg', 'prod-004'],
  broccoli: ['broccoli', 'ब्रोकली', 'prod-008'],
  mushroom: ['mushroom', 'mushrooms', 'मशरूम', 'khumbi', 'खुम्बी', 'button mushroom', 'prod-009'],
  carrot: ['carrot', 'carrots', 'गाजर', 'gajar', 'prod-010'],
  garlic: ['garlic', 'लहसुन', 'lahsun', 'prod-011'],
  chili: ['chili', 'chilli', 'mirch', 'मिर्च', 'capsicum', 'shimla mirch', 'prod-012'],
  orange: ['orange', 'oranges', 'संतरा', 'santara', 'citrus', 'kinnow', 'nagpur orange', 'prod-014'],
  mango: ['mango', 'mangoes', 'आम', 'aam', 'alphonso', 'hapus', 'dashahari', 'langra', 'prod-015'],
  paneer: ['paneer', 'पनीर', 'cottage cheese', 'chena', 'prod-032'],
  butter: ['butter', 'मक्खन', 'makhan', 'white butter', 'prod-028'],
  ghee: ['ghee', 'घी', 'clarified butter', 'desi ghee', 'prod-035'],
  curd: ['curd', 'dahi', 'दही', 'yogurt', 'yoghurt', 'prod-029'],
  cheese: ['cheese', 'चीज', 'cheddar', 'mozzarella', 'prod-026', 'prod-027'],
  milk_powder: ['milk powder', 'मिल्क पाउडर', 'doodh powder', 'skimmed milk', 'prod-033'],
  milk: ['milk', 'दूध', 'doodh', 'toned milk', 'uht milk', 'pasteurized'],
  bread: ['bread', 'ब्रेड', 'पाव', 'pav', 'sourdough', 'loaf', 'prod-041', 'prod-042'],
  cookies: ['cookie', 'cookies', 'biscuit', 'biscuits', 'बिस्कुट', 'बिस्किट', 'namkeen', 'नमकीन', 'prod-044'],
  rice: ['rice', 'चावल', 'chawal', 'basmati', 'sona masoori', 'prod-056', 'prod-057'],
  wheat: ['wheat', 'flour', 'atta', 'आटा', 'गेहूं', 'gehun', 'maida', 'prod-060'],
  lentils: ['dal', 'daal', 'lentil', 'lentils', 'दाल', 'chana', 'चना', 'moong', 'मूंग', 'rajma', 'राजमा', 'toor dal', 'prod-058', 'prod-059'],
  turmeric: ['turmeric', 'हल्दी', 'haldi', 'curcumin', 'prod-063'],
  spices: ['spice', 'spices', 'मसाले', 'masala', 'pepper', 'काली मिर्च', 'coriander', 'jeera', 'prod-062'],
  tea: ['tea', 'चाय', 'chai', 'darjeeling', 'assam tea', 'green tea', 'prod-064'],
  coffee: ['coffee', 'कॉफी', 'coorg coffee', 'espresso', 'prod-065'],
  nuts: ['almond', 'badam', 'बादाम', 'walnut', 'akhrot', 'अखरोट', 'cashew', 'kaju', 'काजू', 'peanut', 'mungfali', 'मूंगफली', 'prod-067', 'prod-068'],
  meat: ['meat', 'chicken', 'चिकन', 'mutton', 'मीट', 'मटन', 'beef', 'steak', 'pork', 'poultry', 'prod-076', 'prod-078'],
  fish: ['fish', 'मछली', 'machli', 'salmon', 'tuna', 'prawn', 'jhinga', 'झींगा', 'seafood', 'rohu', 'catla', 'prod-089', 'prod-090', 'prod-091'],
  grapes: ['grape', 'grapes', 'अंगूर', 'angoor', 'nashik grapes', 'thompson', 'prod-019'],
  guava: ['guava', 'अमरूद', 'amrood', 'peru', 'prod-020'],
  banana_bunch: ['bunch', 'green banana', 'raw banana'],
};


interface FoodDetail {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  pkgMaterialEn: string;
  pkgMaterialHi: string;
  idealTemp: string;
  shelfLifeEn: string;
  shelfLifeHi: string;
  mapEn: string;
  mapHi: string;
  keyRisksEn: string;
  keyRisksHi: string;
  scientificReasonEn: string;
  scientificReasonHi: string;
}

// Rich scientific knowledge profiles for individual foods
const FOOD_KNOWLEDGE_MAP: Record<string, FoodDetail> = {
  tomato: {
    id: 'tomato',
    nameEn: 'Cherry & Vine Tomatoes',
    nameHi: 'टमाटर (Tomato)',
    category: 'Vegetables',
    pkgMaterialEn: 'Micro-perforated BOPP / Anti-Fog Pouch or Top-Seal Rigid Tray',
    pkgMaterialHi: 'सूक्ष्म-छिद्रित एंटी-फॉग BOPP पाउच या ट्रे-सील कवर',
    idealTemp: '10°C - 13°C (90-95% RH)',
    shelfLifeEn: '14 to 18 days (vs 4-5 days open)',
    shelfLifeHi: '14 से 18 दिन (खुले में केवल 4-5 दिन)',
    mapEn: '4% O₂ | 6% CO₂ | 90% N₂',
    mapHi: '4% ऑक्सीजन, 6% कार्बन डाइऑक्साइड, 90% नाइट्रोजन',
    keyRisksEn: 'Chilling injury below 10°C, skin splitting, fungal botrytis rot, internal sweating',
    keyRisksHi: '10°C से नीचे रखने पर स्वाद व रंग खराब होना (चिलिंग इंजरी), पसीना जमना और फफूंद',
    scientificReasonEn: 'Tomatoes are active climacteric fruits with high transpiration. Micro-perforated film allows controlled CO₂ venting, while anti-fog additives prevent moisture droplet pooling on fruit skins.',
    scientificReasonHi: 'टमाटर सांस लेता है और नमी छोड़ता है। साधारण बंद थैली में पसीना जमने से सड़न आती है। एंटी-फॉग सूक्ष्म-छिद्रित थैली नमी को नियंत्रित रखती है और 10-13°C पर फल ताजा रहता है।',
  },
  potato: {
    id: 'potato',
    nameEn: 'Potatoes (Seed / Table)',
    nameHi: 'आलू (Potato)',
    category: 'Vegetables',
    pkgMaterialEn: 'Ventilated Leno Mesh Bag or Light-Barrier Micro-vented Kraft Pouch',
    pkgMaterialHi: 'हवादार लेनो जालीदार बोरी (Mesh Bag) या प्रकाश-रोधी क्राफ्ट पाउच',
    idealTemp: '12°C - 15°C (Dark, 85-90% RH)',
    shelfLifeEn: '60 to 90 days (solid anti-sprouting)',
    shelfLifeHi: '60 से 90 दिन तक सुरक्षित',
    mapEn: 'Ambient ventilated airflow (Zero airtight seal)',
    mapHi: 'खुली हवादार व्यवस्था (पूरी तरह बंद न करें)',
    keyRisksEn: 'Light greening (solanine toxicity), sprout germination, soft rotting in sealed bags',
    keyRisksHi: 'रोशनी से हरा पड़ना (सोलेनाइन विषैलापन), अंकुरण और बंद थैली में सड़न',
    scientificReasonEn: 'Potatoes require continuous aeration to prevent anaerobic blackheart. Exposure to light triggers chlorophyll and toxic solanine glycoalkaloid synthesis, requiring opaque or shaded storage.',
    scientificReasonHi: 'आलू को खुली सूखी हवा चाहिए। प्लास्टिक की पूरी बंद थैली में पसीना आने से सड़न होती है और तेज रोशनी में रखने से आलू हरा होने लगता है।',
  },
  onion: {
    id: 'onion',
    nameEn: 'Onions & Shallots',
    nameHi: 'प्याज (Onion)',
    category: 'Vegetables',
    pkgMaterialEn: 'High-aeration Leno Net Sacks / Jute Mesh',
    pkgMaterialHi: 'जालीदार लेनो बोरी (Net Bag) या जूट की बोरी',
    idealTemp: '18°C - 22°C (Dry, 65-70% RH)',
    shelfLifeEn: '60 to 120 days',
    shelfLifeHi: '60 से 120 दिन तक ताज़ा',
    mapEn: 'Low moisture convective ventilation',
    mapHi: 'कम नमी और निरंतर हवा का संचार',
    keyRisksEn: 'Premature bulb sprouting, neck rot (Botrytis), moisture caking',
    keyRisksHi: 'समय से पहले कल्ले फूटना (sprouting), नमी से गर्दन में सड़न',
    scientificReasonEn: 'Onions need dry, well-ventilated conditions with low relative humidity (65%). High humidity in plastic packaging triggers root regeneration and black mold (Aspergillus niger).',
    scientificReasonHi: 'प्याज को बिल्कुल सूखी जगह और हवा चाहिए। अगर इसे प्लास्टिक पाउच में बंद करेंगे तो नमी से प्याज में जड़ें और फफूंद निकल आएगी।',
  },
  apple: {
    id: 'apple',
    nameEn: 'Kashmiri / Shimla Apples',
    nameHi: 'सेब (Apple)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Anti-Fog Micro-perforated BOPP Wrap or Molded Pulp Tray + Flow Pack',
    pkgMaterialHi: 'एंटी-फॉग सूक्ष्म-छिद्रित BOPP रैप या पल्प ट्रे व फ्लो-पैक',
    idealTemp: '0°C - 2°C (90-95% RH)',
    shelfLifeEn: '60 to 90 days in cold chain MAP',
    shelfLifeHi: '60 से 90 दिन तक कुरकुरा व ताजा',
    mapEn: '2% O₂ | 1.5% CO₂ | Bal N₂',
    mapHi: '2% ऑक्सीजन, 1.5% कार्बन डाइऑक्साइड, 96.5% नाइट्रोजन',
    keyRisksEn: 'Ethylene-induced pulp softening, core browning, skin shriveling',
    keyRisksHi: 'एथिलीन गैस से गूदे का पिलपिला होना, अंदर से काला पड़ना, छिलके की सिकुड़न',
    scientificReasonEn: 'Apples release ethylene gas that accelerates senescent breakdown. Low O₂ (2%) sharply curtails respiration and maintains crisp pectin structure for up to 3 months.',
    scientificReasonHi: 'सेब एथिलीन गैस छोड़ता है जिससे वह जल्दी नरम पड़ जाता है। कम ऑक्सीजन (2%) वाली विशेष पैकेजिंग और 1-2°C तापमान इसे 2 से 3 महीने तक ताजा और कुरकुरा रखता है।',
  },
  banana: {
    id: 'banana',
    nameEn: 'Cavendish Bananas',
    nameHi: 'केला (Banana)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Ethylene-Absorbing Active PE Liner or Modified Atmosphere Bag (Banavac)',
    pkgMaterialHi: 'एथिलीन अवशोषक (Ethylene Scavenger) PE लाइनर थैली',
    idealTemp: '13°C - 14°C strictly (Never below 11°C)',
    shelfLifeEn: '14 to 21 days green state',
    shelfLifeHi: '14 से 21 दिन हरा व ठोस',
    mapEn: '3% O₂ | 5% CO₂ | 92% N₂',
    mapHi: '3% ऑक्सीजन, 5% कार्बन डाइऑक्साइड, 92% नाइट्रोजन',
    keyRisksEn: 'Severe chilling injury below 11°C (black skins), rapid climacteric ripening spike',
    keyRisksHi: '11°C से कम पर छिलका काला पड़ना (चिलिंग इंजरी), गर्मी में 2 दिन में गल जाना',
    scientificReasonEn: 'Bananas undergo catastrophic skin browning below 12°C due to polyphenol oxidase release. An ethylene scrubber sachet inside a 40-micron PE liner delays ripening trigger for 3 weeks.',
    scientificReasonHi: 'केले को कभी फ्रिज या 12°C से नीचे न रखें, वर्ना छिलका काला पड़ जाएगा। एथिलीन सोखने वाली पाउच में यह 3 सप्ताह तक हरा और सुरक्षित रहता है।',
  },
  strawberry: {
    id: 'strawberry',
    nameEn: 'Fresh Strawberries',
    nameHi: 'स्ट्रॉबेरी (Strawberry)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Perforated Clamshell Bio-PLA with Absorbent Base Pad',
    pkgMaterialHi: 'छिद्रित क्लैमशेल बायो-PLA डिब्बा व सोखने वाला पैड',
    idealTemp: '0°C - 1°C (95% RH)',
    shelfLifeEn: '7 to 10 days (vs 2 days standard)',
    shelfLifeHi: '7 से 10 दिन तक सुरक्षित',
    mapEn: '10% O₂ | 15% CO₂ | 75% N₂',
    mapHi: '10% ऑक्सीजन, 15% कार्बन डाइऑक्साइड (फफूंद रोधी), 75% नाइट्रोजन',
    keyRisksEn: 'Gray mold (Botrytis cinerea), surface bruising, weeping moisture leak',
    keyRisksHi: 'ग्रे मोल्ड फफूंद, दबने से रस निकलना और सड़ना',
    scientificReasonEn: 'Strawberries lack protective peel and have very high respiration. Elevated CO₂ (15%) arrests fungal spores while rigid clamshell protects delicate achenes from crush damage.',
    scientificReasonHi: 'स्ट्रॉबेरी का छिलका नहीं होता और यह बहुत नाजुक है। 15% कार्बन डाइऑक्साइड युक्त गैस पैकेजिंग फफूंद को रोकती है और कठोर क्लैमशेल फल को दबने से बचाता है।',
  },
  paneer: {
    id: 'paneer',
    nameEn: 'Fresh Malai Paneer',
    nameHi: 'पनीर (Paneer)',
    category: 'Dairy',
    pkgMaterialEn: 'High-Barrier Multi-Layer PA/EVOH/PE Vacuum Pouch or Thermoformed MAP Tray',
    pkgMaterialHi: 'मल्टी-लेयर EVOH/PE वैक्यूम पाउच या MAP ट्रे',
    idealTemp: '2°C - 4°C chilled strictly',
    shelfLifeEn: '21 to 30 days (vs 2-3 days open)',
    shelfLifeHi: '21 से 30 दिन तक ताजा (खुले में 2-3 दिन)',
    mapEn: '0% O₂ | 30% CO₂ | 70% N₂',
    mapHi: '0% ऑक्सीजन (वैक्यूम), 30% कार्बन डाइऑक्साइड, 70% नाइट्रोजन',
    keyRisksEn: 'Pseudomonas slime, lactic souring, surface mold, yellow discoloration',
    keyRisksHi: 'सतह पर चिपचिपापन (स्लाइम), खट्टापन, फफूंद लगना और पीला पड़ना',
    scientificReasonEn: 'Paneer has neutral pH (5.8) and high moisture (52%), making it highly vulnerable to aerobic spoilage. EVOH oxygen barrier (<1.5 cc/m²) coupled with 30% CO₂ suppresses bacterial proliferation.',
    scientificReasonHi: 'पनीर में अधिक पानी और प्रोटीन होने के कारण हवा लगते ही 2 दिन में खट्टापन और चिपचिपाहट आ जाती है। EVOH वैक्यूम थैली ऑक्सीजन को रोककर इसे 1 माह तक ताजा रखती है।',
  },
  butter: {
    id: 'butter',
    nameEn: 'Creamery Butter & Fat Spreads',
    nameHi: 'मक्खन (Butter)',
    category: 'Dairy',
    pkgMaterialEn: 'Aluminium Foil / Parchment PE Laminate (Zero Light Transmission)',
    pkgMaterialHi: 'एल्युमिनियम फॉयल / पार्चमेंट PE लेमिनेट (प्रकाश-रोधी)',
    idealTemp: '0°C - 4°C chilled or -18°C frozen',
    shelfLifeEn: '180 days chilled / 12 months frozen',
    shelfLifeHi: '6 महीने (चिल्ड) / 12 महीने (फ्रोजन)',
    mapEn: 'Hermetic tight wrap with zero headspace',
    mapHi: 'वायुरोधी सीलबंद आवरण',
    keyRisksEn: 'Photo-oxidation, rancid butyric smell, odor absorption from fridge',
    keyRisksHi: 'रोशनी से तेल का खराब होना (ऑक्सीडेशन), बासी दुर्गंध, गंध सोखना',
    scientificReasonEn: 'Butter contains >80% lipids. Exposure to light wavelengths (400-500nm) and oxygen catalyzes auto-oxidation into rancid aldehydes. Pure aluminum foil laminate provides an impenetrable 100% UV barrier.',
    scientificReasonHi: 'मक्खन में 80% से अधिक वसा होती है। रोशनी और हवा से इसमें खटास व दुर्गंध पैदा हो जाती है। एल्युमिनियम फॉयल प्रकाश और हवा को 100% रोककर मक्खन की खुशबू बनाए रखती है।',
  },
  ghee: {
    id: 'ghee',
    nameEn: 'Pure Desi Ghee',
    nameHi: 'शुद्ध देसी घी (Ghee)',
    category: 'Dairy',
    pkgMaterialEn: 'Tinplate Can or 5-Layer Co-extruded Nylon/EVOH/PE Barrier Pouch / Glass Jar',
    pkgMaterialHi: 'टिन का डिब्बा या 5-लेयर EVOH/नायलॉन पाउच अथवा कांच का जार',
    idealTemp: '18°C - 24°C Ambient dry',
    shelfLifeEn: '9 to 12 months in barrier packaging',
    shelfLifeHi: '9 से 12 महीने तक शुद्ध सुगंध',
    mapEn: 'Nitrogen gas flush prior to hermetic seaming',
    mapHi: 'नाइट्रोजन गैस फ्लश सीलिंग',
    keyRisksEn: 'Peroxide rancidity, granule breakdown, moisture ingress caking',
    keyRisksHi: 'हवा से कड़वाहट (पेरॉक्साइड), दानेदार बनावट खत्म होना',
    scientificReasonEn: 'Ghee has minimal moisture (<0.2%) but is sensitive to oxygen-mediated free-radical lipid oxidation. Nitrogen flushing before hermetic sealing eliminates headspace oxygen completely.',
    scientificReasonHi: 'देसी घी में नमी नहीं होती लेकिन हवा की ऑक्सीजन से स्वाद कड़वा हो जाता है। नाइट्रोजन सीलबंद पैकेजिंग में दानेदार बनावट और महक साल भर बरकरार रहती है।',
  },
  bread: {
    id: 'bread',
    nameEn: 'Artisan Bread, Pav & Sourdough',
    nameHi: 'ब्रेड व पाव (Bread / Pav)',
    category: 'Bakery',
    pkgMaterialEn: 'High-Barrier Co-extruded PVDC / PET or Micro-perforated Polyolefin for crusts',
    pkgMaterialHi: 'हाई-बैरियर PVDC/PET पाउच या क्रस्ट के लिए पॉलीओलेफिन रैप',
    idealTemp: '18°C - 22°C (Never in domestic fridge: retrogradation)',
    shelfLifeEn: '14 to 21 days (with MAP, preservative-free)',
    shelfLifeHi: '14 से 21 दिन तक फफूंद-मुक्त',
    mapEn: '0% O₂ | 40% CO₂ | 60% N₂',
    mapHi: '0% ऑक्सीजन, 40% कार्बन डाइऑक्साइड, 60% नाइट्रोजन',
    keyRisksEn: 'Rhizopus and Penicillium mold, crumb staling (amylopectin retrogradation)',
    keyRisksHi: 'हरी-काली फफूंद (मोल्ड), ब्रेड का कड़ा व सूखा होना',
    scientificReasonEn: 'Domestic refrigeration (4°C) accelerates starch recrystallization by 6x. High CO₂ (40-50%) modified atmosphere eliminates the need for calcium propionate chemical preservatives.',
    scientificReasonHi: 'ब्रेड को कभी फ्रिज में न रखें क्योंकि ठंडक में स्टार्च जमने से ब्रेड सख्त हो जाती है। 40% CO₂ वाली गैस पैकेजिंग बिना केमिकल मिलाए ब्रेड को 2-3 हफ्ते फफूंद से बचाती है।',
  },
  cookies: {
    id: 'cookies',
    nameEn: 'Biscuits, Cookies & Wafers',
    nameHi: 'बिस्कुट व नमकीन (Biscuits & Namkeen)',
    category: 'Bakery',
    pkgMaterialEn: 'Metallized BOPP / CPP Laminate (Met-BOPP 20µ / Extrusion / Cast PP 25µ)',
    pkgMaterialHi: 'मेटलाइज्ड BOPP / CPP चमकीला लेमिनेट पाउच',
    idealTemp: '18°C - 25°C Ambient dry (<50% RH)',
    shelfLifeEn: '6 to 9 months crispness retention',
    shelfLifeHi: '6 से 9 महीने तक कुरकुरापन',
    mapEn: 'Nitrogen gas cushion flush (prevents breakage & rancidity)',
    mapHi: 'नाइट्रोजन गैस कुशन फ्लश (टूटना व सीलन रोकना)',
    keyRisksEn: 'Moisture uptake (sogginess / loss of crispness), fat oxidation (stale oil smell)',
    keyRisksHi: 'सीलन आना (कुरकुरापन खत्म होना) और तेल में बासी गंध पड़ना',
    scientificReasonEn: 'Crisp biscuits have critical water activity of Aw 0.35. A metallized BOPP layer ensures WVTR < 1.0 g/m²·day and OTR < 20 cc/m², preventing moisture ingress and oil auto-oxidation.',
    scientificReasonHi: 'बिस्कुट में नमी पहुंचते ही कुरकुरापन खत्म हो जाता है। मेटलाइज्ड सिल्वर पाउच नमी और हवा को रोकती है तथा नाइट्रोजन गैस बिस्कुट को टूटने से बचाती है।',
  },
  rice: {
    id: 'rice',
    nameEn: 'Aged Basmati Rice & Grains',
    nameHi: 'बासमती चावल व अनाज (Rice)',
    category: 'Dry Goods',
    pkgMaterialEn: 'Heavy-Duty HDPE Woven Sack with LDPE Inner Liner or Vacuum Barrier Pouch',
    pkgMaterialHi: 'मजबूत HDPE बुनी बोरी + LDPE लाइनर या वैक्यूम बैरियर बैग',
    idealTemp: '20°C - 24°C Ambient dry',
    shelfLifeEn: '12 to 24 months',
    shelfLifeHi: '12 से 24 महीने तक सुरक्षित',
    mapEn: 'Hermetic CO₂ fumigation or vacuum seal',
    mapHi: 'वायुरोधी सील या नाइट्रोजन वातावरण',
    keyRisksEn: 'Rice weevil infestation (Sitophilus oryzae), aroma loss (2-acetyl-1-pyrroline), mold',
    keyRisksHi: 'चावल में घुन या कीड़े लगना, बासमती की खुशबू उड़ना और बरसात में फफूंद',
    scientificReasonEn: 'Basmati grains absorb moisture when external RH exceeds 70%, leading to grain chalkiness and weevil egg hatching. Hermetic PE inner lining arrests insect respiration.',
    scientificReasonHi: 'चावल में कीड़े हवा और नमी के कारण पनपते हैं। अंदर LDPE अस्तर वाली मजबूत बोरी नमी को रोकती है जिससे 2 साल तक घुन नहीं लगता और खुशबू बनी रहती है।',
  },
  wheat: {
    id: 'wheat',
    nameEn: 'Whole Wheat Atta & Flours',
    nameHi: 'गेहूं का आटा (Whole Wheat Atta)',
    category: 'Dry Goods',
    pkgMaterialEn: 'Multi-layer PET / Met-PET / Poly Pouch or Moisture-Lock Woven Poly',
    pkgMaterialHi: 'मल्टी-लेयर PET / Met-PET पाउच या नमी-रोधी बुना बैग',
    idealTemp: '18°C - 24°C Dry storage',
    shelfLifeEn: '6 to 9 months (vs 2 months in paper)',
    shelfLifeHi: '6 से 9 महीने तक सुरक्षित',
    mapEn: 'Low residual oxygen moisture barrier',
    mapHi: 'कम ऑक्सीजन व नमी-रोधी सील',
    keyRisksEn: 'Lipase enzyme activity (flour souring), weevils, moisture lump caking',
    keyRisksHi: 'चोकर में कड़वाहट (खट्टापन), गांठे पड़ना और सूंडी/कीड़े लगना',
    scientificReasonEn: 'Whole wheat atta retains the germ containing unsaturated lipids. Lipase breaks this down into bitter free fatty acids if oxygen and humidity are not strictly barricaded.',
    scientificReasonHi: 'चक्की के ताजे आटे में तेल होता है। खुली बोरी में रखने पर हवा से आटा कड़वा हो जाता है। मल्टी-लेयर पाउच हवा और नमी रोककर आटे की मिठास बरकरार रखता है।',
  },
  lentils: {
    id: 'lentils',
    nameEn: 'Pulses & Lentils (Dal, Chana, Moong)',
    nameHi: 'दालें व दलहन (Pulses / Dal)',
    category: 'Dry Goods',
    pkgMaterialEn: 'Recyclable Mono-PE Standing Pouch or Woven PP with Inner Seal',
    pkgMaterialHi: 'रिसाइक्लेबल मोनो-PE स्टैंडिंग पाउच या बुनी बोरी',
    idealTemp: '18°C - 25°C Dry',
    shelfLifeEn: '12 to 18 months',
    shelfLifeHi: '12 से 18 महीने तक सुरक्षित',
    mapEn: 'Dry hermetic seal with desiccant option',
    mapHi: 'वायुरोधी सूखी सीलिंग',
    keyRisksEn: 'Pulse beetle (Callosobruchus maculatus) boring, color fading, hard-to-cook defect',
    keyRisksHi: 'दाल में सुसरी व कीड़े छेद करना, दाल का रंग फीका पड़ना और पकने में कड़ापन',
    scientificReasonEn: 'Storage in humid conditions causes pulse protein denaturation and lignin deposition in seed coats (Hard-To-Cook phenomenon). Polyethylene moisture barriers prevent hardness development.',
    scientificReasonHi: 'दाल में नमी आने पर दाल पकने में बहुत समय लेती है और उसमें छेद करने वाले कीड़े लग जाते हैं। सीलबंद थैली दाल को 1.5 साल तक बिल्कुल नई जैसी रखती है।',
  },
  turmeric: {
    id: 'turmeric',
    nameEn: 'Pure Turmeric & Ground Spices',
    nameHi: 'हल्दी व पिसे मसाले (Turmeric / Spices)',
    category: 'Spices',
    pkgMaterialEn: '3-Ply Aluminium Foil Laminate (PET 12µ / Alu Foil 9µ / PE 75µ)',
    pkgMaterialHi: '3-प्लाई एल्युमिनियम फॉयल लेमिनेट (PET / Alu Foil / PE)',
    idealTemp: '18°C - 24°C Ambient (<60% RH)',
    shelfLifeEn: '18 to 24 months full aroma retention',
    shelfLifeHi: '18 से 24 महीने तक ताज़ा रंग व खुशबू',
    mapEn: '100% Nitrogen flush packaging (Zero O₂)',
    mapHi: '100% नाइट्रोजन गैस फ्लश (शून्य ऑक्सीजन)',
    keyRisksEn: 'Curcumin photolysis under sunlight, volatile oil evaporation (turmerone loss)',
    keyRisksHi: 'धूप से करक्यूमिन का रंग उड़ना, खुशबूदार तेल उड़ जाना और गांठ बनना',
    scientificReasonEn: 'Curcumin degrades exponentially under UV radiation, turning dull gray-brown. Genuine 9-micron aluminum foil provides absolute zero light transmission and near-zero OTR.',
    scientificReasonHi: 'हल्दी का मुख्य तत्व करक्यूमिन धूप और हवा में तेजी से उड़ जाता है। एल्युमिनियम फॉयल वाली 3-परत थैली धूप और हवा को 100% रोककर 2 साल तक रंग और औषधीय गुण बचाती है।',
  },
  meat: {
    id: 'meat',
    nameEn: 'Fresh Meat & Chicken',
    nameHi: 'ताजा चिकन व मीट (Fresh Meat / Poultry)',
    category: 'Meat & Poultry',
    pkgMaterialEn: 'High-Barrier PET/EVOH/PE Thermoformed Skin Pack (VSP) or MAP Barrier Tray',
    pkgMaterialHi: 'हाई-बैरियर EVOH वैक्यूम स्किन पैक (VSP) या MAP ट्रे',
    idealTemp: '0°C - 2°C strictly (Cold chain vital)',
    shelfLifeEn: '12 to 16 days in MAP (vs 2-3 days open)',
    shelfLifeHi: '12 से 16 दिन तक सुरक्षित (खुले में केवल 2-3 दिन)',
    mapEn: '70% O₂ (for bloom) | 30% CO₂ or 100% Vacuum Skin',
    mapHi: 'लाल रंग के लिए 70% O₂ + 30% CO₂, या पूर्ण वैक्यूम स्किन',
    keyRisksEn: 'Psychrotrophic Pseudomonas spoilage, lipid rancidity, metmyoglobin browning, drip loss',
    keyRisksHi: 'बैक्टीरिया से बदबू व चिपचिपापन, रंग भूरा पड़ना और खून का रिसाव',
    scientificReasonEn: 'High water activity (Aw 0.99) and protein encourage rapid microbial expansion. Vacuum skin packing holds juices tight against muscle tissue while high CO₂ arrests spoilage microbes.',
    scientificReasonHi: 'मीट में पानी व खून होने से बैक्टीरिया बहुत तेजी से पनपते हैं। EVOH वैक्यूम स्किन पैक हवा को पूरी तरह निकालकर मीट को 2°C पर 2 हफ्ते तक सुरक्षित रखता है।',
  },
  fish: {
    id: 'fish',
    nameEn: 'Fresh Fish & Seafood',
    nameHi: 'ताजी मछली व समुद्री भोजन (Fresh Fish / Seafood)',
    category: 'Seafood',
    pkgMaterialEn: 'Barrier PA/EVOH/PE Deep-Draw Tray with Anti-Microbial Top Seal',
    pkgMaterialHi: 'EVOH बैरियर ट्रे व सीलबंद टॉप कवर',
    idealTemp: '0°C - 1°C on crushed ice slurry',
    shelfLifeEn: '9 to 12 days in MAP (vs 2-3 days standard)',
    shelfLifeHi: '9 से 12 दिन (खुले में 2 दिन)',
    mapEn: '0% O₂ | 40% CO₂ | 60% N₂ (Zero O₂ suppresses TMA)',
    mapHi: '0% ऑक्सीजन, 40% कार्बन डाइऑक्साइड, 60% नाइट्रोजन',
    keyRisksEn: 'Trimethylamine (TMA) fishy off-odor, Shewanella putrefaciens, protein autolysis',
    keyRisksHi: 'मछली की तेज बदबू (TMA), मांस का गलना और वजन घटना',
    scientificReasonEn: 'Marine fish contain trimethylamine oxide (TMAO) which bacteria reduce to volatile foul TMA. Strict exclusion of oxygen with 40% CO₂ inhibits TMA-producing bacteria at 0°C.',
    scientificReasonHi: 'मछली में ऑक्सीजन लगते ही गंध और सड़न शुरू हो जाती है। 40% CO₂ और शून्य ऑक्सीजन वाली MAP पैकेजिंग 0°C तापमान पर मछली को 10-12 दिन तक ताज़ा रखती है।',
  },
  milk: {
    id: 'milk',
    nameEn: 'Pasteurized & UHT Milk',
    nameHi: 'दूध (Fresh / UHT Milk)',
    category: 'Dairy',
    pkgMaterialEn: 'Aseptic 6-Layer Tetra Pak Carton or Co-extruded 3-Ply Opaque White/Black LDPE Pouch',
    pkgMaterialHi: 'असेप्टिक 6-लेयर टेट्रा पैक या 3-प्लाई अपारदर्शी काली-सफेद LDPE थैली',
    idealTemp: 'Pasteurized: 2°C - 4°C | UHT: Ambient unopened',
    shelfLifeEn: 'Pasteurized: 3-5 days | UHT Aseptic: 6 months unopened',
    shelfLifeHi: 'थैली वाला: 3-5 दिन (चिल्ड) | टेट्रा पैक: 6 महीने बिना फ्रिज',
    mapEn: 'Aseptic liquid filling with zero sterile air head',
    mapHi: 'जीवाणुरहित असेप्टिक पैकिंग',
    keyRisksEn: 'Riboflavin photo-degradation (sunlight off-taste), bacterial souring, bag puncture leaks',
    keyRisksHi: 'रोशनी से विटामिन B2 का नाश और स्वाद बिगड़ना, खट्टापन और थैली फटना',
    scientificReasonEn: 'Milk contains light-sensitive riboflavin (Vitamin B2) which acts as a photosensitizer creating sunlight-flavor aldehydes. The inner black layer of the 3-ply pouch blocks 100% of damaging light.',
    scientificReasonHi: 'दूध में मौजूद विटामिन रोशनी में खराब होकर स्वाद बिगाड़ देता है। इसलिए दूध की विशेष थैली में अंदर काली परत होती है जो रोशनी को रोकती है और दूध को सुरक्षित रखती है।',
  },
  mango: {
    id: 'mango',
    nameEn: 'Fresh Mangoes (Ratnagiri / Dashahari / Kent)',
    nameHi: 'आम (Mango)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Micro-perforated Equilibrium Film or Controlled Atmosphere Pouch',
    pkgMaterialHi: 'सूक्ष्म-छिद्रित सांस लेने वाली थैली (Micro-Perforated Pouch)',
    idealTemp: '12°C - 14°C (Never in cold fridge below 10°C)',
    shelfLifeEn: '14 to 18 days (vs 4-5 days unpackaged)',
    shelfLifeHi: '14 से 18 दिन (खुले में सिर्फ 4-5 दिन)',
    mapEn: '5% O₂ | 8% CO₂ | 87% N₂',
    mapHi: '5% ऑक्सीजन, 8% कार्बन डाइऑक्साइड, 87% नाइट्रोजन',
    keyRisksEn: 'Chilling injury below 10°C (skin pitting), anthracnose decay, fermentative ethanol off-flavor',
    keyRisksHi: '10°C से कम पर छिलके में काले गड्ढे (चिलिंग इंजरी), बंद थैली में शराब जैसी गंध',
    scientificReasonEn: 'Mangoes are tropical climacteric fruits with high respiration. Completely sealed airtight pouches cause anaerobic fermentation, generating ethanol and off-odors. Tailored micro-perforations prevent fermentation.',
    scientificReasonHi: 'आम एक सांस लेने वाला फल है। इसे पूरी तरह बंद थैली में रखने पर अंदर ऑक्सीजन खत्म हो जाती है और फल में शराब जैसी गंध आने लगती है। सूक्ष्म छिद्र वाली थैली 12-14°C पर फल को ताजा रखती है।',
  },
  banana: {
    id: 'banana',
    nameEn: 'Cavendish / Green Banana (Kela)',
    nameHi: 'केला (Banana)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Ethylene-Absorbing MAP Pouch with KMnO₄ Sachet or Perforated LDPE Bunch Wrap',
    pkgMaterialHi: 'एथिलीन अवशोषक MAP पाउच या छिद्रित LDPE बंच रैप',
    idealTemp: '13°C - 15°C (Never below 12°C — chilling injury)',
    shelfLifeEn: '20 to 28 days green / 5-7 days ripe',
    shelfLifeHi: '20 से 28 दिन हरा रहेगा; पीला होने पर 5-7 दिन',
    mapEn: '2-5% O₂ | 5-8% CO₂ | Balance N₂ + KMnO₄ ethylene scrubber',
    mapHi: '2-5% O₂, 5-8% CO₂ + एथिलीन सोखने वाला KMnO₄ पैकेट',
    keyRisksEn: 'Rapid ethylene autocatalytic ripening, crown rot (Colletotrichum), chilling injury',
    keyRisksHi: 'तेजी से पकना, ताज पर सड़न (Crown Rot), ठंड से छिलका काला पड़ना',
    scientificReasonEn: 'Bananas produce ethylene gas which triggers their own ripening. KMnO₄ sachets oxidize ethylene to CO₂, breaking the autocatalytic chain. Never store below 12°C or the cold causes irreversible cell membrane damage.',
    scientificReasonHi: 'केला स्वयं एथिलीन गैस छोड़कर खुद को पकाता है। KMnO₄ पैकेट इस गैस को सोखकर केले को 4 हफ्ते तक हरा रखता है। 12°C से नीचे रखने पर छिलका काला पड़ जाता है।',
  },
  grapes: {
    id: 'grapes',
    nameEn: 'Thompson / Nashik Grapes (Angoor)',
    nameHi: 'अंगूर (Grapes)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Ventilated PET Clamshell Tray with SO₂-releasing pad + Top-Seal Film',
    pkgMaterialHi: 'हवादार PET क्लैमशेल ट्रे + SO₂ पैड + टॉप-सील फिल्म',
    idealTemp: '-1°C to 0°C (Chilled)',
    shelfLifeEn: '35 to 60 days (export grade)',
    shelfLifeHi: '35 से 60 दिन (निर्यात ग्रेड)',
    mapEn: '3% O₂ | 10% CO₂ | SO₂ generating pad (5-8 ppm)',
    mapHi: '3% O₂, 10% CO₂, SO₂ पैड (बोट्राइटिस फफूंद रोकने के लिए)',
    keyRisksEn: 'Botrytis bunch rot (grey mold), stem browning, berry shatter, weight loss',
    keyRisksHi: 'बोट्राइटिस ग्रे मोल्ड फफूंद, डंठल का भूरा होना, दाने टूटना और वजन कम होना',
    scientificReasonEn: 'Botrytis cinerea is the primary post-harvest pathogen in grapes. SO₂ releasing pads (sodium metabisulphite) continuously emit micro-doses of antifungal SO₂ gas within the sealed tray, extending export shelf life.',
    scientificReasonHi: 'अंगूर में ग्रे फफूंद सबसे तेज नुकसान पहुंचाती है। SO₂ पैड धीरे-धीरे एंटी-फंगल गैस छोड़ता है जो ट्रे में फफूंद को रोकता है। इससे अंगूर यूरोप-अमेरिका निर्यात के लिए 60 दिन तक ताजा रहते हैं।',
  },
  guava: {
    id: 'guava',
    nameEn: 'Allahabad Safeda / Lucknow 49 Guava (Amrood)',
    nameHi: 'अमरूद (Guava)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Macro-perforated PE Net Bag or Semi-rigid PET Punnet',
    pkgMaterialHi: 'छिद्रित PE जाली की थैली या PET पनेट ट्रे',
    idealTemp: '8°C - 10°C',
    shelfLifeEn: '15 to 20 days',
    shelfLifeHi: '15 से 20 दिन तक ताजा',
    mapEn: '3-5% O₂ | 5-8% CO₂',
    mapHi: '3-5% O₂, 5-8% CO₂',
    keyRisksEn: 'Rapid softening, fruit fly infestation, anthracnose (Colletotrichum gloeosporioides)',
    keyRisksHi: 'जल्दी नरम पड़ना, फल मक्खी का नुकसान और काली सड़न फफूंद',
    scientificReasonEn: 'Guava has one of the highest respiration rates among tropical fruits. Controlled atmosphere packaging slows softening by suppressing pectinase enzyme activity.',
    scientificReasonHi: 'अमरूद बहुत तेजी से सांस लेता है और नरम पड़ता है। MAP पैकिंग इसे 8°C पर 20 दिन तक ताजा व सख्त रखती है।',
  },
  orange: {
    id: 'orange',
    nameEn: 'Nagpur Mandarin / Kinnow Orange',
    nameHi: 'संतरा (Nagpur Orange)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Ventilated Macro-perforated LDPE Mesh Bags or Stretch Wrap Net',
    pkgMaterialHi: 'हवादार जालीदार LDPE थैली या स्ट्रेच नेट रैप',
    idealTemp: '5°C - 8°C (90-95% RH)',
    shelfLifeEn: '30 to 45 days',
    shelfLifeHi: '30 से 45 दिन तक ताजा',
    mapEn: '5-10% O₂ | 0-5% CO₂ (CO₂ >10% causes off-flavors)',
    mapHi: '5-10% O₂, 5% से कम CO₂ (ज्यादा CO₂ से स्वाद बिगड़ता है)',
    keyRisksEn: 'Green mold (Penicillium digitatum), stem-end rot, rind pitting',
    keyRisksHi: 'हरी फफूंद (Penicillium), डंठल की सड़न, छिलके में गड्ढे',
    scientificReasonEn: 'Citrus is highly susceptible to Penicillium digitatum which spreads via contact. Waxed, ventilated mesh bags reduce contact while maintaining gas exchange to prevent CO₂ injury.',
    scientificReasonHi: 'संतरे में Penicillium फफूंद एक फल से दूसरे में फैलती है। मोम लेपित जाली थैली फलों को अलग रखती है और हवा पास करने देती है।',
  },
  strawberry: {
    id: 'strawberry',
    nameEn: 'Mahabaleshwar / Panchgani Strawberries',
    nameHi: 'स्ट्रॉबेरी (Strawberry)',
    category: 'Fresh Fruits',
    pkgMaterialEn: 'Anti-Fog Perforated OPP Punnet Overwrap (120-gauge) or Clamshell PET',
    pkgMaterialHi: 'एंटी-फॉग OPP ओवरव्रैप या PET क्लैमशेल ट्रे',
    idealTemp: '0°C - 2°C (Never freeze)',
    shelfLifeEn: '7 to 10 days (vs 1-2 days open)',
    shelfLifeHi: '7 से 10 दिन (खुले में 1-2 दिन)',
    mapEn: '15-20% CO₂ | 5-10% O₂ (High CO₂ suppresses Botrytis)',
    mapHi: '15-20% CO₂ + 5-10% O₂ (ज्यादा CO₂ फफूंद रोकती है)',
    keyRisksEn: 'Grey mold (Botrytis cinerea), mechanical bruising, rapid weight loss via transpiration',
    keyRisksHi: 'ग्रे ब्राउन फफूंद, थोड़ी सी ठोकर से दब जाना, तेजी से पानी उड़ना',
    scientificReasonEn: 'Strawberries are among the most perishable fruits. The combination of high surface-to-volume ratio, delicate skin, and high water activity makes them highly susceptible. High CO₂ MAP reduces Botrytis spore germination by >95%.',
    scientificReasonHi: 'स्ट्रॉबेरी बहुत नाजुक होती है और जल्दी खराब होती है। 15-20% CO₂ वाली MAP पैकिंग फफूंद को 95% तक रोकती है और 0°C पर 10 दिन तक ताजी रखती है।',
  },
  spinach: {
    id: 'spinach',
    nameEn: 'Palak / Baby Spinach',
    nameHi: 'पालक (Spinach)',
    category: 'Vegetables',
    pkgMaterialEn: 'Macro-perforated Anti-Fog OPP Pillow Bag or Pre-cut Salad MAP Pack',
    pkgMaterialHi: 'एंटी-फॉग छिद्रित OPP पिलो बैग या MAP सलाद पैक',
    idealTemp: '0°C - 2°C (95-100% RH)',
    shelfLifeEn: '10 to 14 days (vs 2-3 days loose)',
    shelfLifeHi: '10 से 14 दिन ताजा हरा (खुले में 2-3 दिन)',
    mapEn: '1-2% O₂ | 10-15% CO₂',
    mapHi: '1-2% O₂, 10-15% CO₂',
    keyRisksEn: 'Yellowing (chlorophyll degradation), sliminess (bacterial breakdown), wilting',
    keyRisksHi: 'पत्ते पीले पड़ना, चिपचिपापन और सूखना/मुरझाना',
    scientificReasonEn: 'Spinach has extremely high respiration. At 20°C, it loses its green color within 24 hours. MAP at 0-2°C slows chlorophyllase enzyme activity, preserving green color and crispness.',
    scientificReasonHi: 'पालक की सांस लेने की दर बहुत ज्यादा होती है। 20°C पर 24 घंटे में पीली हो जाती है। 0°C MAP पैकिंग में हरा रंग 2 हफ्ते बना रहता है।',
  },
  mushroom: {
    id: 'mushroom',
    nameEn: 'Button / Oyster Mushroom (Khumbi)',
    nameHi: 'मशरूम (खुम्ब/Mushroom)',
    category: 'Vegetables',
    pkgMaterialEn: 'Macro-perforated Anti-Fog PE Pouch or PET Punnet with Bio-based Top Wrap',
    pkgMaterialHi: 'एंटी-फॉग छिद्रित PE पाउच या PET ट्रे',
    idealTemp: '2°C - 4°C',
    shelfLifeEn: '8 to 12 days',
    shelfLifeHi: '8 से 12 दिन तक ताजा सफेद',
    mapEn: '8-10% O₂ | 10-15% CO₂',
    mapHi: '8-10% O₂, 10-15% CO₂',
    keyRisksEn: 'Enzymatic browning (tyrosinase), cap opening, moisture condensation causing slime',
    keyRisksHi: 'रंग भूरा पड़ना, छाता खुलना और नमी से चिपचिपापन',
    scientificReasonEn: 'Mushrooms have no protective skin; they continue respiring after harvest at very high rates. Anti-fog film prevents moisture droplets on the cap surface that accelerate bacterial browning.',
    scientificReasonHi: 'मशरूम के पास सुरक्षात्मक छिलका नहीं होता और यह बहुत तेजी से सांस लेता है। एंटी-फॉग थैली पानी की बूंदें जमने से रोकती है जो भूरा पड़ने का मुख्य कारण हैं।',
  },
  paneer: {
    id: 'paneer',
    nameEn: 'Fresh Paneer / Cottage Cheese',
    nameHi: 'पनीर (Fresh Paneer)',
    category: 'Dairy',
    pkgMaterialEn: 'High-Barrier PA/EVOH/PE Vacuum Pouch or MAP Tray (100% N₂)',
    pkgMaterialHi: 'EVOH वैक्यूम पाउच या नाइट्रोजन MAP ट्रे',
    idealTemp: '1°C - 4°C (Cold chain mandatory)',
    shelfLifeEn: '15 to 25 days vacuum / 7-10 days MAP',
    shelfLifeHi: 'वैक्यूम: 15-25 दिन / MAP: 7-10 दिन',
    mapEn: '100% N₂ flush (zero oxygen) or Vacuum Skin Pack',
    mapHi: '100% नाइट्रोजन फ्लश या वैक्यूम स्किन पैक',
    keyRisksEn: 'Mold growth (Aspergillus), yeast souring, texture hardening, color yellowing',
    keyRisksHi: 'फफूंद लगना, खट्टापन, पनीर सख्त होना और पीला रंग',
    scientificReasonEn: 'Fresh paneer has high moisture (55-60%) and neutral pH 5.5-6.2, making it an ideal growth medium for mold and yeast. Vacuum removes oxygen completely, extending shelf life from 3 days to 25 days at 4°C.',
    scientificReasonHi: 'पनीर में 60% तक नमी और न्यूट्रल pH होने से फफूंद और बैक्टीरिया बहुत तेजी से पनपते हैं। वैक्यूम पाउच ऑक्सीजन हटाकर पनीर को 4°C पर 25 दिन तक ताजा रखता है।',
  },
  butter: {
    id: 'butter',
    nameEn: 'Table Butter / White Butter',
    nameHi: 'मक्खन (Butter)',
    category: 'Dairy',
    pkgMaterialEn: 'Metallized Foil Laminate or PVDC-coated Greaseproof Wrapper',
    pkgMaterialHi: 'मेटलाइज़्ड फॉयल लेमिनेट या ग्रीस-प्रूफ PVDC रैपर',
    idealTemp: '4°C - 8°C (refrigerated) or <-18°C frozen',
    shelfLifeEn: '3 to 6 months refrigerated with good barrier',
    shelfLifeHi: '3 से 6 महीने फ्रिज में बैरियर पैकेजिंग के साथ',
    mapEn: 'Vacuum or 100% N₂ (No oxygen tolerance for lipid-rich products)',
    mapHi: '100% नाइट्रोजन या वैक्यूम',
    keyRisksEn: 'Lipid oxidation rancidity, tainting from refrigerator odors, surface mold',
    keyRisksHi: 'तेल से बदबू आना (rancidity), फ्रिज की बदबू लगना और सतह पर फफूंद',
    scientificReasonEn: 'Butter fat contains 80% lipids including polyunsaturated fatty acids. Light and oxygen trigger free radical chain reactions causing rancid aldehyde formation. Metallized foil provides absolute light and oxygen barrier.',
    scientificReasonHi: 'मक्खन में 80% वसा होती है जो हवा और रोशनी से बासी हो जाती है। मेटलाइज्ड फॉयल रैपर रोशनी और ऑक्सीजन दोनों को 100% रोकता है।',
  },
  ghee: {
    id: 'ghee',
    nameEn: 'Pure Desi Ghee / Clarified Butter',
    nameHi: 'घी (Pure Desi Ghee)',
    category: 'Dairy',
    pkgMaterialEn: 'Food-grade Tin Can or Dark Glass Jar or MET-PET Multi-layer Pouch',
    pkgMaterialHi: 'फूड-ग्रेड टिन डिब्बा, डार्क ग्लास जार या MET-PET पाउच',
    idealTemp: 'Ambient 18-25°C (cool, dark, dry)',
    shelfLifeEn: '12 to 18 months with good barrier packaging',
    shelfLifeHi: '12 से 18 महीने तक शुद्ध रहेगा',
    mapEn: 'Nitrogen blanket in tin / light-blocking dark glass',
    mapHi: 'टिन में नाइट्रोजन ब्लैंकेट या प्रकाश-रोधी डार्क जार',
    keyRisksEn: 'Photo-oxidation rancidity, moisture absorption (Aw increase), off-odor from plastic migration',
    keyRisksHi: 'प्रकाश से बासीपन, नमी सोखना और प्लास्टिक से गंध आना',
    scientificReasonEn: 'Ghee has near-zero water activity (Aw 0.02) but is highly vulnerable to light-catalyzed oxidation. Opaque tin cans with nitrogen blanketing exclude both light and residual oxygen.',
    scientificReasonHi: 'घी में पानी न होने से बैक्टीरिया नहीं पनपते, लेकिन रोशनी और हवा से बासी हो जाता है। टिन डिब्बे में नाइट्रोजन भरकर 18 महीने तक शुद्ध रखा जाता है।',
  },
  tea: {
    id: 'tea',
    nameEn: 'Darjeeling / Assam Tea',
    nameHi: 'चाय (Tea / Chai)',
    category: 'Beverages',
    pkgMaterialEn: 'Aluminium Foil Laminate 4-Ply Zipper Pouch with N₂ Flush',
    pkgMaterialHi: '4-प्लाई एल्युमिनियम फॉयल ज़िपर पाउच + नाइट्रोजन फ्लश',
    idealTemp: 'Cool, dark, dry 15-20°C (<50% RH)',
    shelfLifeEn: '18 to 24 months aroma retained',
    shelfLifeHi: '18 से 24 महीने तक महक बरकरार रहेगी',
    mapEn: '100% N₂ flush (eliminates oxidative staling)',
    mapHi: '100% नाइट्रोजन फ्लश (ऑक्सीजन बिल्कुल नहीं)',
    keyRisksEn: 'Catechin oxidation (staling), moisture absorption (caking), odor tainting',
    keyRisksHi: 'चाय के कैटेकिन का ऑक्सीकरण (बेस्वाद होना), नमी से गांठ और दूसरी बदबू लगना',
    scientificReasonEn: 'Tea polyphenols (catechins, theaflavins) are extremely oxygen-sensitive and undergo enzymatic browning even at ambient conditions. Aluminum foil laminate provides OTR <0.01 cc/m²·day.',
    scientificReasonHi: 'चाय के पॉलीफेनॉल हवा में तेजी से ऑक्सीकृत होकर बेस्वाद हो जाते हैं। एल्युमिनियम फॉयल और नाइट्रोजन फ्लश चाय की महक और स्वाद 2 साल तक बचाते हैं।',
  },
  coffee: {
    id: 'coffee',
    nameEn: 'Coorg / Chikmagalur Coffee Beans / Powder',
    nameHi: 'कॉफी (Coffee)',
    category: 'Beverages',
    pkgMaterialEn: 'Valve-equipped 4-Ply MET-PET Gusset Pouch with N₂ Flush + One-Way Degassing Valve',
    pkgMaterialHi: 'वन-वे डिगैसिंग वाल्व के साथ 4-प्लाई MET-PET पाउच',
    idealTemp: 'Cool, dark 15-20°C',
    shelfLifeEn: '12 to 18 months whole bean / 6-9 months ground',
    shelfLifeHi: 'साबुत बीन: 12-18 महीने / पिसी कॉफी: 6-9 महीने',
    mapEn: 'N₂ flush + One-way CO₂ degassing valve (fresh-roast CO₂ release)',
    mapHi: 'नाइट्रोजन फ्लश + CO₂ निकालने वाला वन-वे वाल्व',
    keyRisksEn: 'Lipid rancidity (caffeol oxidation), CO₂ bag burst without valve, moisture absorption',
    keyRisksHi: 'कॉफी का तेल बासी होना, वाल्व के बिना थैली फटना और नमी से गांठ पड़ना',
    scientificReasonEn: 'Freshly roasted coffee emits CO₂ for weeks. A one-way degassing valve allows CO₂ to escape without letting oxygen enter, preventing both bag burst and oxidative staling simultaneously.',
    scientificReasonHi: 'भुनी कॉफी हफ्तों तक CO₂ गैस छोड़ती है। वन-वे वाल्व इसे बाहर जाने देता है लेकिन हवा अंदर नहीं आने देता। इससे थैली न फटे और कॉफी बासी न हो।',
  },
  nuts: {
    id: 'nuts',
    nameEn: 'Almonds / Cashews / Walnuts (Dry Nuts)',
    nameHi: 'बादाम, काजू, अखरोट (Dry Nuts)',
    category: 'Dry Goods',
    pkgMaterialEn: 'Metallized BOPP / PE Zip-Lock Pouch with N₂ Flush or Vacuum',
    pkgMaterialHi: 'मेटलाइज़्ड BOPP/PE ज़िप-लॉक पाउच + नाइट्रोजन या वैक्यूम',
    idealTemp: 'Ambient 15-18°C dry or Refrigerated 2-4°C for max life',
    shelfLifeEn: '12 to 18 months (ambient N₂) / 24 months refrigerated',
    shelfLifeHi: 'नाइट्रोजन में: 12-18 महीने / फ्रिज में: 2 साल तक',
    mapEn: 'Vacuum or 100% N₂ (prevent lipid oxidation and aflatoxin)',
    mapHi: 'वैक्यूम या 100% नाइट्रोजन (तेल बासी होने से बचाने के लिए)',
    keyRisksEn: 'Lipid rancidity (PUFA oxidation), aflatoxin mold contamination (>60% RH), insect infestation',
    keyRisksHi: 'बादाम-काजू का तेल बासी होना, एफ्लाटॉक्सिन फफूंद (>60% RH पर) और कीड़े',
    scientificReasonEn: 'Tree nuts are rich in unsaturated fatty acids (oleic, linoleic) vulnerable to auto-oxidation. PUFA + oxygen = rancid peroxides (hexanal, nonanal). N₂ flush to <1% oxygen completely stops this chain reaction.',
    scientificReasonHi: 'सूखे मेवों में बहुत अधिक तेल होता है जो हवा से बासी हो जाता है। नाइट्रोजन से भरे पाउच में ऑक्सीजन 1% से कम रहती है जिससे 18 महीने तक बिल्कुल ताज़ा स्वाद बना रहता है।',
  },
  bread: {
    id: 'bread',
    nameEn: 'Bread / Pav / Loaf (Bakery)',
    nameHi: 'ब्रेड व पाव (Bread / Bakery)',
    category: 'Bakery',
    pkgMaterialEn: 'OPP Twist-Wrap or PE Wicket Bag with Ethanol Emitter or N₂ MAP',
    pkgMaterialHi: 'OPP ट्विस्ट-रैप या PE बैग + इथेनॉल एमिटर या नाइट्रोजन फ्लश',
    idealTemp: 'Ambient 18-22°C (not refrigerated — staling accelerates)',
    shelfLifeEn: '7 to 12 days with ethanol emitter',
    shelfLifeHi: '7 से 12 दिन एथेनॉल एमिटर के साथ (फ्रिज में न रखें)',
    mapEn: 'Ethanol vapor emitter (100-500 ppm C₂H₅OH) or N₂ MAP',
    mapHi: 'एथेनॉल इमिटर या नाइट्रोजन फ्लश',
    keyRisksEn: 'Mold growth (Rhizopus, Aspergillus), staling (retrogradation), moisture migration',
    keyRisksHi: 'काली-हरी फफूंद, ब्रेड का बासी व कड़ा होना और नमी का लेन-देन',
    scientificReasonEn: 'Bread staling is caused by amylopectin retrogradation — starch recrystallization. Refrigeration speeds retrogradation 6x. Ethanol emitters release antifungal vapor that inhibits mold without chemical preservatives.',
    scientificReasonHi: 'ब्रेड को फ्रिज में रखने से और ज्यादा कड़ी हो जाती है। एथेनॉल इमिटर फफूंद को बिना केमिकल के रोकता है और 12 दिन तक ब्रेड नरम व सुरक्षित रहती है।',
  },
  cookies: {
    id: 'cookies',
    nameEn: 'Biscuits / Cookies / Namkeen',
    nameHi: 'बिस्कुट, कुकीज़, नमकीन',
    category: 'Snacks',
    pkgMaterialEn: 'Co-extruded Met-OPP / PE Pillow Pack with N₂ flush (cushion protection)',
    pkgMaterialHi: 'मेटलाइज़्ड OPP/PE पिलो पैक + नाइट्रोजन (टूटने से बचाने के लिए)',
    idealTemp: 'Ambient 18-25°C Cool Dry',
    shelfLifeEn: '4 to 9 months N₂-flushed',
    shelfLifeHi: '4 से 9 महीने नाइट्रोजन में',
    mapEn: '100% N₂ (acts as cushioning gas + antioxidant)',
    mapHi: '100% नाइट्रोजन (कुशन + एंटी-ऑक्सिडेंट)',
    keyRisksEn: 'Moisture migration (texture softening / sogginess), lipid rancidity, breakage in transit',
    keyRisksHi: 'नमी से कुरकुरापन खोना, तेल बासी होना और ट्रांसपोर्ट में टूटना',
    scientificReasonEn: 'The crispness of biscuits depends on maintaining water activity below 0.35. Nitrogen gas also serves as a protective cushion gas preventing mechanical breakage during vibration transit.',
    scientificReasonHi: 'बिस्कुट का कुरकुरापन तभी बना रहता है जब नमी Aw 0.35 से कम हो। नाइट्रोजन गैस कुशन का काम करके ट्रांसपोर्ट में बिस्कुट टूटने से बचाती है।',
  },
};


// Regulatory and technical FAQ knowledge
const TECH_KNOWLEDGE: Record<string, { en: string; hi: string }> = {
  fssai: {
    en: 'Under FSSAI (Packaging) Regulations 2018 and BIS IS 9845, the Overall Migration Limit (OML) for food-contact plastics is 60 mg/kg (or 10 mg/dm²). Direct food contact surfaces must use virgin food-grade polymers compliant with IS 10146 (PE) or IS 10142 (PP) with zero recycled plastic in direct contact.',
    hi: 'FSSAI पैकेजिंग नियम 2018 और BIS IS 9845 के अनुसार, भोजन के संपर्क में आने वाले प्लास्टिक से रासायनिक रिसाव (OML) 60 mg/kg से कम होना अनिवार्य है। भोजन के सीधे संपर्क के लिए केवल वर्जिन फूड-ग्रेड पॉलीमर (IS 10146 PE या IS 10142 PP) की ही अनुमति है।',
  },
  map: {
    en: 'Modified Atmosphere Packaging (MAP) replaces normal air (21% O₂, 0.04% CO₂) with a customized gas mixture. Elevated CO₂ (10-30%) suppresses bacterial and fungal growth, while reduced O₂ (2-5%) slows produce respiration without crossing the critical anaerobic threshold.',
    hi: 'मॉडिफाइड एटमॉस्फियर पैकेजिंग (MAP) में थैली की सामान्य हवा हटाकर विशेष गैस मिश्रण (जैसे 5% O₂, 10% CO₂, 85% N₂) भरा जाता है। यह उत्पाद के सांस लेने की गति धीमी करता है और फफूंद व बैक्टीरिया को रोककर शेल्फ-लाइफ 3 से 4 गुना बढ़ाता है।',
  },
  otr_wvtr: {
    en: 'OTR (Oxygen Transmission Rate in cc/m²·day) dictates how much oxygen penetrates the packaging, critical for preventing lipid oxidation and fruit fermentation. WVTR (Water Vapor Transmission Rate in g/m²·day) dictates moisture barrier, essential to avoid produce shriveling or dry food sogginess.',
    hi: 'OTR (ऑक्सीजन ट्रांसमिशन दर) बताती है कि पैकेजिंग में कितनी ऑक्सीजन आ सकती है, जो तेल के खराब होने और फल के पकने को नियंत्रित करती है। WVTR (वाष्प ट्रांसमिशन दर) नमी को रोकती है ताकि सूखा सामान सीले नहीं और ताजे फल सिकुड़ें नहीं।',
  },
  biodegradable: {
    en: 'Bio-based PLA (Polylactic Acid) and PHA (Polyhydroxyalkanoate) offer industrial compostability certified under IS/ISO 17088. They suit fresh produce and dry goods with moderate moisture barrier, supporting Plastic Waste Management Rules (PWMR) compliance.',
    hi: 'बायो-डीग्रेडेबल PLA और PHA मक्के और कृषि अवशेषों से बने पर्यावरण-अनुकूल प्लास्टिक हैं। ये IS/ISO 17088 के तहत खाद में बदल जाते हैं और भारत के प्लास्टिक अपशिष्ट प्रबंधन नियमों (PWMR 2022) के अनुकूल हैं।',
  },
  cold_chain: {
    en: 'Temperature abuse is the #1 cause of food spoilage in transit. For every 10°C rise, produce respiration doubles (Q10 rule). PackWise recommends insulated reefer transport maintained within ±1.5°C of commodity optimal temperature to preserve packaging integrity.',
    hi: 'रास्ते में तापमान बढ़ना भोजन खराब होने का सबसे बड़ा कारण है। तापमान 10°C बढ़ते ही फल-सब्जियों के खराब होने की गति दोगुनी हो जाती है। कोल्ड-चेन में तापमान को सही सीमा में रखना जरूरी है ताकि पैकेजिंग के अंदर पसीना न जमे।',
  },
};

/**
 * Identify product from free-form user query
 */
function findProductInQuery(query: string): string | null {
  const q = query.toLowerCase();

  for (const [key, aliases] of Object.entries(PRODUCT_ALIASES)) {
    for (const alias of aliases) {
      if (q.includes(alias.toLowerCase())) {
        return key;
      }
    }
  }

  // Also check COMMODITIES_100 list
  for (const c of COMMODITIES_100) {
    if (q.includes(c.name.toLowerCase())) {
      const n = c.name.toLowerCase();
      for (const [key, aliases] of Object.entries(PRODUCT_ALIASES)) {
        if (aliases.some((a) => n.includes(a))) return key;
      }
    }
  }

  return null;
}

/**
 * Formulate non-repetitive dynamic food packaging advice
 */
export function generateFoodPackagingAdvice(
  query: string,
  lang: SupportedLanguage = 'en'
): AiFoodAdvice {
  callCount++;
  const lowerQuery = query.toLowerCase();
  const isHindi = lang === 'hi';

  // 1. Check Technical / Standards / Regulatory queries
  if (lowerQuery.includes('fssai') || lowerQuery.includes('is 9845') || lowerQuery.includes('bis') || lowerQuery.includes('migration') || lowerQuery.includes('regulation') || lowerQuery.includes('नियम') || lowerQuery.includes('मानक')) {
    const data = TECH_KNOWLEDGE.fssai;
    return {
      replyText: isHindi ? data.hi : data.en,
      category: 'Regulatory Standards',
    };
  }

  if (lowerQuery.includes('map') || lowerQuery.includes('modified atmosphere') || lowerQuery.includes('गैस') || lowerQuery.includes('nitrogen flush')) {
    const data = TECH_KNOWLEDGE.map;
    return {
      replyText: isHindi ? data.hi : data.en,
      category: 'MAP Gas Technology',
    };
  }

  if (lowerQuery.includes('otr') || lowerQuery.includes('wvtr') || lowerQuery.includes('permeability') || lowerQuery.includes('पारगम्यता')) {
    const data = TECH_KNOWLEDGE.otr_wvtr;
    return {
      replyText: isHindi ? data.hi : data.en,
      category: 'Barrier Physics',
    };
  }

  if (lowerQuery.includes('biodegradable') || lowerQuery.includes('pla') || lowerQuery.includes('pha') || lowerQuery.includes('compostable') || lowerQuery.includes('बायो') || lowerQuery.includes('पर्यावरण')) {
    const data = TECH_KNOWLEDGE.biodegradable;
    return {
      replyText: isHindi ? data.hi : data.en,
      category: 'Sustainable Materials',
    };
  }

  if (lowerQuery.includes('cold chain') || lowerQuery.includes('reefer') || lowerQuery.includes('temperature') || lowerQuery.includes('कोल्ड') || lowerQuery.includes('तापमान') || lowerQuery.includes('ट्रक')) {
    const data = TECH_KNOWLEDGE.cold_chain;
    return {
      replyText: isHindi ? data.hi : data.en,
      category: 'Cold Chain Logistics',
    };
  }

  // 2. Identify Product in query
  const productId = findProductInQuery(lowerQuery);

  if (productId && FOOD_KNOWLEDGE_MAP[productId]) {
    const food = FOOD_KNOWLEDGE_MAP[productId];
    const variantIndex = callCount % 3;

    let response = '';

    if (isHindi) {
      if (variantIndex === 0) {
        response = `${food.nameHi} के लिए अनुशंसित पैकेजिंग: **${food.pkgMaterialHi}**। इसे **${food.idealTemp}** तापमान पर रखने पर शेल्फ-लाइफ **${food.shelfLifeHi}** हो जाएगी। गैस अनुपात: ${food.mapHi}। यह तकनीक ${food.keyRisksHi} से पूर्ण सुरक्षा देती है। ${food.scientificReasonHi}`;
      } else if (variantIndex === 1) {
        response = `वैज्ञानिक खाद्य विश्लेषण (${food.nameHi}): **${food.scientificReasonHi}** सर्वोत्तम परिणाम के लिए **${food.pkgMaterialHi}** चुनें। अनुशंसित तापमान **${food.idealTemp}** है। इससे शेल्फ-लाइफ **${food.shelfLifeHi}** तक विस्तारित होगी (गैस मिश्रण: ${food.mapHi})।`;
      } else {
        response = `स्मार्ट पैकेजिंग प्रोटोकॉल - ${food.nameHi}: मुख्य जोखिम ${food.keyRisksHi} है। इसका समाधान **${food.pkgMaterialHi}** है। भंडारण तापमान **${food.idealTemp}** तथा सुरक्षित ताज़गी अवधि **${food.shelfLifeHi}** है।`;
      }
    } else {
      if (variantIndex === 0) {
        response = `PackWise AI packaging advisory for **${food.nameEn}**: Recommended structure is **${food.pkgMaterialEn}**. Storage at **${food.idealTemp}** extends shelf life to **${food.shelfLifeEn}**. Target MAP atmosphere: ${food.mapEn}. This mitigates: ${food.keyRisksEn}. ${food.scientificReasonEn}`;
      } else if (variantIndex === 1) {
        response = `Bio-kinetic profile for **${food.nameEn}**: ${food.scientificReasonEn} Use **${food.pkgMaterialEn}** maintained at **${food.idealTemp}**. Expected shelf stability: **${food.shelfLifeEn}** under ${food.mapEn}. Critical hazards prevented: ${food.keyRisksEn}.`;
      } else {
        response = `Packaging Engineering Specification — **${food.nameEn}**: Optimal film is **${food.pkgMaterialEn}**. Storage protocol: **${food.idealTemp}** with MAP (${food.mapEn}). Extends freshness to **${food.shelfLifeEn}**, directly preventing ${food.keyRisksEn}.`;
      }
    }

    return {
      replyText: response,
      matchedCommodity: food.nameEn,
      category: food.category,
      recommendedMaterial: food.pkgMaterialEn,
      shelfLife: food.shelfLifeEn,
      storageTemp: food.idealTemp,
      mapAtmosphere: food.mapEn,
    };
  }

  // 3. Category Fallback if commodity not directly mapped
  if (lowerQuery.includes('fruit') || lowerQuery.includes('फल') || lowerQuery.includes('berry') || lowerQuery.includes('melon')) {
    return {
      replyText: isHindi
        ? 'ताजे फलों के लिए श्वसन-संतुलित पैकेजिंग (Micro-perforated BOPP या Bio-PLA Clamshell) आवश्यक है। फल को 2°C-12°C पर रखें और MAP गैस अनुपात 3-5% O₂ तथा 5-10% CO₂ रखें ताकि फफूंद न लगे और फल 2-3 गुना ज्यादा चले।'
        : 'For fresh fruits, PackWise AI prescribes respiration-equilibrated micro-perforated BOPP or bio-based PLA clamshells. Maintain storage at 2°C-12°C with tailored MAP (3-5% O₂ | 5-10% CO₂) to suppress fungal decay without anaerobic alcohol formation.',
      category: 'Fresh Fruits',
    };
  }

  if (lowerQuery.includes('vegetable') || lowerQuery.includes('सब्जी') || lowerQuery.includes('sag') || lowerQuery.includes('greens')) {
    return {
      replyText: isHindi
        ? 'सब्जियों के लिए एंटी-फॉग व सूक्ष्म-छिद्रित पाउच उपयुक्त है जो पसीना जमने से रोकता है। हरी पत्तेदार सब्जियों को 0-2°C और कंद सब्जियों (आलू-प्याज) को हवादार 15°C पर रखें।'
        : 'For vegetables, anti-fog micro-perforated polyolefin films prevent condensation pooling while maintaining aerobic respiration. Leafy greens require 0-2°C, while tubers require dry, dark, well-ventilated ambient storage.',
      category: 'Vegetables',
    };
  }

  if (lowerQuery.includes('sweet') || lowerQuery.includes('mithai') || lowerQuery.includes('मिठाई') || lowerQuery.includes('barfi') || lowerQuery.includes('halwa')) {
    return {
      replyText: isHindi
        ? 'भारतीय मिठाइयों (मावा/खोया बर्फी, लड्डू) में अधिक वसा व नमी होती है। इसके लिए EVOH/PET हाई-बैरियर ट्रे व 100% नाइट्रोजन फ्लश पैकिंग करें। इससे फफूंद और तेल की बासी गंध रुकती है और मिठाई 30-45 दिन तक ताजी रहती है।'
        : 'Traditional Indian sweets (Mithai/Mawa) have high moisture and lipid content. High-barrier EVOH thermoformed trays with 100% Nitrogen gas flush prevent microbial mold and lipid rancidity, extending freshness to 30-45 days at 4°C.',
      category: 'Dairy Sweets',
    };
  }

  if (lowerQuery.includes('oil') || lowerQuery.includes('तेल') || lowerQuery.includes('mustard oil')) {
    return {
      replyText: isHindi
        ? 'खाद्य तेलों के लिए प्रकाश-रोधी टिन्ड कंटेनर या UV-ब्लॉक 5-लेयर नायलॉन पाउच की सिफारिश की जाती है। ऑक्सीजन और सूर्य की रोशनी तेल को बासी व कड़वा बनाती है।'
        : 'Edible cooking oils require opaque tin containers or UV-barrier multi-layer Nylon/EVOH/PE pouches. Eliminating light and headspace oxygen prevents hydroperoxide formation and off-flavor rancidity.',
      category: 'Edible Oils',
    };
  }

  // 4. Dynamic General Response with scientific depth (NEVER repeating static sentence)
  const generalVariantsHi = [
    'PackWise AI खाद्य विज्ञान इंजन: सही पैकेजिंग चुनने के लिए उत्पाद के तीन मुख्य कारकों—श्वसन दर (Respiration), नमी (Moisture/Aw), और वसा प्रतिशत पर विचार किया जाता है। ताजे उत्पादों के लिए सूक्ष्म-छिद्रित एंटी-फॉग थैली और सूखे व तैलीय भोजन के लिए एल्युमिनियम फॉयल या EVOH लेमिनेट चुनें। किसी विशेष उत्पाद (जैसे टमाटर, सेब, चावल, पनीर, मीट) का नाम पूछें!',
    'खाद्य संरक्षण सलाह: किसी भी खाद्य पदार्थ की शेल्फ-लाइफ बढ़ाने के लिए ऑक्सीजन (OTR) और नमी (WVTR) का संतुलन आवश्यक है। ताजे फल व सब्जियों को सांस लेने के लिए नियंत्रित हवादार थैली चाहिए, जबकि दाल, दूध पाउडर और मसालों को वायुरोधी हाई-बैरियर पाउच चाहिए। कृपया अपने उत्पाद का नाम बताएं!',
    'विशेषज्ञ पैकेजिंग प्रणाली: FSSAI 2018 व BIS मानकों के अनुरूप केवल फूड-ग्रेड वर्जिन प्लास्टिक का उपयोग करें। आप ऊपर दिए गए सर्च बॉक्स या माइक में किसी भी भारतीय फल, सब्जी, अनाज या डेयरी उत्पाद का नाम बोलकर उसकी सटीक तापमान, गैस और थैली की सिफारिश जान सकते हैं।',
  ];

  const generalVariantsEn = [
    'PackWise AI Multi-Criteria Decision Engine: Packaging selection is governed by product respiration rate, water activity (Aw), and lipid oxidation susceptibility. For respiring fresh produce, choose micro-perforated anti-fog films; for dry or high-fat foods, utilize EVOH or metallized barrier pouches. Specify any crop (e.g. Tomato, Rice, Paneer, Apple) for exact parameters!',
    'Food Preservation Science Guidance: Extending shelf-life requires balancing Oxygen Transmission (OTR) with Water Vapor Transmission (WVTR). Respiring commodities need controlled gas permeability, while spices and bakery require hermetic nitrogen barriers. Ask about any specific agricultural or dairy product for full telemetry!',
    'Agro-Packaging Standard Protocol: Under FSSAI 2018 and BIS IS 9845 regulations, all food-contact layers must be certified virgin polymers. Enter or speak any specific food commodity to receive its custom MAP gas ratios, storage temperatures, and projected shelf-life gain.',
  ];

  const chosenIndex = callCount % 3;
  return {
    replyText: isHindi ? generalVariantsHi[chosenIndex] : generalVariantsEn[chosenIndex],
    category: 'Universal Food Science',
  };
}
