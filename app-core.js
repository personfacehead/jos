// ============================================================================
// JOURNEY OF SELF — CORE STATE, METABOLIC ENGINE, WEIGHT GRAPH & PLATE SPINNER
// ============================================================================

let appSettings = { unitSystem: 'imperial', fiberPer1000: 15, activeColor: 'default', pantryViewMode: 'list' };
let dailyTargets = { netCarbs: 45, fiber: 23, protein: 143, fat: 83 };
let loggedMacros = { netCarbs: 0, fiber: 0, protein: 0, fat: 0, calories: 0, sodium: 0, weightedScore: 0 };
let sandboxMeal = [];
let currentMealSlot = "Breakfast";
let currentSpinStyle = "surprise";
let hasSpunPlate = false;
let isPlateSpinning = false;
let pantrySelections = new Set();
let openPantryCategories = new Set();
let lastCommit = null;
let currentFilter = 'all';
let activeCookbookRecipeId = null;

let telemetry = {
    gender: 'male', age: 50, heightIn: 70, actLevel: 2, goalPace: 'auto',
    currentWeight: 236.0, startWeight: 236.0, targetWeight: 155.0,
    targetDate: '2027-12-01', waist: '', neck: '', hip: '', bodyFat: '', steps: 6500, stepGoal: 10000
};

let weightHistory = [];
let waterHistoryStack = [];
let exerciseLog = [];
let lifeState = {
    waterOz: 0, waterGoalOz: 96, waterMl: 0, waterGoalMl: 2500,
    fastStart: null, sleepHrs: 7.5, mood: 3, energy: 3, clarity: 3, comfort: 3,
    sanctuaryLocked: false,
    habits: {
        "Morning Sunlight / Outdoor Air": false,
        "Walking Pad / Daily Movement": false,
        "Hydration Goal On Track": false,
        "Protein & Dynamic Fiber Hit": false,
        "Evening Wind-Down (Kitchen Closed)": false
    }
};

let dailyMeals = { "Breakfast": [], "Lunch": [], "Dinner": [], "Evening Meal": [], "Snacks": [] };
let journalHistory = [];
let savedRecipes = {};

let fastingTickerInterval = null;
let mediaRecorder = null;
let audioChunks = [];
let currentRecordedBlob = null;
let recordStartTime = null;
let recordTimerInterval = null;
let vjDatabase = null;
let audioCtx = null;
let analyserNode = null;
let waveformAnimId = null;
let speechRecognizer = null;
let isTranscribing = false;
let actionToastTimeout = null;

// UNIVERSAL HAPTIC & VISUAL ACTION CUE ENGINE
function hapticTap(pattern = 12) {
    if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} }
}

function triggerActionCue(message, icon = "✨") {
    hapticTap([18, 40, 32]);
    const overlay = document.getElementById('action-toast-overlay');
    const txt = document.getElementById('action-toast-text');
    const icn = document.getElementById('action-toast-icon');
    if (!overlay || !txt || !icn) return;
    icn.textContent = icon;
    txt.textContent = message;
    overlay.classList.add('show');
    if (actionToastTimeout) clearTimeout(actionToastTimeout);
    actionToastTimeout = setTimeout(() => overlay.classList.remove('show'), 2600);
}

// CULINARY ROLE & PLATE-ORDER SORTING HELPERS
function getFoodRole(foodId) {
    const f = foodDatabase[foodId];
    if (!f) return "veggie";
    if (
        f.category === "Seafood & Shellfish" ||
        f.category === "Poultry, Meat & Dairy" ||
        PLANT_AND_CANNED_PROTEIN_IDS.has(foodId)
    ) {
        return "protein";
    }
    if (f.category === "Veggies" || f.category === "Fruits & Berries") {
        return "veggie";
    }
    if (f.category === "Sauces, Condiments & Flavor") {
        return "sauce";
    }
    if (f.category === "Cooking Fats & Oils" || f.category === "Fridge") {
        return "fat_fridge";
    }
    return "base";
}

function getCulinarySortRank(foodId) {
    const f = foodDatabase[foodId];
    if (!f) return 99;
    if (PLANT_AND_CANNED_PROTEIN_IDS.has(foodId)) return 2.5;
    return CATEGORY_SORT_PRIORITY[f.category] || 50;
}

function sortSandboxByCulinaryOrder() {
    sandboxMeal.sort((a, b) => getCulinarySortRank(a.id) - getCulinarySortRank(b.id));
}

function updateSpinButtonAndHintUI() {
    const spinBtn = document.getElementById('spin-plate-btn');
    const hintBox = document.getElementById('spin-lock-hint');
    const styleLabel = SPIN_STYLE_LABELS[currentSpinStyle] || 'Surprise Me';
    const showSpinAgain = hasSpunPlate && sandboxMeal.length > 0;

    if (spinBtn && !isPlateSpinning) {
        if (showSpinAgain) {
            spinBtn.innerHTML = `<span style="font-size: 1.3rem;">🎲</span> Spin Again (${styleLabel})`;
        } else {
            spinBtn.innerHTML = `<span style="font-size: 1.3rem;">🎲</span> Spin a Plate (${styleLabel})`;
        }
    }
    if (hintBox) {
        hintBox.style.display = showSpinAgain ? 'block' : 'none';
    }
}

function initEmojiPicker() {
    const grid = document.getElementById('emoji-picker-grid');
    if (!grid) return;
    grid.innerHTML = '';
    EMOJI_LIBRARY.forEach(emj => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'emoji-opt';
        btn.textContent = emj;
        btn.onclick = () => {
            document.getElementById('cf-emoji').value = emj;
            document.querySelectorAll('.emoji-opt').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
        grid.appendChild(btn);
    });
}

// CUSTOM 2-LINE GLASS DROPDOWN MENUS (ACTIVITY, EXERCISE ROUTINE, EXERCISE ZONE)
function renderActivityDropdown() {
    const menu = document.getElementById('activity-dropdown-menu');
    const currentVal = document.getElementById('activity-preset').value;
    if (!menu) return;
    menu.innerHTML = '';
    ACTIVITY_OPTIONS.forEach(opt => {
        const item = document.createElement('div');
        item.className = `activity-opt ${opt.value === currentVal ? 'selected' : ''}`;
        item.onclick = () => selectActivityOption(opt.value);
        item.innerHTML = `
            <div class="activity-opt-line1">${opt.line1}</div>
            <div class="activity-opt-line2">${opt.line2}</div>
        `;
        menu.appendChild(item);
    });
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === currentVal) || ACTIVITY_OPTIONS[1];
    const txtEl = document.getElementById('activity-selected-text');
    if (txtEl) txtEl.textContent = activeOpt.line1;
}

function toggleActivityDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('activity-dropdown-menu');
    if (menu) menu.classList.toggle('open');
}

function selectActivityOption(val) {
    document.getElementById('activity-preset').value = val;
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === val);
    if (activeOpt && activeOpt.level > 0) {
        telemetry.actLevel = activeOpt.level;
    }
    const menu = document.getElementById('activity-dropdown-menu');
    if (menu) menu.classList.remove('open');
    renderActivityDropdown();
    applyPreset();
    previewSmartTargets();
}

function renderExRoutineDropdown() {
    const menu = document.getElementById('ex-routine-dropdown-menu');
    const currentVal = document.getElementById('ex-preset-type').value;
    if (!menu) return;
    menu.innerHTML = '';
    EXERCISE_ROUTINE_OPTIONS.forEach(opt => {
        const item = document.createElement('div');
        item.className = `activity-opt ${opt.value === currentVal ? 'selected' : ''}`;
        item.onclick = () => selectExRoutineOption(opt.value);
        item.innerHTML = `
            <div class="activity-opt-line1">${opt.line1}</div>
            <div class="activity-opt-line2">${opt.line2}</div>
        `;
        menu.appendChild(item);
    });
    const activeOpt = EXERCISE_ROUTINE_OPTIONS.find(o => o.value === currentVal) || EXERCISE_ROUTINE_OPTIONS[0];
    const txtEl = document.getElementById('ex-routine-selected-text');
    if (txtEl) txtEl.textContent = activeOpt.line1;
}

function toggleExRoutineDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('ex-routine-dropdown-menu');
    const zMenu = document.getElementById('ex-zone-dropdown-menu');
    if (zMenu) zMenu.classList.remove('open');
    if (menu) menu.classList.toggle('open');
}

function selectExRoutineOption(val) {
    document.getElementById('ex-preset-type').value = val;
    const menu = document.getElementById('ex-routine-dropdown-menu');
    if (menu) menu.classList.remove('open');
    renderExRoutineDropdown();
}

function renderExZoneDropdown() {
    const menu = document.getElementById('ex-zone-dropdown-menu');
    const currentVal = document.getElementById('ex-manual-zone').value;
    if (!menu) return;
    menu.innerHTML = '';
    EXERCISE_ZONE_OPTIONS.forEach(opt => {
        const item = document.createElement('div');
        item.className = `activity-opt ${opt.value === currentVal ? 'selected' : ''}`;
        item.onclick = () => selectExZoneOption(opt.value);
        item.innerHTML = `
            <div class="activity-opt-line1">${opt.line1}</div>
            <div class="activity-opt-line2">${opt.line2}</div>
        `;
        menu.appendChild(item);
    });
    const activeOpt = EXERCISE_ZONE_OPTIONS.find(o => o.value === currentVal) || EXERCISE_ZONE_OPTIONS[0];
    const txtEl = document.getElementById('ex-zone-selected-text');
    if (txtEl) txtEl.textContent = activeOpt.line1;
}

function toggleExZoneDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('ex-zone-dropdown-menu');
    const rMenu = document.getElementById('ex-routine-dropdown-menu');
    if (rMenu) rMenu.classList.remove('open');
    if (menu) menu.classList.toggle('open');
}

function selectExZoneOption(val) {
    document.getElementById('ex-manual-zone').value = val;
    const menu = document.getElementById('ex-zone-dropdown-menu');
    if (menu) menu.classList.remove('open');
    renderExZoneDropdown();
}

document.addEventListener('click', (e) => {
    const pairs = [
        ['activity-dropdown-wrap', 'activity-dropdown-menu'],
        ['ex-routine-dropdown-wrap', 'ex-routine-dropdown-menu'],
        ['ex-zone-dropdown-wrap', 'ex-zone-dropdown-menu']
    ];
    pairs.forEach(([wrapId, menuId]) => {
        const wrap = document.getElementById(wrapId);
        const menu = document.getElementById(menuId);
        if (wrap && menu && !wrap.contains(e.target)) menu.classList.remove('open');
    });
});

// MEMORY & STATE PERSISTENCE
function recalculateLoggedFromMeals() {
    loggedMacros = { netCarbs: 0, fiber: 0, protein: 0, fat: 0, calories: 0, sodium: 0, weightedScore: 0 };
    Object.values(dailyMeals).forEach(slotItems => {
        slotItems.forEach(item => {
            const food = foodDatabase[item.id];
            if (!food || item.weight <= 0) return;
            const ratio = item.weight / 100;
            const cals = food.calories * ratio;
            loggedMacros.calories += cals;
            loggedMacros.netCarbs += food.netCarbs * ratio;
            loggedMacros.fiber += food.fiber * ratio;
            loggedMacros.protein += food.protein * ratio;
            loggedMacros.fat += food.fat * ratio;
            loggedMacros.sodium += (food.sodium || 0) * ratio;
            loggedMacros.weightedScore += (food.healthScore * cals);
        });
    });
}

function saveToMemory() {
    localStorage.setItem('journeySettings_v7', JSON.stringify(appSettings));
    localStorage.setItem('journeyDailyMeals_v7', JSON.stringify(dailyMeals));
    localStorage.setItem('journeySandbox_v7', JSON.stringify(sandboxMeal));
    localStorage.setItem('journeyTelemetry_v7', JSON.stringify(telemetry));
    localStorage.setItem('journeyWeightHist_v7', JSON.stringify(weightHistory));
    localStorage.setItem('journeyWaterStack_v7', JSON.stringify(waterHistoryStack));
    localStorage.setItem('journeyExercise_v7', JSON.stringify(exerciseLog));
    localStorage.setItem('journeyLife_v7', JSON.stringify(lifeState));
    localStorage.setItem('journeyHistory_v7', JSON.stringify(journalHistory));
    localStorage.setItem('journeyRecipes_v7', JSON.stringify(savedRecipes));
    localStorage.setItem('journeyCalInput_v7', document.getElementById('calorie-input').value);
    localStorage.setItem('journeyActPreset_v7', document.getElementById('activity-preset').value);
    
    const affinities = {};
    const customFoods = {};
    Object.values(foodDatabase).forEach(f => {
        affinities[f.id] = f.affinity;
        if (f.isCustom) customFoods[f.id] = f;
    });
    localStorage.setItem('journeyAffinities_v7', JSON.stringify(affinities));
    localStorage.setItem('journeyCustomFoods_v7', JSON.stringify(customFoods));
}

function loadFromMemory() {
    const sSet = localStorage.getItem('journeySettings_v7') || localStorage.getItem('journeySettings_v6');
    if (sSet) Object.assign(appSettings, JSON.parse(sSet));
    if (!appSettings.pantryViewMode) appSettings.pantryViewMode = 'list';

    const savedCustomFoods = localStorage.getItem('journeyCustomFoods_v7') || localStorage.getItem('journeyCustomFoods_v6');
    if (savedCustomFoods) Object.assign(foodDatabase, JSON.parse(savedCustomFoods));

    const savedAffinities = localStorage.getItem('journeyAffinities_v7') || localStorage.getItem('journeyAffinities_v6');
    if (savedAffinities) {
        const affinities = JSON.parse(savedAffinities);
        Object.keys(affinities).forEach(id => { if (foodDatabase[id]) foodDatabase[id].affinity = affinities[id]; });
    }

    const sMeals = localStorage.getItem('journeyDailyMeals_v7') || localStorage.getItem('journeyDailyMeals_v6');
    if (sMeals) dailyMeals = JSON.parse(sMeals);

    const savedSandbox = localStorage.getItem('journeySandbox_v7') || localStorage.getItem('journeySandbox_v6');
    if (savedSandbox) {
        sandboxMeal = JSON.parse(savedSandbox).filter(i => foodDatabase[i.id]);
        sortSandboxByCulinaryOrder();
    }
    if (sandboxMeal.length > 0) hasSpunPlate = true;

    const savedTelemetry = localStorage.getItem('journeyTelemetry_v7') || localStorage.getItem('journeyTelemetry_v6');
    if (savedTelemetry) Object.assign(telemetry, JSON.parse(savedTelemetry));
    if (!telemetry.startWeight && telemetry.currentWeight) {
        telemetry.startWeight = telemetry.currentWeight;
    }

    const sWtHist = localStorage.getItem('journeyWeightHist_v7');
    if (sWtHist) {
        weightHistory = JSON.parse(sWtHist);
    } else {
        weightHistory = [
            { date: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10), weight: telemetry.startWeight || 236.0 },
            { date: new Date().toISOString().slice(0, 10), weight: telemetry.currentWeight || 236.0 }
        ];
    }

    const sWStack = localStorage.getItem('journeyWaterStack_v7');
    if (sWStack) waterHistoryStack = JSON.parse(sWStack);

    const sEx = localStorage.getItem('journeyExercise_v7') || localStorage.getItem('journeyExercise_v6');
    if (sEx) exerciseLog = JSON.parse(sEx);

    const sLife = localStorage.getItem('journeyLife_v7') || localStorage.getItem('journeyLife_v6');
    if (sLife) Object.assign(lifeState, JSON.parse(sLife));
    if (typeof lifeState.waterMl !== 'number') lifeState.waterMl = Math.round((lifeState.waterOz || 0) * 29.5735);
    if (typeof lifeState.waterGoalMl !== 'number') lifeState.waterGoalMl = 2500;
    if (!lifeState.comfort) lifeState.comfort = 3;

    const sHist = localStorage.getItem('journeyHistory_v7') || localStorage.getItem('journeyHistory_v6');
    if (sHist) journalHistory = JSON.parse(sHist);

    const sRec = localStorage.getItem('journeyRecipes_v7') || localStorage.getItem('journeyRecipes_v6');
    if (sRec) savedRecipes = JSON.parse(sRec);

    const sCal = localStorage.getItem('journeyCalInput_v7') || localStorage.getItem('journeyCalInput_v6');
    if (sCal) document.getElementById('calorie-input').value = sCal;

    const sAct = localStorage.getItem('journeyActPreset_v7') || localStorage.getItem('journeyActPreset_v6');
    if (sAct) document.getElementById('activity-preset').value = sAct;

    document.getElementById('unit-mode-label').textContent = appSettings.unitSystem === 'metric' ? 'Metric' : 'Imperial';
    if (appSettings.activeColor && appSettings.activeColor !== 'default') {
        setPanelColor(appSettings.activeColor);
    }
    recalculateLoggedFromMeals();
    renderActivityDropdown();
    renderExRoutineDropdown();
    renderExZoneDropdown();
    renderStagingWaterButtons();
    updateWaterWaveHeight();
    updateGoalsBarUI();
    updateExerciseBarUI();
    renderSanctuaryUI();
    startFastingTicker();
    initVoiceJournalDB();
}

// THEME, PALETTE & MACRO TARGET CALCULATORS
function setPanelColor(rgbCsv) {
    hapticTap(8);
    appSettings.activeColor = rgbCsv;
    if (rgbCsv === 'default') {
        document.body.style.removeProperty('--panel-bg');
        document.body.style.removeProperty('--input-bg');
    } else {
        document.body.style.setProperty('--panel-bg', `rgba(${rgbCsv}, 0.35)`);
        document.body.style.setProperty('--input-bg', `rgba(${rgbCsv}, 0.22)`);
    }
    saveToMemory();
}

function toggleTheme(themeClass) {
    hapticTap(10);
    document.body.className = themeClass;
    document.getElementById('btn-midnight').classList.toggle('active', themeClass === 'theme-midnight');
    document.getElementById('btn-daybreak').classList.toggle('active', themeClass === 'theme-daybreak');
    setPanelColor(appSettings.activeColor || 'default');
    const staged = calculateStagedMacros();
    if (staged.calories > 0) updateAmbientHUD((staged.weightedScore / staged.calories), staged.calories);
}

function updateAmbientHUD(score, activeCalories) {
    document.body.classList.remove('state-vitality', 'state-drift', 'state-rogue');
    if (activeCalories === 0) return;
    if (score >= 7.5) document.body.classList.add('state-vitality');
    else if (score <= 4.5) document.body.classList.add('state-rogue');
    else document.body.classList.add('state-drift');
}

function selectMealSlot(slotName) {
    hapticTap(8);
    currentMealSlot = slotName;
    document.querySelectorAll('.slot-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === slotName);
    });
    document.getElementById('commit-meal-btn').textContent = `Add to ${slotName}`;
}

function applyPreset() {
    const preset = document.getElementById('activity-preset').value;
    const ratioPanel = document.getElementById('ratio-controls-panel');
    if (preset === 'custom') {
        ratioPanel.style.display = 'flex';
        calculateMacros();
        return;
    }
    ratioPanel.style.display = 'none';
    const [c, p, f] = preset.split('-').map(Number);
    document.getElementById('manual-carb').value = c;
    document.getElementById('manual-pro').value = p;
    document.getElementById('manual-fat').value = f;
    calculateMacros();
    saveToMemory();
}

function manualRatioUpdate() {
    document.getElementById('activity-preset').value = 'custom';
    document.getElementById('ratio-controls-panel').style.display = 'flex';
    renderActivityDropdown();
    calculateMacros();
    saveToMemory();
}

function calculateMacros() {
    const totalCals = parseInt(document.getElementById('calorie-input').value) || 1500;
    const cPct = parseInt(document.getElementById('manual-carb').value) || 0;
    const pPct = parseInt(document.getElementById('manual-pro').value) || 0;
    const fPct = parseInt(document.getElementById('manual-fat').value) || 0;
    const totalPct = cPct + pPct + fPct;

    const errorMsg = document.getElementById('ratio-error');
    if (totalPct !== 100) { errorMsg.style.display = 'block'; return; }
    errorMsg.style.display = 'none';

    dailyTargets.netCarbs = Math.round((totalCals * (cPct / 100)) / KCAL_PER_GRAM.carbs);
    dailyTargets.protein = Math.round((totalCals * (pPct / 100)) / KCAL_PER_GRAM.protein);
    dailyTargets.fat = Math.round((totalCals * (fPct / 100)) / KCAL_PER_GRAM.fat);

    const baseRate = appSettings.fiberPer1000 || 15;
    let fiberCalc = (totalCals / 1000) * baseRate;
    if (telemetry.gender === 'male' && telemetry.age <= 50) fiberCalc += 2;
    dailyTargets.fiber = Math.max(15, Math.round(fiberCalc));

    document.getElementById('lbl-carb-pct').textContent = `${cPct}%`;
    document.getElementById('lbl-pro-pct').textContent = `${pPct}%`;
    document.getElementById('lbl-fat-pct').textContent = `${fPct}%`;
    document.getElementById('lbl-fiber-rate').textContent = `${baseRate}g/1k`;
    document.getElementById('bar-carb-target').textContent = `${dailyTargets.netCarbs}g`;
    document.getElementById('bar-pro-target').textContent = `${dailyTargets.protein}g`;
    document.getElementById('bar-fat-target').textContent = `${dailyTargets.fat}g`;
    document.getElementById('bar-fiber-target').textContent = `${dailyTargets.fiber}g`;

    const mainCalsEl = document.getElementById('main-fuel-cals');
    if (mainCalsEl) mainCalsEl.textContent = `🔥 ${totalCals.toLocaleString()} KCAL TARGET`;
    const presetVal = document.getElementById('activity-preset').value;
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === presetVal) || ACTIVITY_OPTIONS[1];
    const mainProfEl = document.getElementById('main-fuel-profile');
    if (mainProfEl) {
        const shortTier = activeOpt.level > 0 ? `Level ${activeOpt.level}` : `Custom`;
        mainProfEl.textContent = `${shortTier} (${cPct}/${pPct}/${fPct}%) ✎`;
    }

    updateUI();
}

// GRANULAR HEIGHT & CLINICAL BODY COMPOSITION ENGINE
function syncHeightFromFeetInches() {
    const ft = parseFloat(document.getElementById('prof-height-ft').value) || 5;
    const inc = parseFloat(document.getElementById('prof-height-in').value) || 0;
    const totalIn = (ft * 12) + inc;
    document.getElementById('prof-height').value = totalIn;
    previewSmartTargets();
}

function syncHeightFromCm() {
    const cm = parseFloat(document.getElementById('prof-height-cm').value) || 175;
    document.getElementById('prof-height').value = cm;
    previewSmartTargets();
}

function computeBodyComposition(g, age, hVal, currW, waistVal, neckVal, hipVal, manualBf) {
    const isMetric = appSettings.unitSystem === 'metric';
    const weightKg = isMetric ? currW : currW * 0.45359237;
    const weightLbs = isMetric ? currW * 2.20462 : currW;
    const heightCm = isMetric ? hVal : hVal * 2.54;
    const heightIn = isMetric ? hVal / 2.54 : hVal;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    const waistIn = waistVal ? (isMetric ? waistVal / 2.54 : waistVal) : 0;
    const neckIn = neckVal ? (isMetric ? neckVal / 2.54 : neckVal) : 0;
    const hipIn = hipVal ? (isMetric ? hipVal / 2.54 : hipVal) : 0;

    let estBodyFat = parseFloat(manualBf) || 0;
    let bfMethod = "Manual Input";

    if (!estBodyFat) {
        if (g === 'male' && waistIn > neckIn && neckIn > 10) {
            estBodyFat = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
            bfMethod = "US Navy Tape Formula";
        } else if (g === 'female' && waistIn > 0 && hipIn > 0 && neckIn > 8 && (waistIn + hipIn - neckIn) > 0) {
            estBodyFat = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
            bfMethod = "US Navy Tape Formula";
        } else {
            const sexFlag = g === 'male' ? 1 : 0;
            estBodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * sexFlag) - 5.4;
            bfMethod = "Clinical BMI-Age Formula";
        }
    }
    estBodyFat = Math.max(5, Math.min(60, estBodyFat));
    const leanMassVal = currW * (1 - (estBodyFat / 100));
    const leanMassLbs = weightLbs * (1 - (estBodyFat / 100));
    const whtr = waistIn > 0 && heightIn > 0 ? (waistIn / heightIn) : null;

    return { bmi, estBodyFat, bfMethod, leanMassVal, leanMassLbs, whtr, heightIn, heightCm };
}

function computeSmartPlan(g, age, hVal, currW, goalW, actLvl, goalDateStr, pacePref = 'auto') {
    const isMetric = appSettings.unitSystem === 'metric';
    const weightKg = isMetric ? currW : currW * 0.45359237;
    const goalKg = isMetric ? goalW : goalW * 0.45359237;
    const heightCm = isMetric ? hVal : hVal * 2.54;

    const s = g === 'male' ? 5 : -161;
    const bmr = Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * age) + s);
    const opt = ACTIVITY_OPTIONS.find(o => o.level === parseInt(actLvl)) || ACTIVITY_OPTIONS[1];
    const tdee = Math.round(bmr * opt.mult);

    const totalLbsToLose = Math.max(0, (weightKg - goalKg) * 2.20462);
    let daysRemaining = 180;
    let lbsPerWeek = 1.2;

    if (pacePref === 'gentle') {
        lbsPerWeek = 0.75;
        daysRemaining = Math.max(7, Math.round((totalLbsToLose / lbsPerWeek) * 7));
    } else if (pacePref === 'sustainable') {
        lbsPerWeek = 1.5;
        daysRemaining = Math.max(7, Math.round((totalLbsToLose / lbsPerWeek) * 7));
    } else if (pacePref === 'accelerated') {
        lbsPerWeek = 2.0;
        daysRemaining = Math.max(7, Math.round((totalLbsToLose / lbsPerWeek) * 7));
    } else {
        const targetTime = new Date(goalDateStr + "T00:00:00").getTime();
        daysRemaining = Math.max(7, Math.round((targetTime - Date.now()) / (1000 * 60 * 60 * 24)));
        lbsPerWeek = totalLbsToLose / (daysRemaining / 7);
    }

    const weeksRemaining = daysRemaining / 7;
    const dailyDeficit = Math.round((lbsPerWeek * 3500) / 7);
    const recCalories = Math.max(1200, Math.min(tdee - 200, tdee - dailyDeficit));
    const recFiber = Math.max(15, Math.round((recCalories / 1000) * appSettings.fiberPer1000));

    return { bmr, tdee, daysRemaining, weeksRemaining, lbsPerWeek, dailyDeficit, recCalories, recFiber, opt };
}

function previewSmartTargets() {
    const g = document.getElementById('prof-gender').value;
    const age = parseInt(document.getElementById('prof-age').value) || 50;
    const hVal = parseFloat(document.getElementById('prof-height').value) || 70;
    const currW = telemetry.currentWeight || 236.0;
    const goalW = parseFloat(document.getElementById('target-weight-input').value) || 155;
    const presetVal = document.getElementById('activity-preset').value;
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === presetVal) || ACTIVITY_OPTIONS[1];
    const actLvl = activeOpt.level > 0 ? activeOpt.level : (telemetry.actLevel || 2);
    const dateStr = document.getElementById('target-date-input').value || '2027-12-01';
    const pacePref = document.getElementById('prof-goal-pace') ? document.getElementById('prof-goal-pace').value : 'auto';

    const waistVal = parseFloat(document.getElementById('waist-input').value) || 0;
    const neckVal = parseFloat(document.getElementById('neck-input').value) || 0;
    const hipVal = parseFloat(document.getElementById('hip-input').value) || 0;
    const manualBf = parseFloat(document.getElementById('bodyfat-input').value) || 0;

    const plan = computeSmartPlan(g, age, hVal, currW, goalW, actLvl, dateStr, pacePref);
    const comp = computeBodyComposition(g, age, hVal, currW, waistVal, neckVal, hipVal, manualBf);
    const uLabel = appSettings.unitSystem === 'metric' ? 'kg' : 'lbs';
    const paceVal = appSettings.unitSystem === 'metric' ? (plan.lbsPerWeek * 0.453592).toFixed(2) : plan.lbsPerWeek.toFixed(2);
    const whtrTxt = comp.whtr ? ` • Waist-to-Height: <strong>${comp.whtr.toFixed(2)}</strong>` : '';

    document.getElementById('smart-calc-readout').innerHTML = `
        <strong>Live Metabolic Preview (at ${currW.toFixed(1)} ${uLabel}):</strong> BMR ${plan.bmr} kcal | Maintenance (TDEE) ${plan.tdee} kcal<br>
        <strong>Body Composition:</strong> Est. Body Fat <strong>${comp.estBodyFat.toFixed(1)}%</strong> (${comp.bfMethod}) • Lean Mass <strong>${comp.leanMassVal.toFixed(1)} ${uLabel}</strong>${whtrTxt}<br>
        <strong>Projected Pace (${Math.round(plan.weeksRemaining)} wks):</strong> -${paceVal} ${uLabel}/wk (-${plan.dailyDeficit} kcal/day deficit)<br>
        <strong style="color:var(--text-pro);">Recommended Daily Target: ${plan.recCalories} kcal</strong> • Dynamic Fiber: ${plan.recFiber}g
    `;
}

function applySmartRecommendation() {
    const g = document.getElementById('prof-gender').value;
    const age = parseInt(document.getElementById('prof-age').value) || 50;
    const hVal = parseFloat(document.getElementById('prof-height').value) || 70;
    const currW = telemetry.currentWeight || 236.0;
    const goalW = parseFloat(document.getElementById('target-weight-input').value) || 155;
    const presetVal = document.getElementById('activity-preset').value;
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === presetVal) || ACTIVITY_OPTIONS[1];
    const actLvl = activeOpt.level > 0 ? activeOpt.level : 2;
    const dateStr = document.getElementById('target-date-input').value || '2027-12-01';
    const pacePref = document.getElementById('prof-goal-pace') ? document.getElementById('prof-goal-pace').value : 'auto';

    const plan = computeSmartPlan(g, age, hVal, currW, goalW, actLvl, dateStr, pacePref);
    document.getElementById('calorie-input').value = plan.recCalories;
    calculateMacros();
    previewSmartTargets();
    triggerActionCue(`Applied ${plan.recCalories} kcal Target!`, "🎯");
}

// OPTION B: MAIN PAGE INLINE WEIGHT EDITOR + INTERACTIVE WEIGHT TREND GRAPH
function updateGoalsBarUI() {
    const isMetric = appSettings.unitSystem === 'metric';
    const u = isMetric ? 'kg' : 'lbs';
    const plan = computeSmartPlan(telemetry.gender, telemetry.age, telemetry.heightIn, telemetry.currentWeight, telemetry.targetWeight, telemetry.actLevel, telemetry.targetDate, telemetry.goalPace || 'auto');
    const pace = isMetric ? (plan.lbsPerWeek * 0.453592).toFixed(1) : plan.lbsPerWeek.toFixed(1);

    const mainWtInput = document.getElementById('main-current-weight-input');
    if (mainWtInput && document.activeElement !== mainWtInput) {
        mainWtInput.value = telemetry.currentWeight.toFixed(1);
    }
    const unitLbl = document.getElementById('main-wt-unit-lbl');
    if (unitLbl) unitLbl.textContent = u;

    const startW = telemetry.startWeight || telemetry.currentWeight;
    const diff = (telemetry.currentWeight - startW).toFixed(1);
    const diffStr = diff <= 0 ? `${diff} ${u}` : `+${diff} ${u}`;

    const streamEl = document.getElementById('summary-goals-stream');
    if (streamEl) {
        streamEl.innerHTML = `Start ${startW.toFixed(1)} (${diffStr})<span class="pipe-sep">|</span>Goal ${telemetry.targetWeight.toFixed(1)} ${u}<span class="pipe-sep">|</span>-${pace} ${u}/wk`;
    }
}

function stepMainPageWeight(delta) {
    hapticTap(8);
    const inp = document.getElementById('main-current-weight-input');
    if (!inp) return;
    const nextVal = Math.max(30, (parseFloat(inp.value) || telemetry.currentWeight) + delta);
    inp.value = nextVal.toFixed(1);
}

function stepGraphModalWeight(delta) {
    hapticTap(8);
    const inp = document.getElementById('wg-quick-input');
    if (!inp) return;
    const nextVal = Math.max(30, (parseFloat(inp.value) || telemetry.currentWeight) + delta);
    inp.value = nextVal.toFixed(1);
}

function logMainPageWeight(val, fromGraphModal = false) {
    const parsed = parseFloat(val);
    if (!parsed || parsed < 30) return;
    telemetry.currentWeight = parseFloat(parsed.toFixed(1));
    if (!telemetry.startWeight) {
        telemetry.startWeight = telemetry.currentWeight;
    }
    const todayIso = new Date().toISOString().slice(0, 10);
    const existingToday = weightHistory.find(e => e.date === todayIso);
    if (existingToday) {
        existingToday.weight = telemetry.currentWeight;
    } else {
        weightHistory.push({ date: todayIso, weight: telemetry.currentWeight });
    }
    weightHistory.sort((a, b) => a.date.localeCompare(b.date));
    saveToMemory();
    updateGoalsBarUI();
    if (fromGraphModal || document.getElementById('weight-graph-modal').style.display === 'flex') {
        renderWeightGraphModal();
    }
    const u = appSettings.unitSystem === 'metric' ? 'kg' : 'lbs';
    triggerActionCue(`Current Weight Logged: ${telemetry.currentWeight.toFixed(1)} ${u}!`, "⚖️");
}

function openWeightGraphModal() {
    hapticTap(10);
    renderWeightGraphModal();
    document.getElementById('weight-graph-modal').style.display = 'flex';
}

function closeWeightGraphModal() {
    document.getElementById('weight-graph-modal').style.display = 'none';
}

function deleteWeightEntry(idx) {
    if (weightHistory.length <= 1) return;
    weightHistory.splice(idx, 1);
    telemetry.currentWeight = weightHistory[weightHistory.length - 1].weight;
    saveToMemory();
    updateGoalsBarUI();
    renderWeightGraphModal();
}

function renderWeightGraphModal() {
    const isMetric = appSettings.unitSystem === 'metric';
    const u = isMetric ? 'kg' : 'lbs';
    const qInput = document.getElementById('wg-quick-input');
    if (qInput) qInput.value = telemetry.currentWeight.toFixed(1);
    const uLbl = document.getElementById('wg-unit-lbl');
    if (uLbl) uLbl.textContent = u;

    const startW = telemetry.startWeight || telemetry.currentWeight;
    const currW = telemetry.currentWeight;
    const goalW = telemetry.targetWeight;
    const totalChange = (currW - startW).toFixed(1);
    const toGo = Math.max(0, currW - goalW).toFixed(1);

    const statsEl = document.getElementById('wg-stats-summary');
    if (statsEl) {
        statsEl.innerHTML = `
            <div style="background:var(--card-sub-bg); padding:0.65rem; border-radius:10px; border:1px solid var(--border-light);">
                <div style="font-size:0.65rem; color:var(--panel-text-muted); text-transform:uppercase;">Start Weight</div>
                <div style="font-size:1rem; font-weight:900;">${startW.toFixed(1)} ${u}</div>
            </div>
            <div style="background:var(--card-sub-bg); padding:0.65rem; border-radius:10px; border:1px solid var(--border-light);">
                <div style="font-size:0.65rem; color:var(--panel-text-muted); text-transform:uppercase;">Net Change</div>
                <div style="font-size:1rem; font-weight:900; color:var(--text-fib);">${totalChange <= 0 ? totalChange : '+' + totalChange} ${u}</div>
            </div>
            <div style="background:var(--card-sub-bg); padding:0.65rem; border-radius:10px; border:1px solid var(--border-light);">
                <div style="font-size:0.65rem; color:var(--panel-text-muted); text-transform:uppercase;">Remaining to Goal</div>
                <div style="font-size:1rem; font-weight:900; color:var(--text-pro);">${toGo} ${u}</div>
            </div>
        `;
    }

    const svgBox = document.getElementById('wg-svg-container');
    if (svgBox) {
        const pts = weightHistory.length > 0 ? weightHistory : [{ date: new Date().toISOString().slice(0,10), weight: currW }];
        const allVals = [...pts.map(p => p.weight), startW, goalW];
        const minW = Math.floor(Math.min(...allVals) - 4);
        const maxW = Math.ceil(Math.max(...allVals) + 4);
        const rangeW = Math.max(5, maxW - minW);

        const W = 560, H = 200, padL = 46, padR = 24, padT = 20, padB = 32;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        const yFor = w => padT + plotH - (((w - minW) / rangeW) * plotH);
        const xFor = (i, len) => len <= 1 ? (padL + plotW / 2) : (padL + (i / (len - 1)) * plotW);

        const yStart = yFor(startW);
        const yGoal = yFor(goalW);

        let polyPoints = pts.map((p, i) => `${xFor(i, pts.length).toFixed(1)},${yFor(p.weight).toFixed(1)}`).join(' ');
        let circlesHtml = pts.map((p, i) => {
            const cx = xFor(i, pts.length).toFixed(1);
            const cy = yFor(p.weight).toFixed(1);
            const shortDate = p.date.slice(5);
            return `
                <circle cx="${cx}" cy="${cy}" r="5.5" fill="#00d2ff" stroke="#0f172a" stroke-width="2"/>
                <text x="${cx}" y="${(parseFloat(cy) - 10).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="currentColor">${p.weight.toFixed(1)}</text>
                <text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.7">${shortDate}</text>
            `;
        }).join('');

        svgBox.innerHTML = `
            <svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; overflow:visible; font-family:var(--font-mono);">
                <line x1="${padL}" y1="${yStart}" x2="${W - padR}" y2="${yStart}" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5"/>
                <text x="${padL - 6}" y="${yStart + 4}" text-anchor="end" font-size="9" font-weight="800" fill="#94a3b8">Start ${startW.toFixed(0)}</text>
                <line x1="${padL}" y1="${yGoal}" x2="${W - padR}" y2="${yGoal}" stroke="#22c55e" stroke-dasharray="5 4" stroke-width="1.8"/>
                <text x="${padL - 6}" y="${yGoal + 4}" text-anchor="end" font-size="9" font-weight="800" fill="#22c55e">Goal ${goalW.toFixed(0)}</text>
                ${pts.length > 1 ? `<polyline fill="none" stroke="#c026d3" stroke-width="3" points="${polyPoints}"/>` : ''}
                ${circlesHtml}
            </svg>
        `;
    }

    const histBox = document.getElementById('wg-history-list');
    if (histBox) {
        histBox.innerHTML = weightHistory.map((item, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.85rem; background:var(--card-sub-bg); border:1px solid var(--border-light); border-radius:10px; font-family:var(--font-mono); font-size:0.8rem;">
                <span>📅 <strong>${item.date}</strong></span>
                <div style="display:flex; align-items:center; gap:0.65rem;">
                    <strong style="color:var(--text-pro);">${item.weight.toFixed(1)} ${u}</strong>
                    ${weightHistory.length > 1 ? `<button type="button" class="remove-btn" style="width:24px; height:24px; font-size:0.9rem;" onclick="deleteWeightEntry(${idx})">&times;</button>` : ''}
                </div>
            </div>
        `).reverse().join('');
    }
}

function openHorizonModal() {
    const isMetric = appSettings.unitSystem === 'metric';
    document.getElementById('imperial-height-wrap').style.display = isMetric ? 'none' : 'grid';
    document.getElementById('metric-height-wrap').style.display = isMetric ? 'flex' : 'none';

    if (isMetric) {
        document.getElementById('prof-height-cm').value = telemetry.heightIn || 178;
    } else {
        const totalIn = telemetry.heightIn || 70;
        const ft = Math.floor(totalIn / 12);
        const remIn = +(totalIn % 12).toFixed(1);
        document.getElementById('prof-height-ft').value = ft;
        document.getElementById('prof-height-in').value = remIn;
    }
    document.getElementById('prof-height').value = telemetry.heightIn || (isMetric ? 178 : 70);

    document.getElementById('lbl-start-wt').textContent = `Starting Weight (${isMetric ? 'kg' : 'lbs'} • Optional — Recommended)`;
    document.getElementById('lbl-goal-wt').textContent = `Target Goal Weight (${isMetric ? 'kg' : 'lbs'})`;
    document.getElementById('lbl-waist').textContent = `Waist at Navel (${isMetric ? 'cm' : 'inches'} • Optional)`;
    document.getElementById('lbl-neck').textContent = `Neck Circumference (${isMetric ? 'cm' : 'inches'} • Optional)`;
    document.getElementById('lbl-hip').textContent = `Hip Circumference (${isMetric ? 'cm' : 'inches'} • Optional)`;

    document.getElementById('prof-gender').value = telemetry.gender || 'male';
    document.getElementById('prof-age').value = telemetry.age || 50;
    if (document.getElementById('prof-goal-pace')) {
        document.getElementById('prof-goal-pace').value = telemetry.goalPace || 'auto';
    }
    document.getElementById('start-weight-input').value = telemetry.startWeight || '';
    document.getElementById('target-weight-input').value = telemetry.targetWeight;
    document.getElementById('target-date-input').value = telemetry.targetDate || '2027-12-01';
    document.getElementById('waist-input').value = telemetry.waist || '';
    document.getElementById('neck-input').value = telemetry.neck || '';
    document.getElementById('hip-input').value = telemetry.hip || '';
    document.getElementById('bodyfat-input').value = telemetry.bodyFat || '';
    renderActivityDropdown();
    previewSmartTargets();
    document.getElementById('horizon-modal').style.display = 'flex';
}
function closeHorizonModal() { document.getElementById('horizon-modal').style.display = 'none'; }

function saveTelemetry(showHealthReport = false) {
    telemetry.gender = document.getElementById('prof-gender').value;
    telemetry.age = parseInt(document.getElementById('prof-age').value) || 50;
    telemetry.heightIn = parseFloat(document.getElementById('prof-height').value) || 70;
    telemetry.goalPace = document.getElementById('prof-goal-pace') ? document.getElementById('prof-goal-pace').value : 'auto';

    const presetVal = document.getElementById('activity-preset').value;
    const activeOpt = ACTIVITY_OPTIONS.find(o => o.value === presetVal);
    if (activeOpt && activeOpt.level > 0) telemetry.actLevel = activeOpt.level;

    const enteredStart = parseFloat(document.getElementById('start-weight-input').value);
    telemetry.startWeight = enteredStart > 0 ? enteredStart : (telemetry.currentWeight || 236.0);
    telemetry.targetWeight = parseFloat(document.getElementById('target-weight-input').value) || telemetry.targetWeight;
    telemetry.targetDate = document.getElementById('target-date-input').value || '2027-12-01';
    telemetry.waist = document.getElementById('waist-input').value;
    telemetry.neck = document.getElementById('neck-input').value;
    telemetry.hip = document.getElementById('hip-input').value;
    telemetry.bodyFat = document.getElementById('bodyfat-input').value;

    calculateMacros();
    saveToMemory();
    updateGoalsBarUI();
    closeHorizonModal();
    triggerActionCue("Profile & Metabolic Goals Saved!", "🎯");
    if (showHealthReport) {
        openHealthReportModal();
    }
}

// PERSONAL HEALTH & METABOLIC REPORT POPUP (TRIGGERED ON SAVE)
function openHealthReportModal() {
    const isMetric = appSettings.unitSystem === 'metric';
    const u = isMetric ? 'kg' : 'lbs';
    const currW = telemetry.currentWeight || 236.0;
    const comp = computeBodyComposition(
        telemetry.gender,
        telemetry.age,
        telemetry.heightIn,
        currW,
        parseFloat(telemetry.waist) || 0,
        parseFloat(telemetry.neck) || 0,
        parseFloat(telemetry.hip) || 0,
        parseFloat(telemetry.bodyFat) || 0
    );
    const plan = computeSmartPlan(
        telemetry.gender,
        telemetry.age,
        telemetry.heightIn,
        currW,
        telemetry.targetWeight,
        telemetry.actLevel,
        telemetry.targetDate,
        telemetry.goalPace || 'auto'
    );

    const proPerLbLean = (dailyTargets.protein / Math.max(50, comp.leanMassLbs)).toFixed(2);
    let whtrSection = '';
    if (comp.whtr) {
        const status = comp.whtr < 0.50
            ? '<span style="color:var(--text-fib); font-weight:900;">Optimal Longevity Zone (&lt;0.50)</span>'
            : (comp.whtr < 0.60 ? '<span style="color:var(--text-fat); font-weight:900;">Elevated Visceral Adiposity (0.50–0.59) — Great Target for Reduction</span>' : '<span style="color:var(--text-carb); font-weight:900;">High Priority Metabolic Focus (&ge;0.60)</span>');
        whtrSection = `
            <div class="health-report-card" style="border-left-color:var(--text-fib);">
                <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--text-fib);">📏 Waist-to-Height Ratio (Cardiometabolic Marker)</div>
                <div style="font-size:1.1rem; font-weight:900; margin:0.2rem 0;">Ratio: ${comp.whtr.toFixed(2)} — ${status}</div>
                <div style="font-size:0.82rem; color:var(--panel-text-muted);">Keeping waist circumference under half your height (&lt;0.50) is one of the strongest clinical predictors of insulin sensitivity and cardiovascular health.</div>
            </div>
        `;
    } else {
        whtrSection = `
            <div class="health-report-card" style="border-left-color:var(--text-fib);">
                <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--text-fib);">📏 Tip: Add Your Waist &amp; Neck Measurements</div>
                <div style="font-size:0.82rem; color:var(--panel-text-muted);">Entering your optional Waist and Neck measurements unlocks clinical US Navy Body Fat % and Waist-to-Height Ratio tracking.</div>
            </div>
        `;
    }

    const body = document.getElementById('health-report-body');
    body.innerHTML = `
        ${whtrSection}
        <div class="health-report-card" style="border-left-color:var(--text-pro);">
            <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--text-pro);">💪 Body Composition &amp; Muscle Protection</div>
            <div style="font-size:1.05rem; font-weight:900; margin:0.2rem 0;">Est. Body Fat: ${comp.estBodyFat.toFixed(1)}% • Lean Mass: ${comp.leanMassVal.toFixed(1)} ${u}</div>
            <div style="font-size:0.82rem; color:var(--panel-text-muted);">
                Your daily protein target (<strong>${dailyTargets.protein}g</strong>) provides <strong>${proPerLbLean}g of protein per lb of lean body mass</strong>. Clinical studies show 0.8g–1.1g/lb of lean mass preserves resting muscle tissue so weight lost comes overwhelmingly from fat stores.
            </div>
        </div>
        <div class="health-report-card" style="border-left-color:var(--text-fat);">
            <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--text-fat);">🔥 Metabolic Engine (BMR &amp; TDEE)</div>
            <div style="font-size:1.05rem; font-weight:900; margin:0.2rem 0;">Resting BMR: ${plan.bmr} kcal • Daily Burn (TDEE): ${plan.tdee} kcal</div>
            <div style="font-size:0.82rem; color:var(--panel-text-muted);">
                At your chosen target of <strong>${document.getElementById('calorie-input').value} kcal/day</strong> and <strong>${dailyTargets.fiber}g Fiber</strong>, your body is positioned for steady lipid oxidation without triggering severe metabolic adaptation.
            </div>
        </div>
    `;
    document.getElementById('health-report-modal').style.display = 'flex';
}

function closeHealthReportModal() {
    document.getElementById('health-report-modal').style.display = 'none';
}

// EXERCISE MODAL & FAT OXIDATION LOGGER
function openExerciseModal() {
    document.getElementById('ex-steps-input').value = telemetry.steps || 6500;
    document.getElementById('ex-step-goal-input').value = telemetry.stepGoal || 10000;
    renderExRoutineDropdown();
    renderExZoneDropdown();
    renderExerciseModal();
    document.getElementById('exercise-modal').style.display = 'flex';
}
function closeExerciseModal() { document.getElementById('exercise-modal').style.display = 'none'; }

function updateStepsFromModal(val) {
    telemetry.steps = Math.max(0, parseInt(val) || 0);
    saveToMemory(); updateExerciseBarUI(); updatePatternInsights();
    triggerActionCue(`Steps Updated: ${telemetry.steps.toLocaleString()} steps!`, "👟");
}
function updateStepGoalFromModal(val) {
    telemetry.stepGoal = Math.max(1000, parseInt(val) || 10000);
    saveToMemory(); updateExerciseBarUI();
}
function adjustSteps(delta) {
    telemetry.steps = Math.max(0, (telemetry.steps || 0) + delta);
    document.getElementById('ex-steps-input').value = telemetry.steps;
    saveToMemory(); updateExerciseBarUI(); updatePatternInsights();
    triggerActionCue(`+${delta.toLocaleString()} Steps Logged (${telemetry.steps.toLocaleString()} total)!`, "👟");
}

function logPresetExercise() {
    const raw = document.getElementById('ex-preset-type').value;
    const [key, metStr, fatPctStr] = raw.split('|');
    const mins = parseInt(document.getElementById('ex-preset-mins').value) || 30;
    const activeOpt = EXERCISE_ROUTINE_OPTIONS.find(o => o.value === raw) || EXERCISE_ROUTINE_OPTIONS[0];
    const label = activeOpt.line1;

    const isMetric = appSettings.unitSystem === 'metric';
    const weightKg = isMetric ? telemetry.currentWeight : telemetry.currentWeight * 0.453592;
    const met = parseFloat(metStr);
    const fatPct = parseFloat(fatPctStr);

    const kcal = Math.round(met * 3.5 * weightKg / 200 * mins);
    const fatGrams = Math.round((kcal * fatPct) / 9);

    exerciseLog.push({ name: label, mins, kcal, fatGrams, fatPct: Math.round(fatPct * 100) });
    saveToMemory(); renderExerciseModal(); updateExerciseBarUI(); updatePatternInsights();
    triggerActionCue(`${label} Logged (+${kcal} kcal • ~${fatGrams}g Fat Burned)!`, "🏃");
}

function logManualExercise() {
    const kcal = parseInt(document.getElementById('ex-manual-kcal').value) || 0;
    if (kcal <= 0) return;
    const [zoneName, fatPctStr] = document.getElementById('ex-manual-zone').value.split('|');
    const fatPct = parseFloat(fatPctStr);
    const fatGrams = Math.round((kcal * fatPct) / 9);

    exerciseLog.push({ name: zoneName, mins: 30, kcal, fatGrams, fatPct: Math.round(fatPct * 100) });
    document.getElementById('ex-manual-kcal').value = '';
    saveToMemory(); renderExerciseModal(); updateExerciseBarUI(); updatePatternInsights();
    triggerActionCue(`Manual Workout Logged (+${kcal} kcal • ~${fatGrams}g Fat)!`, "🔥");
}

function removeExerciseItem(idx) {
    exerciseLog.splice(idx, 1);
    saveToMemory(); renderExerciseModal(); updateExerciseBarUI(); updatePatternInsights();
}

function renderExerciseModal() {
    const list = document.getElementById('exercise-log-list');
    if (!list) return;
    if (exerciseLog.length === 0) {
        list.innerHTML = `<p class="empty-state" style="margin:0.75rem 0;">No workouts logged yet today.</p>`;
        return;
    }
    list.innerHTML = exerciseLog.map((ex, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0.9rem; background:var(--input-bg); border:1px solid var(--border-light); border-radius:10px; margin-bottom:0.45rem; font-size:0.82rem;">
            <div>
                <strong>${ex.name}</strong> (${ex.mins}m)<br>
                <span style="font-family:var(--font-mono); font-size:0.74rem; color:var(--text-pro);">${ex.kcal} kcal burned • ~${ex.fatGrams}g Fat Oxidized (${ex.fatPct}% lipid fuel)</span>
            </div>
            <button class="remove-btn" onclick="removeExerciseItem(${i})">&times;</button>
        </div>
    `).join('');
}

function updateExerciseBarUI() {
    let totalKcal = 0, totalFat = 0;
    exerciseLog.forEach(e => { totalKcal += e.kcal; totalFat += e.fatGrams; });
    const activeSteps = Math.max(0, (telemetry.steps || 0) - 3000);
    const stepCals = Math.round(activeSteps * 0.045);
    const stepFat = Math.round((stepCals * 0.80) / 9);

    const streamEl = document.getElementById('summary-exercise-stream');
    if (streamEl) {
        streamEl.innerHTML = `${(telemetry.steps || 0).toLocaleString()} steps<span class="pipe-sep">|</span>${totalKcal + stepCals} kcal<span class="pipe-sep">|</span>${totalFat + stepFat}g fat`;
    }
}

// HYDRATION LOGGER W/ RISING WATER WAVE, BUBBLES, UNDO & RESET
function renderStagingWaterButtons() {
    const container = document.getElementById('staging-water-btns');
    if (!container) return;
    if (appSettings.unitSystem === 'metric') {
        container.innerHTML = `
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(250)">+250 ml</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(350)">+350 ml</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(500)">+500 ml</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(1000)">+1 L</button>
            <button type="button" class="unit-btn" style="border-color:var(--text-pro); color:var(--text-pro);" onclick="undoWater()" title="Undo Last Water Entry">⌫ Undo</button>
            <button type="button" class="unit-btn" style="border-color:var(--text-carb); color:var(--text-carb);" onclick="resetWater()" title="Reset Today's Water to 0">↺ Reset</button>
        `;
    } else {
        container.innerHTML = `
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(8)">+8 oz</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(12)">+12 oz</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(16)">+16 oz</button>
            <button type="button" class="unit-btn" style="flex:1;" onclick="addWater(24)">+24 oz</button>
            <button type="button" class="unit-btn" style="border-color:var(--text-pro); color:var(--text-pro);" onclick="undoWater()" title="Undo Last Water Entry">⌫ Undo</button>
            <button type="button" class="unit-btn" style="border-color:var(--text-carb); color:var(--text-carb);" onclick="resetWater()" title="Reset Today's Water to 0">↺ Reset</button>
        `;
    }
}

function updateWaterWaveHeight() {
    const waveEl = document.getElementById('water-wave-bg');
    if (!waveEl) return;
    const isMetric = appSettings.unitSystem === 'metric';
    const wVal = isMetric ? (lifeState.waterMl || 0) : (lifeState.waterOz || 0);
    const wGoal = isMetric ? (lifeState.waterGoalMl || 2500) : (lifeState.waterGoalOz || 96);
    const pct = Math.min(100, Math.round((wVal / Math.max(1, wGoal)) * 100));
    waveEl.style.height = `${pct}%`;
}

function triggerWaterSplashVisual() {
    const strip = document.getElementById('staging-water-strip');
    const bubbleLayer = document.getElementById('water-bubble-layer');
    updateWaterWaveHeight();
    if (strip) {
        strip.classList.add('splash-active');
        setTimeout(() => strip.classList.remove('splash-active'), 700);
    }
    if (bubbleLayer) {
        for (let i = 0; i < 12; i++) {
            const b = document.createElement('div');
            b.className = 'water-bubble';
            const size = 6 + Math.floor(Math.random() * 12);
            b.style.width = `${size}px`;
            b.style.height = `${size}px`;
            b.style.left = `${8 + Math.floor(Math.random() * 84)}%`;
            b.style.animationDelay = `${(Math.random() * 0.25).toFixed(2)}s`;
            bubbleLayer.appendChild(b);
            setTimeout(() => b.remove(), 1350);
        }
    }
}

function addWater(amount) {
    if (amount <= 0) return;
    const isMetric = appSettings.unitSystem === 'metric';
    if (isMetric) {
        lifeState.waterMl = Math.max(0, (lifeState.waterMl || 0) + amount);
        lifeState.waterOz = Math.round(lifeState.waterMl / 29.5735);
        waterHistoryStack.push({ unit: 'ml', amount });
    } else {
        lifeState.waterOz = Math.max(0, (lifeState.waterOz || 0) + amount);
        lifeState.waterMl = Math.round(lifeState.waterOz * 29.5735);
        waterHistoryStack.push({ unit: 'oz', amount });
    }
    triggerWaterSplashVisual();
    saveToMemory();
    updateUI();
    updatePatternInsights();
    if (document.getElementById('journal-modal').style.display === 'flex') renderJournal();
    const u = isMetric ? 'ml' : 'oz';
    const totalNow = isMetric ? lifeState.waterMl : lifeState.waterOz;
    const goalNow = isMetric ? lifeState.waterGoalMl : lifeState.waterGoalOz;
    triggerActionCue(`+${amount} ${u} Water Logged (${totalNow}/${goalNow} ${u})!`, "💧");
}

function undoWater() {
    const isMetric = appSettings.unitSystem === 'metric';
    if (waterHistoryStack.length > 0) {
        const last = waterHistoryStack.pop();
        if (last.unit === 'ml') {
            lifeState.waterMl = Math.max(0, (lifeState.waterMl || 0) - last.amount);
            lifeState.waterOz = Math.round(lifeState.waterMl / 29.5735);
        } else {
            lifeState.waterOz = Math.max(0, (lifeState.waterOz || 0) - last.amount);
            lifeState.waterMl = Math.round(lifeState.waterOz * 29.5735);
        }
        triggerActionCue(`Undid Last Water Tap (-${last.amount} ${last.unit})`, "⌫");
    } else {
        if (isMetric) {
            lifeState.waterMl = Math.max(0, (lifeState.waterMl || 0) - 250);
            lifeState.waterOz = Math.round(lifeState.waterMl / 29.5735);
        } else {
            lifeState.waterOz = Math.max(0, (lifeState.waterOz || 0) - 8);
            lifeState.waterMl = Math.round(lifeState.waterOz * 29.5735);
        }
        triggerActionCue("Adjusted Water Log", "⌫");
    }
    updateWaterWaveHeight();
    saveToMemory();
    updateUI();
    updatePatternInsights();
    if (document.getElementById('journal-modal').style.display === 'flex') renderJournal();
}

function resetWater() {
    if ((lifeState.waterOz || 0) === 0 && (lifeState.waterMl || 0) === 0) return;
    if (!confirm("Reset today's hydration log back to 0?")) return;
    lifeState.waterOz = 0;
    lifeState.waterMl = 0;
    waterHistoryStack = [];
    updateWaterWaveHeight();
    saveToMemory();
    updateUI();
    updatePatternInsights();
    if (document.getElementById('journal-modal').style.display === 'flex') renderJournal();
    triggerActionCue("Hydration Log Reset to 0", "↺");
}

// 3-SECOND ANIMATED SPINNING PLATE + 5-SLOT QUOTA BRAIN + MEAL STAGING
function selectSpinStyle(styleKey) {
    hapticTap(8);
    currentSpinStyle = styleKey;
    document.querySelectorAll('.spin-style-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-style') === styleKey);
    });
    updateSpinButtonAndHintUI();
}

function detectProfileFromLockedItems(lockedItems) {
    if (!lockedItems || lockedItems.length === 0) return null;
    for (const item of lockedItems) {
        if (SWEET_ONLY_ITEMS.has(item.id)) return "breakfast_sweet";
    }
    const savoryKeys = ["med", "asian", "curry", "latin", "american", "plant"];
    let bestKey = null, bestCount = 0;
    savoryKeys.forEach(k => {
        const prof = CULINARY_PROFILES[k];
        const allIds = new Set([...prof.slot1, ...prof.slot2, ...prof.slot3, ...prof.slot4, ...prof.slot5]);
        let hits = 0;
        lockedItems.forEach(it => { if (allIds.has(it.id)) hits++; });
        if (hits > bestCount) { bestCount = hits; bestKey = k; }
    });
    return bestKey;
}

function spinMealRemix() {
    if (isPlateSpinning) return;
    isPlateSpinning = true;
    hapticTap([15, 50, 15]);

    const lockedItems = sandboxMeal.filter(it => it.locked);
    const usedIds = new Set(lockedItems.map(i => i.id));
    const savoryKeys = ["med", "asian", "curry", "latin", "american", "plant"];

    const roleCounts = { protein: 0, veggie: 0, base: 0, fat_fridge: 0, sauce: 0 };
    lockedItems.forEach(it => {
        const r = getFoodRole(it.id);
        if (roleCounts[r] !== undefined) roleCounts[r]++;
    });

    let activeProfileKey = currentSpinStyle;
    if (activeProfileKey === "surprise") {
        const detected = detectProfileFromLockedItems(lockedItems);
        if (detected) activeProfileKey = detected;
        else if (currentMealSlot === "Breakfast") activeProfileKey = Math.random() < 0.55 ? "breakfast_savory" : "breakfast_sweet";
        else activeProfileKey = savoryKeys[Math.floor(Math.random() * savoryKeys.length)];
    } else if (activeProfileKey === "breakfast") {
        const hasSweetLock = lockedItems.some(it => SWEET_ONLY_ITEMS.has(it.id));
        const hasSavoryLock = lockedItems.some(it => CULINARY_PROFILES.breakfast_savory.slot5.includes(it.id));
        if (hasSweetLock) activeProfileKey = "breakfast_sweet";
        else if (hasSavoryLock) activeProfileKey = "breakfast_savory";
        else activeProfileKey = Math.random() < 0.5 ? "breakfast_savory" : "breakfast_sweet";
    }

    let pool1Ids = [], pool2Ids = [], pool3Ids = [], pool4Ids = [], pool5Ids = [];
    if (activeProfileKey === "fusion") {
        const s1 = new Set(), s2 = new Set(), s3 = new Set(), s4 = new Set(), s5 = new Set();
        savoryKeys.forEach(k => {
            CULINARY_PROFILES[k].slot1.forEach(id => s1.add(id));
            CULINARY_PROFILES[k].slot2.forEach(id => s2.add(id));
            CULINARY_PROFILES[k].slot3.forEach(id => s3.add(id));
            CULINARY_PROFILES[k].slot4.forEach(id => s4.add(id));
            CULINARY_PROFILES[k].slot5.forEach(id => s5.add(id));
        });
        pool1Ids = [...s1]; pool2Ids = [...s2]; pool3Ids = [...s3]; pool4Ids = [...s4]; pool5Ids = [...s5];
    } else {
        const prof = CULINARY_PROFILES[activeProfileKey] || CULINARY_PROFILES.med;
        pool1Ids = prof.slot1; pool2Ids = prof.slot2; pool3Ids = prof.slot3; pool4Ids = prof.slot4; pool5Ids = prof.slot5;
    }

    const isBreakfastSpin = activeProfileKey === "breakfast_savory" || activeProfileKey === "breakfast_sweet";
    const tryPickFromPool = (idList, targetRole = null) => {
        if (targetRole && roleCounts[targetRole] >= ROLE_CAPS[targetRole]) return null;
        const candidates = idList
            .map(id => foodDatabase[id])
            .filter(f => {
                if (!f || usedIds.has(f.id)) return false;
                if (PANTRY_UTILITY_ONLY.has(f.id)) return false;
                if ((f.affinity || 2) < 2) return false;
                if (!isBreakfastSpin && SWEET_ONLY_ITEMS.has(f.id)) return false;
                const itemRole = getFoodRole(f.id);
                if (roleCounts[itemRole] >= ROLE_CAPS[itemRole]) return false;
                return true;
            });
        if (candidates.length === 0) return null;
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        usedIds.add(chosen.id);
        roleCounts[getFoodRole(chosen.id)]++;
        return chosen;
    };

    const desiredSlots = [
        { role: "protein",    pool: pool1Ids },
        { role: "veggie",     pool: pool2Ids },
        { role: "base",       pool: pool3Ids },
        { role: "fat_fridge", pool: pool4Ids },
        { role: "sauce",      pool: pool5Ids }
    ];
    const rolloverOrder = [
        { role: "veggie",     pool: pool2Ids },
        { role: "sauce",      pool: pool5Ids },
        { role: "base",       pool: pool3Ids },
        { role: "fat_fridge", pool: pool4Ids }
    ];

    const newlySpunFoods = [];
    desiredSlots.forEach(slotDef => {
        let picked = tryPickFromPool(slotDef.pool, slotDef.role);
        if (!picked) {
            for (const fallback of rolloverOrder) {
                picked = tryPickFromPool(fallback.pool, fallback.role);
                if (picked) break;
            }
        }
        if (picked) newlySpunFoods.push(picked);
    });

    const spinBtn = document.getElementById('spin-plate-btn');
    const stageEl = document.getElementById('plate-spin-stage');
    const wheelEl = document.getElementById('spinning-plate-wheel');
    const statusEl = document.getElementById('spin-stage-status');
    const previewRow = document.getElementById('spin-slot-preview-row');

    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = `<span style="font-size: 1.3rem;">🍽️</span> Spinning Chef's Plate (3s)...`;
    }
    if (stageEl && wheelEl && previewRow) {
        stageEl.style.display = 'flex';
        previewRow.innerHTML = '';
        wheelEl.style.animation = 'none';
        void wheelEl.offsetWidth;
        wheelEl.style.animation = 'plateSpin3s 3s cubic-bezier(0.15, 0.85, 0.25, 1) forwards';
    }

    newlySpunFoods.forEach((food, idx) => {
        setTimeout(() => {
            hapticTap(10);
            if (wheelEl) wheelEl.textContent = food.emoji.startsWith('http') ? '🍽️' : food.emoji;
            if (statusEl) statusEl.textContent = `Dealing Slot ${idx + 1}: ${food.name.split(' (')[0]}...`;
            if (previewRow) {
                const badge = document.createElement('span');
                badge.style.cssText = 'padding:0.25rem 0.6rem; border-radius:50px; background:var(--panel-bg); border:1px solid var(--glow-pro);';
                badge.textContent = `${food.emoji.startsWith('http') ? '🍽️' : food.emoji} ${food.name.split(' (')[0]}`;
                previewRow.appendChild(badge);
            }
        }, (idx + 1) * 520);
    });

    setTimeout(() => {
        isPlateSpinning = false;
        if (stageEl) stageEl.style.display = 'none';
        if (spinBtn) spinBtn.disabled = false;
        hasSpunPlate = true;
        sandboxMeal = [
            ...lockedItems,
            ...newlySpunFoods.map(f => ({ id: f.id, weight: f.defaultWeight, locked: false }))
        ];
        sortSandboxByCulinaryOrder();
        saveToMemory();
        updateSandboxUI();
        triggerActionCue("Chef's Plate Dealt & Sorted!", "🎲");
    }, 3000);
}

function toggleLockSandboxItem(index) {
    hapticTap(8);
    if (!sandboxMeal[index]) return;
    sandboxMeal[index].locked = !sandboxMeal[index].locked;
    saveToMemory();
    updateSandboxUI();
}

function updateSandboxUI() {
    const list = document.getElementById('sandbox-list');
    list.innerHTML = '';
    if (sandboxMeal.length === 0) {
        hasSpunPlate = false;
        updateSpinButtonAndHintUI();
        list.innerHTML = `<li class="empty-state">No ingredients staged.<br>Tap Pantry, Cookbook, or Spin a Plate above.</li>`;
        updateUI(); return;
    }
    updateSpinButtonAndHintUI();
    sandboxMeal.forEach((item, index) => {
        const food = foodDatabase[item.id];
        if (!food) return;
        const ratio = item.weight / 100;
        let displayEmoji = food.emoji.startsWith('http') ? `<img src="${food.emoji}" style="width:1.25rem; height:1.25rem; border-radius:50%; object-fit:cover; vertical-align:middle;">` : food.emoji;
        const li = document.createElement('li');
        li.className = 'sandbox-item';
        li.innerHTML = `
            <div class="sandbox-item-details">
                <div class="sandbox-item-name">
                    <button type="button" class="lock-item-btn ${item.locked ? 'locked' : ''}" onclick="toggleLockSandboxItem(${index})" title="Lock item to keep it on your plate during Spin a Plate">${item.locked ? '🔒' : '🔓'}</button>
                    <span>${displayEmoji} ${food.name}</span>
                </div>
                <div class="sandbox-item-macros" id="macros-display-${index}">
                    ${Math.round(food.calories * ratio)} kcal | ${(food.netCarbs * ratio).toFixed(1)}g Carbs | ${(food.fiber * ratio).toFixed(1)}g Fiber | ${(food.protein * ratio).toFixed(1)}g Protein | ${(food.fat * ratio).toFixed(1)}g Fat
                </div>
            </div>
            <div class="sandbox-item-controls">
                <button type="button" class="unit-btn" onclick="changeWeight(${index}, 5)">1 tsp</button>
                <button type="button" class="unit-btn" onclick="changeWeight(${index}, 15)">1 tbsp</button>
                <button type="button" class="unit-btn" onclick="changeWeight(${index}, 28)">1 oz</button>
                <button type="button" class="unit-btn" onclick="changeWeight(${index}, 100)">100g</button>
                <button type="button" class="step-wt-btn" onclick="stepWeight(${index}, -10)">−10g</button>
                <input type="number" id="stage-weight-input-${index}" value="${item.weight}" min="1" step="1" oninput="changeWeight(${index}, this.value)">
                <span style="font-size:0.82rem; font-family:var(--font-mono); font-weight:800;">g</span>
                <button type="button" class="step-wt-btn" onclick="stepWeight(${index}, 10)">+10g</button>
                <button type="button" class="delete-ing-pill" onclick="removeFromSandbox(${index})">🗑️ Delete</button>
            </div>`;
        list.appendChild(li);
    });
    updateUI();
}

function stepWeight(index, delta) {
    if (!sandboxMeal[index]) return;
    hapticTap(6);
    const currentW = parseFloat(sandboxMeal[index].weight) || 0;
    changeWeight(index, Math.max(1, currentW + delta));
}

function changeWeight(index, newWeight) {
    sandboxMeal[index].weight = parseFloat(newWeight) || 0;
    const inputBox = document.getElementById(`stage-weight-input-${index}`);
    if (inputBox && document.activeElement !== inputBox) inputBox.value = sandboxMeal[index].weight;

    const item = sandboxMeal[index];
    const food = foodDatabase[item.id];
    const ratio = item.weight / 100;
    const macroDisplay = document.getElementById(`macros-display-${index}`);
    if (macroDisplay) {
        macroDisplay.innerHTML = `${Math.round(food.calories * ratio)} kcal | ${(food.netCarbs * ratio).toFixed(1)}g Carbs | ${(food.fiber * ratio).toFixed(1)}g Fiber | ${(food.protein * ratio).toFixed(1)}g Protein | ${(food.fat * ratio).toFixed(1)}g Fat`;
    }
    saveToMemory(); updateUI();
}

function removeFromSandbox(index) {
    const removed = sandboxMeal[index] ? foodDatabase[sandboxMeal[index].id] : null;
    sandboxMeal.splice(index, 1);
    saveToMemory();
    updateSandboxUI();
    if (removed) triggerActionCue(`Deleted ${removed.name.split(' (')[0]}`, "🗑️");
}

function calculateStagedMacros() {
    let staged = { calories: 0, netCarbs: 0, fiber: 0, protein: 0, fat: 0, weightedScore: 0 };
    sandboxMeal.forEach(item => {
        if (item.weight <= 0 || !foodDatabase[item.id]) return;
        const food = foodDatabase[item.id];
        const ratio = item.weight / 100;
        const cals = food.calories * ratio;
        staged.calories += cals;
        staged.netCarbs += food.netCarbs * ratio;
        staged.fiber += food.fiber * ratio;
        staged.protein += food.protein * ratio;
        staged.fat += food.fat * ratio;
        staged.weightedScore += food.healthScore * cals;
    });
    return staged;
}

function commitMeal() {
    if (sandboxMeal.length === 0) return;
    const stagedNow = calculateStagedMacros();
    lastCommit = {
        slot: currentMealSlot,
        previousSlotState: (dailyMeals[currentMealSlot] || []).map(i => ({ ...i })),
        stagedSnapshot: sandboxMeal.map(i => ({ ...i }))
    };
    if (!dailyMeals[currentMealSlot]) dailyMeals[currentMealSlot] = [];
    sandboxMeal.forEach(stItem => {
        const existing = dailyMeals[currentMealSlot].find(x => x.id === stItem.id);
        if (existing) existing.weight += stItem.weight;
        else dailyMeals[currentMealSlot].push({ id: stItem.id, weight: stItem.weight });
    });
    sandboxMeal = [];
    hasSpunPlate = false;
    recalculateLoggedFromMeals();
    document.getElementById('undo-btn').style.display = 'inline-flex';
    saveToMemory(); updateSandboxUI(); updateGoalsBarUI(); updatePatternInsights();
    triggerActionCue(`Meal Added to ${currentMealSlot} (+${Math.round(stagedNow.calories)} kcal)!`, "🍽️");
}

function undoCommit() {
    if (!lastCommit) return;
    dailyMeals[lastCommit.slot] = lastCommit.previousSlotState.map(i => ({ ...i }));
    sandboxMeal = lastCommit.stagedSnapshot.map(i => ({ ...i }));
    lastCommit = null;
    recalculateLoggedFromMeals();
    document.getElementById('undo-btn').style.display = 'none';
    saveToMemory(); updateSandboxUI(); updateGoalsBarUI(); updatePatternInsights();
    triggerActionCue("Undid Last Meal Addition", "⌫");
}

function getMealVibeTag(m) {
    if (m.calories <= 0) return "✨ Ready for Ingredients";
    if (m.protein >= 35 && m.fiber >= 7) return "🔥 High-Satiety Protein & Fiber Plate";
    if (m.protein >= 35) return "💪 Muscle-Protecting Protein Anchor";
    if (m.fiber >= 8) return "🌿 Gut-Health Prebiotic Fiber Boost";
    if (m.netCarbs <= 10 && m.fat >= 15) return "🥑 Steady Ketogenic / Lipid Fuel";
    return "⚡ Balanced Metabolic Fuel";
}

function updateUI() {
    const staged = calculateStagedMacros();
    document.getElementById('bar-carb-logged').textContent = Math.round(loggedMacros.netCarbs);
    document.getElementById('bar-fiber-logged').textContent = Math.round(loggedMacros.fiber);
    document.getElementById('bar-pro-logged').textContent = Math.round(loggedMacros.protein);
    document.getElementById('bar-fat-logged').textContent = Math.round(loggedMacros.fat);

    const cCals = loggedMacros.netCarbs * 4;
    const pCals = loggedMacros.protein * 4;
    const fCals = loggedMacros.fat * 9;
    const totalMacroCals = cCals + pCals + fCals;
    let splitStr = '0/0/0%';
    if (totalMacroCals > 0) {
        splitStr = `${Math.round((cCals / totalMacroCals) * 100)}/${Math.round((pCals / totalMacroCals) * 100)}/${Math.round((fCals / totalMacroCals) * 100)}%`;
    }

    const isMetric = appSettings.unitSystem === 'metric';
    const wVal = isMetric ? (lifeState.waterMl || 0) : (lifeState.waterOz || 0);
    const wGoal = isMetric ? (lifeState.waterGoalMl || 2500) : (lifeState.waterGoalOz || 96);
    const wUnit = isMetric ? 'ml' : 'oz';

    const mealsStreamEl = document.getElementById('summary-meals-stream');
    if (mealsStreamEl) {
        mealsStreamEl.innerHTML = `${Math.round(loggedMacros.calories)} kcal<span class="pipe-sep">|</span>${splitStr}<span class="pipe-sep">|</span>${wVal}/${wGoal} ${wUnit}`;
    }

    const stagingWaterEl = document.getElementById('staging-water-readout');
    if (stagingWaterEl) stagingWaterEl.textContent = `${wVal}/${wGoal} ${wUnit}`;

    document.getElementById('bar-carb-shadow-txt').textContent = staged.netCarbs > 0 ? `(+${Math.round(staged.netCarbs)})` : '';
    document.getElementById('bar-fiber-shadow-txt').textContent = staged.fiber > 0 ? `(+${Math.round(staged.fiber)})` : '';
    document.getElementById('bar-pro-shadow-txt').textContent = staged.protein > 0 ? `(+${Math.round(staged.protein)})` : '';
    document.getElementById('bar-fat-shadow-txt').textContent = staged.fat > 0 ? `(+${Math.round(staged.fat)})` : '';

    const carbPct = Math.min((loggedMacros.netCarbs / dailyTargets.netCarbs) * 100, 100) || 0;
    const fiberPct = Math.min((loggedMacros.fiber / dailyTargets.fiber) * 100, 100) || 0;
    const proPct = Math.min((loggedMacros.protein / dailyTargets.protein) * 100, 100) || 0;
    const fatPct = Math.min((loggedMacros.fat / dailyTargets.fat) * 100, 100) || 0;

    document.getElementById('bar-carb-fill').style.width = `${carbPct}%`;
    document.getElementById('bar-fiber-fill').style.width = `${fiberPct}%`;
    document.getElementById('bar-pro-fill').style.width = `${proPct}%`;
    document.getElementById('bar-fat-fill').style.width = `${fatPct}%`;

    document.getElementById('shadow-carb-fill').style.width = `${Math.min((staged.netCarbs / dailyTargets.netCarbs) * 100, 100 - carbPct) || 0}%`;
    document.getElementById('shadow-fiber-fill').style.width = `${Math.min((staged.fiber / dailyTargets.fiber) * 100, 100 - fiberPct) || 0}%`;
    document.getElementById('shadow-pro-fill').style.width = `${Math.min((staged.protein / dailyTargets.protein) * 100, 100 - proPct) || 0}%`;
    document.getElementById('shadow-fat-fill').style.width = `${Math.min((staged.fat / dailyTargets.fat) * 100, 100 - fatPct) || 0}%`;

    const panelTitle = document.getElementById('quality-panel-title');
    const ring = document.getElementById('score-ring');
    const scoreVal = document.getElementById('meal-score-value');
    const calsReadout = document.getElementById('staged-cals');
    const calLabel = document.getElementById('quality-cal-label');
    const vibeBadge = document.getElementById('meal-vibe-badge');

    if (staged.calories > 0) {
        const avgStaged = staged.weightedScore / staged.calories;
        const roundedStaged = Math.round(avgStaged * 10);
        panelTitle.textContent = "Staged Meal Quality";
        scoreVal.innerHTML = `${roundedStaged}<span style="font-size:1.3rem;">%</span>`;
        ring.style.borderColor = roundedStaged >= 80 ? 'var(--glow-fib)' : (roundedStaged >= 50 ? 'var(--glow-fat)' : 'var(--glow-carb)');
        calsReadout.textContent = Math.round(staged.calories);
        calLabel.textContent = "Staged Calories";
        if (vibeBadge) vibeBadge.textContent = getMealVibeTag(staged);
        updateAmbientHUD(avgStaged, staged.calories);
    } else if (loggedMacros.calories > 0) {
        const avgLogged = loggedMacros.weightedScore / loggedMacros.calories;
        const roundedLogged = Math.round(avgLogged * 10);
        panelTitle.textContent = "Today's Meals";
        scoreVal.innerHTML = `${roundedLogged}<span style="font-size:1.3rem;">%</span>`;
        ring.style.borderColor = roundedLogged >= 80 ? 'var(--glow-fib)' : (roundedLogged >= 50 ? 'var(--glow-fat)' : 'var(--glow-carb)');
        calsReadout.textContent = Math.round(loggedMacros.calories);
        calLabel.textContent = "Calories";
        if (vibeBadge) vibeBadge.textContent = getMealVibeTag(loggedMacros);
        updateAmbientHUD(avgLogged, staged.calories);
    } else {
        panelTitle.textContent = "Staged Meal Quality";
        scoreVal.innerHTML = `-`;
        ring.style.borderColor = 'var(--border-light)';
        calsReadout.textContent = "0";
        calLabel.textContent = "Staged Calories";
        if (vibeBadge) vibeBadge.textContent = "✨ Ready for Ingredients";
        updateAmbientHUD(0, 0);
    }
}