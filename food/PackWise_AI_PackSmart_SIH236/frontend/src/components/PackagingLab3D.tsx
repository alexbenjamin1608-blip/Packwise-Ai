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
} from 'lucide-react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

interface PackagingLab3DProps {
  initialMaterialId?: string;
}

interface LayerSpec {
  name: string;
  material: string;
  role: string;
  thickness: string;
  barrierRating: string;
  strengthRating: string;
  sealRating: string;
  flexibility: string;
  moistureProt: string;
  oxygenProt: string;
}

const LAYER_DETAILS: Record<string, LayerSpec> = {
  'Outer Layer': {
    name: 'Outer Layer (BOPET / BOPP)',
    material: 'Biaxially Oriented Polyester',
    role: 'Puncture resistance, heat stability, and reverse flexo/gravure printing surface',
    thickness: '12 - 20 µm',
    barrierRating: 'Moderate',
    strengthRating: 'High (140 MPa)',
    sealRating: 'Non-sealing (Thermal resist)',
    flexibility: 'High flex-crack resistance',
    moistureProt: 'Good',
    oxygenProt: 'Moderate',
  },
  'Barrier Layer': {
    name: 'Barrier Layer (EVOH / Metallized / AlOx)',
    material: 'Ethylene Vinyl Alcohol / Vacuum Met-PET',
    role: 'Blocks oxygen transmission ($O_2$), aroma volatiles, and UV light degradation',
    thickness: '3 - 12 µm',
    barrierRating: 'Ultra High (OTR < 1.5 cc)',
    strengthRating: 'Moderate',
    sealRating: 'Requires tie layer',
    flexibility: 'Moderate',
    moistureProt: 'High',
    oxygenProt: 'Near Absolute Barrier',
  },
  'Adhesive Layer': {
    name: 'Adhesive / Tie Layer',
    material: 'Solventless Polyurethane / Maleic Anhydride PE',
    role: 'Bonds dissimilar polymers preventing delamination during shipping and thermal shifts',
    thickness: '2 - 4 µm',
    barrierRating: 'Low',
    strengthRating: 'High interlaminar bond (>4 N/15mm)',
    sealRating: 'N/A',
    flexibility: 'Extremely flexible',
    moistureProt: 'Neutral',
    oxygenProt: 'Neutral',
  },
  'Sealant Layer': {
    name: 'Sealant Layer (Metallocene LLDPE / CPP)',
    material: 'Linear Low Density Polyethylene (Food Grade)',
    role: 'Direct food contact layer providing hermetic heat sealing and moisture resistance',
    thickness: '40 - 70 µm',
    barrierRating: 'High Moisture / Low Gas',
    strengthRating: 'High tear & puncture resistance',
    sealRating: 'Hermetic Hot-Tack Seal (110°C - 135°C)',
    flexibility: 'Ultra Flexible',
    moistureProt: 'Superior (WVTR < 4 g/m²·day)',
    oxygenProt: 'Permeable',
  },
};

export const PackagingLab3D: React.FC<PackagingLab3DProps> = ({
  initialMaterialId = 'pet-pe-multilayer',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(initialMaterialId);
  const [thicknessMicrons, setThicknessMicrons] = useState<number>(75);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isXrayMode, setIsXrayMode] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<string>('Barrier Layer');
  const [sceneState, setSceneState] = useState<{ fps: number }>({ fps: 60 });

  // Refs for Three.js state manipulation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const packageMeshRef = useRef<THREE.Mesh | null>(null);
  const explodedGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const foodMeshRef = useRef<THREE.Group | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);

  const activeMaterial = PACKAGING_MATERIALS.find((m) => m.id === selectedMaterialId) || PACKAGING_MATERIALS[0];

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and high pixel ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    cyanKeyLight.position.set(4, 5, 3);
    scene.add(cyanKeyLight);

    const goldFillLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    goldFillLight.position.set(-4, 3, -2);
    scene.add(goldFillLight);

    const bottomRimLight = new THREE.PointLight(0x38bdf8, 1.5, 10);
    bottomRimLight.position.set(0, -2, 2);
    scene.add(bottomRimLight);

    // 5. Holographic Floor Mandala Grid
    const gridHelper = new THREE.GridHelper(8, 24, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // Golden floor ring
    const ringGeo = new THREE.RingGeometry(1.4, 1.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = -1.59;
    scene.add(floorRing);

    // 6. Food Model: Realistic Alphonso Mango Group
    const foodGroup = new THREE.Group();
    foodMeshRef.current = foodGroup;

    // Procedural Mango Shape using modified sphere geometry
    const mangoGeo = new THREE.SphereGeometry(0.72, 32, 32);
    // Stretch and curve mango form
    const posAttr = mangoGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      let y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      // Mango tapering at bottom and slight kidney curve
      const factor = 1 - (y + 0.72) * 0.25;
      posAttr.setX(i, x * factor * 0.85);
      posAttr.setZ(i, z * factor * 1.15);
      if (y > 0) {
        posAttr.setX(i, x * 0.95 + Math.sin(y * 2) * 0.08);
      }
    }
    mangoGeo.computeVertexNormals();

    // Mango Material with saffron, orange, and fresh green gradient tones
    const mangoMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf59e0b),
      roughness: 0.35,
      metalness: 0.05,
      emissive: new THREE.Color(0x78350f),
      emissiveIntensity: 0.15,
    });
    const mangoMesh = new THREE.Mesh(mangoGeo, mangoMat);
    foodGroup.add(mangoMesh);

    // Stem and green leaf
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.25, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f2e18, roughness: 0.9 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0.04, 0.75, 0);
    stem.rotation.z = -0.15;
    foodGroup.add(stem);

    // Fresh Green Leaf
    const leafGeo = new THREE.ConeGeometry(0.18, 0.5, 16);
    leafGeo.scale(1, 0.2, 2.5);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0.2, 0.76, 0.05);
    leaf.rotation.set(0.5, 0.3, -0.8);
    foodGroup.add(leaf);

    // Golden AI Energy Orbiting Rings
    const orbitGeo = new THREE.TorusGeometry(1.15, 0.012, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.75,
    });
    const orbit1 = new THREE.Mesh(orbitGeo, orbitMat);
    orbit1.rotation.x = Math.PI / 3;
    foodGroup.add(orbit1);
    haloRef.current = orbit1;

    const orbit2 = new THREE.Mesh(orbitGeo, orbitMat.clone());
    orbit2.rotation.x = -Math.PI / 4;
    orbit2.rotation.y = Math.PI / 6;
    foodGroup.add(orbit2);

    scene.add(foodGroup);

    // 7. Single Standard Package Enclosure (Pouch/Clamshell)
    const pkgGeo = new THREE.BoxGeometry(1.9, 2.4, 1.4, 16, 16, 16);
    const pkgMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5,
      thickness: 0.5,
      side: THREE.DoubleSide,
    });
    const packageMesh = new THREE.Mesh(pkgGeo, pkgMat);
    packageMeshRef.current = packageMesh;
    scene.add(packageMesh);

    // 8. Exploded View Layer Group
    const explodedGroup = new THREE.Group();
    explodedGroup.visible = false;
    explodedGroupRef.current = explodedGroup;

    // 4 Layers: Outer, Barrier, Adhesive, Sealant
    const layersConfig = [
      { name: 'Outer Layer', yOffset: 1.6, color: 0x38bdf8, opacity: 0.65 },
      { name: 'Barrier Layer', yOffset: 0.9, color: 0xf59e0b, opacity: 0.8 },
      { name: 'Adhesive Layer', yOffset: 0.3, color: 0xfcd34d, opacity: 0.5 },
      { name: 'Sealant Layer', yOffset: -0.4, color: 0x10b981, opacity: 0.7 },
    ];

    layersConfig.forEach((cfg) => {
      const layerPlateGeo = new THREE.BoxGeometry(2.3, 0.04, 1.8);
      const layerPlateMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        roughness: 0.2,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const plate = new THREE.Mesh(layerPlateGeo, layerPlateMat);
      plate.position.y = cfg.yOffset;
      plate.name = cfg.name;
      explodedGroup.add(plate);

      // Connecting holographic vertical guide lines
      const lineMat = new THREE.LineDashedMaterial({
        color: 0x06b6d4,
        dashSize: 0.1,
        gapSize: 0.05,
      });
      const points = [
        new THREE.Vector3(-1.1, cfg.yOffset, -0.85),
        new THREE.Vector3(-1.1, -1.2, -0.85),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      explodedGroup.add(line);
    });

    scene.add(explodedGroup);

    // 9. X-Ray Gas Permeation Molecules Particle System
    const particleGroup = new THREE.Group();
    particleGroup.visible = false;
    particlesGroupRef.current = particleGroup;

    const particleCount = 70;
    const pGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const o2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // O2 - Cyan
    const co2Mat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // CO2 - Green
    const h2oMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd }); // H2O - Light Blue

    const particleData: { mesh: THREE.Mesh; speed: number; dir: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const matType = i % 3 === 0 ? o2Mat : i % 3 === 1 ? co2Mat : h2oMat;
      const pMesh = new THREE.Mesh(pGeo, matType);
      // Random position outside/around package
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 1.5;
      pMesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius
      );
      particleGroup.add(pMesh);
      particleData.push({
        mesh: pMesh,
        speed: 0.008 + Math.random() * 0.012,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    scene.add(particleGroup);

    // 10. Mouse interaction for orbit rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (sceneRef.current) {
        sceneRef.current.rotation.y += deltaX * 0.008;
        if (cameraRef.current) {
          cameraRef.current.position.y = Math.max(
            0.5,
            Math.min(3.5, cameraRef.current.position.y - deltaY * 0.008)
          );
          cameraRef.current.lookAt(0, 0, 0);
        }
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.003;
      cameraRef.current.position.z = Math.max(2.5, Math.min(8.0, newZ));
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Auto rotation
      if (isAutoRotate && sceneRef.current) {
        sceneRef.current.rotation.y += 0.004;
      }

      // Mango golden orbit rotation
      if (haloRef.current) {
        haloRef.current.rotation.z = elapsedTime * 0.8;
      }

      // Gas particles movement
      if (particlesGroupRef.current && particlesGroupRef.current.visible) {
        particleData.forEach((p) => {
          p.mesh.position.y += Math.sin(elapsedTime * 2 + p.mesh.position.x) * 0.005;
          // Pulse inwards towards food, bounce off if barrier is high
          const dist = Math.sqrt(p.mesh.position.x ** 2 + p.mesh.position.z ** 2);
          if (dist > 2.8) {
            p.dir = -1;
          } else if (dist < 0.9) {
            p.dir = 1; // Bounced off packaging
          }
          p.mesh.position.x += Math.cos(elapsedTime) * p.speed * p.dir;
          p.mesh.position.z += Math.sin(elapsedTime) * p.speed * p.dir;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight || 520;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isAutoRotate]);

  // Handle Material & Thickness Changes in Three.js Scene
  useEffect(() => {
    if (!packageMeshRef.current) return;
    const mat = packageMeshRef.current.material as THREE.MeshPhysicalMaterial;

    // Calculate thickness ratio (50 to 150 µm)
    const thicknessNormalized = (thicknessMicrons - 50) / 100;

    // Dynamically adjust material properties
    switch (selectedMaterialId) {
      case 'alu-foil-laminate':
        mat.color = new THREE.Color(0xd1d5db);
        mat.metalness = 0.95;
        mat.roughness = 0.15;
        mat.transmission = 0.0;
        mat.opacity = 1.0;
        break;
      case 'metallized-bopp-pet':
        mat.color = new THREE.Color(0x94a3b8);
        mat.metalness = 0.85;
        mat.roughness = 0.25;
        mat.transmission = 0.1;
        mat.opacity = 0.9;
        break;
      case 'high-barrier-evoh':
        mat.color = new THREE.Color(0x38bdf8);
        mat.metalness = 0.05;
        mat.roughness = 0.08;
        mat.transmission = 0.8 - thicknessNormalized * 0.2;
        mat.opacity = 0.35 + thicknessNormalized * 0.3;
        break;
      case 'biodegradable-pla':
        mat.color = new THREE.Color(0xa3e635);
        mat.metalness = 0.02;
        mat.roughness = 0.45;
        mat.transmission = 0.5 - thicknessNormalized * 0.2;
        mat.opacity = 0.5 + thicknessNormalized * 0.25;
        break;
      case 'bopp-paper-kraft':
        mat.color = new THREE.Color(0xd97706);
        mat.metalness = 0.0;
        mat.roughness = 0.85;
        mat.transmission = 0.0;
        mat.opacity = 0.95;
        break;
      case 'micro-perf-pe':
        mat.color = new THREE.Color(0x67e8f9);
        mat.metalness = 0.05;
        mat.roughness = 0.15;
        mat.transmission = 0.85;
        mat.opacity = 0.28;
        break;
      default: // pet-pe-multilayer
        mat.color = new THREE.Color(0x38bdf8);
        mat.metalness = 0.1;
        mat.roughness = 0.12;
        mat.transmission = 0.7 - thicknessNormalized * 0.2;
        mat.opacity = 0.35 + thicknessNormalized * 0.3;
        break;
    }

    if (isXrayMode) {
      mat.transmission = 0.92;
      mat.opacity = 0.15;
      mat.wireframe = false;
    }
  }, [selectedMaterialId, thicknessMicrons, isXrayMode]);

  // Handle Exploded View Toggle
  useEffect(() => {
    if (explodedGroupRef.current && packageMeshRef.current && foodMeshRef.current) {
      explodedGroupRef.current.visible = isExploded;
      packageMeshRef.current.visible = !isExploded;
      // Move food down when exploded
      foodMeshRef.current.position.y = isExploded ? -1.1 : 0;
    }
  }, [isExploded]);

  // Handle X-Ray View Toggle
  useEffect(() => {
    if (particlesGroupRef.current) {
      particlesGroupRef.current.visible = isXrayMode;
    }
  }, [isXrayMode]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && sceneRef.current) {
      cameraRef.current.position.set(0, 1.8, 4.5);
      cameraRef.current.lookAt(0, 0, 0);
      sceneRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive 3D Packaging Laboratory</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Three.js PBR Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            3D Molecular & Layer <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">Packaging Lab</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5">
            Inspect real-time film refraction, thickness variation, exploded layer physics, and gas barrier molecular permeation.
          </p>
        </div>

        {/* 3D Mode Toggles */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => {
              setIsExploded(!isExploded);
              if (!isExploded) setIsXrayMode(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isExploded
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Exploded View
          </button>

          <button
            onClick={() => {
              setIsXrayMode(!isXrayMode);
              if (!isXrayMode) setIsExploded(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isXrayMode
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            X-Ray Permeation
          </button>

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isAutoRotate ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCcw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5"
            title="Reset Camera View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Lab Studio Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Canvas Viewport (8 Columns on Desktop) */}
        <div className="lg:col-span-8 relative rounded-2xl glass-card border border-white/15 overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[540px] flex flex-col justify-between bg-gradient-to-b from-[#0B132B]/60 to-[#070B14]">
          {/* Three.js Canvas Container */}
          <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Top HUD Overlay Markers */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                ACTIVE PRODUCE: ALPHONSO MANGO
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {activeMaterial.shortCode}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3D PHYSICS ENGINE: ONLINE</span>
            </div>
          </div>

          {/* Molecule Legend during X-Ray Mode */}
          {isXrayMode && (
            <div className="relative z-10 mx-4 sm:mx-5 p-2.5 rounded-xl bg-black/80 border border-cyan-500/30 backdrop-blur-md max-w-sm flex items-center justify-around text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-cyan-200 font-mono text-[11px]">O₂ Molecules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-200 font-mono text-[11px]">CO₂ Gas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300" />
                <span className="text-sky-200 font-mono text-[11px]">H₂O Vapor</span>
              </div>
            </div>
          )}

          {/* Bottom Interactive Controls Bar */}
          <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Thickness Slider (50 to 150 µm) */}
            <div className="w-full sm:w-72 space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Film Thickness:
                </span>
                <span className="font-mono text-amber-300 font-bold text-sm">
                  {thicknessMicrons} µm
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                value={thicknessMicrons}
                onChange={(e) => setThicknessMicrons(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 µm (Ultra-thin)</span>
                <span>100 µm</span>
                <span>150 µm (Rigid)</span>
              </div>
            </div>

            {/* Quick Material Switcher Pill Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {[
                { id: 'pet-pe-multilayer', label: 'PET/PE' },
                { id: 'high-barrier-evoh', label: 'EVOH' },
                { id: 'alu-foil-laminate', label: 'Alu Foil' },
                { id: 'metallized-bopp-pet', label: 'Met-PET' },
                { id: 'mono-pe-recyclable', label: 'Mono-PE' },
                { id: 'biodegradable-pla', label: 'Bio-PLA' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterialId(m.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                    selectedMaterialId === m.id
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry & Layer Inspector Sidebar (4 Columns on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Material Specs Card */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/15 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Material Laboratory Data
                </span>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                  {activeMaterial.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeMaterial.structureType}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeMaterial.description}
            </p>

            {/* Scientific Barrier Gauges */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Oxygen Barrier (OTR)</span>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                  {activeMaterial.otr} <span className="text-[10px] text-slate-400 font-sans">cc/m²·d</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, 100 - activeMaterial.otr / 30))}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Moisture (WVTR)</span>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                  {activeMaterial.wvtr} <span className="text-[10px] text-slate-400 font-sans">g/m²·d</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, 100 - activeMaterial.wvtr * 4))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Tensile Strength:</span>
                <span className="font-mono text-white">{activeMaterial.tensileStrengthMpa} MPa</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Heat Sealability:</span>
                <span className="font-semibold text-emerald-300">{activeMaterial.sealability}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Indian Market Cost:</span>
                <span className="font-mono text-amber-300 font-bold">₹{activeMaterial.relativeCostPerM2INR} / m²</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">BIS Standard:</span>
                <span className="font-mono text-cyan-300">{activeMaterial.bisStandard}</span>
              </div>
            </div>
          </div>

          {/* Exploded Layer Selector & Micro-Analysis */}
          {isExploded && (
            <div className="p-4 sm:p-5 rounded-2xl glass-card-gold border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Exploded Layer Telemetry
                </span>
                <span className="text-[10px] font-mono text-amber-400">CLICK TO SELECT</span>
              </div>

              {/* Layer Selection Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(LAYER_DETAILS).map((layerKey) => (
                  <button
                    key={layerKey}
                    onClick={() => setActiveLayer(layerKey)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
                      activeLayer === layerKey
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60 font-semibold'
                        : 'bg-black/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {layerKey}
                  </button>
                ))}
              </div>

              {/* Active Layer Details */}
              {LAYER_DETAILS[activeLayer] && (
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs">
                  <p className="font-bold text-white text-sm">{LAYER_DETAILS[activeLayer].name}</p>
                  <p className="text-[11px] text-slate-300">{LAYER_DETAILS[activeLayer].role}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                    <div>
                      <span className="text-slate-500">Thickness:</span>
                      <p className="font-mono text-cyan-300">{LAYER_DETAILS[activeLayer].thickness}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Flexibility:</span>
                      <p className="font-medium text-slate-200">{LAYER_DETAILS[activeLayer].flexibility}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Moisture Barrier:</span>
                      <p className="font-medium text-emerald-300">{LAYER_DETAILS[activeLayer].moistureProt}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Oxygen Barrier:</span>
                      <p className="font-medium text-amber-300">{LAYER_DETAILS[activeLayer].oxygenProt}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational Disclaimer Banner */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-300/80 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Scientific Simulation:</strong> Dynamic 3D model represents conceptual polymer barrier kinematics. Permeation values and thickness are reference benchmarks for educational & design evaluation.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
