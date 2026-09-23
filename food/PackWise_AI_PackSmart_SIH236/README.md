# PackWise AI / PackSmart — SIH 236
### AI-Based Intelligent Food Packaging Material Recommendation & TOPSIS Decision Engine

> **Production-ready, physics-informed software** for agricultural & food commodities packaging optimization, matching real mass-transfer physics equations, Michaelis-Menten respiration kinetics, and the TOPSIS multi-criteria algorithm with a futuristic 3D web dashboard.

---

## 🌟 Key Highlights & Modules

1. **100 Categorized Food Commodities**:
   - Scientifically accurate chemical, physical, and biological constraints (Moisture %, Lipid %, pH, Respiration, Aw, Critical Moisture %, Critical O2 Limit %, Optimum Temperature).
   - Categories: Fresh Produce (25), Dairy (15), Bakery (15), Dry Goods (20), Meat & Poultry (13), Seafood (12).
2. **Real Mass-Transfer Physics Engine**:
   - **Tetens Formula** for saturated vapor pressure: $P_{sat}(T) = 0.61078 \exp\left(\frac{17.27 T}{T + 237.3}\right)$.
   - **Water Vapor Transmission (WVTR)** flux calculations for moisture migration and dry solid shelf-life decay curves.
   - **Michaelis-Menten & Arrhenius Respiration Model** for fresh produce oxygen consumption and anaerobic fermentation hazard alerts.
3. **TOPSIS Multi-Criteria Decision Engine**:
   - Vector normalization balancing **Cost (Min)**, **LCA Carbon Footprint (Min)**, and **Barrier Performance (Max)**.
   - Dynamic user-adjustable priority weights with Euclidean distance calculation to positive-ideal and negative-ideal solutions.
4. **Futuristic 3D Dashboard & Laboratory**:
   - **PackagingLab3D**: Interactive Three.js multi-layer packaging inspection (BOPET, EVOH, Tie layers, LLDPE) with real-time 3D rotation, zoom, and layer exploding.
   - **Quantum 3D TOPSIS Dashboard**: Glassmorphic UI with CSS 3D perspective transforms (`perspective-1000`, card-tilt on hover), neon glow states, and live MCDM sliders.
   - **50-Frame Visual Storyboard**: Farm-to-AI-lab interactive sequence.
   - **Vaani Voice AI Copilot**: English and Hindi speech recognition & text-to-speech feedback.
   - **Aasaan Mode (Farmer Mode)**: 6-question simplified flow tailored for farmers and mandi traders.
   - **Live Crop Camera Scanner**: Real-time camera scanner modal for instant crop identification.
   - **Cold Chain & Spoilage Simulator**: Real-time temperature break risk analytics during transit.
   - **FSSAI & BIS Regulatory Compliance**: Indian packaging standards (IS 12252, IS 10146, IS 9845, Plastic Waste Management Rules 2022).
   - **Traceability QR Pass**: Instant QR code generation with batch pass summary.

---

## 🚀 Quick Start (One-Click Windows)

Simply double-click:
```cmd
START_PACKSMART.bat
```
This batch file will:
1. Validate Python and Node.js.
2. Initialize and seed the SQLite database with 100 commodities.
3. Launch the FastAPI backend on `http://localhost:8000`.
4. Launch the Vite React frontend on `http://localhost:5173`.
5. Automatically open `http://localhost:5173` in your default browser.

To stop both services cleanly, run:
```cmd
stop.bat
```

---

## 🛠 Manual Execution

### Backend (FastAPI + SQLite/PostgreSQL)
```bash
# Navigate to food directory
cd c:\Users\AKASH\Desktop\food

# Initialize Database
python backend/data/init_db.py

# Start FastAPI Server
python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

### Frontend (React + TypeScript + Vite)
```bash
cd c:\Users\AKASH\Desktop\food\frontend

# Install dependencies (if needed)
npm install

# Start Vite Dev Server
npm run dev
```
- Frontend URL: `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health and database commodity/material counts |
| `POST` | `/api/v1/optimize` | TOPSIS multi-criteria optimization engine |
| `POST` | `/api/v1/recommend` | Full PackWise recommendation report with MAP & compliance |
| `GET` | `/api/v1/commodities` | List & filter all 100 food commodities by category or search |
| `GET` | `/api/v1/commodities/{id}` | Single commodity biological/chemical parameters |
| `GET` | `/api/v1/categories` | Food categories and count breakdown |
| `GET` | `/api/v1/packaging-materials` | Advanced materials catalog (PLA, PHA, LDPE, HDPE, PET, EVOH, etc.) |
| `GET` | `/api/v1/analytics/summary` | Aggregated sustainability and recommendation statistics |
| `GET` | `/api/v1/analytics/decay-curve` | Dynamic quality retention decay curve calculation |

---

## 📂 Project Architecture

```
food/
├── frontend/                          # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/                # 25 Interactive components (PackagingLab3D, Quantum3dDashboard, etc.)
│   │   ├── data/                      # 100 commodities dataset, packaging materials, compliance
│   │   ├── services/                  # api.ts (Backend connector with offline fallback)
│   │   ├── hooks/                     # useVoiceAssistant.ts (Web Speech API)
│   │   ├── i18n/                      # translations.ts (English & Hindi)
│   │   ├── utils/                     # recommendationEngine.ts
│   │   ├── App.tsx                    # Main navigation & state orchestrator
│   │   └── index.css                  # Custom 3D & glassmorphic styling
│   └── public/frames/                 # 50 visual storyboard frames
├── backend/                           # FastAPI Python Application
│   ├── main.py                        # FastAPI entry point & CORS configuration
│   ├── database.py                    # SQLAlchemy session manager (SQLite / Postgres)
│   ├── models.py                      # ORM tables (Commodities, Materials, Respiration, Logs)
│   ├── schemas.py                     # Pydantic validation schemas
│   ├── services/
│   │   ├── topsis_service.py          # NumPy TOPSIS algorithm implementation
│   │   ├── physics_engine.py          # Tetens vapor pressure, WVTR flux, Michaelis-Menten
│   │   └── recommendation_service.py  # Packaging matching engine
│   ├── routers/                       # REST endpoint controllers
│   └── data/init_db.py                # Database seeder (100 commodities)
├── database/
│   ├── schema.sql                     # Full SQL DDL & 100 commodity inserts
│   └── packsmart.db                   # Pre-seeded SQLite database
├── START_PACKSMART.bat                # Windows One-Click Runner
├── start.bat                          # Launcher shortcut
├── stop.bat                           # Clean process shutdown
├── .env.example                       # Environment configuration template
└── README.md
```

---

## 🏆 SIH 236 Problem Statement Alignment

- **Agricultural Spoilage Mitigation**: Recommends high-performance Modified Atmosphere Packaging (MAP) to reduce the ~30% post-harvest loss in Indian mandis.
- **Micro-Enterprises & Farmer Accessibility**: Dual interface with both high-end engineering physics controls and intuitive Hindi voice-assisted Aasaan Mode.
- **PWM Rules 2022 Compliance**: Prioritizes compostable bio-plastics (PLA, PHA) and mono-material recyclables aligned with Central Pollution Control Board (CPPCB) guidelines.
