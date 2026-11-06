// ============================================================================
// JOURNEY OF SELF — PANTRY DATABASE, CONSTANTS & CULINARY PROFILES
// ============================================================================

const KCAL_PER_GRAM = { carbs: 4, protein: 4, fat: 9 };
const MAX_VOICE_SECONDS = 300;

const CATEGORY_ORDER = [
    "Seafood & Shellfish",
    "Poultry, Meat & Dairy",
    "Veggies",
    "Fruits & Berries",
    "Cooking Fats & Oils",
    "Nuts & Seeds",
    "Canned Foods",
    "Dried Goods",
    "Fridge",
    "Flour & Fiber",
    "Sauces, Condiments & Flavor"
];

const EMOJI_LIBRARY = [
    "🥩","🍗","🥓","🥚","🧀","🥛","🍣","🐟","🦐","🦪","🥦","🥬","🥑","🍅","🥒","🌶️","🫑","🧄","🧅","🥕","🥔","🍠","🍄","🍓","🫐","🍎","🍌","🍋","🍊","🍒","🍑","🍐","🫒","🥥","🧈","🍾","🥜","🌰","🫘","🌾","🍚","🥣","🥫","🧊","🥪","🍜","🍯","🍁","🧂","🍵","🍫","🥄","📦"
];

const UNIT_CONVERSIONS = {
    "g":    { label: "Grams (g)", factor: 1 },
    "oz":   { label: "Ounces (oz - 28.35g)", factor: 28.35 },
    "tsp":  { label: "Teaspoon (tsp - 5ml)", factor: 5 },
    "tbsp": { label: "Tablespoon (tbsp - 15ml)", factor: 15 },
    "floz": { label: "Fluid Ounce (fl oz - 30ml)", factor: 30 },
    "cup":  { label: "Cup (240ml)", factor: 240 },
    "ml":   { label: "Milliliters (ml)", factor: 1 }
};

const ACTIVITY_OPTIONS = [
    { value: "10-35-55", level: 1, mult: 1.20, line1: "Level 1: Sedentary/Rest Day", line2: "10% Carbs | 35% Protein | 55% Fat • 1.20x BMR" },
    { value: "12-38-50", level: 2, mult: 1.35, line1: "Level 2: Light Active/Walking Pad", line2: "12% Carbs | 38% Protein | 50% Fat • 1.35x BMR" },
    { value: "15-35-50", level: 3, mult: 1.50, line1: "Level 3: Moderate Cardio/10k Steps", line2: "15% Carbs | 35% Protein | 50% Fat • 1.50x BMR" },
    { value: "15-45-40", level: 4, mult: 1.60, line1: "Level 4: Strength & Lifting", line2: "15% Carbs | 45% Protein | 40% Fat • 1.60x BMR" },
    { value: "20-40-40", level: 5, mult: 1.75, line1: "Level 5: High-Intensity/Athletic", line2: "20% Carbs | 40% Protein | 40% Fat • 1.75x BMR" },
    { value: "25-30-45", level: 6, mult: 1.95, line1: "Level 6: Endurance/Mountain Trail", line2: "25% Carbs | 30% Protein | 45% Fat • 1.95x BMR" },
    { value: "custom",   level: 0, mult: 1.35, line1: "Custom Macro Split", line2: "Manual % Carbs | Protein | Fat" }
];

const EXERCISE_ROUTINE_OPTIONS = [
    { value: "walkpad|3.2|0.80",   line1: "Walking Pad / Desk Walk", line2: "2 kph, 3% Incline • 3.2 MET • 80% Fat Fuel" },
    { value: "briskwalk|4.3|0.65", line1: "Brisk Outdoor Walk",      line2: "Flat / Neighborhood • 4.3 MET • 65% Fat Fuel" },
    { value: "trailhike|6.0|0.60", line1: "Trail Hike (Moderate)",   line2: "Elevation Gain • 6.0 MET • 60% Fat Fuel" },
    { value: "mtnascent|8.0|0.50", line1: "Mountain Ascent",         line2: "Steep Climb • 8.0 MET • 50% Fat Fuel" },
    { value: "lifting|5.0|0.55",   line1: "Strength Training",       line2: "Lifting Weights • 5.0 MET • 55% Fat Fuel" },
    { value: "cycling|6.5|0.50",   line1: "Cycling / Rowing",        line2: "Steady Cardio • 6.5 MET • 50% Fat Fuel" },
    { value: "hiit|9.0|0.30",      line1: "High-Intensity / HIIT",   line2: "Running / Sports • 9.0 MET • 30% Fat Fuel" }
];

const EXERCISE_ZONE_OPTIONS = [
    { value: "Zone 1 Walking Pad|0.80",    line1: "Zone 1: Light / Walk Pad",      line2: "80% Lipid / Fat Oxidation" },
    { value: "Zone 2 Steady Cardio|0.65",  line1: "Zone 2: Steady Aerobic Cardio", line2: "65% Lipid / Fat Oxidation" },
    { value: "Strength / Resistance|0.55", line1: "Strength / Resistance Lifting", line2: "55% Lipid / Fat Oxidation" },
    { value: "High Intensity / HIIT|0.30", line1: "Zone 4/5: High Intensity HIIT", line2: "30% Lipid / 70% Glycogen" }
];

const foodDatabase = {};

function mkFood(id, name, emoji, category, defaultWeight, healthScore, calories, netCarbs, fiber, protein, fat, satFat = 0, sugar = 0, sodium = 0, chol = 0, micros = {}) {
    return { id, name, emoji, category, defaultWeight, healthScore, affinity: 2, calories, netCarbs, fiber, protein, fat, satFat, sugar, sodium, chol, micros };
}

function addF(id, name, emoji, catIdx, defaultWeight, healthScore, calories, netCarbs, fiber, protein, fat, satFat = 0, sugar = 0, sodium = 0, chol = 0, micros = {}) {
    foodDatabase[id] = mkFood(id, name, emoji, CATEGORY_ORDER[catIdx], defaultWeight, healthScore, calories, netCarbs, fiber, protein, fat, satFat, sugar, sodium, chol, micros);
}

// 1. SEAFOOD & SHELLFISH (20 ITEMS)
addF("salmon_sockeye", "Sockeye Salmon (Fresh)", "🍣", 0, 150, 10, 153, 0, 0, 21.9, 6.6, 1.2, 0, 55, 62, {"Omega-3": "1.2g", "Vitamin D": "570 IU", "Vitamin B12": "3.2 mcg"});
addF("salmon_atlantic", "Atlantic Salmon (Fresh/Frozen)", "🍣", 0, 150, 9, 208, 0, 0, 20.4, 13.4, 3.1, 0, 59, 55, {"Omega-3": "2.2g", "Vitamin D": "440 IU"});
addF("salmon_king", "Wild King / Chinook Salmon (Fresh)", "🍣", 0, 150, 10, 231, 0, 0, 20.0, 16.3, 3.8, 0, 47, 66, {"Omega-3": "2.6g", "Selenium": "36 mcg"});
addF("tuna_sushi", "Yellowfin/Ahi Tuna (Fresh)", "🍱", 0, 150, 10, 108, 0, 0, 24.4, 0.5, 0.2, 0, 45, 38, {"Selenium": "92 mcg", "Niacin": "18 mg"});
addF("cod_frozen", "Pacific Cod (Frozen)", "🐠", 0, 150, 9, 82, 0, 0, 18.0, 0.7, 0.1, 0, 54, 43, {"Iodine": "110 mcg", "Selenium": "33 mcg"});
addF("halibut_fresh", "Halibut (Fresh/Frozen)", "🐟", 0, 150, 10, 111, 0, 0, 22.5, 1.6, 0.3, 0, 59, 41, {"Selenium": "47 mcg", "Magnesium": "28 mg"});
addF("chilean_seabass", "Chilean Sea Bass / Sablefish (Fresh)", "🐟", 0, 150, 10, 195, 0, 0, 13.4, 15.3, 3.2, 0, 56, 49, {"Omega-3": "1.8g", "Vitamin D": "310 IU"});
addF("swordfish_steak", "Swordfish Steaks (Fresh/Frozen)", "🐟", 0, 150, 9, 144, 0, 0, 19.7, 6.7, 1.8, 0, 81, 66, {"Selenium": "68 mcg", "Vitamin D": "666 IU"});
addF("branzino_snapper", "Mediterranean Branzino / Red Snapper", "🐟", 0, 150, 10, 100, 0, 0, 20.5, 1.3, 0.3, 0, 64, 37, {"Selenium": "38 mcg", "Potassium": "417 mg"});
addF("tilapia_frozen", "Tilapia (Frozen)", "🐟", 0, 150, 8, 96, 0, 0, 20.1, 1.7, 0.6, 0, 52, 50, {"Selenium": "42 mcg", "Vitamin B12": "1.6 mcg"});
addF("rainbow_trout", "Rainbow Trout (Fresh)", "🐟", 0, 150, 10, 141, 0, 0, 20.5, 6.2, 1.4, 0, 51, 59, {"Omega-3": "1.0g", "Vitamin B12": "4.2 mcg"});
addF("mackerel_frozen", "Mackerel (Frozen)", "🐟", 0, 150, 9, 205, 0, 0, 18.6, 13.9, 3.3, 0, 90, 70, {"Omega-3": "2.5g", "Vitamin B12": "8.7 mcg"});
addF("mahi_mahi", "Mahi Mahi (Frozen)", "🐠", 0, 150, 9, 85, 0, 0, 18.5, 0.7, 0.2, 0, 88, 73, {"Selenium": "36 mcg", "Niacin": "6.1 mg"});
addF("unagi_eel", "Unagi / Freshwater Eel (Japanese Prepared)", "🍱", 0, 100, 8, 236, 3.0, 0, 23.7, 15.0, 3.0, 2.5, 310, 161, {"Vitamin A": "3787 IU", "Vitamin B12": "2.9 mcg"});
addF("octopus_tako", "Octopus / Tako (Cooked Sashimi)", "🐙", 0, 100, 9, 164, 4.4, 0, 29.8, 2.1, 0.5, 0, 460, 96, {"Vitamin B12": "36 mcg", "Iron": "9.5 mg"});
addF("shrimp_cooked", "Shrimp (Cooked/Frozen)", "🦐", 0, 120, 9, 99, 0.2, 0, 24.0, 0.3, 0.1, 0, 111, 189, {"Astaxanthin": "High", "Selenium": "40 mcg"});
addF("scallops_frozen", "Sea Scallops (Frozen)", "🐚", 0, 120, 9, 111, 5.4, 0, 20.5, 0.8, 0.2, 0, 390, 41, {"Vitamin B12": "2.2 mcg", "Zinc": "1.5 mg"});
addF("crab_meat", "Lump Crab Meat (Fresh)", "🦀", 0, 115, 9, 83, 0, 0, 17.9, 1.1, 0.2, 0, 293, 53, {"Zinc": "3.6 mg", "Vitamin B12": "9.0 mcg"});
addF("lobster_tail", "Lobster Tail (Fresh/Frozen)", "🦞", 0, 120, 9, 89, 0, 0, 19.0, 0.9, 0.2, 0, 486, 146, {"Copper": "1.6 mg", "Selenium": "73 mcg"});
addF("littleneck_clams", "Littleneck / Manila Clams (Fresh Steamed)", "🦪", 0, 120, 10, 148, 5.1, 0, 25.5, 2.0, 0.2, 0, 120, 67, {"Vitamin B12": "98.9 mcg", "Iron": "2.8 mg"});

// 2. POULTRY, MEAT & DAIRY (40 ITEMS)
addF("chicken_breast", "Chicken Breast (Boneless/Skinless)", "🍗", 1, 150, 10, 165, 0, 0, 31.0, 3.6, 1.0, 0, 74, 85, {"Niacin": "13.7 mg", "Selenium": "27 mcg"});
addF("chicken_thigh", "Chicken Thigh (Boneless/Skinless)", "🍗", 1, 150, 8, 177, 0, 0, 24.0, 8.2, 2.2, 0, 84, 94, {"Zinc": "1.9 mg", "Iron": "1.1 mg"});
addF("ground_chicken", "Ground Chicken (Lean)", "🍗", 1, 115, 9, 143, 0, 0, 17.4, 8.1, 2.1, 0, 60, 86, {"Niacin": "7.5 mg", "Selenium": "18 mcg"});
addF("chicken_sausage", "Chicken Sausage (Links)", "🌭", 1, 85, 7, 164, 2.0, 0, 16.5, 9.4, 2.8, 1.0, 580, 65, {"Protein": "High", "Sodium": "Moderate"});
addF("turkey_breast", "Turkey Breast (Fresh)", "🦃", 1, 150, 10, 135, 0, 0, 30.1, 1.0, 0.3, 0, 55, 62, {"Tryptophan": "High", "Selenium": "30 mcg"});
addF("ground_turkey_93", "Ground Turkey (93/7 Lean)", "🦃", 1, 115, 9, 150, 0, 0, 21.0, 7.0, 1.8, 0, 65, 75, {"Selenium": "25 mcg", "Zinc": "2.4 mg"});
addF("ground_turkey_85", "Ground Turkey (85/15)", "🦃", 1, 115, 7, 200, 0, 0, 17.0, 15.0, 4.0, 0, 70, 80, {"Zinc": "2.6 mg", "Iron": "1.4 mg"});
addF("turkey_bacon", "Uncured Turkey Bacon", "🥓", 1, 28, 7, 214, 3.5, 0, 21.4, 14.3, 3.6, 0, 678, 71, {"Lower Saturated Fat": "Yes"});
addF("duck_breast", "Duck Breast (Skinless)", "🦆", 1, 115, 8, 140, 0, 0, 23.5, 4.5, 1.5, 0, 65, 77, {"Iron": "4.5 mg", "Selenium": "22 mcg"});
addF("beef_93_7", "Ground Beef (93/7 Lean)", "🥩", 1, 115, 8, 152, 0, 0, 21.0, 7.0, 2.9, 0, 66, 62, {"Iron": "2.4 mg", "Zinc": "5.1 mg"});
addF("beef_85_15", "Ground Beef (85/15)", "🥩", 1, 115, 7, 215, 0, 0, 18.6, 15.0, 5.8, 0, 66, 68, {"Iron": "2.1 mg", "Zinc": "4.6 mg"});
addF("beef_80_20", "Ground Beef (80/20)", "🥩", 1, 115, 6, 254, 0, 0, 17.2, 20.0, 7.6, 0, 66, 71, {"Iron": "1.9 mg", "Zinc": "4.2 mg"});
addF("sirloin_steak", "Top Sirloin Steak", "🥩", 1, 150, 9, 183, 0, 0, 27.0, 7.6, 3.0, 0, 58, 78, {"Iron": "2.6 mg", "Zinc": "5.5 mg"});
addF("flank_steak", "Flank Steak", "🥩", 1, 150, 9, 192, 0, 0, 27.6, 8.2, 3.4, 0, 54, 79, {"Zinc": "4.8 mg", "Vitamin B12": "1.8 mcg"});
addF("ny_strip_filet", "NY Strip / Filet Mignon Steak", "🥩", 1, 150, 9, 212, 0, 0, 28.0, 10.6, 4.1, 0, 55, 76, {"Vitamin B12": "2.8 mcg", "Zinc": "5.3 mg"});
addF("ribeye_steak", "Ribeye Steak", "🥩", 1, 150, 7, 291, 0, 0, 24.0, 21.8, 9.5, 0, 54, 80, {"Vitamin B12": "2.5 mcg", "Zinc": "5.2 mg"});
addF("ground_bison", "Grass-Fed Ground Bison / Buffalo", "🥩", 1, 115, 10, 146, 0, 0, 20.2, 7.2, 2.9, 0, 68, 66, {"Iron": "2.8 mg", "CLA & Omega-3": "High"});
addF("venison_elk", "Venison / Elk Medallions (Lean Game)", "🥩", 1, 150, 10, 158, 0, 0, 30.2, 3.2, 1.3, 0, 54, 112, {"Iron": "4.5 mg", "Vitamin B12": "3.6 mcg"});
addF("lamb_chops", "Lamb Loin Chops / Ground Lamb", "🥩", 1, 130, 8, 250, 0, 0, 25.5, 16.5, 6.8, 0, 72, 92, {"CLA": "Highest Ruminant Source", "Zinc": "4.5 mg"});
addF("pork_tenderloin", "Pork Tenderloin (Lean)", "🥩", 1, 150, 9, 143, 0, 0, 26.2, 3.5, 1.2, 0, 52, 65, {"Thiamin (B1)": "0.9 mg", "Selenium": "42 mcg"});
addF("pork_chop", "Pork Loin Chop", "🥩", 1, 150, 8, 197, 0, 0, 25.7, 9.7, 3.4, 0, 58, 75, {"Thiamin": "0.8 mg", "Zinc": "2.2 mg"});
addF("pork_ground", "Ground Pork", "🥩", 1, 115, 7, 263, 0, 0, 16.9, 21.2, 7.9, 0, 56, 72, {"Thiamin": "0.7 mg", "Vitamin B12": "0.8 mcg"});
addF("prosciutto_serrano", "Prosciutto di Parma / Jamón Serrano", "🥓", 1, 30, 7, 250, 0, 0, 28.5, 14.2, 4.9, 0, 1850, 75, {"Dry-Cured Protein": "28.5g/100g"});
addF("bacon_cured", "Bacon (Cooked)", "🥓", 1, 30, 4, 541, 1.4, 0, 37.0, 42.0, 14.0, 0, 1717, 110, {"Sodium": "High", "Choline": "125 mg"});
addF("eggs_whole", "Whole Eggs (Large)", "🥚", 1, 100, 9, 143, 0.7, 0, 12.6, 9.5, 3.1, 0.4, 142, 372, {"Choline": "294 mg", "Vitamin D": "82 IU"});
addF("egg_whites", "Liquid Egg Whites", "🥚", 1, 100, 10, 52, 0.7, 0, 10.9, 0.2, 0, 0.7, 166, 0, {"Pure Albumin": "100%", "Potassium": "163 mg"});
addF("greek_yogurt_0", "Greek Yogurt (0% Nonfat Plain)", "🥣", 1, 170, 10, 59, 3.6, 0, 10.3, 0.4, 0.1, 3.2, 36, 5, {"Probiotics": "Live Cultures", "Calcium": "110 mg"});
addF("greek_yogurt_full", "Greek Yogurt (Whole Milk Plain)", "🥣", 1, 170, 8, 97, 3.9, 0, 9.0, 5.0, 3.2, 3.5, 35, 18, {"Probiotics": "Live Cultures", "Calcium": "100 mg"});
addF("cottage_cheese_low", "Cottage Cheese (2% Low-Fat)", "🥣", 1, 113, 9, 81, 4.3, 0, 10.5, 2.3, 1.4, 4.0, 306, 12, {"Casein Protein": "Slow-Release", "Calcium": "91 mg"});
addF("ricotta_whole", "Whole Milk Ricotta Cheese", "🥣", 1, 60, 8, 150, 3.0, 0, 11.3, 10.3, 6.5, 0.3, 84, 51, {"Whey Protein": "Rich in Leucine", "Calcium": "207 mg"});
addF("kefir_plain", "Plain Fermented Milk Kefir", "🥛", 1, 240, 10, 45, 4.5, 0, 3.8, 1.0, 0.6, 4.5, 50, 5, {"12+ Live Probiotic Strains": "Massive"});
addF("goat_cheese_chevre", "Goat Cheese / Chèvre (Log/Crumbles)", "🧀", 1, 28, 9, 364, 0.1, 0, 21.6, 29.8, 20.6, 0.1, 415, 79, {"A2 Capric/Caprylic MCTs": "Easy Digestion"});
addF("gruyere_swiss", "Aged Gruyère / Swiss Cheese", "🧀", 1, 28, 8, 413, 0.4, 0, 29.8, 32.3, 18.9, 0.4, 336, 110, {"Calcium": "1011 mg", "Vitamin K2": "High"});
addF("cheddar_cheese", "Sharp Cheddar Cheese", "🧀", 1, 28, 7, 403, 1.3, 0, 24.9, 33.1, 21.1, 0.5, 621, 105, {"Calcium": "721 mg", "Vitamin K2": "Good"});
addF("mozzarella_cheese", "Mozzarella Cheese (Part-Skim)", "🧀", 1, 28, 8, 280, 2.8, 0, 24.3, 17.1, 10.9, 1.0, 619, 64, {"Calcium": "731 mg", "Phosphorus": "463 mg"});
addF("parmesan_cheese", "Parmesan Cheese (Grated)", "🧀", 1, 15, 8, 420, 3.4, 0, 37.9, 28.0, 17.3, 0.8, 1529, 88, {"Calcium": "1109 mg", "Umami": "High"});
addF("feta_cheese", "Feta Cheese", "🧀", 1, 28, 7, 264, 4.1, 0, 14.2, 21.3, 14.9, 0, 1116, 89, {"Calcium": "493 mg", "Riboflavin": "0.8 mg"});
addF("cream_cheese", "Cream Cheese", "🧀", 1, 28, 5, 342, 4.1, 0, 5.9, 34.2, 19.3, 3.2, 321, 110, {"Vitamin A": "1111 IU", "Calcium": "98 mg"});
addF("heavy_cream", "Heavy Whipping Cream", "🥛", 1, 15, 6, 340, 2.8, 0, 2.1, 36.1, 23.0, 2.8, 27, 114, {"Vitamin A": "1470 IU", "Choline": "19 mg"});
addF("whole_milk", "Whole Milk", "🥛", 1, 240, 7, 61, 4.8, 0, 3.2, 3.3, 1.9, 5.0, 43, 10, {"Calcium": "113 mg", "Vitamin D": "51 IU"});

// 3. VEGGIES (60 ITEMS)
addF("avocado_fresh", "Avocado (Fresh)", "🥑", 2, 75, 10, 160, 1.8, 6.7, 2.0, 14.7, 2.1, 0.7, 7, 0, {"Potassium": "485 mg", "Folate": "81 mcg"});
addF("broccoli_fresh", "Broccoli (Fresh/Frozen)", "🥦", 2, 100, 10, 34, 4.0, 2.6, 2.8, 0.4, 0.1, 1.7, 33, 0, {"Vitamin C": "89 mg", "Sulforaphane": "High"});
addF("broccoli_rabe", "Broccoli Rabe (Fresh)", "🥦", 2, 100, 10, 22, 0.3, 2.8, 3.2, 0.5, 0.1, 0.3, 33, 0, {"Vitamin K": "224 mcg", "Folate": "83 mcg"});
addF("cauliflower_fresh", "Cauliflower (Fresh/Frozen)", "🥦", 2, 100, 10, 25, 3.0, 2.0, 1.9, 0.3, 0.1, 1.9, 30, 0, {"Vitamin C": "48 mg", "Choline": "44 mg"});
addF("cauliflower_rice", "Cauliflower Rice (Frozen)", "🍚", 2, 100, 10, 24, 3.0, 2.0, 2.0, 0.2, 0, 1.8, 25, 0, {"Vitamin C": "45 mg", "Low Glycemic": "Yes"});
addF("brussels_sprouts", "Brussels Sprouts (Fresh/Frozen)", "🥬", 2, 100, 10, 43, 5.2, 3.8, 3.4, 0.3, 0.1, 2.2, 25, 0, {"Vitamin K": "177 mcg", "Vitamin C": "85 mg"});
addF("spinach_fresh", "Spinach (Fresh/Frozen)", "🥬", 2, 85, 10, 23, 1.4, 2.2, 2.9, 0.4, 0.1, 0.4, 79, 0, {"Vitamin K": "483 mcg", "Magnesium": "79 mg"});
addF("kale_fresh", "Kale (Fresh/Frozen)", "🥬", 2, 85, 10, 49, 5.1, 3.6, 4.3, 0.9, 0.1, 2.3, 38, 0, {"Vitamin K": "390 mcg", "Lutein": "High"});
addF("swiss_chard", "Swiss Chard (Fresh)", "🥬", 2, 100, 10, 19, 2.1, 1.6, 1.8, 0.2, 0, 1.1, 213, 0, {"Vitamin K": "830 mcg", "Magnesium": "81 mg"});
addF("collard_mustard_greens", "Collard & Mustard Greens (Fresh)", "🥬", 2, 100, 10, 32, 1.4, 4.0, 3.0, 0.6, 0.1, 0.5, 17, 0, {"Calcium": "232 mg", "Vitamin K": "437 mcg"});
addF("radicchio_watercress", "Radicchio, Endive & Watercress", "🥬", 2, 85, 10, 20, 2.2, 1.6, 1.8, 0.2, 0, 0.6, 22, 0, {"Bitter Sesquiterpenes": "Digestive Aid"});
addF("bok_choy", "Bok Choy (Fresh)", "🥬", 2, 100, 10, 13, 1.2, 1.0, 1.5, 0.2, 0, 1.2, 65, 0, {"Calcium": "105 mg", "Vitamin C": "45 mg"});
addF("napa_cabbage", "Napa Cabbage (Fresh)", "🥬", 2, 100, 10, 16, 2.0, 1.2, 1.2, 0.2, 0, 1.4, 9, 0, {"Vitamin K": "43 mcg", "Folate": "79 mcg"});
addF("green_cabbage", "Green/Red Cabbage (Fresh)", "🥬", 2, 100, 10, 25, 3.3, 2.5, 1.3, 0.1, 0, 3.2, 18, 0, {"Vitamin C": "36.6 mg", "Vitamin K": "76 mcg"});
addF("romaine_lettuce", "Romaine Lettuce (Fresh)", "🥬", 2, 85, 10, 17, 1.2, 2.1, 1.2, 0.3, 0, 1.2, 8, 0, {"Vitamin A": "8710 IU", "Folate": "136 mcg"});
addF("arugula_fresh", "Arugula (Fresh)", "🥬", 2, 50, 10, 25, 2.1, 1.6, 2.6, 0.7, 0.1, 2.1, 27, 0, {"Dietary Nitrates": "High", "Calcium": "160 mg"});
addF("asparagus_fresh", "Asparagus (Fresh)", "🥦", 2, 100, 10, 20, 1.8, 2.1, 2.2, 0.1, 0, 1.9, 2, 0, {"Folate": "52 mcg", "Prebiotic Inulin": "Yes"});
addF("zucchini_fresh", "Zucchini (Fresh)", "🥒", 2, 120, 10, 17, 2.1, 1.0, 1.2, 0.3, 0.1, 2.5, 8, 0, {"Potassium": "261 mg", "Vitamin C": "17.9 mg"});
addF("eggplant_fresh", "Japanese / Globe Eggplant (Fresh)", "🍆", 2, 100, 9, 25, 2.9, 3.0, 1.0, 0.2, 0, 3.5, 2, 0, {"Nasunin Anthocyanins": "Brain Antioxidant"});
addF("cucumber_fresh", "Cucumber (Fresh)", "🥒", 2, 100, 9, 15, 3.1, 0.5, 0.7, 0.1, 0, 1.7, 2, 0, {"Hydration": "95% Water", "Vitamin K": "16.4 mcg"});
addF("bell_pepper_red", "Bell Pepper - Red/Orange/Yellow", "🫑", 2, 100, 10, 31, 3.9, 2.1, 1.0, 0.3, 0, 4.2, 4, 0, {"Vitamin C": "127.7 mg", "Vitamin A": "3131 IU"});
addF("bell_pepper_green", "Green Bell Pepper (Fresh)", "🫑", 2, 100, 10, 20, 2.9, 1.7, 0.9, 0.2, 0, 2.4, 3, 0, {"Vitamin C": "80.4 mg", "Vitamin B6": "0.2 mg"});
addF("shishito_padron", "Shishito / Padrón Peppers (Fresh)", "🫑", 2, 85, 10, 25, 3.0, 2.0, 1.0, 0.2, 0, 2.0, 3, 0, {"Vitamin C": "High", "Luteolin": "Antioxidant"});
addF("jalapeno_fresh", "Jalapeño / Serrano Peppers (Fresh)", "🌶️", 2, 30, 9, 29, 3.7, 2.8, 0.9, 0.4, 0.1, 4.1, 3, 0, {"Capsaicin": "High", "Vitamin C": "118 mg"});
addF("tomatoes_fresh", "Tomatoes - Roma/Cherry/Vine (Fresh)", "🍅", 2, 100, 10, 18, 2.7, 1.2, 0.9, 0.2, 0, 2.6, 5, 0, {"Lycopene": "High", "Potassium": "237 mg"});
addF("green_beans", "Green Beans (Fresh/Frozen)", "🫛", 2, 100, 9, 31, 4.3, 2.7, 1.8, 0.2, 0, 3.3, 6, 0, {"Vitamin K": "43 mcg", "Vitamin C": "12.2 mg"});
addF("snow_peas", "Snow Peas / Snap Peas (Fresh)", "🫛", 2, 100, 9, 42, 4.9, 2.6, 2.8, 0.2, 0, 4.0, 4, 0, {"Vitamin C": "60 mg", "Vitamin K": "25 mcg"});
addF("green_sweet_peas", "Green Sweet Peas (Fresh/Frozen)", "🫛", 2, 85, 9, 81, 9.0, 5.7, 5.4, 0.4, 0.1, 5.7, 5, 0, {"Plant Protein & Fiber": "High"});
addF("edamame_frozen", "Edamame - Shelled (Frozen)", "🫛", 2, 85, 10, 121, 3.7, 5.2, 11.9, 5.2, 0.6, 2.2, 6, 0, {"Folate": "311 mcg", "Iron": "2.3 mg"});
addF("mushrooms_cremini", "Cremini / Button Mushrooms (Fresh)", "🍄", 2, 85, 10, 22, 2.3, 1.0, 3.1, 0.3, 0, 2.0, 5, 0, {"Selenium": "26 mcg", "Ergothioneine": "High"});
addF("mushrooms_shiitake", "Shiitake Mushrooms (Fresh)", "🍄", 2, 85, 10, 34, 4.3, 2.5, 2.2, 0.5, 0.1, 2.4, 9, 0, {"Beta-Glucans": "High", "Vitamin B5": "1.5 mg"});
addF("mushrooms_enoki_oyster", "Enoki, Oyster & Maitake Mushrooms", "🍄", 2, 85, 10, 35, 5.0, 2.7, 2.9, 0.4, 0.1, 1.0, 3, 0, {"Beta-Glucan Polysaccharides": "Immune Support"});
addF("celery_fresh", "Celery (Fresh)", "🥬", 2, 100, 9, 14, 1.4, 1.6, 0.7, 0.2, 0, 1.3, 80, 0, {"Vitamin K": "29.3 mcg", "Potassium": "260 mg"});
addF("fennel_bulb", "Fennel Bulb (Mediterranean Fresh)", "🥬", 2, 100, 10, 31, 4.2, 3.1, 1.2, 0.2, 0, 3.9, 52, 0, {"Anethole": "Digestive Support", "Potassium": "414 mg"});
addF("carrots_fresh", "Carrots (Fresh)", "🥕", 2, 85, 9, 41, 6.8, 2.8, 0.9, 0.2, 0, 4.7, 69, 0, {"Beta-Carotene / Vit A": "16706 IU"});
addF("parsnips_fresh", "Parsnips (Fresh)", "🥕", 2, 100, 9, 75, 13.1, 4.9, 1.2, 0.3, 0.1, 4.8, 10, 0, {"Soluble Fiber": "4.9g/100g", "Potassium": "375 mg"});
addF("daikon_radish", "Daikon Radish (Japanese White Radish)", "🌱", 2, 100, 10, 18, 2.5, 1.6, 0.6, 0.1, 0, 2.5, 21, 0, {"Myrosinase Enzymes": "Digestive Aid"});
addF("radishes_red", "Red & Watermelon Radishes (Fresh)", "🌱", 2, 85, 10, 16, 1.8, 1.6, 0.7, 0.1, 0, 1.9, 39, 0, {"Isothiocyanates": "High", "Vitamin C": "14.8 mg"});
addF("turnips_rutabaga", "Turnips & Rutabaga (Fresh)", "🥔", 2, 100, 9, 32, 4.8, 2.1, 1.0, 0.1, 0, 4.0, 45, 0, {"Glucosinolates": "Cruciferous Root"});
addF("jicama_fresh", "Jicama (Fresh Sticks)", "🥔", 2, 100, 10, 38, 3.9, 4.9, 0.7, 0.1, 0, 1.8, 4, 0, {"Prebiotic Inulin Fiber": "4.9g/100g"});
addF("lotus_root", "Lotus Root / Renkon (Fresh Sliced)", "🌱", 2, 100, 9, 74, 12.3, 4.9, 2.6, 0.1, 0, 0.5, 40, 0, {"Vitamin C": "44 mg", "Copper": "0.3 mg"});
addF("beets_fresh", "Red & Golden Beets (Fresh/Roasted)", "🍠", 2, 100, 9, 43, 6.8, 2.8, 1.6, 0.2, 0, 6.8, 78, 0, {"Betalains & Nitrates": "Nitric Oxide Boost"});
addF("onion_yellow_red", "Yellow or Red Onion (Fresh)", "🧅", 2, 50, 9, 40, 7.6, 1.7, 1.1, 0.1, 0, 4.2, 4, 0, {"Quercetin": "High", "Prebiotic Inulin": "Yes"});
addF("shallots_fresh", "Shallots (Fresh)", "🧅", 2, 30, 9, 72, 13.6, 3.2, 2.5, 0.1, 0, 7.9, 12, 0, {"Organosulfur Compounds": "High"});
addF("leeks_fresh", "Fresh Leeks", "🧅", 2, 85, 10, 61, 12.4, 1.8, 1.5, 0.3, 0, 3.9, 20, 0, {"Kaempferol & Prebiotic Inulin": "High"});
addF("green_onion", "Green Onions / Scallions (Fresh)", "🧅", 2, 25, 10, 32, 4.7, 2.6, 1.8, 0.2, 0, 2.3, 16, 0, {"Vitamin K": "207 mcg", "Vitamin C": "18.8 mg"});
addF("garlic_fresh", "Fresh Garlic", "🧄", 2, 10, 10, 149, 31.0, 2.1, 6.4, 0.5, 0.1, 1.0, 17, 0, {"Allicin": "High", "Manganese": "1.7 mg"});
addF("ginger_fresh", "Fresh Ginger Root", "🫚", 2, 10, 10, 80, 15.8, 2.0, 1.8, 0.8, 0.2, 1.7, 13, 0, {"Gingerol": "High", "Magnesium": "43 mg"});
addF("fresh_herbs", "Fresh Culinary Herbs (Basil, Cilantro, Parsley, Dill)", "🌿", 2, 15, 10, 28, 1.5, 2.5, 2.8, 0.6, 0.1, 0.3, 35, 0, {"Vitamin K": "600+ mcg", "Apigenin & Luteolin": "Massive"});
addF("spaghetti_squash", "Spaghetti Squash (Fresh)", "🎃", 2, 150, 9, 31, 5.4, 1.5, 0.6, 0.6, 0.1, 2.8, 17, 0, {"Manganese": "0.1 mg", "Vitamin C": "2.1 mg"});
addF("kabocha_squash", "Kabocha Squash (Japanese Pumpkin)", "🎃", 2, 120, 10, 40, 7.0, 2.4, 1.2, 0.2, 0, 3.5, 10, 0, {"Beta-Carotene": "Very High", "Lower Carb Squash": "Yes"});
addF("acorn_delicata", "Acorn & Delicata Squash (Fresh)", "🎃", 2, 120, 9, 40, 8.9, 1.5, 0.8, 0.1, 0, 2.0, 3, 0, {"Vitamin A & C": "High", "Potassium": "347 mg"});
addF("butternut_squash", "Butternut Squash (Fresh/Frozen)", "🎃", 2, 120, 9, 45, 9.7, 2.0, 1.0, 0.1, 0, 2.2, 4, 0, {"Vitamin A": "10630 IU", "Potassium": "352 mg"});
addF("sweet_potato", "Sweet Potato (Fresh)", "🍠", 2, 130, 9, 86, 17.1, 3.0, 1.6, 0.1, 0, 4.2, 55, 0, {"Vitamin A": "14187 IU", "Potassium": "337 mg"});
addF("yukon_potato", "Yukon Gold / Red Potato (Fresh)", "🥔", 2, 130, 7, 77, 15.3, 2.2, 2.0, 0.1, 0, 0.8, 6, 0, {"Potassium": "425 mg", "Vitamin C": "19.7 mg"});
addF("russet_potato", "Russet Baking Potato (Fresh)", "🥔", 2, 150, 6, 79, 16.8, 1.3, 2.1, 0.1, 0, 0.6, 5, 0, {"Potassium": "417 mg", "Vitamin B6": "0.3 mg"});
addF("sweet_corn_fresh", "Sweet Corn on the Cob / Frozen Corn", "🌽", 2, 100, 7, 86, 16.7, 2.0, 3.3, 1.4, 0.2, 6.3, 15, 0, {"Lutein & Zeaxanthin": "Eye Health"});
addF("artichoke_frozen", "Artichoke Hearts (Frozen)", "🥬", 2, 100, 10, 47, 5.1, 5.4, 3.3, 0.2, 0, 1.0, 94, 0, {"Prebiotic Fiber": "Very High", "Folate": "68 mcg"});
addF("okra_fresh", "Okra (Fresh/Frozen)", "🥒", 2, 100, 9, 33, 4.3, 3.2, 1.9, 0.2, 0, 1.5, 7, 0, {"Vitamin K": "31.3 mcg", "Folate": "60 mcg"});
addF("bean_sprouts", "Mung Bean Sprouts (Fresh)", "🌱", 2, 100, 9, 30, 4.1, 1.8, 3.0, 0.2, 0, 4.1, 6, 0, {"Vitamin C": "13.2 mg", "Folate": "61 mcg"});

// 4. FRUITS & BERRIES (25 ITEMS)
addF("blueberries", "Blueberries (Fresh/Frozen)", "🫐", 3, 85, 10, 57, 12.1, 2.4, 0.7, 0.3, 0, 10.0, 1, 0, {"Anthocyanins": "Very High", "Vitamin K": "19.3 mcg"});
addF("raspberries", "Raspberries (Fresh/Frozen)", "🍓", 3, 85, 10, 52, 5.4, 6.5, 1.2, 0.7, 0, 4.4, 1, 0, {"Dietary Fiber": "Massive", "Vitamin C": "26.2 mg"});
addF("blackberries", "Blackberries (Fresh/Frozen)", "🫐", 3, 85, 10, 43, 4.3, 5.3, 1.4, 0.5, 0, 4.9, 1, 0, {"Dietary Fiber": "High", "Vitamin C": "21 mg"});
addF("strawberries", "Strawberries (Fresh/Frozen)", "🍓", 3, 100, 10, 32, 5.7, 2.0, 0.7, 0.3, 0, 4.9, 1, 0, {"Vitamin C": "58.8 mg", "Folate": "24 mcg"});
addF("cranberries_whole", "Whole Cranberries (Fresh/Frozen)", "🍒", 3, 85, 10, 46, 8.6, 3.6, 0.5, 0.1, 0, 4.3, 2, 0, {"A-Type Proanthocyanidins": "High"});
addF("pomegranate_arils", "Pomegranate Arils (Fresh Seeds)", "🍒", 3, 85, 10, 83, 14.7, 4.0, 1.7, 1.2, 0.1, 13.7, 3, 0, {"Punicalagins & Urolithin-A Precursors": "High"});
addF("cherries_dark", "Dark Sweet Cherries (Fresh/Frozen)", "🍒", 3, 100, 9, 63, 13.9, 2.1, 1.1, 0.2, 0, 12.8, 0, 0, {"Melatonin & Polyphenols": "High"});
addF("apple_fresh", "Apple - Honeycrisp/Granny Smith", "🍎", 3, 150, 9, 52, 11.4, 2.4, 0.3, 0.2, 0, 10.4, 1, 0, {"Pectin Fiber": "High", "Quercetin": "Good"});
addF("pear_fresh", "Pear (Fresh)", "🍐", 3, 150, 9, 57, 12.1, 3.1, 0.4, 0.1, 0, 9.8, 1, 0, {"Soluble Fiber": "High", "Copper": "0.1 mg"});
addF("kiwi_fresh", "Kiwifruit (Fresh)", "🥝", 3, 75, 10, 61, 11.7, 3.0, 1.1, 0.5, 0, 9.0, 3, 0, {"Vitamin C": "92.7 mg", "Actinidin Enzyme": "Digestive Aid"});
addF("lemon_lime", "Lemon / Lime Juice (Fresh)", "🍋", 3, 30, 10, 22, 6.6, 0.3, 0.4, 0.2, 0, 2.5, 1, 0, {"Vitamin C": "38.7 mg", "Citric Acid": "High"});
addF("orange_navel", "Navel Orange / Grapefruit", "🍊", 3, 130, 9, 47, 9.4, 2.4, 0.9, 0.1, 0, 9.4, 0, 0, {"Vitamin C": "53.2 mg", "Folate": "30 mcg"});
addF("mandarin_yuzu", "Mandarin / Clementine / Yuzu Citrus", "🍊", 3, 100, 9, 53, 11.5, 1.8, 0.8, 0.3, 0, 10.6, 2, 0, {"Nobiletin & Hesperidin": "Citrus Flavonoids"});
addF("peach_nectarine", "Peach / Nectarine (Fresh)", "🍑", 3, 130, 8, 39, 8.0, 1.5, 0.9, 0.3, 0, 8.4, 0, 0, {"Vitamin C": "6.6 mg", "Vitamin A": "326 IU"});
addF("plum_apricot", "Black Plum & Apricot (Fresh)", "🍑", 3, 100, 9, 46, 10.0, 1.4, 0.7, 0.3, 0, 9.9, 0, 0, {"Chlorogenic Acid": "Antioxidant"});
addF("figs_fresh", "Fresh Black Mission Figs", "🍑", 3, 100, 8, 74, 16.3, 2.9, 0.8, 0.3, 0.1, 16.3, 1, 0, {"Potassium": "232 mg", "Calcium": "35 mg"});
addF("persimmon_fuyu", "Fuyu Persimmon (Japanese Autumn Fruit)", "🍊", 3, 120, 8, 70, 15.0, 3.6, 0.6, 0.2, 0, 12.5, 1, 0, {"Vitamin A": "1627 IU", "Manganese": "0.4 mg"});
addF("papaya_guava", "Papaya & Guava (Fresh)", "🥭", 3, 120, 9, 55, 8.5, 3.5, 1.5, 0.6, 0.1, 7.8, 5, 0, {"Papain Enzymes & Vitamin C": "200% DV"});
addF("pineapple_fresh", "Pineapple (Fresh/Frozen Chunks)", "🍍", 3, 120, 8, 50, 11.7, 1.4, 0.5, 0.1, 0, 9.9, 1, 0, {"Bromelain Enzyme": "Proteolytic Aid"});
addF("mango_fresh", "Mango (Fresh/Frozen Chunks)", "🥭", 3, 120, 7, 60, 13.4, 1.6, 0.8, 0.4, 0.1, 13.7, 1, 0, {"Mangiferin & Vitamin A": "High"});
addF("watermelon_fresh", "Seedless Watermelon (Fresh Cubed)", "🍉", 3, 150, 8, 30, 7.2, 0.4, 0.6, 0.2, 0, 6.2, 1, 0, {"L-Citrulline & Lycopene": "Hydration"});
addF("cantaloupe_honeydew", "Cantaloupe & Honeydew Melon", "🍈", 3, 150, 8, 34, 7.3, 0.9, 0.8, 0.2, 0, 7.9, 16, 0, {"Vitamin A": "3382 IU", "Potassium": "267 mg"});
addF("grapes_seedless", "Red & Green Seedless Grapes", "🍇", 3, 100, 7, 69, 17.2, 0.9, 0.7, 0.2, 0, 15.5, 2, 0, {"Resveratrol": "Polyphenol"});
addF("banana_fresh", "Banana (Fresh)", "🍌", 3, 118, 7, 89, 20.2, 2.6, 1.1, 0.3, 0.1, 12.2, 1, 0, {"Potassium": "358 mg", "Vitamin B6": "0.4 mg"});
addF("medjool_dates", "Medjool Dates (Pitted)", "🌴", 3, 24, 6, 277, 68.3, 6.7, 1.8, 0.2, 0, 66.5, 1, 0, {"Potassium": "696 mg", "Copper": "0.4 mg"});

// 5. COOKING FATS & OILS (20 ITEMS)
addF("olive_oil_ev", "Extra Virgin Olive Oil", "🍾", 4, 14, 10, 884, 0, 0, 0, 100.0, 13.8, 0, 2, 0, {"Oleic Acid": "73%", "Polyphenols": "High"});
addF("garlic_olive_oil", "Garlic-Infused Extra Virgin Olive Oil", "🧄", 4, 14, 10, 884, 0, 0, 0, 100.0, 13.8, 0, 0, 0, {"Low-FODMAP Garlic Flavor": "Oleic Acid 73%"});
addF("truffle_olive_oil", "Black/White Truffle Olive Oil", "🍄", 4, 14, 9, 884, 0, 0, 0, 100.0, 13.8, 0, 0, 0, {"Aromatic Finishing Oil": "Monounsaturated"});
addF("avocado_oil", "Avocado Oil", "🍾", 4, 14, 10, 884, 0, 0, 0, 100.0, 11.6, 0, 0, 0, {"Monounsaturated Fat": "70%", "Smoke Point": "520°F"});
addF("macadamia_oil", "Macadamia Nut Oil", "🍾", 4, 14, 9, 884, 0, 0, 0, 100.0, 12.0, 0, 0, 0, {"Monounsaturated Fat": "80%+", "Omega-7": "High"});
addF("walnut_oil", "Cold-Pressed Walnut Oil", "🍾", 4, 14, 9, 884, 0, 0, 0, 100.0, 9.1, 0, 0, 0, {"ALA Omega-3": "10.4g", "Salad Finishing Oil": "Yes"});
addF("flaxseed_oil", "Cold-Pressed Flaxseed Oil", "🍾", 4, 14, 10, 884, 0, 0, 0, 100.0, 9.0, 0, 0, 0, {"Plant ALA Omega-3": "53g/100g (Massive)"});
addF("perilla_seed_oil", "Roasted Perilla Seed Oil (Japanese/Korean)", "🍾", 4, 14, 10, 884, 0, 0, 0, 100.0, 8.0, 0, 0, 0, {"ALA Omega-3": "60%+", "Rosmarinic Acid": "High"});
addF("pumpkin_seed_oil", "Pumpkin Seed Oil", "🍾", 4, 14, 9, 884, 0, 0, 0, 100.0, 18.0, 0, 0, 0, {"Carotenoids & Vit E": "High"});
addF("sesame_oil_toasted", "Toasted Sesame Oil", "🍾", 4, 14, 8, 884, 0, 0, 0, 100.0, 14.2, 0, 0, 0, {"Sesamol & Sesamin": "Antioxidants"});
addF("chili_crisp_oil", "Chili Crisp Infused Oil", "🌶️", 4, 15, 7, 720, 6.0, 2.0, 2.0, 76.0, 11.0, 1.0, 420, 0, {"Capsaicin & Crispy Garlic": "Savory Heat"});
addF("rice_bran_oil", "High-Heat Rice Bran Oil (Japanese Tempura)", "🍾", 4, 14, 7, 884, 0, 0, 0, 100.0, 19.7, 0, 0, 0, {"Gamma-Oryzanol": "Antioxidant", "Smoke Point": "450°F"});
addF("mct_oil_c8", "Pure MCT Oil (C8/C10 Caprylic)", "🥥", 4, 14, 9, 860, 0, 0, 0, 100.0, 100.0, 0, 0, 0, {"Rapid Ketone Conversion": "Brain Fuel"});
addF("coconut_oil", "Virgin Coconut Oil", "🥥", 4, 14, 7, 862, 0, 0, 0, 100.0, 82.5, 0, 0, 0, {"MCTs / Lauric Acid": "High"});
addF("ghee_clarified", "Ghee (Clarified Butter)", "🧈", 4, 14, 8, 876, 0, 0, 0, 99.5, 61.9, 0, 0, 256, {"Butyric Acid": "High", "Lactose-Free": "Yes"});
addF("butter_irish_salted", "Salted Grass-Fed Irish Butter", "🧈", 4, 14, 8, 717, 0.1, 0, 0.9, 81.1, 51.4, 0.1, 643, 215, {"Vitamin K2 & CLA": "Grass-Fed"});
addF("butter_cultured", "Cultured European Style Butter", "🧈", 4, 14, 8, 740, 0.1, 0, 0.7, 83.0, 53.0, 0.1, 15, 220, {"83% Butterfat": "Fermented Cream"});
addF("butter_grassfed", "Unsalted Butter", "🧈", 4, 14, 7, 717, 0.1, 0, 0.9, 81.1, 51.4, 0.1, 11, 215, {"Vitamin A": "2499 IU", "CLA & Butyrate": "Yes"});
addF("beef_tallow", "Beef Tallow / Duck Fat", "🧈", 4, 14, 7, 902, 0, 0, 0, 100.0, 49.8, 0, 0, 109, {"Stearic & Oleic Acid": "High Heat Stability"});
addF("bacon_fat_drippings", "Filtered Bacon Fat / Skillet Drippings", "🥓", 4, 14, 6, 897, 0, 0, 0, 99.7, 39.0, 0, 140, 95, {"Oleic Acid": "45% Monounsaturated"});

// 6. NUTS & SEEDS (25 ITEMS)
addF("almonds", "Almonds (Raw/Roasted)", "🥜", 5, 28, 10, 579, 9.1, 12.5, 21.2, 49.9, 3.8, 4.4, 1, 0, {"Vitamin E": "25.6 mg", "Magnesium": "270 mg"});
addF("walnuts", "Walnuts", "🥜", 5, 28, 10, 654, 7.0, 6.7, 15.2, 65.2, 6.1, 2.6, 2, 0, {"ALA Omega-3": "9.1g", "Copper": "1.6 mg"});
addF("pecans", "Pecans", "🥜", 5, 28, 9, 691, 4.3, 9.6, 9.2, 72.0, 6.2, 4.0, 0, 0, {"Zinc": "4.5 mg", "Manganese": "4.5 mg"});
addF("macadamia", "Macadamia Nuts", "🥜", 5, 28, 9, 718, 5.2, 8.6, 7.9, 75.8, 12.1, 4.6, 5, 0, {"Monounsaturated Fat": "58.9g", "Thiamin": "1.2 mg"});
addF("hazelnuts_filberts", "Hazelnuts / Filberts (Raw/Roasted)", "🌰", 5, 28, 9, 628, 7.0, 9.7, 15.0, 60.8, 4.5, 4.3, 0, 0, {"Vitamin E": "15 mg", "Manganese": "6.2 mg"});
addF("pistachios", "Pistachios (Shelled)", "🥜", 5, 28, 9, 560, 17.2, 10.6, 20.2, 45.3, 5.9, 7.7, 1, 0, {"Vitamin B6": "1.7 mg", "Potassium": "1025 mg"});
addF("cashews", "Cashews", "🥜", 5, 28, 8, 553, 26.9, 3.3, 18.2, 43.9, 7.8, 5.9, 12, 0, {"Copper": "2.2 mg", "Magnesium": "292 mg"});
addF("brazil_nuts", "Brazil Nuts", "🥜", 5, 15, 9, 659, 4.2, 7.5, 14.3, 67.1, 16.1, 2.3, 3, 0, {"Selenium": "1917 mcg (Massive)"});
addF("pine_nuts", "Pine Nuts", "🥜", 5, 28, 8, 673, 9.4, 3.7, 13.7, 68.4, 4.9, 3.6, 2, 0, {"Pinolenic Acid": "Yes", "Manganese": "8.8 mg"});
addF("chestnuts_roasted", "Roasted Peeled Chestnuts", "🌰", 5, 50, 8, 245, 47.9, 5.1, 3.2, 2.2, 0.4, 10.6, 2, 0, {"Low-Fat Nut": "Vitamin C 26 mg"});
addF("chia_seeds", "Chia Seeds", "🥄", 5, 15, 10, 486, 7.7, 34.4, 16.5, 30.7, 3.3, 0, 16, 0, {"Omega-3": "17.8g", "Calcium": "631 mg"});
addF("flax_seeds", "Whole Flax Seeds", "🌾", 5, 15, 10, 534, 1.6, 27.3, 18.3, 42.2, 3.7, 1.6, 30, 0, {"Omega-3": "22.8g", "Lignans": "Massive"});
addF("hemp_hearts", "Hemp Hearts (Shelled)", "🥄", 5, 30, 10, 553, 4.7, 4.0, 31.6, 48.8, 4.6, 1.5, 5, 0, {"Magnesium": "700 mg", "Zinc": "9.9 mg"});
addF("pumpkin_seeds", "Pumpkin Seeds (Pepitas)", "🥜", 5, 28, 10, 559, 4.7, 6.0, 30.2, 49.1, 8.7, 1.4, 7, 0, {"Magnesium": "592 mg", "Zinc": "7.8 mg"});
addF("sunflower_seeds", "Sunflower Seeds (Kernels)", "🥜", 5, 28, 9, 584, 11.4, 8.6, 20.8, 51.5, 4.5, 2.6, 9, 0, {"Vitamin E": "35.2 mg", "Selenium": "53 mcg"});
addF("sesame_seeds_toasted", "Toasted Black & White Sesame Seeds", "🥄", 5, 15, 9, 573, 11.7, 11.8, 17.7, 49.7, 7.0, 0.3, 11, 0, {"Calcium": "975 mg", "Copper": "4.1 mg"});
addF("poppy_nigella_seeds", "Poppy & Nigella (Black Cumin) Seeds", "🥄", 5, 10, 9, 525, 8.6, 19.5, 18.0, 41.6, 4.5, 3.0, 26, 0, {"Thymoquinone & Calcium": "1438 mg"});
addF("sacha_inchi", "Sacha Inchi Seeds", "🥜", 5, 28, 10, 607, 0, 17.8, 28.5, 46.4, 3.5, 0, 0, 0, {"Plant Omega-3": "Very High", "Complete Protein": "Yes"});
addF("shredded_coconut_unsweet", "Unsweetened Shredded Coconut Flakes", "🥥", 5, 20, 8, 660, 7.3, 16.3, 6.9, 64.5, 57.2, 7.3, 37, 0, {"MCTs & Insoluble Fiber": "High"});
addF("almond_butter", "Almond Butter (Unsweetened)", "🥜", 5, 32, 9, 614, 8.5, 10.3, 21.0, 55.5, 4.2, 4.4, 7, 0, {"Vitamin E": "24.2 mg", "Magnesium": "279 mg"});
addF("peanut_butter", "Natural Peanut Butter", "🥜", 5, 32, 8, 588, 14.0, 6.0, 25.1, 50.4, 6.8, 6.2, 17, 0, {"Niacin": "13.4 mg", "Magnesium": "154 mg"});
addF("cashew_butter", "Creamy Cashew Butter", "🥜", 5, 32, 8, 587, 25.6, 2.0, 17.6, 49.4, 9.8, 5.0, 15, 0, {"Copper & Magnesium": "High"});
addF("sunbutter", "SunButter (Sunflower Seed Butter)", "🌻", 5, 32, 9, 617, 11.0, 7.0, 22.0, 56.0, 5.0, 3.0, 120, 0, {"Nut-Free Vitamin E": "32 mg"});
addF("pistachio_butter", "Pure Pistachio Butter / Paste", "🥜", 5, 30, 9, 572, 16.5, 10.0, 20.5, 46.0, 5.8, 7.0, 5, 0, {"Lutein & Vitamin B6": "High"});
addF("tahini", "Tahini (Sesame Paste)", "🍯", 5, 30, 9, 595, 11.8, 9.3, 17.0, 53.8, 7.5, 0.5, 35, 0, {"Calcium": "426 mg", "Iron": "8.9 mg"});

// 7. CANNED FOODS (60 ITEMS)
addF("tuna_canned", "Albacore/Chunk Light Tuna (Canned)", "🥫", 6, 85, 9, 116, 0, 0, 25.5, 1.0, 0.3, 0, 247, 42, {"Selenium": "65 mcg", "Vitamin B12": "2.5 mcg"});
addF("sardines_canned", "Wild Sardines in Olive Oil (Canned)", "🥫", 6, 85, 10, 208, 0, 0, 24.6, 11.5, 1.5, 0, 307, 142, {"Omega-3": "1.5g", "Calcium": "382 mg"});
addF("salmon_canned", "Wild Pink/Sockeye Salmon (Canned)", "🥫", 6, 85, 10, 136, 0, 0, 23.1, 4.9, 1.1, 0, 360, 55, {"Omega-3": "1.1g", "Vitamin D": "500 IU"});
addF("anchovies_canned", "Anchovy Fillets in Olive Oil (Tin/Jar)", "🐟", 6, 30, 9, 210, 0, 0, 28.9, 9.7, 2.2, 0, 3668, 85, {"Omega-3": "2.1g", "Calcium": "232 mg"});
addF("smoked_oysters", "Smoked Oysters (Canned)", "🦪", 6, 85, 9, 165, 5.5, 0, 13.5, 9.8, 2.1, 0, 320, 75, {"Zinc": "65 mg (Massive)", "Vitamin B12": "16 mcg"});
addF("mussels_canned", "Smoked Mussels (Canned)", "🦪", 6, 85, 9, 140, 3.5, 0, 17.5, 6.0, 1.2, 0, 310, 56, {"Vitamin B12": "20 mcg", "Iron": "6.5 mg"});
addF("chopped_clams_canned", "Chopped Sea Clams in Clam Juice (Canned)", "🦪", 6, 85, 9, 79, 2.7, 0, 13.5, 1.0, 0.1, 0, 320, 38, {"Vitamin B12": "49 mcg", "Iron": "12 mg"});
addF("crab_canned", "Lump White Crab Meat (Canned)", "🦀", 6, 85, 9, 83, 0, 0, 18.1, 0.9, 0.2, 0, 330, 62, {"Zinc": "3.8 mg", "Selenium": "36 mcg"});
addF("squid_canned", "Squid / Calamari (Canned)", "🦑", 6, 85, 8, 92, 1.8, 0, 15.6, 1.4, 0.4, 0, 330, 233, {"Copper": "1.9 mg", "Selenium": "44 mcg"});
addF("saba_miso_canned", "Saba Miso-ni / Mackerel in Miso (Japanese Canned)", "🐟", 6, 100, 9, 215, 6.5, 0.5, 16.8, 13.5, 3.2, 5.0, 520, 65, {"EPA/DHA Omega-3": "2.2g", "Fermented Miso": "Yes"});
addF("sanma_kabayaki", "Sanma Kabayaki / Pacific Saury in Sweet Soy (Canned)", "🐟", 6, 100, 8, 225, 7.2, 0, 18.5, 13.8, 3.1, 6.0, 580, 70, {"Omega-3 & Vitamin B12": "High"});
addF("quail_eggs_canned", "Canned Quail Eggs (Water-Packed)", "🥚", 6, 85, 9, 158, 0.4, 0, 13.1, 11.1, 3.6, 0.4, 141, 844, {"Vitamin B12 & Choline": "High"});
addF("chicken_canned", "Chunk White Chicken Breast in Water (Canned)", "🍗", 6, 85, 9, 115, 0, 0, 23.5, 2.0, 0.6, 0, 350, 60, {"Lean Shelf-Stable Protein": "23.5g/100g"});
addF("roast_beef_canned", "Canned Roast Beef / Corned Beef", "🥩", 6, 85, 7, 215, 0, 0, 25.0, 12.5, 5.2, 0, 790, 82, {"Iron & Vitamin B12": "High"});
addF("spam_canned", "SPAM Less-Sodium / Classic (Canned)", "🥫", 6, 56, 3, 315, 3.0, 0, 13.5, 27.0, 10.0, 0, 1035, 70, {"Shelf-Stable Pork": "High Sodium/Fat"});
addF("tomatoes_diced_canned", "Diced / Crushed Tomatoes (Canned)", "🥫", 6, 120, 9, 24, 3.6, 1.5, 1.1, 0.2, 0, 2.8, 130, 0, {"Bioavailable Lycopene": "Very High"});
addF("san_marzano_canned", "San Marzano Whole Peeled Tomatoes (Canned)", "🥫", 6, 120, 10, 26, 3.8, 1.6, 1.2, 0.2, 0, 3.0, 25, 0, {"Low-Sodium Italian Plum Tomatoes": "Lycopene"});
addF("tomato_sauce_canned", "Tomato Sauce (Canned)", "🥫", 6, 120, 8, 24, 3.8, 1.5, 1.2, 0.2, 0, 3.2, 320, 0, {"Lycopene": "High", "Vitamin C": "7 mg"});
addF("tomato_paste_canned", "Tomato Paste (Canned)", "🥫", 6, 30, 9, 82, 14.8, 4.1, 4.3, 0.5, 0.1, 12.2, 59, 0, {"Concentrated Lycopene": "Massive"});
addF("sundried_tomatoes_oil", "Sun-Dried Tomatoes in Olive Oil (Jarred)", "🍅", 6, 30, 9, 213, 18.0, 5.8, 5.1, 14.1, 2.1, 14.0, 266, 0, {"Bioavailable Lycopene": "Highest Source"});
addF("black_beans_canned", "Black Beans (Canned)", "🫘", 6, 130, 10, 91, 9.7, 6.9, 6.0, 0.3, 0.1, 0.3, 140, 0, {"Magnesium": "42 mg", "Folate": "73 mcg"});
addF("garbanzo_canned", "Garbanzo Beans / Chickpeas (Canned)", "🫘", 6, 130, 9, 119, 15.0, 5.3, 6.2, 1.9, 0.2, 0.5, 165, 0, {"Folate": "65 mcg", "Manganese": "0.9 mg"});
addF("pinto_canned", "Pinto Beans (Canned)", "🫘", 6, 130, 9, 90, 10.6, 5.2, 5.4, 0.6, 0.1, 0.3, 180, 0, {"Folate": "60 mcg", "Iron": "1.5 mg"});
addF("kidney_canned", "Kidney / Cannellini Beans (Canned)", "🫘", 6, 130, 9, 84, 10.2, 5.1, 5.6, 0.4, 0.1, 0.4, 175, 0, {"Iron": "1.6 mg", "Potassium": "265 mg"});
addF("fava_broad_beans", "Mediterranean Fava / Broad Beans (Canned)", "🫘", 6, 130, 9, 71, 6.5, 3.8, 5.2, 0.4, 0.1, 0.8, 220, 0, {"L-DOPA Precursor": "Mood & Focus"});
addF("gigantes_beans", "Gigantes Baked Beans in Vinaigrette (Canned)", "🫘", 6, 130, 9, 135, 12.0, 5.5, 6.0, 6.2, 0.9, 2.5, 290, 0, {"Greek Giant Runner Beans": "High Fiber"});
addF("lentils_canned", "Steamed Ready-to-Eat Brown Lentils (Canned)", "🫘", 6, 130, 10, 105, 11.5, 6.5, 8.2, 0.4, 0.1, 1.0, 140, 0, {"Iron": "3.1 mg", "Folate": "150 mcg"});
addF("adzuki_beans_canned", "Unsweetened Adzuki Red Beans (Japanese Canned)", "🫘", 6, 130, 9, 120, 17.5, 6.5, 7.5, 0.2, 0, 0.5, 15, 0, {"Molybdenum & Folate": "High"});
addF("lupini_beans", "Lupini Beans (Canned/Jarred)", "🫘", 6, 100, 10, 119, 1.2, 2.8, 15.6, 2.9, 0.3, 0, 310, 0, {"Zero-Starch Legume": "Yes"});
addF("black_soybeans", "Black Soybeans (Canned)", "🫘", 6, 130, 10, 92, 0.8, 5.4, 8.5, 4.6, 0.6, 0.8, 115, 0, {"Keto-Friendly Bean": "Yes"});
addF("refried_beans_canned", "Refried Beans (Canned)", "🫘", 6, 130, 7, 91, 10.5, 4.8, 5.2, 1.2, 0.4, 0.4, 340, 0, {"Iron": "1.6 mg", "Potassium": "250 mg"});
addF("chili_beans_canned", "Chili Beans in Sauce (Canned)", "🫘", 6, 130, 7, 95, 13.5, 4.6, 5.4, 0.8, 0.2, 1.5, 380, 0, {"Iron": "1.8 mg", "Fiber": "Good"});
addF("baked_beans_american", "American Smokehouse Baked Beans (Canned)", "🫘", 6, 130, 5, 115, 18.5, 4.2, 4.8, 0.8, 0.2, 8.5, 420, 0, {"Classic Comfort Side": "Higher Sugar"});
addF("dolmas_canned", "Stuffed Grape Leaves / Dolmas (Canned)", "🍃", 6, 100, 8, 145, 15.0, 2.5, 2.8, 7.5, 1.0, 1.0, 480, 0, {"Mediterranean Herb & Rice": "Quercetin"});
addF("artichokes_marinated", "Marinated Artichoke Hearts in Oil (Jarred)", "🥬", 6, 85, 9, 110, 4.5, 4.2, 2.1, 8.5, 1.2, 1.0, 310, 0, {"Cynarin & Prebiotic Inulin": "Liver & Gut"});
addF("eggplant_spread_jar", "Fire-Roasted Eggplant Spread / Caponata (Jarred)", "🍆", 6, 60, 9, 85, 6.0, 2.5, 1.2, 6.0, 0.8, 3.5, 280, 0, {"Mediterranean Vegetable Relish": "Polyphenols"});
addF("olives_black_green", "Black or Kalamata Olives (Canned/Jarred)", "🫒", 6, 30, 8, 116, 2.8, 3.2, 0.8, 10.9, 1.4, 0, 735, 0, {"Oleic Acid": "7.9g", "Polyphenols": "High"});
addF("castelvetrano_olives", "Castelvetrano Green Olives (Jarred)", "🫒", 6, 30, 9, 145, 1.0, 3.0, 1.0, 15.0, 2.0, 0, 680, 0, {"Buttery Sicilian Olives": "Hydroxytyrosol"});
addF("roasted_red_peppers", "Roasted Red Peppers (Canned/Jarred)", "🫑", 6, 50, 9, 28, 4.2, 1.5, 0.9, 0.2, 0, 3.5, 190, 0, {"Vitamin C": "65 mg", "Vitamin A": "High"});
addF("pepperoncini_banana", "Whole Pepperoncini & Banana Peppers (Jarred)", "🌶️", 6, 30, 9, 18, 2.0, 1.5, 0.5, 0.1, 0, 0.5, 450, 0, {"Vinegar & Capsaicin": "Zero Fat"});
addF("pickled_onions_giardiniera", "Pickled Red Onions & Giardiniera (Jarred)", "🧅", 6, 50, 9, 32, 5.0, 1.5, 0.6, 0.5, 0, 2.5, 340, 0, {"Acetic Acid & Quercetin": "Glycemic Aid"});
addF("hatch_green_chiles", "Diced Hatch Green Chiles (Canned)", "🌶️", 6, 30, 9, 20, 3.0, 1.5, 0.7, 0.1, 0, 1.5, 110, 0, {"Vitamin C": "68 mg", "Low Sodium": "Yes"});
addF("pickled_jalapenos", "Pickled Nacho Jalapeño Slices (Jarred)", "🌶️", 6, 30, 8, 27, 2.1, 2.6, 0.9, 0.9, 0.1, 1.3, 660, 0, {"Capsaicin": "Thermogenic"});
addF("chipotle_canned", "Chipotle Peppers in Adobo (Canned)", "🌶️", 6, 30, 8, 83, 13.3, 5.0, 2.6, 1.7, 0.2, 6.0, 460, 0, {"Capsaicin": "High", "Lycopene": "Good"});
addF("dill_pickles_jar", "Kosher Dill Pickle Spears (Jarred)", "🥒", 6, 60, 8, 12, 1.4, 1.0, 0.5, 0.2, 0, 1.1, 808, 0, {"Electrolyte Sodium": "Zero Calorie Crunch"});
addF("sauerkraut_jar", "Barrel-Cured Sauerkraut (Canned/Jarred)", "🥬", 6, 60, 9, 19, 1.4, 2.9, 0.9, 0.1, 0, 1.8, 661, 0, {"Organic Acids & Fiber": "High"});
addF("kimchi_canned", "Shelf-Stable Fermented Kimchi (Canned/Jarred)", "🥬", 6, 60, 9, 18, 1.2, 1.6, 1.1, 0.4, 0, 1.0, 520, 0, {"Fermented Napa & Chili": "Gut Support"});
addF("gari_umeboshi", "Pickled Sushi Ginger (Gari) & Umeboshi Plums", "🌸", 6, 20, 9, 35, 6.5, 1.2, 0.4, 0.1, 0, 4.5, 650, 0, {"Citric Acid & Gingerol": "Palate Cleanser"});
addF("pumpkin_puree_canned", "100% Pure Pumpkin Puree (Canned)", "🎃", 6, 120, 10, 34, 5.2, 2.9, 1.1, 0.3, 0.1, 3.3, 5, 0, {"Vitamin A": "15563 IU", "Soluble Fiber": "High"});
addF("jackfruit_canned", "Young Green Jackfruit in Brine (Canned)", "🥫", 6, 100, 8, 22, 1.5, 3.5, 1.1, 0.1, 0, 0, 190, 0, {"Shredded Meat Texture": "High Fiber"});
addF("baby_corn_canned", "Whole Baby Corn (Canned)", "🌽", 6, 85, 8, 26, 3.2, 2.4, 2.0, 0.4, 0, 1.5, 210, 0, {"Low-Carb Corn": "3.2g Net Carbs"});
addF("sweet_corn_canned", "Sweet Golden Corn Kernels (Canned)", "🌽", 6, 100, 6, 67, 13.5, 1.9, 2.3, 0.8, 0.1, 4.5, 195, 0, {"Lutein & Zeaxanthin": "Good"});
addF("green_beans_canned", "Cut Green Beans (Canned)", "🫛", 6, 100, 8, 20, 2.6, 1.9, 1.1, 0.1, 0, 1.2, 240, 0, {"Low Calorie Vegetable": "20 kcal/100g"});
addF("mushrooms_canned", "Straw & Wood Ear Mushrooms (Canned)", "🍄", 6, 85, 8, 25, 2.6, 2.5, 2.2, 0.3, 0, 0.5, 290, 0, {"Polysaccharides & Fiber": "Good"});
addF("hearts_of_palm", "Hearts of Palm (Canned)", "🎋", 6, 100, 9, 28, 2.2, 2.4, 2.5, 0.2, 0, 1.0, 426, 0, {"Potassium": "177 mg", "Iron": "3.1 mg"});
addF("bamboo_shoots", "Bamboo Shoots (Canned)", "🎋", 6, 100, 8, 19, 1.8, 1.4, 1.7, 0.4, 0.1, 1.0, 7, 0, {"Potassium": "533 mg", "Low Calorie": "Yes"});
addF("water_chestnuts", "Water Chestnuts (Canned)", "🌰", 6, 100, 8, 50, 9.8, 2.5, 0.9, 0.1, 0, 2.5, 8, 0, {"Potassium": "330 mg", "Manganese": "0.2 mg"});
addF("coconut_milk_canned", "Coconut Milk - Full Fat (Canned)", "🥥", 6, 60, 8, 197, 2.8, 0, 2.0, 21.3, 18.9, 2.0, 13, 0, {"MCTs": "High", "Manganese": "0.8 mg"});
addF("coconut_cream_canned", "Canned Coconut Cream (Unsweetened Rich)", "🥥", 6, 60, 8, 280, 3.5, 1.0, 2.8, 29.0, 26.0, 2.0, 15, 0, {"Rich Dairy-Free Cream": "Lauric Acid"});
addF("chicken_veg_soup_canned", "Ready-to-Eat Chicken & Vegetable Soup (Canned)", "🥣", 6, 240, 7, 55, 6.5, 1.2, 4.2, 1.5, 0.4, 1.5, 480, 15, {"Quick Warm Meal Base": "132 kcal/cup"});

// 8. DRIED GOODS (40 ITEMS)
addF("whey_protein_isolate", "Whey Protein Isolate", "🥛", 7, 30, 9, 375, 3.0, 0, 88.0, 1.5, 0.8, 1.0, 160, 15, {"BCAAs / Leucine": "Very High"});
addF("soy_protein", "Soy / Pea Protein Isolate", "🥄", 7, 30, 8, 366, 2.5, 3.3, 83.3, 3.0, 0.5, 0, 900, 0, {"Iron": "14 mg", "Complete Plant Protein": "Yes"});
addF("bone_broth_egg_protein", "Beef Bone Broth / Egg White Protein Powder", "🥄", 7, 30, 9, 360, 1.0, 0, 86.0, 0.5, 0, 0, 280, 0, {"Dairy-Free Complete Protein": "High"});
addF("collagen_peptides", "Collagen Peptides Powder", "🥄", 7, 20, 9, 350, 0, 0, 90.0, 0, 0, 0, 120, 0, {"Glycine & Proline": "Joint/Skin Support"});
addF("beef_jerky_zero", "Zero-Sugar Grass-Fed Beef Jerky / Biltong", "🥩", 7, 28, 9, 285, 1.0, 0, 53.5, 7.1, 2.8, 0, 1150, 65, {"Trail Protein": "53.5g/100g", "Zero Sugar": "Yes"});
addF("pork_rinds", "Artisanal Pork Rinds / Chicharrones", "🥓", 7, 28, 6, 544, 0, 0, 61.3, 31.3, 11.4, 0, 1200, 95, {"Zero-Carb Crunch": "Collagen-Rich"});
addF("katsuobushi_bonito", "Katsuobushi (Dried Smoked Bonito Flakes)", "🐟", 7, 10, 10, 340, 0.5, 0, 77.0, 3.0, 0.8, 0, 140, 180, {"77% Pure Protein": "Japanese Umami Topping"});
addF("tvp_soy_curls", "Textured Soy Protein / Soy Curls (Dry)", "🫘", 7, 35, 9, 336, 15.0, 18.0, 52.0, 1.2, 0.2, 5.0, 15, 0, {"Whole Soybean Strips": "52g Protein/100g"});
addF("oats_steel_cut", "Steel Cut Oats (Dry)", "🌾", 7, 40, 10, 375, 57.5, 10.0, 12.5, 6.3, 1.1, 1.0, 2, 0, {"Beta-Glucan Fiber": "High", "Magnesium": "138 mg"});
addF("oats_rolled", "Rolled Oats (Dry)", "🌾", 7, 40, 9, 379, 57.6, 10.1, 13.2, 6.5, 1.2, 1.0, 6, 0, {"Beta-Glucan": "High", "Iron": "4.2 mg"});
addF("10_grain_cereal", "10-Grain Hot Cereal (Dry)", "🥣", 7, 40, 9, 350, 57.5, 12.5, 12.5, 2.5, 0.4, 1.0, 5, 0, {"Diverse Whole Grains": "10 Types"});
addF("quinoa_tricolor", "Tri-Color Quinoa (Dry)", "🌾", 7, 45, 10, 368, 57.2, 7.0, 14.1, 6.1, 0.7, 0, 5, 0, {"Complete Protein": "Yes", "Magnesium": "197 mg"});
addF("farro_dry", "Farro (Dry)", "🌾", 7, 45, 9, 355, 66.0, 10.5, 13.3, 2.2, 0.3, 1.5, 10, 0, {"Niacin": "6.5 mg", "Zinc": "3.2 mg"});
addF("black_wild_rice", "Black / Forbidden Wild Rice (Dry)", "🍚", 7, 45, 10, 356, 68.9, 6.7, 13.3, 2.2, 0.4, 1.0, 5, 0, {"Anthocyanins": "High", "Zinc": "3.5 mg"});
addF("brown_mixed_rice", "Brown / Mixed Rice (Dry)", "🍚", 7, 45, 8, 362, 72.5, 3.5, 7.5, 2.7, 0.5, 0.8, 4, 0, {"Manganese": "3.7 mg", "Selenium": "23 mcg"});
addF("basmati_rice", "Basmati Rice (Dry)", "🍚", 7, 45, 7, 355, 77.0, 2.0, 8.8, 0.8, 0.2, 0, 2, 0, {"Lower GI White Rice": "Yes"});
addF("jasmine_rice", "Jasmine Rice (Dry)", "🍚", 7, 45, 6, 355, 78.0, 1.1, 7.1, 0.6, 0.1, 0, 2, 0, {"Fast-Digesting Carb": "Yes"});
addF("sushi_rice_koshihikari", "Short-Grain Koshihikari Sushi Rice (Dry)", "🍚", 7, 45, 7, 358, 77.5, 1.5, 6.8, 0.6, 0.1, 0, 2, 0, {"Japanese Short-Grain": "Clean Starch"});
addF("arborio_orzo_dry", "Arborio Risotto Rice / Orzo (Dry)", "🍚", 7, 45, 7, 356, 74.0, 2.2, 9.5, 1.0, 0.2, 0.5, 4, 0, {"Mediterranean Starch Base": "Creamy"});
addF("polenta_grits_dry", "Coarse Polenta / Stone-Ground Corn Grits (Dry)", "🌽", 7, 40, 8, 362, 71.5, 5.5, 8.5, 2.2, 0.3, 1.0, 5, 0, {"Lutein & Zeaxanthin": "Whole Stone-Ground"});
addF("popcorn_kernels_dry", "Organic Yellow/White Popcorn Kernels (Dry)", "🍿", 7, 30, 9, 387, 63.3, 14.5, 12.9, 4.5, 0.6, 0.9, 8, 0, {"Whole Grain Polyphenols": "14.5g Fiber/100g"});
addF("buckwheat", "Buckwheat Groats (Dry)", "🌾", 7, 45, 10, 343, 61.5, 10.0, 13.3, 3.4, 0.7, 0, 1, 0, {"Rutin Bioflavonoid": "High"});
addF("soba_noodles_dry", "100% Buckwheat Soba Noodles (Japanese Dry)", "🍜", 7, 56, 9, 336, 66.0, 5.5, 14.4, 1.9, 0.4, 1.0, 320, 0, {"Rutin & Manganese": "Low GI Noodle"});
addF("udon_ramen_dry", "Sanuki Udon / Ramen Wheat Noodles (Dry)", "🍜", 7, 56, 6, 345, 69.0, 2.8, 11.5, 1.4, 0.3, 1.0, 680, 0, {"Japanese Wheat Noodles": "Quick Fuel"});
addF("chickpea_lentil_pasta", "Chickpea / Red Lentil High-Protein Pasta (Dry)", "🍝", 7, 56, 10, 340, 44.0, 13.5, 23.0, 3.5, 0.5, 3.0, 25, 0, {"Legume Pasta": "23g Protein & 13.5g Fiber"});
addF("semolina_pasta_dry", "Durum Wheat Semolina Pasta (Mediterranean Dry)", "🍝", 7, 56, 7, 357, 71.2, 3.2, 12.5, 1.5, 0.3, 2.5, 6, 0, {"Al Dente Low-GI": "Selenium 63 mcg"});
addF("bulgur", "Bulgur Wheat (Dry)", "🌾", 7, 45, 9, 342, 63.4, 12.5, 12.3, 1.3, 0.2, 0.4, 17, 0, {"Manganese": "3.0 mg", "Fiber": "Very High"});
addF("pearled_barley", "Pearled Barley (Dry)", "🌾", 7, 45, 9, 352, 62.1, 15.6, 9.9, 1.2, 0.2, 0.8, 9, 0, {"Beta-Glucan Soluble Fiber": "Very High"});
addF("couscous_dry", "Tri-Color / Israeli Couscous (Dry)", "🌾", 7, 45, 7, 355, 71.0, 4.4, 12.0, 1.1, 0.2, 1.5, 8, 0, {"Selenium": "27 mcg"});
addF("lentils_dry", "Green / Red / French Lentils (Dry)", "🫘", 7, 45, 10, 352, 40.0, 20.5, 25.8, 1.1, 0.2, 2.0, 6, 0, {"Folate": "479 mcg", "Iron": "6.5 mg"});
addF("split_peas_dry", "Split Peas (Dry)", "🫛", 7, 45, 10, 341, 35.0, 25.5, 24.6, 1.2, 0.2, 8.0, 15, 0, {"Dietary Fiber": "Massive", "Folate": "274 mcg"});
addF("beans_dry_all", "Dry Beans - Black/Navy/Kidney/Pinto", "🫘", 7, 35, 10, 341, 40.0, 22.0, 21.6, 1.4, 0.3, 2.1, 12, 0, {"Iron": "5.3 mg", "Magnesium": "171 mg"});
addF("wakame_kombu_dry", "Dried Wakame & Kombu Seaweed Kelp", "🌿", 7, 10, 10, 138, 12.0, 35.0, 14.0, 2.5, 0.5, 0, 2800, 0, {"Iodine, Fucoxanthin & Alginate Fiber": "Massive"});
addF("seaweed_snacks", "Roasted Seaweed / Nori Sheets", "🌿", 7, 10, 9, 300, 10.0, 10.0, 20.0, 20.0, 2.0, 0, 450, 0, {"Iodine": "Very High", "Tyrosine": "Good"});
addF("dried_shiitake", "Dried Shiitake Mushroom Caps", "🍄", 7, 15, 10, 296, 63.9, 11.5, 9.6, 1.0, 0.2, 2.2, 13, 0, {"Lentinan & Vitamin D2": "Concentrated Umami"});
addF("sundried_tomatoes_dry", "Dry-Packed Sun-Dried Tomato Halves", "🍅", 7, 20, 9, 258, 43.5, 12.3, 14.1, 3.0, 0.4, 37.6, 107, 0, {"Potassium": "3427 mg", "Lycopene": "Extreme"});
addF("tomato_powder", "Dehydrated Tomato Powder", "🧂", 7, 10, 9, 302, 58.2, 16.5, 12.9, 0.4, 0.1, 43.9, 134, 0, {"Concentrated Lycopene": "Extreme"});
addF("freeze_dried_berries", "Freeze-Dried Strawberries & Blueberries", "🍓", 7, 15, 9, 350, 68.0, 15.0, 4.5, 1.5, 0, 52.0, 5, 0, {"100% Whole Fruit Polyphenols": "Zero Added Sugar"});
addF("dried_figs_apricots", "Unsulfured Dried Figs, Apricots & Currants", "🍑", 7, 30, 7, 249, 54.1, 9.8, 3.3, 0.9, 0.1, 47.9, 10, 0, {"Calcium & Iron": "Mediterranean Energy"});
addF("heavy_cream_dried", "Heavy Cream Powder (Dried)", "🥛", 7, 10, 5, 700, 10.0, 0, 7.0, 70.0, 44.0, 10.0, 80, 210, {"Shelf-Stable Dairy Fat": "Yes"});

// 9. FRIDGE (40 ITEMS)
addF("tofu_firm", "Extra Firm Tofu", "🧊", 8, 100, 9, 94, 1.2, 1.0, 10.5, 5.3, 0.8, 0.5, 14, 0, {"Calcium": "350 mg", "Isoflavones": "High"});
addF("tofu_silken", "Silken Tofu", "🧊", 8, 100, 9, 55, 1.9, 0.5, 5.2, 2.7, 0.4, 1.0, 10, 0, {"Calcium": "120 mg", "Digestibility": "High"});
addF("baked_marinated_tofu", "Marinated Baked Teriyaki/Sesame Tofu", "🧊", 8, 85, 9, 175, 4.5, 2.0, 18.5, 9.0, 1.3, 2.5, 380, 0, {"Ready-to-Eat High Protein": "18.5g/100g"});
addF("tempeh", "Organic Tempeh", "🥪", 8, 100, 10, 192, 4.0, 5.0, 20.3, 10.8, 2.5, 0, 9, 0, {"Fermented Soy": "Yes", "Manganese": "1.3 mg"});
addF("natto_fermented", "Natto (Japanese Fermented Soybeans)", "🫘", 8, 50, 10, 211, 7.2, 5.4, 19.4, 11.0, 1.6, 4.9, 7, 0, {"Vitamin K2 (MK-7)": "1000 mcg (Highest Food)", "Nattokinase": "Yes"});
addF("seitan", "Seitan (Wheat Meat)", "🥪", 8, 100, 8, 140, 5.0, 1.5, 25.0, 2.0, 0.3, 1.0, 380, 0, {"High Protein Density": "25g/100g"});
addF("deli_turkey_breast", "Deli Oven-Roasted Turkey Breast", "🦃", 8, 85, 9, 104, 1.8, 0, 21.5, 1.0, 0.3, 1.0, 520, 45, {"Quick Lean Protein": "21.5g/100g"});
addF("deli_roast_beef_ham", "Deli Roast Beef & Uncured Black Forest Ham", "🥩", 8, 85, 8, 125, 1.5, 0, 21.0, 3.8, 1.4, 1.0, 580, 55, {"Iron & Zinc": "High"});
addF("smoked_salmon_lox", "Cold-Smoked Nova Lox / Smoked Salmon", "🍣", 8, 56, 9, 117, 0, 0, 18.3, 4.3, 0.9, 0, 672, 23, {"Omega-3 & Astaxanthin": "High"});
addF("soppressata_pancetta", "Sliced Soppressata, Pancetta & Capicola", "🥓", 8, 30, 6, 350, 1.0, 0, 24.0, 28.0, 10.0, 0, 1450, 85, {"Mediterranean Charcuterie": "Savory"});
addF("hard_boiled_eggs", "Peeled Hard-Boiled Eggs (Ready-to-Eat)", "🥚", 8, 100, 9, 155, 1.1, 0, 12.6, 10.6, 3.3, 1.1, 124, 373, {"Choline & Lutein": "Grab-and-Go"});
addF("egg_white_wraps", "Egg-White Crepes / Wraps", "🥚", 8, 56, 10, 50, 1.5, 0, 10.5, 0.2, 0, 0, 220, 0, {"Zero-Grain Protein Wrap": "Yes"});
addF("keto_tortillas", "High-Fiber Keto / Carb-Balance Tortillas", "🌮", 8, 45, 8, 155, 6.5, 33.0, 11.0, 6.5, 1.0, 0, 420, 0, {"Modified Wheat/Oat Fiber": "33g Fiber/100g"});
addF("sprouted_ezekiel_bread", "Sprouted Grain (Ezekiel) / Sourdough Bread", "🍞", 8, 68, 9, 235, 35.0, 8.8, 14.7, 1.5, 0.3, 0, 220, 0, {"Sprouted Legumes & Grains": "Complete Protein"});
addF("yakisoba_ramen_fresh", "Fresh Yakisoba / Ramen Noodles (Refrigerated)", "🍜", 8, 113, 7, 165, 31.0, 2.0, 6.0, 1.5, 0.3, 1.0, 320, 0, {"Fresh Chilled Japanese Noodles": "Quick Cook"});
addF("gyoza_potstickers", "Chicken & Veggie Potstickers / Gyoza (Refrigerated)", "🥟", 8, 113, 8, 175, 21.0, 2.0, 10.5, 4.8, 1.0, 2.0, 390, 25, {"Japanese Dumplings": "Balanced Macros"});
addF("kelp_noodles", "Kelp Noodles", "🍜", 8, 113, 9, 6, 0, 1.0, 0, 0, 0, 0, 25, 0, {"Iodine": "High", "Calcium": "15% DV"});
addF("shirataki_noodles", "Shirataki / Konjac Noodles", "🍜", 8, 113, 9, 9, 0, 3.0, 0, 0, 0, 0, 5, 0, {"Glucomannan Soluble Fiber": "100%"});
addF("kimchi_fresh", "Kimchi (Raw/Fermented)", "🥬", 8, 50, 10, 15, 0.8, 1.6, 1.1, 0.5, 0.1, 1.1, 498, 0, {"Live Lactobacilli": "High"});
addF("sauerkraut_raw", "Raw Sauerkraut (Refrigerated)", "🥬", 8, 50, 10, 19, 1.4, 2.9, 0.9, 0.1, 0, 1.8, 661, 0, {"Probiotics": "High", "Vitamin C": "14.7 mg"});
addF("takuan_tsukemono", "Pickled Daikon (Takuan) & Cucumber Tsukemono", "🥒", 8, 40, 9, 28, 5.5, 1.5, 0.6, 0.1, 0, 4.0, 580, 0, {"Japanese Fermented Pickles": "Digestive Enzymes"});
addF("white_miso", "White / Red Miso Paste", "🥄", 8, 15, 9, 198, 20.0, 5.4, 12.8, 6.0, 1.1, 6.2, 3728, 0, {"Probiotic Enzymes": "Yes", "Zinc": "2.6 mg"});
addF("labneh_cheese", "Labneh (Thick Strained Kefir/Yogurt Cheese)", "🥣", 8, 45, 9, 160, 4.0, 0, 10.5, 11.0, 7.0, 3.5, 290, 35, {"Mediterranean Probiotic Spread": "High Protein"});
addF("halloumi_cheese", "Halloumi Grilling Cheese", "🧀", 8, 56, 8, 321, 1.8, 0, 21.4, 25.0, 17.8, 1.8, 1070, 89, {"Cypriot Sheep/Goat Cheese": "High Melting Point"});
addF("burrata_bufala", "Fresh Burrata & Mozzarella di Bufala", "🧀", 8, 56, 8, 268, 1.8, 0, 16.1, 21.4, 14.3, 1.0, 285, 71, {"Creamy Artisan Italian Cheese": "Low Sodium"});
addF("feta_marinated", "Herb-Marinated Feta Cubes", "🧀", 8, 30, 8, 290, 2.5, 0, 14.0, 25.0, 14.0, 0, 950, 75, {"Sheep/Goat Feta in Olive Oil": "Rich"});
addF("hummus_fridge", "Classic Hummus", "🥣", 8, 30, 8, 166, 8.3, 6.0, 7.9, 9.6, 1.4, 0.5, 379, 0, {"Folate": "83 mcg", "Iron": "2.4 mg"});
addF("edamame_wasabi_hummus", "Edamame & Wasabi Hummus Dip", "🥣", 8, 30, 9, 150, 6.5, 5.5, 9.0, 8.5, 1.0, 1.5, 320, 0, {"Higher Protein Soy/Tahini Dip": "Yes"});
addF("baba_ganoush", "Smoky Baba Ganoush (Roasted Eggplant Dip)", "🍆", 8, 45, 9, 135, 6.0, 3.5, 3.0, 10.5, 1.5, 2.5, 340, 0, {"Roasted Eggplant & Tahini": "Low Glycemic"});
addF("muhammara_dip", "Muhammara (Roasted Red Pepper & Walnut Spread)", "🫑", 8, 30, 9, 240, 11.0, 3.5, 4.5, 19.5, 2.0, 5.5, 310, 0, {"Walnut Omega-3 & Pomegranate Molasses": "High"});
addF("olive_tapenade_tub", "Kalamata & Green Olive Tapenade (Tub)", "🫒", 8, 30, 9, 230, 3.0, 3.5, 1.5, 23.0, 3.2, 0, 820, 0, {"Olive Polyphenols & Capers": "Keto Friendly"});
addF("pesto_fridge_fresh", "Fresh Refrigerated Genovese Basil Pesto", "🌿", 8, 30, 9, 420, 5.0, 2.2, 9.0, 41.0, 6.0, 1.0, 540, 15, {"Unpasteurized Fresh Basil & Pine Nuts": "High"});
addF("guacamole_fridge", "Fresh Guacamole", "🥑", 8, 30, 9, 150, 2.0, 6.0, 2.0, 14.0, 2.0, 1.0, 260, 0, {"Potassium": "450 mg", "Healthy Fats": "High"});
addF("salsa_fridge_fresh", "Fresh Restaurant-Style Salsa (Refrigerated Tub)", "🍅", 8, 60, 10, 22, 3.8, 1.5, 1.0, 0.2, 0, 2.5, 340, 0, {"Raw Tomato, Onion, Cilantro & Lime": "Vitamin C"});
addF("soy_milk_unsweet", "Organic Unsweetened Soy Milk (Refrigerated)", "🥛", 8, 240, 9, 33, 0.8, 0.8, 3.3, 1.8, 0.3, 0.4, 35, 0, {"8g Complete Plant Protein/Cup": "Isoflavones"});
addF("almond_milk_unsweet", "Unsweetened Almond Milk", "🥛", 8, 240, 9, 13, 0.3, 0.4, 0.5, 1.1, 0.1, 0, 65, 0, {"Calcium": "188 mg", "Vitamin E": "6.8 mg"});
addF("oat_milk_unsweet", "Unsweetened Oat Milk (Refrigerated)", "🥛", 8, 240, 7, 40, 6.5, 0.8, 1.0, 1.5, 0.2, 0, 45, 0, {"Beta-Glucan Soluble Fiber": "Creamy"});
addF("coconut_milk_carton", "Unsweetened Coconut Milk Beverage (Carton)", "🥥", 8, 240, 8, 19, 0.4, 0.4, 0.2, 1.9, 1.7, 0, 15, 0, {"Vitamin B12 & D Fortified": "Low Calorie"});
addF("cold_brew_black", "Unsweetened Black Cold Brew Coffee", "☕", 8, 240, 9, 2, 0, 0, 0.3, 0, 0, 0, 5, 0, {"Chlorogenic Acid Polyphenols": "Zero Sugar"});
addF("kombucha_fridge", "Raw Kombucha", "🍵", 8, 240, 8, 16, 3.5, 0, 0, 0, 0, 3.0, 4, 0, {"Live Cultures & Organic Acids": "High"});

// 10. FLOUR & FIBER (20 ITEMS)
addF("psyllium_husk_powder", "Psyllium Husk Powder", "🌾", 9, 5, 10, 350, 10.0, 80.0, 0, 0, 0, 0, 10, 0, {"Soluble Viscous Fiber": "80g/100g"});
addF("oat_fiber", "Oat Fiber (Zero Net Carb)", "🌾", 9, 15, 10, 0, 0, 95.0, 0, 0, 0, 0, 0, 0, {"Insoluble Dietary Fiber": "95g/100g"});
addF("acacia_inulin_fiber", "Acacia Senegal / Inulin Prebiotic Fiber Powder", "🥄", 9, 10, 10, 200, 0, 90.0, 0, 0, 0, 0, 5, 0, {"Pure Soluble Prebiotic": "90g Fiber/100g"});
addF("green_banana_flour", "Green Banana Flour (Resistant Starch Fiber)", "🍌", 9, 20, 10, 340, 62.0, 18.0, 3.5, 1.0, 0.2, 2.0, 5, 0, {"RS2 Resistant Starch": "Butyrate Producer"});
addF("tigernut_flour", "Tigernut Flour (Prebiotic Resistant Starch)", "🌰", 9, 30, 9, 466, 30.0, 33.3, 6.7, 23.3, 4.0, 20.0, 10, 0, {"Nut-Free Tuber Flour": "33.3g Fiber/100g"});
addF("lupin_flour", "Lupin Bean Flour (Zero-Starch Keto Flour)", "🌾", 9, 30, 10, 333, 3.3, 36.7, 40.0, 10.0, 1.5, 3.3, 15, 0, {"40g Protein & 36.7g Fiber": "Ultra-Low Carb"});
addF("vital_wheat_gluten", "Vital Wheat Gluten (75% Protein Flour)", "🌾", 9, 30, 9, 370, 13.0, 1.0, 75.0, 1.8, 0.3, 0, 29, 0, {"Seitan & Keto Bread Base": "75g Protein/100g"});
addF("flax_meal", "Ground Flaxseed Meal", "🌾", 9, 15, 10, 534, 1.6, 27.3, 18.3, 42.2, 3.7, 1.6, 30, 0, {"Bioavailable Lignans": "Massive"});
addF("almond_flour_pantry", "Blanched Almond Flour", "🌾", 9, 30, 9, 571, 8.9, 10.7, 21.4, 50.0, 3.6, 3.6, 0, 0, {"Vitamin E": "25 mg", "Magnesium": "268 mg"});
addF("coconut_flour", "Organic Coconut Flour", "🥥", 9, 15, 9, 400, 20.0, 36.0, 18.0, 14.0, 12.5, 8.0, 35, 0, {"Dietary Fiber": "36g/100g", "Iron": "8 mg"});
addF("chickpea_flour", "Chickpea / Besan Flour", "🌾", 9, 30, 9, 387, 47.0, 10.8, 22.4, 6.7, 0.7, 10.8, 64, 0, {"Folate": "437 mcg", "Iron": "4.9 mg"});
addF("oat_flour_whole", "Whole Grain Oat Flour", "🌾", 9, 30, 9, 404, 59.2, 6.5, 14.7, 9.1, 1.6, 0.8, 19, 0, {"Beta-Glucan Fiber": "Heart Healthy"});
addF("buckwheat_flour_dark", "Dark Buckwheat Flour", "🌾", 9, 30, 9, 335, 60.6, 10.0, 12.6, 3.1, 0.7, 2.6, 11, 0, {"Rutin & Magnesium": "251 mg"});
addF("whole_red_wheat_flour", "Whole Red Wheat Flour", "🌾", 9, 30, 8, 340, 61.3, 10.7, 13.2, 2.5, 0.4, 0.4, 2, 0, {"Manganese": "4.1 mg", "Selenium": "61 mcg"});
addF("cassava_flour", "Cassava Root Flour (Grain-Free)", "🌾", 9, 30, 7, 357, 78.5, 7.1, 1.8, 0.5, 0.1, 1.8, 15, 0, {"Whole Yuca Root": "Autoimmune Friendly"});
addF("rice_flour", "White / Brown Rice Flour", "🌾", 9, 30, 6, 366, 77.7, 2.4, 6.0, 1.4, 0.4, 0.1, 0, 0, {"Gluten-Free": "Yes"});
addF("arrowroot", "Arrowroot / Tapioca Starch", "🥄", 9, 10, 6, 357, 84.8, 3.4, 0.3, 0.1, 0, 0, 2, 0, {"Grain-Free Thickener": "Yes"});
addF("xanthan_glucomannan", "Xanthan Gum & Glucomannan Binder", "🥄", 9, 3, 9, 300, 0, 80.0, 3.0, 0, 0, 0, 300, 0, {"Zero-Carb Sauce & Baking Binder": "80% Soluble Fiber"});
addF("falafel_mix", "Dry Falafel Mix", "🧆", 9, 35, 7, 343, 43.0, 11.4, 17.1, 5.7, 0.7, 3.0, 850, 0, {"Iron": "3.5 mg", "Fiber": "High"});
addF("baking_powder", "Baking Powder / Baking Soda", "🥄", 9, 4, 6, 53, 27.7, 0.2, 0, 0, 0, 0, 10600, 0, {"Calcium": "5876 mg"});

// 11. SAUCES, CONDIMENTS & FLAVOR (50 ITEMS)
addF("stevia_extract", "Pure Stevia Leaf Extract / Drops", "🌿", 10, 1, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, {"Zero Glycemic Impact": "GI 0"});
addF("monk_fruit", "Monk Fruit / Allulose Sweetener", "🥄", 10, 4, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, {"Zero Net Carbs": "Yes"});
addF("erythritol", "Erythritol / Xylitol Granules", "🥄", 10, 4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, {"Sugar Alcohol": "Zero Glycemic"});
addF("organic_raw_sugar", "Organic Raw Sugar (Turbinado/Cane)", "🧂", 10, 4, 2, 399, 99.8, 0, 0, 0, 0, 99.2, 3, 0, {"Unrefined Cane Crystals": "100%"});
addF("cane_sugar_white", "White Granulated Cane Sugar", "🧂", 10, 4, 1, 387, 100.0, 0, 0, 0, 0, 100.0, 1, 0, {"Pure Sucrose": "100%"});
addF("brown_sugar", "Dark / Light Brown Sugar", "🧂", 10, 4, 1, 380, 98.1, 0, 0.1, 0, 0, 97.0, 28, 0, {"Molasses Trace Minerals": "Potassium 133 mg"});
addF("coconut_sugar", "Coconut Palm Sugar", "🥥", 10, 4, 3, 375, 95.0, 0, 0, 0, 0, 95.0, 15, 0, {"Trace Inulin": "Yes"});
addF("raw_honey", "Raw Unfiltered Honey", "🍯", 10, 21, 5, 304, 82.2, 0.2, 0.3, 0, 0, 82.1, 4, 0, {"Raw Enzymes & Pollen": "Yes"});
addF("maple_syrup", "Pure Aged Maple Syrup", "🍁", 10, 30, 5, 260, 67.0, 0, 0, 0.1, 0, 60.5, 12, 0, {"Manganese": "2.9 mg", "Zinc": "1.5 mg"});
addF("brown_rice_syrup", "Brown Rice Syrup", "🍯", 10, 30, 2, 316, 80.0, 0, 0, 0, 0, 80.0, 15, 0, {"Maltose": "High GI"});
addF("vinegar_apple_cider", "Raw Apple Cider Vinegar", "🍾", 10, 15, 10, 21, 0.9, 0, 0, 0, 0, 0.4, 5, 0, {"Acetic Acid & Mother": "Glycemic Control"});
addF("vinegar_balsamic", "Aged Balsamic Vinegar", "🍾", 10, 15, 8, 88, 17.0, 0, 0.5, 0, 0, 14.9, 23, 0, {"Grape Polyphenols": "High"});
addF("vinegar_all", "Red Wine / Rice / White Vinegar", "🍾", 10, 15, 9, 18, 0.3, 0, 0, 0, 0, 0, 4, 0, {"Acetic Acid": "5%"});
addF("tamari_soy_sauce", "Tamari / Low-Sodium Soy Sauce", "🍾", 10, 15, 7, 60, 5.6, 0.8, 10.5, 0.1, 0, 1.7, 3800, 0, {"Fermented Umami": "High"});
addF("coconut_aminos", "Coconut Aminos", "🍾", 10, 15, 8, 100, 20.0, 0, 0, 0, 0, 20.0, 1800, 0, {"Soy-Free Alternative": "70% Less Sodium"});
addF("enchilada_red_green", "Red or Green Enchilada Sauce", "🥫", 10, 60, 7, 42, 5.5, 1.6, 0.8, 1.5, 0.2, 2.0, 420, 0, {"Capsaicin & Lycopene": "Good"});
addF("sambal_hot_sauce", "Sambal Oelek / Sriracha / Hot Sauce", "🌶️", 10, 15, 8, 35, 6.0, 2.0, 1.0, 0.5, 0, 3.0, 1100, 0, {"Capsaicin": "Thermogenic"});
addF("dijon_mustard", "Dijon / Stone Ground Mustard", "🍯", 10, 15, 9, 66, 3.3, 4.0, 3.7, 3.3, 0.2, 0.8, 1100, 0, {"Selenium": "32 mcg"});
addF("worcestershire", "Worcestershire / Fish Sauce", "🍾", 10, 10, 6, 78, 19.5, 0, 0, 0, 0, 10.0, 980, 0, {"Umami": "High"});
addF("mirin", "Mirin (Sweet Rice Wine)", "🍶", 10, 15, 4, 240, 43.0, 0, 0.2, 0, 0, 40.0, 15, 0, {"Cooking Glaze": "High Sugar"});
addF("tamarind_paste", "Tamarind Paste", "🍯", 10, 15, 8, 239, 57.4, 5.1, 2.8, 0.6, 0.3, 38.8, 28, 0, {"Tartaric Acid & Magnesium": "92 mg"});
addF("marmite", "Marmite / Yeast Extract", "🍯", 10, 5, 7, 260, 20.0, 3.0, 38.0, 0.5, 0.1, 1.0, 3900, 0, {"Vitamin B12": "24 mcg", "Folate": "1250 mcg"});
addF("bone_broth", "Chicken or Beef Bone Broth", "🥣", 10, 240, 10, 19, 0, 0, 4.2, 0.2, 0, 0, 180, 0, {"Collagen & Glycine": "High"});
addF("cacao_nibs", "Raw Cacao Nibs / Unsweetened Cocoa", "🍫", 10, 15, 10, 570, 7.0, 33.0, 14.0, 46.0, 27.0, 0, 20, 0, {"Magnesium": "499 mg", "Flavanols": "Massive"});
addF("nutritional_yeast", "Nutritional Yeast Flakes", "🧀", 10, 10, 10, 400, 10.0, 20.0, 50.0, 5.0, 0.8, 0, 250, 0, {"Vitamin B12": "150 mcg"});
addF("matcha_powder", "Ceremonial Matcha Green Tea Powder", "🍵", 10, 2, 10, 324, 3.0, 38.5, 29.6, 5.3, 0.7, 0, 6, 0, {"EGCG Catechins": "137x Green Tea"});
addF("maca_powder", "Gelatinized Maca Root Powder", "🥄", 10, 5, 9, 325, 60.0, 18.0, 14.0, 2.0, 0.3, 25.0, 18, 0, {"Adaptogens / Macamides": "High"});
addF("gochujang", "Gochujang (Korean Fermented Chili Paste)", "🌶️", 10, 15, 7, 220, 44.0, 2.5, 5.0, 1.5, 0.2, 24.0, 2200, 0, {"Fermented Capsaicin": "Thermogenic"});
addF("thai_curry_paste", "Thai Red / Green Curry Paste", "🍛", 10, 15, 9, 115, 12.0, 4.0, 3.0, 5.5, 1.0, 3.0, 1850, 0, {"Galangal, Lemongrass & Chili": "Anti-Inflammatory"});
addF("ponzu_sauce", "Ponzu (Citrus Soy Dressing)", "🍋", 10, 15, 8, 66, 13.0, 0, 3.3, 0, 0, 6.5, 2100, 0, {"Yuzu/Citrus Bioflavonoids": "Bright Umami"});
addF("oyster_mushroom_sauce", "Oyster / Mushroom Stir-Fry Sauce", "🦪", 10, 15, 7, 105, 22.0, 0.5, 2.5, 0.3, 0, 16.0, 2600, 0, {"Savory Glaze": "Rich Glutamates"});
addF("black_bean_garlic", "Fermented Black Bean Garlic Sauce", "🫘", 10, 15, 8, 130, 14.0, 2.5, 7.0, 5.0, 0.7, 6.0, 2900, 0, {"Fermented Soy & Allicin": "Deep Savory"});
addF("dashi_broth", "Dashi Broth / Bonito Flakes", "🍲", 10, 240, 10, 15, 0.5, 0, 3.0, 0.2, 0, 0, 260, 5, {"Inosinate & Kombu Iodine": "Pure Umami Base"});
addF("basil_pesto", "Basil Pesto (Genovese)", "🌿", 10, 30, 9, 450, 4.5, 2.0, 8.5, 44.0, 6.5, 1.5, 580, 12, {"Fresh Basil Polyphenols & Olive Oil": "High"});
addF("chimichurri", "Chimichurri (Fresh Herb & Garlic Sauce)", "🌿", 10, 30, 10, 410, 3.0, 1.8, 1.5, 43.0, 6.0, 0.5, 390, 0, {"Parsley, Oregano & Raw Garlic": "Antioxidant"});
addF("harissa_paste", "Harissa (North African Chili Paste)", "🌶️", 10, 15, 9, 95, 8.0, 3.5, 2.5, 5.0, 0.7, 2.0, 680, 0, {"Caraway, Coriander & Smoked Chili": "High"});
addF("tzatziki_dip", "Tzatziki (Cucumber Garlic Yogurt Dip)", "🥒", 10, 30, 9, 90, 4.0, 0.5, 5.5, 6.0, 3.5, 2.5, 260, 18, {"Live Yogurt Cultures & Dill": "Cooling"});
addF("capers_brined", "Capers (Non-Pareil Brined)", "🫒", 10, 10, 10, 23, 1.7, 3.2, 2.4, 0.9, 0.2, 0.4, 2348, 0, {"Quercetin & Rutin": "Highest Plant Source"});
addF("sundried_tomato_tapenade", "Sun-Dried Tomato Tapenade", "🍅", 10, 20, 9, 285, 12.0, 4.5, 3.5, 24.0, 3.5, 8.0, 620, 0, {"Concentrated Lycopene & Olive Oil": "High"});
addF("salsa_verde", "Salsa Verde (Roasted Tomatillo)", "🟢", 10, 30, 10, 28, 4.5, 1.5, 1.0, 0.5, 0, 2.5, 380, 0, {"Tomatillo Withanolides & Cilantro": "Low Cal"});
addF("pico_de_gallo", "Pico de Gallo / Fire-Roasted Salsa", "🍅", 10, 30, 10, 26, 4.2, 1.6, 1.0, 0.2, 0, 2.8, 360, 0, {"Vitamin C & Lycopene": "Fresh"});
addF("tajin_seasoning", "Tajín (Chili-Lime Seasoning)", "🌶️", 10, 2, 9, 0, 0, 0, 0, 0, 0, 0, 19000, 0, {"Dehydrated Lime & Chili Peppers": "Zero Cal"});
addF("bbq_sauce_sf", "Sugar-Free Tangy BBQ Sauce", "🍖", 10, 30, 8, 35, 5.0, 1.5, 1.0, 0.2, 0, 1.0, 720, 0, {"Apple Cider Vinegar & Tomato Base": "Low Glycemic"});
addF("smoked_paprika_rub", "Liquid Smoke & Smoked Paprika Rub", "🔥", 10, 5, 9, 282, 19.0, 34.9, 14.1, 12.9, 2.1, 10.3, 68, 0, {"Capsanthin Carotenoids": "Very High"});
addF("avocado_oil_mayo", "Avocado Oil Mayonnaise", "🥚", 10, 15, 8, 667, 0, 0, 0, 73.3, 8.5, 0, 500, 50, {"Monounsaturated Avocado Oil": "Seed-Oil Free"});
addF("horseradish_wasabi", "Prepared Horseradish / Real Wasabi", "🌱", 10, 10, 9, 48, 8.0, 3.3, 1.2, 0.7, 0.1, 5.0, 420, 0, {"Allyl Isothiocyanate": "Sinus & Antimicrobial"});
addF("furikake_bagel", "Furikake / Everything Bagel Seasoning", "🧂", 10, 5, 9, 480, 12.0, 8.0, 18.0, 36.0, 5.0, 2.0, 3200, 0, {"Sesame, Nori, Garlic & Poppy": "Iodine & Calcium"});
addF("golden_turmeric_blend", "Golden Turmeric, Ginger & Black Pepper Blend", "✨", 10, 4, 10, 312, 44.4, 22.7, 9.7, 3.3, 1.8, 3.2, 27, 0, {"Curcumin + Piperine": "2000% Bioavailability"});
addF("vanilla_bean_paste", "Pure Vanilla Bean Paste / Extract", "🍦", 10, 5, 8, 288, 12.6, 0, 0.1, 0.1, 0, 12.6, 9, 0, {"Vanillin Polyphenols": "Aromatic"});
addF("blackstrap_molasses", "Unsulphured Blackstrap Molasses", "🍯", 10, 15, 7, 290, 74.7, 0, 0, 0.1, 0, 55.0, 37, 0, {"Iron": "17.2 mg", "Calcium": "860 mg"});

// 5-SLOT CULINARY BRAIN PROFILES, QUOTA CAPS & SORTING METADATA
const PANTRY_UTILITY_ONLY = new Set([
    "baking_powder", "xanthan_glucomannan", "arrowroot", "rice_flour", "cassava_flour",
    "whole_red_wheat_flour", "buckwheat_flour_dark", "oat_flour_whole", "chickpea_flour",
    "coconut_flour", "almond_flour_pantry", "vital_wheat_gluten", "lupin_flour",
    "tigernut_flour", "green_banana_flour", "acacia_inulin_fiber", "oat_fiber",
    "psyllium_husk_powder", "whey_protein_isolate", "soy_protein", "bone_broth_egg_protein",
    "collagen_peptides", "heavy_cream_dried", "tomato_powder", "organic_raw_sugar",
    "cane_sugar_white", "brown_sugar", "coconut_sugar", "brown_rice_syrup", "erythritol"
]);

const SWEET_ONLY_ITEMS = new Set([
    "blueberries", "raspberries", "blackberries", "strawberries", "cranberries_whole",
    "cherries_dark", "apple_fresh", "pear_fresh", "kiwi_fresh", "peach_nectarine",
    "plum_apricot", "figs_fresh", "persimmon_fuyu", "banana_fresh", "medjool_dates",
    "cantaloupe_honeydew", "grapes_seedless", "watermelon_fresh", "freeze_dried_berries",
    "dried_figs_apricots", "oats_steel_cut", "oats_rolled", "10_grain_cereal",
    "stevia_extract", "monk_fruit", "raw_honey", "maple_syrup", "cacao_nibs",
    "matcha_powder", "maca_powder", "vanilla_bean_paste", "blackstrap_molasses"
]);

const ROLE_CAPS = {
    protein: 2,
    veggie: 4,
    base: 2,
    fat_fridge: 2,
    sauce: 3
};

const PLANT_AND_CANNED_PROTEIN_IDS = new Set([
    "tofu_firm", "tofu_silken", "baked_marinated_tofu", "tempeh", "natto_fermented",
    "seitan", "deli_turkey_breast", "deli_roast_beef_ham", "smoked_salmon_lox",
    "hard_boiled_eggs", "tuna_canned", "sardines_canned", "salmon_canned",
    "anchovies_canned", "smoked_oysters", "mussels_canned", "chopped_clams_canned",
    "crab_canned", "squid_canned", "saba_miso_canned", "sanma_kabayaki",
    "quail_eggs_canned", "chicken_canned", "roast_beef_canned", "beef_jerky_zero",
    "tvp_soy_curls"
]);

const CATEGORY_SORT_PRIORITY = {
    "Seafood & Shellfish": 1,
    "Poultry, Meat & Dairy": 2,
    "Veggies": 3,
    "Fruits & Berries": 4,
    "Dried Goods": 5,
    "Canned Foods": 6,
    "Nuts & Seeds": 7,
    "Cooking Fats & Oils": 8,
    "Fridge": 9,
    "Flour & Fiber": 10,
    "Sauces, Condiments & Flavor": 11
};

const CULINARY_PROFILES = {
    med: {
        label: "🌊 Med",
        slot1: ["branzino_snapper", "halibut_fresh", "salmon_atlantic", "swordfish_steak", "octopus_tako", "shrimp_cooked", "scallops_frozen", "littleneck_clams", "chicken_breast", "chicken_thigh", "lamb_chops", "prosciutto_serrano", "greek_yogurt_0", "greek_yogurt_full", "goat_cheese_chevre", "feta_cheese", "mozzarella_cheese", "parmesan_cheese", "ricotta_whole", "sardines_canned", "salmon_canned", "tuna_canned"],
        slot2: ["avocado_fresh", "broccoli_rabe", "spinach_fresh", "arugula_fresh", "asparagus_fresh", "zucchini_fresh", "eggplant_fresh", "cucumber_fresh", "bell_pepper_red", "tomatoes_fresh", "fennel_bulb", "artichoke_frozen", "onion_yellow_red", "shallots_fresh", "garlic_fresh", "fresh_herbs", "lemon_lime", "radicchio_watercress"],
        slot3: ["almonds", "walnuts", "pistachios", "pine_nuts", "san_marzano_canned", "sundried_tomatoes_oil", "garbanzo_canned", "kidney_canned", "fava_broad_beans", "gigantes_beans", "lentils_canned", "lupini_beans", "dolmas_canned", "artichokes_marinated", "eggplant_spread_jar", "olives_black_green", "castelvetrano_olives", "roasted_red_peppers", "pepperoncini_banana", "farro_dry", "arborio_orzo_dry", "polenta_grits_dry", "chickpea_lentil_pasta", "semolina_pasta_dry", "bulgur", "couscous_dry", "lentils_dry", "sundried_tomatoes_dry"],
        slot4: ["olive_oil_ev", "garlic_olive_oil", "truffle_olive_oil", "labneh_cheese", "halloumi_cheese", "burrata_bufala", "feta_marinated", "hummus_fridge", "baba_ganoush", "muhammara_dip", "olive_tapenade_tub", "pesto_fridge_fresh", "soppressata_pancetta", "sprouted_ezekiel_bread"],
        slot5: ["vinegar_balsamic", "vinegar_all", "dijon_mustard", "basil_pesto", "chimichurri", "harissa_paste", "tzatziki_dip", "capers_brined", "sundried_tomato_tapenade", "golden_turmeric_blend"]
    },
    asian: {
        label: "🥢 Asian",
        slot1: ["salmon_sockeye", "salmon_king", "tuna_sushi", "cod_frozen", "halibut_fresh", "chilean_seabass", "mackerel_frozen", "unagi_eel", "octopus_tako", "shrimp_cooked", "scallops_frozen", "crab_meat", "littleneck_clams", "chicken_thigh", "chicken_breast", "ground_chicken", "duck_breast", "pork_tenderloin", "pork_ground", "flank_steak", "eggs_whole", "saba_miso_canned", "sanma_kabayaki", "quail_eggs_canned"],
        slot2: ["broccoli_fresh", "bok_choy", "napa_cabbage", "green_cabbage", "cucumber_fresh", "shishito_padron", "snow_peas", "edamame_frozen", "mushrooms_shiitake", "mushrooms_enoki_oyster", "daikon_radish", "lotus_root", "green_onion", "garlic_fresh", "ginger_fresh", "kabocha_squash", "bean_sprouts"],
        slot3: ["sesame_seeds_toasted", "cashews", "adzuki_beans_canned", "gari_umeboshi", "baby_corn_canned", "mushrooms_canned", "bamboo_shoots", "water_chestnuts", "katsuobushi_bonito", "sushi_rice_koshihikari", "black_wild_rice", "jasmine_rice", "soba_noodles_dry", "udon_ramen_dry", "wakame_kombu_dry", "seaweed_snacks", "dried_shiitake"],
        slot4: ["sesame_oil_toasted", "perilla_seed_oil", "chili_crisp_oil", "rice_bran_oil", "tofu_firm", "tofu_silken", "baked_marinated_tofu", "natto_fermented", "yakisoba_ramen_fresh", "gyoza_potstickers", "kelp_noodles", "shirataki_noodles", "kimchi_fresh", "takuan_tsukemono", "white_miso", "edamame_wasabi_hummus"],
        slot5: ["vinegar_all", "tamari_soy_sauce", "coconut_aminos", "sambal_hot_sauce", "mirin", "gochujang", "ponzu_sauce", "oyster_mushroom_sauce", "black_bean_garlic", "dashi_broth", "horseradish_wasabi", "furikake_bagel"]
    },
    curry: {
        label: "🍛 Curry/Thai",
        slot1: ["shrimp_cooked", "mahi_mahi", "cod_frozen", "salmon_atlantic", "scallops_frozen", "chicken_thigh", "chicken_breast", "ground_chicken", "duck_breast", "pork_tenderloin", "pork_ground", "lamb_chops", "eggs_whole", "tofu_firm", "tempeh"],
        slot2: ["broccoli_fresh", "cauliflower_fresh", "cauliflower_rice", "spinach_fresh", "bok_choy", "zucchini_fresh", "eggplant_fresh", "bell_pepper_red", "jalapeno_fresh", "green_beans", "snow_peas", "green_sweet_peas", "carrots_fresh", "onion_yellow_red", "shallots_fresh", "green_onion", "garlic_fresh", "ginger_fresh", "fresh_herbs", "butternut_squash", "sweet_potato", "mango_fresh", "pineapple_fresh", "papaya_guava", "lemon_lime"],
        slot3: ["cashews", "peanut_butter", "cashew_butter", "shredded_coconut_unsweet", "garbanzo_canned", "lentils_canned", "jackfruit_canned", "baby_corn_canned", "bamboo_shoots", "water_chestnuts", "coconut_milk_canned", "coconut_cream_canned", "basmati_rice", "jasmine_rice", "lentils_dry"],
        slot4: ["coconut_oil", "ghee_clarified", "rice_bran_oil", "chili_crisp_oil", "baked_marinated_tofu", "shirataki_noodles", "coconut_milk_carton"],
        slot5: ["coconut_aminos", "tamari_soy_sauce", "sambal_hot_sauce", "worcestershire", "tamarind_paste", "thai_curry_paste", "golden_turmeric_blend"]
    },
    latin: {
        label: "🌮 Mexican/Latin",
        slot1: ["flank_steak", "sirloin_steak", "beef_93_7", "beef_85_15", "chicken_thigh", "chicken_breast", "ground_chicken", "ground_turkey_93", "pork_tenderloin", "pork_ground", "shrimp_cooked", "mahi_mahi", "cod_frozen", "eggs_whole", "cheddar_cheese", "mozzarella_cheese", "feta_cheese"],
        slot2: ["avocado_fresh", "romaine_lettuce", "green_cabbage", "zucchini_fresh", "bell_pepper_red", "bell_pepper_green", "jalapeno_fresh", "tomatoes_fresh", "jicama_fresh", "onion_yellow_red", "green_onion", "garlic_fresh", "fresh_herbs", "sweet_potato", "sweet_corn_fresh", "lemon_lime"],
        slot3: ["pumpkin_seeds", "tomatoes_diced_canned", "black_beans_canned", "pinto_canned", "refried_beans_canned", "chili_beans_canned", "roasted_red_peppers", "pickled_onions_giardiniera", "hatch_green_chiles", "pickled_jalapenos", "chipotle_canned", "hearts_of_palm", "sweet_corn_canned", "brown_mixed_rice", "quinoa_tricolor", "beans_dry_all"],
        slot4: ["avocado_oil", "olive_oil_ev", "keto_tortillas", "egg_white_wraps", "guacamole_fridge", "salsa_fridge_fresh", "sauerkraut_raw"],
        slot5: ["vinegar_apple_cider", "enchilada_red_green", "sambal_hot_sauce", "chimichurri", "salsa_verde", "pico_de_gallo", "tajin_seasoning", "smoked_paprika_rub"]
    },
    american: {
        label: "🥩 American",
        slot1: ["ribeye_steak", "ny_strip_filet", "sirloin_steak", "flank_steak", "ground_bison", "venison_elk", "beef_93_7", "beef_85_15", "chicken_breast", "chicken_thigh", "chicken_sausage", "turkey_breast", "ground_turkey_93", "turkey_bacon", "pork_tenderloin", "pork_chop", "bacon_cured", "salmon_sockeye", "lobster_tail", "scallops_frozen", "crab_meat", "cheddar_cheese", "gruyere_swiss"],
        slot2: ["avocado_fresh", "broccoli_fresh", "cauliflower_fresh", "brussels_sprouts", "spinach_fresh", "kale_fresh", "collard_mustard_greens", "romaine_lettuce", "asparagus_fresh", "zucchini_fresh", "cucumber_fresh", "bell_pepper_red", "tomatoes_fresh", "green_beans", "mushrooms_cremini", "celery_fresh", "carrots_fresh", "beets_fresh", "onion_yellow_red", "shallots_fresh", "garlic_fresh", "butternut_squash", "sweet_potato", "yukon_potato", "russet_potato", "sweet_corn_fresh"],
        slot3: ["walnuts", "pecans", "almonds", "dill_pickles_jar", "sauerkraut_jar", "baked_beans_american", "green_beans_canned", "quinoa_tricolor", "black_wild_rice", "pork_rinds"],
        slot4: ["butter_irish_salted", "butter_cultured", "butter_grassfed", "ghee_clarified", "beef_tallow", "bacon_fat_drippings", "olive_oil_ev", "avocado_oil", "deli_turkey_breast", "deli_roast_beef_ham", "hard_boiled_eggs", "sprouted_ezekiel_bread", "sauerkraut_raw"],
        slot5: ["vinegar_apple_cider", "vinegar_balsamic", "dijon_mustard", "worcestershire", "bone_broth", "bbq_sauce_sf", "smoked_paprika_rub", "avocado_oil_mayo", "horseradish_wasabi", "furikake_bagel"]
    },
    plant: {
        label: "🌱 Plant Bowl",
        slot1: ["tofu_firm", "tofu_silken", "baked_marinated_tofu", "tempeh", "natto_fermented", "seitan", "edamame_frozen", "lupini_beans", "black_soybeans", "tvp_soy_curls"],
        slot2: ["avocado_fresh", "broccoli_fresh", "broccoli_rabe", "cauliflower_fresh", "cauliflower_rice", "brussels_sprouts", "spinach_fresh", "kale_fresh", "swiss_chard", "bok_choy", "arugula_fresh", "asparagus_fresh", "zucchini_fresh", "bell_pepper_red", "tomatoes_fresh", "snow_peas", "mushrooms_cremini", "mushrooms_shiitake", "mushrooms_enoki_oyster", "carrots_fresh", "beets_fresh", "jicama_fresh", "kabocha_squash", "butternut_squash", "sweet_potato", "artichoke_frozen", "fresh_herbs", "pomegranate_arils"],
        slot3: ["lentils_canned", "black_beans_canned", "garbanzo_canned", "fava_broad_beans", "lentils_dry", "split_peas_dry", "chickpea_lentil_pasta", "hemp_hearts", "sacha_inchi", "pumpkin_seeds", "almonds", "walnuts", "pistachios", "chia_seeds", "flax_seeds", "sunflower_seeds", "sesame_seeds_toasted", "quinoa_tricolor", "farro_dry", "black_wild_rice", "buckwheat", "wakame_kombu_dry", "seaweed_snacks"],
        slot4: ["olive_oil_ev", "avocado_oil", "flaxseed_oil", "walnut_oil", "perilla_seed_oil", "pumpkin_seed_oil", "sesame_oil_toasted", "tahini", "hummus_fridge", "edamame_wasabi_hummus", "baba_ganoush", "muhammara_dip", "olive_tapenade_tub", "guacamole_fridge", "kimchi_fresh", "sauerkraut_raw", "white_miso", "kelp_noodles", "shirataki_noodles", "sprouted_ezekiel_bread"],
        slot5: ["vinegar_apple_cider", "vinegar_balsamic", "coconut_aminos", "tamari_soy_sauce", "dijon_mustard", "nutritional_yeast", "chimichurri", "harissa_paste", "salsa_verde", "pico_de_gallo", "golden_turmeric_blend", "furikake_bagel"]
    },
    breakfast_savory: {
        label: "🍳 Savory Breakfast",
        slot1: ["eggs_whole", "egg_whites", "hard_boiled_eggs", "smoked_salmon_lox", "turkey_bacon", "chicken_sausage", "bacon_cured", "prosciutto_serrano", "cottage_cheese_low", "feta_cheese", "goat_cheese_chevre", "cheddar_cheese", "gruyere_swiss"],
        slot2: ["avocado_fresh", "spinach_fresh", "kale_fresh", "arugula_fresh", "tomatoes_fresh", "bell_pepper_red", "mushrooms_cremini", "asparagus_fresh", "zucchini_fresh", "onion_yellow_red", "green_onion", "sweet_potato", "yukon_potato", "fresh_herbs"],
        slot3: ["black_beans_canned", "pinto_canned", "refried_beans_canned", "pumpkin_seeds", "hemp_hearts", "quinoa_tricolor", "hatch_green_chiles", "roasted_red_peppers"],
        slot4: ["butter_irish_salted", "ghee_clarified", "olive_oil_ev", "avocado_oil", "sprouted_ezekiel_bread", "egg_white_wraps", "keto_tortillas", "guacamole_fridge", "salsa_fridge_fresh"],
        slot5: ["salsa_verde", "pico_de_gallo", "sambal_hot_sauce", "chimichurri", "harissa_paste", "furikake_bagel", "dijon_mustard", "nutritional_yeast"]
    },
    breakfast_sweet: {
        label: "🥣 Sweet Breakfast Bowl",
        slot1: ["greek_yogurt_0", "greek_yogurt_full", "cottage_cheese_low", "ricotta_whole", "kefir_plain", "eggs_whole", "egg_whites"],
        slot2: ["blueberries", "raspberries", "blackberries", "strawberries", "cherries_dark", "pomegranate_arils", "apple_fresh", "pear_fresh", "kiwi_fresh", "peach_nectarine", "figs_fresh", "banana_fresh", "mango_fresh", "medjool_dates"],
        slot3: ["oats_steel_cut", "oats_rolled", "10_grain_cereal", "quinoa_tricolor", "buckwheat", "pumpkin_puree_canned", "freeze_dried_berries", "almonds", "walnuts", "pecans", "macadamia", "pistachios", "chia_seeds", "flax_seeds", "hemp_hearts", "pumpkin_seeds", "shredded_coconut_unsweet"],
        slot4: ["almond_butter", "peanut_butter", "cashew_butter", "pistachio_butter", "sunbutter", "coconut_oil", "mct_oil_c8", "almond_milk_unsweet", "soy_milk_unsweet", "cold_brew_black"],
        slot5: ["stevia_extract", "monk_fruit", "raw_honey", "maple_syrup", "cacao_nibs", "matcha_powder", "maca_powder", "vanilla_bean_paste", "golden_turmeric_blend"]
    }
};

const SPIN_STYLE_LABELS = {
    surprise: "Surprise Me",
    fusion: "Fusion Mix",
    med: "Mediterranean",
    asian: "Japanese & Asian",
    curry: "Curry & Thai",
    latin: "Mexican & Latin",
    american: "American Bistro",
    plant: "Plant Bowl",
    breakfast: "Breakfast"
};

const MACRO_META = {
    netCarbs: {
        title: "🔥 Net Carbohydrates Breakdown",
        color: "var(--text-carb)",
        glow: "var(--glow-carb)",
        limitWord: "Daily Limit",
        role: "Net Carbs (Total Carbs minus Fiber) directly drive blood glucose and insulin signaling. Keeping Net Carbs within your daily target encourages steady energy and switches your metabolism toward fat oxidation between meals.",
        topIds: ["cauliflower_rice", "avocado_fresh", "broccoli_fresh", "zucchini_fresh", "spinach_fresh"]
    },
    fiber: {
        title: "🌿 Dietary Fiber Breakdown",
        color: "var(--text-fib)",
        glow: "var(--glow-fib)",
        limitWord: "Daily Goal",
        role: "Dietary Fiber slows gastric emptying, blunts post-meal glucose spikes, and feeds beneficial gut bacteria that produce short-chain fatty acids (butyrate) for satiety and metabolic health.",
        topIds: ["chia_seeds", "flax_seeds", "avocado_fresh", "raspberries", "black_beans_canned"]
    },
    protein: {
        title: "💪 Protein Breakdown",
        color: "var(--text-pro)",
        glow: "var(--glow-pro)",
        limitWord: "Daily Goal",
        role: "Protein has the highest thermic effect of any macronutrient (burning 20–30% of its calories during digestion), triggers PYY and GLP-1 satiety hormones, and protects lean muscle mass while in a calorie deficit.",
        topIds: ["chicken_breast", "salmon_sockeye", "tuna_canned", "greek_yogurt_0", "sirloin_steak"]
    },
    fat: {
        title: "🥑 Dietary Fat Breakdown",
        color: "var(--text-fat)",
        glow: "var(--glow-fat)",
        limitWord: "Daily Limit",
        role: "Healthy monounsaturated and Omega-3 fats support hormone synthesis, fat-soluble vitamin absorption (A, D, E, K), and steady ketogenic/lipid energy without spiking insulin.",
        topIds: ["olive_oil_ev", "avocado_fresh", "salmon_sockeye", "walnuts", "macadamia"]
    }
};