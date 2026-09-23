# PackWise AI / PackSmart (SIH 236) — Walkthrough & Verification

A production-ready, full-stack **AI-Based Intelligent Food Packaging Material Recommendation & TOPSIS Decision System** built with **FastAPI**, **SQLite/PostgreSQL**, and **React 19 with Vite, TypeScript, Tailwind CSS, and Three.js**.

---

## 📦 What Was Built & Implemented

### 1. Database & Scientific Data (`database/`)
- [schema.sql](file:///c:/Users/AKASH/Desktop/food/database/schema.sql): DDL tables and inserts for **exactly 100 food commodities** across 6 scientific categories:
  - **Fresh Produce (1–25)**: Strawberries, Blueberries, Spinach, Iceberg Lettuce, Cherry Tomatoes, Yukon Gold Potatoes, Yellow Onions, Broccoli, Mushrooms, Hass Avocados, Kent Mangoes, etc.
  - **Dairy (26–40)**: Cheddar, Fresh Mozzarella, Creamery Butter, Greek Yogurt, Cream Cheese, Parmesan, Paneer, Ghee, Brie, Feta, etc.
  - **Bakery (41–55)**: Sandwich Bread, Sourdough, Croissants, Cookies, Sponge Cake, Bagels, Muffins, Tortillas, Puff Pastry, Pita, Naan, Brownies, etc.
  - **Dry Goods (56–75)**: Jasmine Rice, Brown Rice, Red Lentils, Chickpeas, Flour, Cane Sugar, Black Peppercorns, Turmeric, Coffee, Matcha, Oats, Almonds, Walnuts, Pistachios, Chia Seeds, Flax Seeds, Pasta, Quinoa, Milk Powder, etc.
  - **Meat & Poultry (76–88)**: Ribeye Steak, Ground Beef, Chicken Breast, Wings, Pork Chops, Bacon, Sausage, Lamb Chops, Salami, Turkey, Smoked Ham, Duck Breast, Pepperoni, etc.
  - **Seafood (89–100)**: Atlantic Salmon, Yellowfin Tuna, White Shrimp, Pacific Cod, Lump Crab, Lobster Tails, PEI Mussels, Smoked Salmon, Sardines, Albacore Tuna, Bluepoint Oysters, Octopus, etc.
- **Packaging Materials Catalog**: 10 high-tech packaging materials (BioWrap PLA, NaturaEco PHA, Standard LDPE, HiDensity HDPE, ClearShield PET, BarrierMax Met-PET, HydroBlock Al-Foil Laminate, AeroFlow BOPP-PERF, NaturPaper Chitosan, OmniShield EVOH).
- [packsmart.db](file:///c:/Users/AKASH/Desktop/food/database/packsmart.db): Pre-seeded SQLite database ready for immediate offline execution.

---

### 2. Backend Physics & Multi-Criteria Decision Engine (`backend/`)
- [database.py](file:///c:/Users/AKASH/Desktop/food/backend/database.py): SQLAlchemy engine with automatic SQLite fallback and PostgreSQL compatibility.
- [models.py](file:///c:/Users/AKASH/Desktop/food/backend/models.py): ORM models for `food_commodities`, `packaging_materials`, `respiration_kinetics`, and `recommendation_logs`.
- [schemas.py](file:///c:/Users/AKASH/Desktop/food/backend/schemas.py): Pydantic validation schemas.
- [physics_engine.py](file:///c:/Users/AKASH/Desktop/food/backend/services/physics_engine.py):
  - **Tetens Equation** for saturated vapor pressure: $P_{sat}(T) = 0.61078 \exp\left(\frac{17.27 T}{T + 237.3}\right)$.
  - **Water Vapor Transmission (WVTR)** flux calculations for moisture migration and shelf-life prediction.
  - **Michaelis-Menten & Arrhenius Respiration Model** for fresh produce oxygen consumption and anaerobic fermentation hazard alerts.
- [topsis_service.py](file:///c:/Users/AKASH/Desktop/food/backend/services/topsis_service.py): NumPy vector normalization, dynamic weighting, Euclidean distances to ideal best/worst, and closeness ranking.
- [recommendation_service.py](file:///c:/Users/AKASH/Desktop/food/backend/services/recommendation_service.py): Full PackWise recommendation logic with MAP, cold-chain risk alerts, and Indian standards compliance (FSSAI 2018, BIS IS 12252/10146/9845).
- **Routers**:
  - `POST /api/v1/optimize`: TOPSIS material optimization.
  - `POST /api/v1/recommend`: Full PackWise recommendation report.
  - `GET /api/v1/commodities`: Search & filter across all 100 commodities.
  - `GET /api/v1/packaging-materials`: Materials catalog.
  - `GET /api/v1/analytics/summary`: Aggregate statistics.
  - `GET /api/v1/analytics/decay-curve`: Dynamic quality decay curves.

---

### 3. Frontend Dashboard & 3D Visualizer (`frontend/`)
- **Preserved All 24 Reference Modules**:
  - [Navbar.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/Navbar.tsx) with language switcher, voice copilot trigger, and navigation links.
  - [HeroSection.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/HeroSection.tsx) with immersive agricultural background.
  - [StoryboardSequence.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/StoryboardSequence.tsx) with 50 visual storyboard frames.
  - [PackagingLab3D.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/PackagingLab3D.tsx) with Three.js 3D multi-layer packaging inspection.
  - [FarmerSimpleMode.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/FarmerSimpleMode.tsx) with 6-question simplified flow in English & Hindi.
  - [LiveCropScannerModal.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/LiveCropScannerModal.tsx) with camera crop scanner.
  - [AiVoiceCopilotModal.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/AiVoiceCopilotModal.tsx) and [VoiceAssistantBar.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/VoiceAssistantBar.tsx).
  - [TraceabilityReport.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/TraceabilityReport.tsx) with QR code generation.
  - [BarrierAnalytics.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/BarrierAnalytics.tsx), [MapSimulator.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/MapSimulator.tsx), [ColdChainTracker.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/ColdChainTracker.tsx), [RoiCalculator.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/RoiCalculator.tsx).
- **New Quantum 3D Dashboard**:
  - [Quantum3dDashboard.tsx](file:///c:/Users/AKASH/Desktop/food/frontend/src/components/Quantum3dDashboard.tsx): Futuristic 3D perspective cards (`perspective-1000`, card-tilt on hover), glassmorphic layout, MCDM weight sliders (Eco-Impact, Cost, Barrier), and 100-commodity selector.
- **Centralized API Client**:
  - [api.ts](file:///c:/Users/AKASH/Desktop/food/frontend/src/services/api.ts): Connects live to FastAPI backend, with seamless client-side fallback if backend is offline.

---

### 4. Windows One-Click Runner & Automation
- [START_PACKSMART.bat](file:///c:/Users/AKASH/Desktop/food/START_PACKSMART.bat): Double-clickable script that validates Python/Node, initializes the database, starts backend on port 8000, starts frontend on port 5173, and opens `http://localhost:5173` in your browser.
- [start.bat](file:///c:/Users/AKASH/Desktop/food/start.bat): Fast startup shortcut.
- [stop.bat](file:///c:/Users/AKASH/Desktop/food/stop.bat): Graceful port-killing script for ports 8000 and 5173.
- [.env.example](file:///c:/Users/AKASH/Desktop/food/.env.example) & [README.md](file:///c:/Users/AKASH/Desktop/food/README.md).

---

## 🧪 Verification & Test Results

### 1. Database Seeder
```
[DB INIT] Creating database tables...
[DB INIT] Seeding database from schema.sql...
[DB INIT] Successfully seeded 100 food commodities and 10 packaging materials!
```

### 2. Backend API Execution
- `GET /api/v1/health` on `http://localhost:8080/api/v1/health` -> `HTTP 200 OK`:
  ```json
  {
    "status": "healthy",
    "version": "2.5.0",
    "engine": "FastAPI + NumPy TOPSIS + Arrhenius/Tetens Physics Engine",
    "commodities_count": 100,
    "materials_count": 10
  }
  ```
- `POST /api/v1/optimize` -> `HTTP 200 OK` (10 materials ranked via TOPSIS with hazard warning for low OTR).
- `POST /api/v1/recommend` -> `HTTP 200 OK` (`ID: PW-1361C09B`, `Score: 94.0`).

### 3. Frontend Production Build & Live Server
```
vite v8.3.0 building client environment for production...
✓ 2514 modules transformed.
dist/index.html                     1.33 kB │ gzip:   0.76 kB
dist/assets/index-BiSqlzQL.css     95.42 kB │ gzip:  13.50 kB
dist/assets/index-DeZYQk9V.js   1,549.14 kB │ gzip: 414.20 kB
✓ built in 1.23s
```
- Frontend Server running on: **`http://localhost:3000`**

---

## 🚀 How to Run the Software

In Windows File Explorer, navigate to:
```
c:\Users\AKASH\Desktop\food
```
and double-click:
```
START_PACKSMART.bat
```
Both backend (Port 8080) and frontend (Port 3000) will boot automatically and launch in your default web browser at `http://localhost:3000`.

---

## 💾 Downloadable ZIP Package

The complete project has been bundled into a single ZIP archive:
- **Desktop**: `C:\Users\AKASH\Desktop\PackWise_AI_PackSmart_SIH236.zip`
- **Workspace**: `C:\Users\AKASH\Desktop\food\PackWise_AI_PackSmart_SIH236.zip`
