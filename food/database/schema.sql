-- PackSmart SIH 236 / QuantumPack Database Schema
-- Compatible with PostgreSQL and SQLite

CREATE TABLE IF NOT EXISTS food_commodities (
    commodity_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    moisture_content_pct DECIMAL(5,2) NOT NULL,
    lipid_content_pct DECIMAL(5,2) NOT NULL,
    ph_value DECIMAL(4,2) NOT NULL,
    is_respiring BOOLEAN DEFAULT FALSE,
    optimum_temp_c DECIMAL(4,1) NOT NULL,
    critical_oxygen_limit_pct DECIMAL(4,2) DEFAULT NULL,
    critical_moisture_limit_pct DECIMAL(4,2) NOT NULL,
    water_activity_aw DECIMAL(3,2) NOT NULL,
    default_shelf_life_days INT NOT NULL
);

CREATE TABLE IF NOT EXISTS packaging_materials (
    material_id VARCHAR(36) PRIMARY KEY,
    trade_name VARCHAR(100) NOT NULL UNIQUE,
    base_polymer VARCHAR(50) NOT NULL,
    thickness_microns DECIMAL(6,2) NOT NULL,
    otr_normalized DECIMAL(10,4) NOT NULL, -- cc/m^2/day at 23C, 0% RH
    wvtr_normalized DECIMAL(10,4) NOT NULL, -- g/m^2/day at 38C, 90% RH
    co2tr_normalized DECIMAL(10,4) NOT NULL,
    tensile_strength_mpa DECIMAL(6,2) NOT NULL,
    cost_per_kg DECIMAL(6,2) NOT NULL,
    carbon_footprint_index DECIMAL(4,2) NOT NULL, -- 0 (Very Eco) to 10 (High Carbon)
    is_biodegradable BOOLEAN DEFAULT FALSE,
    fda_approved BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS respiration_kinetics (
    id VARCHAR(36) PRIMARY KEY,
    commodity_name VARCHAR(100) NOT NULL,
    v_max_o2 DECIMAL(8,4) NOT NULL, -- mL/kg.h maximum O2 consumption rate
    k_m_o2 DECIMAL(6,3) NOT NULL,   -- Michaelis constant (% O2)
    rq DECIMAL(4,2) NOT NULL DEFAULT 1.0, -- Respiration quotient (CO2 produced / O2 consumed)
    activation_energy_kj DECIMAL(6,2) NOT NULL DEFAULT 65.0
);

CREATE TABLE IF NOT EXISTS recommendation_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    commodity_name VARCHAR(100) NOT NULL,
    ambient_temp_c DECIMAL(4,1) NOT NULL,
    external_rh_pct DECIMAL(4,1) NOT NULL,
    surface_area_m2 DECIMAL(6,4) NOT NULL,
    product_mass_kg DECIMAL(6,3) NOT NULL,
    recommended_material VARCHAR(100) NOT NULL,
    topsis_score DECIMAL(5,4) NOT NULL,
    predicted_shelf_life_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERTS: Exactly 100 Food Commodities with Scientifically-Informed Values
-- ============================================================================

INSERT OR REPLACE INTO food_commodities (commodity_id, name, category, moisture_content_pct, lipid_content_pct, ph_value, is_respiring, optimum_temp_c, critical_oxygen_limit_pct, critical_moisture_limit_pct, water_activity_aw, default_shelf_life_days) VALUES
-- Category: Fresh Produce (1-25) - Respiring
('prod-001', 'Fresh Strawberries', 'Fresh Produce', 90.9, 0.3, 3.40, 1, 1.0, 2.0, 95.0, 0.98, 7),
('prod-002', 'Fresh Blueberries', 'Fresh Produce', 84.2, 0.3, 3.20, 1, 2.0, 2.0, 90.0, 0.97, 14),
('prod-003', 'Fresh Spinach Leaves', 'Fresh Produce', 91.4, 0.4, 6.80, 1, 0.0, 1.5, 95.0, 0.99, 5),
('prod-004', 'Iceberg Lettuce', 'Fresh Produce', 95.6, 0.1, 6.00, 1, 1.0, 1.0, 98.0, 0.99, 8),
('prod-005', 'Cherry Tomatoes', 'Fresh Produce', 94.5, 0.2, 4.30, 1, 12.0, 3.0, 96.0, 0.98, 12),
('prod-006', 'Yukon Gold Potatoes', 'Fresh Produce', 79.0, 0.1, 5.60, 1, 15.0, 5.0, 85.0, 0.96, 60),
('prod-007', 'Yellow Onions', 'Fresh Produce', 89.1, 0.1, 5.50, 1, 20.0, 4.0, 92.0, 0.97, 90),
('prod-008', 'Broccoli Florets', 'Fresh Produce', 89.3, 0.4, 6.50, 1, 0.0, 2.0, 92.0, 0.99, 10),
('prod-009', 'Button Mushrooms', 'Fresh Produce', 92.4, 0.3, 6.20, 1, 1.0, 2.0, 96.0, 0.99, 5),
('prod-010', 'Sweet Carrots', 'Fresh Produce', 88.0, 0.2, 6.00, 1, 0.0, 3.0, 92.0, 0.98, 28),
('prod-011', 'Fresh Garlic Bulbs', 'Fresh Produce', 58.9, 0.5, 5.80, 1, 20.0, 5.0, 65.0, 0.93, 120),
('prod-012', 'Red Bell Peppers', 'Fresh Produce', 92.2, 0.3, 5.10, 1, 7.0, 3.0, 95.0, 0.98, 14),
('prod-013', 'Hass Avocados', 'Fresh Produce', 72.3, 15.4, 6.40, 1, 6.0, 2.0, 80.0, 0.97, 10),
('prod-014', 'Navel Oranges', 'Fresh Produce', 86.8, 0.1, 3.80, 1, 4.0, 3.0, 90.0, 0.97, 30),
('prod-015', 'Kent Mangoes', 'Fresh Produce', 83.5, 0.4, 4.50, 1, 12.0, 3.0, 88.0, 0.97, 14),
('prod-016', 'Red Peaches', 'Fresh Produce', 88.9, 0.3, 3.80, 1, 0.0, 2.0, 92.0, 0.98, 10),
('prod-017', 'Sweet Cherries', 'Fresh Produce', 82.2, 0.2, 4.00, 1, 0.0, 2.0, 86.0, 0.97, 14),
('prod-018', 'White Cauliflower', 'Fresh Produce', 92.0, 0.3, 6.30, 1, 0.0, 2.0, 95.0, 0.99, 12),
('prod-019', 'Green Cabbage', 'Fresh Produce', 92.2, 0.1, 5.80, 1, 0.0, 2.0, 96.0, 0.98, 40),
('prod-020', 'Green Asparagus', 'Fresh Produce', 93.2, 0.1, 6.20, 1, 2.0, 1.5, 96.0, 0.99, 7),
('prod-021', 'Fresh Sweet Basil', 'Fresh Produce', 92.1, 0.6, 6.00, 1, 12.0, 2.0, 95.0, 0.98, 6),
('prod-022', 'Fresh Italian Cilantro', 'Fresh Produce', 92.2, 0.5, 6.20, 1, 1.0, 2.0, 95.0, 0.99, 7),
('prod-023', 'Gala Apples', 'Fresh Produce', 85.6, 0.2, 3.50, 1, 0.0, 1.5, 88.0, 0.97, 90),
('prod-024', 'Cavendish Bananas', 'Fresh Produce', 74.9, 0.3, 4.70, 1, 13.5, 2.0, 80.0, 0.96, 10),
('prod-025', 'Fresh Raspberries', 'Fresh Produce', 85.8, 0.7, 3.60, 1, 0.5, 2.0, 90.0, 0.98, 4),

-- Category: Dairy (26-40)
('dai-026', 'Cheddar Cheese Block', 'Dairy', 37.0, 33.0, 5.20, 0, 4.0, NULL, 40.0, 0.88, 120),
('dai-027', 'Fresh Mozzarella Cheese', 'Dairy', 54.0, 18.0, 5.20, 0, 4.0, NULL, 58.0, 0.96, 21),
('dai-028', 'Salted Creamery Butter', 'Dairy', 16.0, 81.0, 6.20, 0, 4.0, NULL, 18.0, 0.91, 180),
('dai-029', 'Whole Milk Greek Yogurt', 'Dairy', 81.0, 5.0, 4.40, 0, 4.0, NULL, 85.0, 0.97, 30),
('dai-030', 'Traditional Cream Cheese', 'Dairy', 54.0, 34.0, 4.80, 0, 4.0, NULL, 56.0, 0.96, 45),
('dai-031', 'Grated Parmesan Cheese', 'Dairy', 18.0, 28.0, 5.30, 0, 4.0, NULL, 22.0, 0.85, 270),
('dai-032', 'Fresh Paneer Block', 'Dairy', 52.0, 24.0, 5.80, 0, 4.0, NULL, 55.0, 0.96, 12),
('dai-033', 'Skimmed Milk Powder', 'Dairy', 4.0, 0.8, 6.60, 0, 20.0, NULL, 7.0, 0.30, 365),
('dai-034', 'Whey Protein Isolate', 'Dairy', 5.0, 1.0, 6.30, 0, 20.0, NULL, 8.0, 0.35, 540),
('dai-035', 'Pure Grassfed Ghee', 'Dairy', 0.2, 99.5, 6.50, 0, 20.0, NULL, 1.0, 0.15, 365),
('dai-036', 'French Brie Wheel', 'Dairy', 48.0, 28.0, 6.00, 0, 4.0, NULL, 52.0, 0.95, 30),
('dai-037', 'Greek Feta Cheese', 'Dairy', 55.0, 21.0, 4.40, 0, 4.0, NULL, 58.0, 0.96, 60),
('dai-038', 'Cultured Sour Cream', 'Dairy', 74.0, 18.0, 4.50, 0, 4.0, NULL, 78.0, 0.97, 25),
('dai-039', 'Heavy Whipping Cream', 'Dairy', 57.0, 36.0, 6.60, 0, 4.0, NULL, 60.0, 0.98, 20),
('dai-040', 'Vegan Margarine Tub', 'Dairy', 16.0, 80.0, 6.00, 0, 4.0, NULL, 18.0, 0.92, 120),

-- Category: Bakery (41-55)
('bak-041', 'Sliced White Sandwich Bread', 'Bakery', 36.0, 3.5, 5.40, 0, 20.0, NULL, 40.0, 0.94, 7),
('bak-042', 'Whole Wheat Sourdough', 'Bakery', 38.0, 1.5, 4.60, 0, 20.0, NULL, 42.0, 0.93, 10),
('bak-043', 'Butter Croissants', 'Bakery', 28.0, 21.0, 5.80, 0, 20.0, NULL, 32.0, 0.90, 4),
('bak-044', 'Soft Chocolate Chip Cookies', 'Bakery', 8.5, 18.0, 6.00, 0, 20.0, NULL, 12.0, 0.65, 30),
('bak-045', 'Yellow Sponge Cake', 'Bakery', 26.0, 10.0, 6.20, 0, 20.0, NULL, 30.0, 0.88, 12),
('bak-046', 'Plain New York Bagels', 'Bakery', 32.0, 1.5, 5.50, 0, 20.0, NULL, 36.0, 0.93, 7),
('bak-047', 'Blueberry Streusel Muffins', 'Bakery', 24.0, 11.0, 5.90, 0, 20.0, NULL, 28.0, 0.87, 6),
('bak-048', 'White Flour Tortillas', 'Bakery', 30.0, 7.0, 5.80, 0, 20.0, NULL, 34.0, 0.89, 21),
('bak-049', 'Unbaked Puff Pastry Sheets', 'Bakery', 30.0, 22.0, 6.00, 0, -18.0, NULL, 34.0, 0.91, 180),
('bak-050', 'Greek Pita Bread Flat', 'Bakery', 31.0, 2.0, 5.60, 0, 20.0, NULL, 35.0, 0.92, 10),
('bak-051', 'Glazed Yeast Donuts', 'Bakery', 22.0, 16.0, 5.50, 0, 20.0, NULL, 26.0, 0.85, 2),
('bak-052', 'Crisp Saltine Crackers', 'Bakery', 3.0, 8.0, 6.50, 0, 20.0, NULL, 6.0, 0.30, 180),
('bak-053', 'Garlic Butter Tandoori Naan', 'Bakery', 29.0, 6.0, 5.80, 0, -18.0, NULL, 33.0, 0.91, 120),
('bak-054', 'Fudge Chocolate Brownies', 'Bakery', 12.0, 16.0, 5.80, 0, 20.0, NULL, 15.0, 0.73, 14),
('bak-055', 'Gluten-Free Seeded Bread', 'Bakery', 42.0, 6.0, 5.20, 0, 20.0, NULL, 45.0, 0.94, 5),

-- Category: Dry Goods (56-75)
('dry-056', 'Long-Grain White Jasmine Rice', 'Dry Goods', 12.0, 0.5, 6.50, 0, 20.0, NULL, 14.0, 0.60, 365),
('dry-057', 'Organic Whole Grain Brown Rice', 'Dry Goods', 12.0, 2.5, 6.40, 0, 20.0, NULL, 14.0, 0.62, 180),
('dry-058', 'Split Whole Red Lentils', 'Dry Goods', 11.0, 1.0, 6.30, 0, 20.0, NULL, 13.0, 0.58, 365),
('dry-059', 'Dried Kabuli Chickpeas', 'Dry Goods', 10.5, 5.0, 6.40, 0, 20.0, NULL, 13.0, 0.55, 365),
('dry-060', 'Premium Unbleached Bread Flour', 'Dry Goods', 13.0, 1.2, 6.10, 0, 20.0, NULL, 15.0, 0.65, 270),
('dry-061', 'Yellow Masa Corn Flour', 'Dry Goods', 11.0, 3.8, 6.30, 0, 20.0, NULL, 13.0, 0.60, 180),
('dry-062', 'Refined White Cane Sugar', 'Dry Goods', 0.05, 0.0, 7.00, 0, 20.0, NULL, 0.5, 0.25, 730),
('dry-063', 'Whole Tellicherry Black Peppercorns', 'Dry Goods', 10.0, 3.0, 5.50, 0, 20.0, NULL, 12.0, 0.50, 540),
('dry-064', 'Organic Ground Turmeric Root', 'Dry Goods', 9.0, 6.0, 6.00, 0, 20.0, NULL, 11.0, 0.48, 540),
('dry-065', 'Light-Roast Single-Origin Coffee', 'Dry Goods', 2.5, 15.0, 5.10, 0, 20.0, NULL, 5.0, 0.35, 120),
('dry-066', 'Matcha Green Tea Powder', 'Dry Goods', 4.0, 2.0, 5.80, 0, 20.0, NULL, 7.0, 0.38, 270),
('dry-067', 'Rolled Old-Fashioned Oats', 'Dry Goods', 9.5, 6.5, 6.50, 0, 20.0, NULL, 12.0, 0.52, 270),
('dry-068', 'Raw California Almonds', 'Dry Goods', 4.5, 49.0, 6.00, 0, 20.0, NULL, 7.0, 0.45, 240),
('dry-069', 'English Walnut Halves', 'Dry Goods', 4.0, 65.0, 6.10, 0, 20.0, NULL, 6.0, 0.40, 180),
('dry-070', 'Shelled Roasted Pistachios', 'Dry Goods', 3.0, 53.0, 5.90, 0, 20.0, NULL, 5.0, 0.35, 180),
('dry-071', 'Organic Black Chia Seeds', 'Dry Goods', 8.0, 31.0, 6.20, 0, 20.0, NULL, 10.0, 0.50, 365),
('dry-072', 'Golden Linseed Flax Seeds', 'Dry Goods', 7.5, 42.0, 6.10, 0, 20.0, NULL, 9.5, 0.48, 270),
('dry-073', 'Semolina Durum Wheat Pasta', 'Dry Goods', 11.5, 1.5, 6.20, 0, 20.0, NULL, 13.5, 0.55, 730),
('dry-074', 'Whole Grain Tri-Color Quinoa', 'Dry Goods', 11.0, 6.0, 6.30, 0, 20.0, NULL, 13.0, 0.58, 365),
('dry-075', 'Instant Full-Cream Milk Powder', 'Dry Goods', 3.5, 26.5, 6.60, 0, 20.0, NULL, 5.5, 0.32, 270),

-- Category: Meat & Poultry (76-88)
('meat-076', 'USDA Choice Ribeye Steak', 'Meat & Poultry', 65.0, 22.0, 5.60, 0, 1.0, NULL, 68.0, 0.99, 5),
('meat-077', '80-20 Fresh Ground Beef', 'Meat & Poultry', 62.0, 20.0, 5.80, 0, 1.0, NULL, 65.0, 0.99, 3),
('meat-078', 'Fresh Cage-Free Chicken Breast', 'Meat & Poultry', 74.0, 2.5, 6.00, 0, 1.0, NULL, 76.0, 0.99, 6),
('meat-079', 'Fresh Jumbo Chicken Wings', 'Meat & Poultry', 68.0, 15.0, 6.10, 0, 1.0, NULL, 70.0, 0.99, 5),
('meat-080', 'Center-Cut Pork Chops', 'Meat & Poultry', 68.0, 12.0, 5.70, 0, 1.0, NULL, 71.0, 0.99, 7),
('meat-081', 'Thick-Cut Applewood Smoked Bacon', 'Meat & Poultry', 35.0, 45.0, 5.80, 0, 4.0, NULL, 38.0, 0.92, 40),
('meat-082', 'Spicy Pork Sausage Links', 'Meat & Poultry', 53.0, 28.0, 5.90, 0, 4.0, NULL, 56.0, 0.96, 14),
('meat-083', 'Fresh Domestic Lamb Chops', 'Meat & Poultry', 64.0, 19.0, 5.80, 0, 1.0, NULL, 67.0, 0.99, 5),
('meat-084', 'Dry Cured Italian Salami', 'Meat & Poultry', 32.0, 36.0, 4.90, 0, 15.0, NULL, 35.0, 0.82, 120),
('meat-085', 'Fresh Deli Turkey Breast Slice', 'Meat & Poultry', 72.0, 2.0, 6.10, 0, 4.0, NULL, 75.0, 0.98, 10),
('meat-086', 'Premium Smoked Forest Ham', 'Meat & Poultry', 68.0, 6.0, 6.00, 0, 4.0, NULL, 71.0, 0.97, 21),
('meat-087', 'Fresh Pekin Duck Breast', 'Meat & Poultry', 66.0, 18.0, 5.90, 0, 1.0, NULL, 69.0, 0.99, 5),
('meat-088', 'Cured Sliced Pork Pepperoni', 'Meat & Poultry', 26.0, 42.0, 4.80, 0, 18.0, NULL, 30.0, 0.79, 180),

-- Category: Seafood (89-100)
('sea-089', 'Fresh Atlantic Salmon Fillet', 'Seafood', 68.0, 13.0, 6.20, 0, 0.5, NULL, 71.0, 0.99, 4),
('sea-090', 'Yellowfin Tuna Steak', 'Seafood', 71.0, 1.5, 6.10, 0, 0.5, NULL, 73.0, 0.99, 3),
('sea-091', 'Fresh Headless White Shrimp', 'Seafood', 78.0, 1.0, 6.50, 0, 0.5, NULL, 80.0, 0.99, 4),
('sea-092', 'Wild-Caught Pacific Cod Fillet', 'Seafood', 81.0, 0.7, 6.30, 0, 0.5, NULL, 83.0, 0.99, 3),
('sea-093', 'Pasteurized Lump Crab Meat', 'Seafood', 79.0, 1.2, 6.60, 0, 2.0, NULL, 81.0, 0.99, 14),
('sea-094', 'Coldwater Lobster Tails', 'Seafood', 78.0, 0.9, 6.40, 0, -18.0, NULL, 80.0, 0.99, 180),
('sea-095', 'Live Prince Edward Island Mussels', 'Seafood', 82.0, 1.5, 6.50, 0, 2.0, NULL, 85.0, 0.99, 3),
('sea-096', 'Cold-Smoked Sockeye Salmon Slices', 'Seafood', 56.0, 10.0, 5.90, 0, 2.0, NULL, 60.0, 0.95, 21),
('sea-097', 'Canned Sardines in Extra Virgin Olive Oil', 'Seafood', 52.0, 28.0, 5.80, 0, 20.0, NULL, 55.0, 0.94, 1095),
('sea-098', 'Canned Albacore Tuna in Spring Water', 'Seafood', 70.0, 1.0, 6.00, 0, 20.0, NULL, 72.0, 0.98, 1095),
('sea-099', 'Fresh Shucked Bluepoint Oysters', 'Seafood', 84.0, 1.2, 6.20, 0, 2.0, NULL, 86.0, 0.99, 5),
('sea-100', 'Fresh Whole Cleaned Octopus', 'Seafood', 80.0, 1.0, 6.30, 0, 0.5, NULL, 82.0, 0.99, 4);

-- Core Packaging Materials Catalog
INSERT OR REPLACE INTO packaging_materials (material_id, trade_name, base_polymer, thickness_microns, otr_normalized, wvtr_normalized, co2tr_normalized, tensile_strength_mpa, cost_per_kg, carbon_footprint_index, is_biodegradable, fda_approved) VALUES
('mat-001', 'BioWrap Compostable PLA', 'PLA', 25.0, 750.0, 110.0, 2400.0, 48.0, 4.80, 2.2, 1, 1),
('mat-002', 'NaturaEco PHA Marine Film', 'PHA', 30.0, 420.0, 65.0, 1300.0, 35.0, 6.50, 1.1, 1, 1),
('mat-003', 'Standard PolyPack LDPE', 'LDPE', 50.0, 3800.0, 12.0, 11000.0, 22.0, 1.75, 6.5, 0, 1),
('mat-004', 'HiDensity Tough HDPE', 'HDPE', 40.0, 1600.0, 4.5, 5200.0, 32.0, 1.95, 5.8, 0, 1),
('mat-005', 'ClearShield Gloss PET', 'PET', 15.0, 75.0, 18.0, 280.0, 165.0, 2.90, 7.8, 0, 1),
('mat-006', 'BarrierMax Metallized PET', 'MET-PET', 12.0, 1.2, 0.7, 4.5, 150.0, 3.40, 8.2, 0, 1),
('mat-007', 'HydroBlock Aluminum Foil Laminate', 'AL-FOIL-LAMI', 75.0, 0.01, 0.01, 0.01, 85.0, 5.20, 9.1, 0, 1),
('mat-008', 'AeroFlow Micro-perforated Film', 'BOPP-PERF', 20.0, 12000.0, 85.0, 36000.0, 120.0, 3.10, 6.9, 0, 1),
('mat-009', 'NaturPaper Chitosan Coated', 'CHITOSAN-PAPER', 80.0, 450.0, 180.0, 1200.0, 28.0, 3.90, 1.5, 1, 1),
('mat-010', 'OmniShield EVOH Coextrusion', 'PE/EVOH/PE', 60.0, 0.4, 3.2, 1.2, 55.0, 5.80, 7.5, 0, 1);

-- Respiration Kinetics Baseline
INSERT OR REPLACE INTO respiration_kinetics (id, commodity_name, v_max_o2, k_m_o2, rq, activation_energy_kj) VALUES
('resp-001', 'Fresh Strawberries', 45.0, 1.8, 1.15, 62.5),
('resp-002', 'Fresh Blueberries', 32.0, 2.0, 1.05, 58.0),
('resp-003', 'Fresh Spinach Leaves', 85.0, 1.2, 1.25, 70.0),
('resp-004', 'Iceberg Lettuce', 28.0, 1.0, 1.00, 55.0),
('resp-005', 'Cherry Tomatoes', 22.0, 2.5, 1.10, 60.0),
('resp-006', 'Yukon Gold Potatoes', 8.5, 3.0, 0.95, 48.0),
('resp-007', 'Yellow Onions', 6.0, 2.8, 0.90, 45.0),
('resp-008', 'Broccoli Florets', 95.0, 1.5, 1.30, 75.0),
('resp-009', 'Button Mushrooms', 110.0, 1.6, 1.20, 68.0),
('resp-010', 'Sweet Carrots', 18.0, 2.2, 1.00, 52.0),
('resp-011', 'Fresh Garlic Bulbs', 5.0, 3.5, 0.85, 40.0),
('resp-012', 'Red Bell Peppers', 25.0, 2.4, 1.05, 56.0),
('resp-013', 'Hass Avocados', 55.0, 1.9, 1.15, 64.0),
('resp-014', 'Navel Oranges', 14.0, 2.5, 0.95, 50.0),
('resp-015', 'Kent Mangoes', 38.0, 2.1, 1.20, 65.0),
('resp-016', 'Red Peaches', 42.0, 1.8, 1.10, 61.0),
('resp-017', 'Sweet Cherries', 30.0, 2.0, 1.05, 57.0),
('resp-018', 'White Cauliflower', 40.0, 1.7, 1.12, 63.0),
('resp-019', 'Green Cabbage', 19.0, 2.0, 1.00, 54.0),
('resp-020', 'Green Asparagus', 120.0, 1.4, 1.35, 78.0),
('resp-021', 'Fresh Sweet Basil', 65.0, 1.6, 1.18, 66.0),
('resp-022', 'Fresh Italian Cilantro', 70.0, 1.5, 1.22, 67.0),
('resp-023', 'Gala Apples', 12.0, 1.8, 1.00, 52.0),
('resp-024', 'Cavendish Bananas', 48.0, 2.2, 1.15, 63.0),
('resp-025', 'Fresh Raspberries', 60.0, 1.7, 1.10, 64.0);
