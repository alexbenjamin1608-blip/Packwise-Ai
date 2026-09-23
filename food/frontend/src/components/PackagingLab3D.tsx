import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Eye,
  Layers,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle,
  Maximize2,
  Box,
  Thermometer,
  Wind,
  Info,
  ChevronDown
} from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

interface PackagingLab3DProps {
  initialMaterialId?: string;
}

interface FoodProductOption {
  id: string;
  name: string;
  category: string;
  colorHex: number;
  respirationRate: string;
  idealTempC: number;
  criticalO2: number | null;
  optimumRh: number;
  defaultLifeDays: number;
  recommendedPackaging: string;
  targetMap: string;
}

const FOOD_PRODUCTS: FoodProductOption[] = [
  { id: 'mango', name: 'Alphonso Mango', category: 'Fresh Fruits', colorHex: 0xf59e0b, respirationRate: 'High (45 mL/kg.h)', idealTempC: 13, criticalO2: 2.0, optimumRh: 90, defaultLifeDays: 18, recommendedPackaging: 'Micro-perforated PET / LDPE', targetMap: '5% O₂ | 10% CO₂ | Bal N₂' },
  { id: 'apple', name: 'Kashmiri Apple', category: 'Fresh Fruits', colorHex: 0xdc2626, respirationRate: 'Moderate (15 mL/kg.h)', idealTempC: 2, criticalO2: 1.5, optimumRh: 92, defaultLifeDays: 60, recommendedPackaging: 'Anti-Fog Tray Wrap BOPP', targetMap: '2% O₂ | 1% CO₂ | Bal N₂' },
  { id: 'strawberry', name: 'Fresh Strawberries', category: 'Fresh Fruits', colorHex: 0xe11d48, respirationRate: 'Very High (60 mL/kg.h)', idealTempC: 1, criticalO2: 2.0, optimumRh: 95, defaultLifeDays: 7, recommendedPackaging: 'Perforated Clamshell Bio-PLA', targetMap: '10% O₂ | 15% CO₂ | Bal N₂' },
  { id: 'tomato', name: 'Cherry / Vine Tomato', category: 'Vegetables', colorHex: 0xef4444, respirationRate: 'Moderate (22 mL/kg.h)', idealTempC: 12, criticalO2: 3.0, optimumRh: 90, defaultLifeDays: 14, recommendedPackaging: 'Micro-perforated Flow-Wrap', targetMap: '4% O₂ | 6% CO₂ | Bal N₂' },
  { id: 'broccoli', name: 'Fresh Broccoli Florets', category: 'Vegetables', colorHex: 0x15803d, respirationRate: 'Extremely High (95 mL/kg.h)', idealTempC: 0, criticalO2: 2.0, optimumRh: 95, defaultLifeDays: 12, recommendedPackaging: 'High-Transmission LDPE Pouch', targetMap: '2% O₂ | 8% CO₂ | Bal N₂' },
  { id: 'mushroom', name: 'Button Mushrooms', category: 'Vegetables', colorHex: 0xf5f5f4, respirationRate: 'Extremely High (110 mL/kg.h)', idealTempC: 1, criticalO2: 2.0, optimumRh: 95, defaultLifeDays: 8, recommendedPackaging: 'Breathable Chitosan Micro-film', targetMap: '5% O₂ | 10% CO₂ | Bal N₂' },
  { id: 'paneer', name: 'Fresh Malai Paneer', category: 'Dairy', colorHex: 0xf8fafc, respirationRate: 'Non-Respiring (Anaerobic)', idealTempC: 4, criticalO2: null, optimumRh: 85, defaultLifeDays: 21, recommendedPackaging: 'EVOH Multi-Layer Vacuum Pack', targetMap: '0% O₂ | 30% CO₂ | 70% N₂' },
  { id: 'butter', name: 'Creamery Butter', category: 'Dairy', colorHex: 0xfde047, respirationRate: 'Non-Respiring', idealTempC: 4, criticalO2: null, optimumRh: 65, defaultLifeDays: 180, recommendedPackaging: 'Aluminum Foil / PE Laminate', targetMap: 'Hermetic Nitrogen Flush' },
  { id: 'bread', name: 'Artisan Bread Loaf', category: 'Bakery', colorHex: 0xb45309, respirationRate: 'Non-Respiring (Mold Risk)', idealTempC: 20, criticalO2: null, optimumRh: 60, defaultLifeDays: 14, recommendedPackaging: 'High Barrier PVDC / PET', targetMap: '0% O₂ | 40% CO₂ | 60% N₂' },
  { id: 'rice', name: 'Basmati Rice & Grains', category: 'Dry Goods', colorHex: 0xd4a373, respirationRate: 'Non-Respiring (Weevil Risk)', idealTempC: 22, criticalO2: null, optimumRh: 50, defaultLifeDays: 365, recommendedPackaging: 'Heavy Duty HDPE Woven Bag', targetMap: 'Hermetic Moisture Lock' },
  { id: 'meat', name: 'Prime Beef Ribeye Steak', category: 'Meat & Poultry', colorHex: 0x991b1b, respirationRate: 'Non-Respiring (Pseudomonas)', idealTempC: 1, criticalO2: null, optimumRh: 85, defaultLifeDays: 14, recommendedPackaging: 'Barrier PET / EVOH / PE Skin Pack', targetMap: '70% O₂ (Bloomed) | 30% CO₂' },
  { id: 'fish', name: 'Fresh Salmon Fillet', category: 'Seafood', colorHex: 0xf97316, respirationRate: 'Non-Respiring (TMA Spoilage)', idealTempC: 0.5, criticalO2: null, optimumRh: 90, defaultLifeDays: 10, recommendedPackaging: 'EVOH Thermoformed Barrier Tray', targetMap: '40% CO₂ | 60% N₂ (Zero O₂)' },
];

interface LayerSpec {
  name: string;
  material: string;
  role: string;
  thickness: string;
  barrierRating: string;
  strengthRating: string;
  sealRating: string;
  moistureProt: string;
  oxygenProt: string;
}

const LAYER_DETAILS: Record<string, LayerSpec> = {
  'Outer Layer': {
    name: 'Outer Layer (BOPET / BOPP)',
    material: 'Biaxially Oriented Polyester / Polypropylene',
    role: 'Puncture resistance, dimensional stiffness, and high-definition reverse gravure printing',
    thickness: '12 - 20 µm',
    barrierRating: 'Moderate (OTR: 75-110 cc)',
    strengthRating: 'High Tensile (165 MPa)',
    sealRating: 'Thermal Barrier (Non-sealing)',
    moistureProt: 'Good (WVTR: ~18 g/m²)',
    oxygenProt: 'Moderate',
  },
  'Barrier Layer': {
    name: 'Barrier Core (EVOH / Metallized / Foil)',
    material: 'Ethylene Vinyl Alcohol (EVOH) / Vacuum Met-PET / Al-Foil',
    role: 'Near-absolute block against oxygen, aroma volatilization, UV oxidation, and moisture migration',
    thickness: '3 - 15 µm',
    barrierRating: 'Ultra High (OTR < 1.5 cc)',
    strengthRating: 'Flexible Core',
    sealRating: 'Non-sealing (Encapsulated)',
    moistureProt: 'High Barrier (WVTR < 0.5 g/m²)',
    oxygenProt: 'Near Zero (< 0.5 cc/m².day)',
  },
  'Adhesive Layer': {
    name: 'Tie / Adhesive Layer (Solventless PU / Maleic PE)',
    material: 'Solventless Polyurethane / Grafted Copolymer',
    role: 'Bonds dissimilar polymers preventing delamination under sub-zero storage and vibration',
    thickness: '2 - 4 µm',
    barrierRating: 'Structural Bond',
    strengthRating: 'Bond Strength > 4.5 N/15mm',
    sealRating: 'N/A',
    moistureProt: 'Neutral',
    oxygenProt: 'Neutral',
  },
  'Sealant Layer': {
    name: 'Sealant Matrix (Metallocene LLDPE / CPP)',
    material: 'Food-Grade Metallocene Linear Low-Density Polyethylene',
    role: 'Hermetic thermal heat seal at 120-145°C with high hot tack and fat/acid resistance',
    thickness: '40 - 80 µm',
    barrierRating: 'Superior Moisture Barrier',
    strengthRating: 'High Impact / Drop Resistant',
    sealRating: 'Hermetic Heat Seal (Grade A)',
    moistureProt: 'Superior (WVTR < 3 g/m²)',
    oxygenProt: 'Standard Permeable',
  },
};

export const PackagingLab3D: React.FC<PackagingLab3DProps> = ({
  initialMaterialId = 'pet-pe-multilayer',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('mango');
  const [selectedPackagingType, setSelectedPackagingType] = useState<string>('pouch');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(initialMaterialId);
  const [explodeDistance, setExplodeDistance] = useState<number>(0);
  const [isXrayMode, setIsXrayMode] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<string>('Barrier Layer');

  // Refs for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const packageMeshRef = useRef<THREE.Mesh | null>(null);
  const foodMeshGroupRef = useRef<THREE.Group | null>(null);
  const explodedPlatesRef = useRef<THREE.Mesh[]>([]);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeFood = FOOD_PRODUCTS.find((f) => f.id === selectedFoodId) || FOOD_PRODUCTS[0];
  const activeMaterial = PACKAGING_MATERIALS.find((m) => m.id === selectedMaterialId) || PACKAGING_MATERIALS[0];

  // Helper to build 3D procedural food meshes
  const buildFoodMesh = (foodId: string): THREE.Group => {
    const group = new THREE.Group();

    if (foodId === 'mango') {
      // Mango Ovoid with Kidney Curvature
      const geo = new THREE.SphereGeometry(0.72, 32, 32);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const taper = 1 - (y + 0.72) * 0.22;
        pos.setX(i, (x + 0.12 * Math.sin(y * 2.0)) * taper);
        pos.setZ(i, z * 0.85 * taper);
      }
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.05 });
      group.add(new THREE.Mesh(geo, mat));

      // Stem & Leaf
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0x3f2e18 }));
      stem.position.set(0.04, 0.75, 0);
      group.add(stem);
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0x15803d, side: THREE.DoubleSide }));
      leaf.scale.set(1, 0.2, 2.5);
      leaf.position.set(0.2, 0.76, 0.05);
      leaf.rotation.set(0.5, 0.3, -0.8);
      group.add(leaf);
    } else if (foodId === 'apple') {
      // Apple: sphere indented at top and bottom
      const geo = new THREE.SphereGeometry(0.7, 32, 32);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        let y = pos.getY(i);
        const z = pos.getZ(i);
        if (y > 0.4) y -= 0.12 * Math.exp(-(x * x + z * z) * 4);
        if (y < -0.4) y += 0.08 * Math.exp(-(x * x + z * z) * 4);
        pos.setY(i, y);
      }
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.25, metalness: 0.1 });
      group.add(new THREE.Mesh(geo, mat));

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x2b1d0c }));
      stem.position.set(0, 0.72, 0);
      stem.rotation.z = -0.15;
      group.add(stem);
    } else if (foodId === 'strawberry') {
      // Strawberry: tapered cone
      const geo = new THREE.ConeGeometry(0.58, 1.1, 32);
      geo.rotateX(Math.PI);
      const mat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
      group.add(new THREE.Mesh(geo, mat));

      // Green star calyx
      const calyx = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.05, 0.06, 6), new THREE.MeshStandardMaterial({ color: 0x15803d }));
      calyx.position.set(0, 0.56, 0);
      group.add(calyx);
    } else if (foodId === 'tomato') {
      // Tomato: slightly squashed glossy sphere with star calyx
      const geo = new THREE.SphereGeometry(0.68, 32, 32);
      geo.scale(1.1, 0.9, 1.1);
      const mat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.15, metalness: 0.1 });
      group.add(new THREE.Mesh(geo, mat));

      const calyx = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.02, 0.04, 5), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
      calyx.position.set(0, 0.62, 0);
      group.add(calyx);
    } else if (foodId === 'paneer') {
      // Paneer: fresh cuboid dairy block with rounded bevels
      const geo = new THREE.BoxGeometry(1.25, 0.75, 0.95);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.0 });
      group.add(new THREE.Mesh(geo, mat));
    } else if (foodId === 'butter') {
      // Butter: golden-yellow bar
      const geo = new THREE.BoxGeometry(1.3, 0.65, 0.65);
      const mat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3, metalness: 0.05 });
      group.add(new THREE.Mesh(geo, mat));
    } else if (foodId === 'bread') {
      // Bread loaf: rounded box
      const geo = new THREE.BoxGeometry(1.35, 0.8, 0.75);
      const mat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
      const loaf = new THREE.Mesh(geo, mat);
      group.add(loaf);
    } else if (foodId === 'rice') {
      // Grain sack: rounded pouch
      const geo = new THREE.CylinderGeometry(0.65, 0.75, 1.3, 16);
      const mat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 });
      group.add(new THREE.Mesh(geo, mat));
    } else if (foodId === 'meat') {
      // Steak: marbled crimson cut
      const geo = new THREE.CylinderGeometry(0.75, 0.75, 0.28, 32);
      geo.scale(1.2, 1, 0.85);
      const mat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.35, metalness: 0.1 });
      group.add(new THREE.Mesh(geo, mat));
    } else if (foodId === 'fish') {
      // Salmon fillet: tapered rectangular slice
      const geo = new THREE.BoxGeometry(1.4, 0.26, 0.8);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
      group.add(new THREE.Mesh(geo, mat));
    } else {
      // Default produce sphere
      const geo = new THREE.SphereGeometry(0.7, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: activeFood.colorHex, roughness: 0.4 });
      group.add(new THREE.Mesh(geo, mat));
    }

    // Floating Golden AI Telemetry Ring
    const ringGeo = new THREE.TorusGeometry(1.15, 0.012, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.7 });
    const orbit = new THREE.Mesh(ringGeo, ringMat);
    orbit.rotation.x = Math.PI / 3;
    group.add(orbit);

    return group;
  };

  // Helper to build 3D packaging geometry based on packaging type
  const buildPackagingMesh = (pkgType: string): THREE.Mesh => {
    let geo: THREE.BufferGeometry;
    let color = 0x38bdf8;
    let opacity = isXrayMode ? 0.2 : 0.4;

    if (pkgType === 'tray') {
      // MAP Rigid Tray with transparent lidding
      geo = new THREE.BoxGeometry(2.1, 1.2, 1.6);
      color = 0x06b6d4;
    } else if (pkgType === 'skin') {
      // Contour Skin Pack
      geo = new THREE.BoxGeometry(1.85, 1.0, 1.4);
      color = 0x10b981;
      opacity = 0.28;
    } else if (pkgType === 'clamshell') {
      // Rigid PET Clamshell
      geo = new THREE.BoxGeometry(2.0, 1.9, 1.5);
      color = 0x38bdf8;
      opacity = 0.3;
    } else {
      // Standard Flexible Pillow Pouch
      geo = new THREE.BoxGeometry(1.9, 2.3, 1.35);
      color = 0x38bdf8;
    }

    const mat = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.45,
      thickness: 0.6,
      wireframe: isWireframe,
      side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geo, mat);
  };

  // Re-build 3D Food Mesh when selectedFoodId changes
  useEffect(() => {
    if (!sceneRef.current) return;
    if (foodMeshGroupRef.current) {
      sceneRef.current.remove(foodMeshGroupRef.current);
    }
    const newGroup = buildFoodMesh(selectedFoodId);
    foodMeshGroupRef.current = newGroup;
    sceneRef.current.add(newGroup);
  }, [selectedFoodId]);

  // Re-build Packaging Mesh when selectedPackagingType or wireframe or xray changes
  useEffect(() => {
    if (!sceneRef.current) return;
    if (packageMeshRef.current) {
      sceneRef.current.remove(packageMeshRef.current);
    }
    const newPkg = buildPackagingMesh(selectedPackagingType);
    packageMeshRef.current = newPkg;
    sceneRef.current.add(newPkg);
  }, [selectedPackagingType, isWireframe, isXrayMode]);

  // Update exploded plates positions based on explodeDistance slider
  useEffect(() => {
    const plates = explodedPlatesRef.current;
    if (!plates || plates.length === 0) return;

    const baseOffsets = [1.6, 0.9, 0.3, -0.4];
    plates.forEach((plate, i) => {
      const targetY = baseOffsets[i] + (explodeDistance / 100) * (1.2 * (i - 1.5));
      const targetZ = (explodeDistance / 100) * (0.8 * (i - 1.5));
      plate.position.set(0, targetY, targetZ);
    });

    if (packageMeshRef.current) {
      packageMeshRef.current.visible = explodeDistance < 15;
    }
  }, [explodeDistance]);

  // Main Three.js Scene Lifecycle
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    cyanLight.position.set(4, 5, 3);
    scene.add(cyanLight);

    const goldLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    goldLight.position.set(-4, 3, -2);
    scene.add(goldLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.5, 10);
    rimLight.position.set(0, -2, 2);
    scene.add(rimLight);

    // Grid
    const gridHelper = new THREE.GridHelper(8, 24, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // Initial Food Mesh
    const initialFood = buildFoodMesh(selectedFoodId);
    foodMeshGroupRef.current = initialFood;
    scene.add(initialFood);

    // Initial Package Mesh
    const initialPkg = buildPackagingMesh(selectedPackagingType);
    packageMeshRef.current = initialPkg;
    scene.add(initialPkg);

    // Exploded Plates Group
    const explodedGroup = new THREE.Group();
    const layersConfig = [
      { name: 'Outer Layer', yOffset: 1.6, color: 0x38bdf8, opacity: 0.65 },
      { name: 'Barrier Layer', yOffset: 0.9, color: 0xf59e0b, opacity: 0.8 },
      { name: 'Adhesive Layer', yOffset: 0.3, color: 0xfcd34d, opacity: 0.5 },
      { name: 'Sealant Layer', yOffset: -0.4, color: 0x10b981, opacity: 0.7 },
    ];

    const plates: THREE.Mesh[] = [];
    layersConfig.forEach((cfg) => {
      const plateGeo = new THREE.BoxGeometry(2.3, 0.04, 1.8);
      const plateMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        roughness: 0.2,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = cfg.yOffset;
      plate.name = cfg.name;
      explodedGroup.add(plate);
      plates.push(plate);
    });
    explodedPlatesRef.current = plates;
    scene.add(explodedGroup);

    // Gas Molecule Particles
    const particleGroup = new THREE.Group();
    particlesGroupRef.current = particleGroup;
    const pGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const o2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const co2Mat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const h2oMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });

    for (let i = 0; i < 60; i++) {
      const mat = i % 3 === 0 ? o2Mat : i % 3 === 1 ? co2Mat : h2oMat;
      const p = new THREE.Mesh(pGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 1.5;
      p.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.5, Math.sin(angle) * radius);
      particleGroup.add(p);
    }
    scene.add(particleGroup);

    // Mouse Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      if (foodMeshGroupRef.current) foodMeshGroupRef.current.rotation.y += dx * 0.008;
      if (packageMeshRef.current) packageMeshRef.current.rotation.y += dx * 0.008;
      explodedGroup.rotation.y += dx * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging) {
        if (foodMeshGroupRef.current) foodMeshGroupRef.current.rotation.y += 0.006;
        if (packageMeshRef.current) packageMeshRef.current.rotation.y += 0.006;
        explodedGroup.rotation.y += 0.006;
      }

      particleGroup.visible = isXrayMode;
      if (isXrayMode) {
        particleGroup.children.forEach((p) => {
          p.position.y += 0.004;
          if (p.position.y > 1.4) p.position.y = -1.4;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Multi-Polymer Physics Lab</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">All 100 Commodity Types</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Interactive 3D <span className="bg-gradient-to-r from-amber-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">Packaging & Material Simulator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Rotate, peel, and inspect multi-layer barrier structures across various fresh produce, dairy, bakery, meat, and seafood products.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isWireframe ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-slate-300 border-white/10'
            }`}
          >
            Wireframe: {isWireframe ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setIsXrayMode(!isXrayMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isXrayMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-300 border-white/10'
            }`}
          >
            X-Ray Gas Flux: {isXrayMode ? 'ACTIVE' : 'OFF'}
          </button>
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAutoRotate ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-slate-300 border-white/10'
            }`}
          >
            Auto-Spin: {isAutoRotate ? 'ON' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl glass-card border border-white/10 bg-slate-950/60">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Food Commodity
          </label>
          <select
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            {FOOD_PRODUCTS.map((f) => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Packaging Enclosure
          </label>
          <select
            value={selectedPackagingType}
            onChange={(e) => setSelectedPackagingType(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="pouch">Flexible Pillow Pouch (Sealed)</option>
            <option value="tray">MAP Rigid Barrier Tray + Top Lid</option>
            <option value="skin">Contour Vacuum Skin Pack (VSP)</option>
            <option value="clamshell">Crystal Clear PET Clamshell</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Barrier Film Spec
          </label>
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            {PACKAGING_MATERIALS.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.shortCode} - {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Layer Explode Peeling</span>
            <span className="text-cyan-300 font-mono">{explodeDistance}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={explodeDistance}
            onChange={(e) => setExplodeDistance(parseInt(e.target.value) || 0)}
            className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* Main 3D Canvas + Technical Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Canvas Viewport (7 Columns) */}
        <div className="lg:col-span-7 rounded-3xl glass-card border border-white/15 p-2 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
          <div ref={mountRef} className="w-full h-full min-h-[480px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing" />

          {/* Canvas Floating Overlay Badges */}
          <div className="absolute top-5 left-5 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xl text-left pointer-events-none">
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active 3D Substrate</p>
            <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {activeFood.name} in {activeMaterial.shortCode}
            </p>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <span className="text-[10px] text-slate-400 font-mono bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/5">
              Drag mouse to rotate 360° • Explode slider to separate layers
            </span>
            <span className="text-[10px] text-teal-300 font-mono bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-teal-500/30">
              Target MAP: {activeFood.targetMap}
            </span>
          </div>
        </div>

        {/* Right Information & Layer Specs (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Food Biological Constraints Card */}
          <div className="p-5 rounded-3xl glass-card border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Food Biological Constraint</span>
                <h3 className="text-base font-extrabold text-white">{activeFood.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeFood.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase">Respiration Rate</span>
                <p className="font-bold text-white mt-0.5">{activeFood.respirationRate}</p>
              </div>
              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase">Ideal Temp / RH</span>
                <p className="font-bold text-cyan-300 mt-0.5">{activeFood.idealTempC}°C / {activeFood.optimumRh}% RH</p>
              </div>
              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase">Default Fresh Life</span>
                <p className="font-bold text-emerald-300 mt-0.5">{activeFood.defaultLifeDays} Days Max</p>
              </div>
              <div className="bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase">Recommended Pack</span>
                <p className="font-bold text-amber-300 mt-0.5 truncate">{activeFood.recommendedPackaging}</p>
              </div>
            </div>
          </div>

          {/* Multi-Layer Structure Selector & Deep Dive */}
          <div className="p-5 rounded-3xl glass-card border border-white/15 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Cross-Section Layer Breakdown
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">4-PLY LAMINATE</span>
            </div>

            {/* Layer Selection Tabs */}
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(LAYER_DETAILS).map((lName) => (
                <button
                  key={lName}
                  onClick={() => setActiveLayer(lName)}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                    activeLayer === lName
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <p className="font-bold truncate">{lName}</p>
                  <p className="text-[10px] text-slate-400">{LAYER_DETAILS[lName].thickness}</p>
                </button>
              ))}
            </div>

            {/* Detailed Spec for Selected Layer */}
            {LAYER_DETAILS[activeLayer] && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{LAYER_DETAILS[activeLayer].name}</span>
                  <span className="text-[10px] font-mono text-cyan-300">{LAYER_DETAILS[activeLayer].thickness}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-cyan-400">Function: </strong>
                  {LAYER_DETAILS[activeLayer].role}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-slate-400">Oxygen Barrier: </span>
                    <span className="text-white font-mono">{LAYER_DETAILS[activeLayer].oxygenProt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Moisture Barrier: </span>
                    <span className="text-white font-mono">{LAYER_DETAILS[activeLayer].moistureProt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tensile Rating: </span>
                    <span className="text-white font-mono">{LAYER_DETAILS[activeLayer].strengthRating}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Seal Integrity: </span>
                    <span className="text-white font-mono">{LAYER_DETAILS[activeLayer].sealRating}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
