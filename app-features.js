// ============================================================================
// JOURNEY OF SELF — SANCTUARY, VOICE STUDIO, PANTRY, COOKBOOK & PDF EXPORT
// ============================================================================

let pantryRecipeTargetId = null;

// DAILY RHYTHM & INNER SANCTUARY (WITH SUBMIT & LOCK + UNDO/UNLOCK)
function openSanctuaryModal() {
    hapticTap(10);
    renderSanctuaryUI();
    document.getElementById('sanctuary-modal').style.display = 'flex';
}

function closeSanctuaryModal() {
    document.getElementById('sanctuary-modal').style.display = 'none';
}

function submitAndLockSanctuary() {
    lifeState.sanctuaryLocked = true;
    saveToMemory();
    renderSanctuaryUI();
    triggerActionCue("Today's Sanctuary Submitted & Locked!", "🔒");
}

function unlockSanctuaryDay() {
    lifeState.sanctuaryLocked = false;
    saveToMemory();
    renderSanctuaryUI();
    triggerActionCue("Sanctuary Unlocked for Editing", "🔓");
}

function adjustSleep(delta) {
    if (lifeState.sanctuaryLocked) { triggerActionCue("Tap 'Undo / Unlock' below to edit", "🔒"); return; }
    hapticTap(8);
    lifeState.sleepHrs = Math.max(0, Math.min(24, (parseFloat(lifeState.sleepHrs) || 0) + delta));
    const sleepInput = document.getElementById('life-sleep-hrs');
    if (sleepInput) sleepInput.value = lifeState.sleepHrs;
    saveToMemory();
    updatePatternInsights();
}

function toggleFasting() {
    if (lifeState.sanctuaryLocked) { triggerActionCue("Tap 'Undo / Unlock' below to edit", "🔒"); return; }
    if (lifeState.fastStart) {
        lifeState.fastStart = null;
        triggerActionCue("Fasting Timer Ended • Eating Window Open", "🍽️");
    } else {
        lifeState.fastStart = Date.now();
        triggerActionCue("Intermittent Fasting Timer Started!", "⏱️");
    }
    saveToMemory();
    renderSanctuaryUI();
    startFastingTicker();
}

function adjustFastStart(hrsBack) {
    if (lifeState.sanctuaryLocked || !lifeState.fastStart) return;
    hapticTap(8);
    lifeState.fastStart -= (hrsBack * 3600 * 1000);
    saveToMemory();
    updateFastingBannerText();
}

function startFastingTicker() {
    if (fastingTickerInterval) clearInterval(fastingTickerInterval);
    updateFastingBannerText();
    if (lifeState.fastStart) {
        fastingTickerInterval = setInterval(updateFastingBannerText, 1000);
    }
}

function updateFastingBannerText() {
    const fastBtn = document.getElementById('fasting-toggle-btn');
    const plusHrBtn = document.getElementById('fast-plus-hr-btn');
    const fastBanner = document.getElementById('fasting-status-banner');
    if (!fastBanner) return;

    if (lifeState.fastStart) {
        const elapsedSec = Math.max(0, Math.floor((Date.now() - lifeState.fastStart) / 1000));
        const h = Math.floor(elapsedSec / 3600);
        const m = Math.floor((elapsedSec % 3600) / 60);
        const s = elapsedSec % 60;
        const pad = n => String(n).padStart(2, '0');
        const hrsFloat = elapsedSec / 3600;
        const zone = hrsFloat >= 16 ? 'Deep Cellular Renewal Zone' : (hrsFloat >= 12 ? 'Fat-Burning Lipolysis Active' : 'Digestive Rest & Glycogen Transition');
        fastBanner.innerHTML = `<span style="color:var(--text-pro); font-size:1.05rem;">⏱️ ${pad(h)}h ${pad(m)}m ${pad(s)}s Fasted</span><br><span style="font-size:0.8rem;">${zone}</span>`;
        if (fastBtn) fastBtn.textContent = 'End Fast';
        if (plusHrBtn) plusHrBtn.style.display = 'inline-block';
    } else {
        fastBanner.textContent = 'Eating Window Open • Tap Start Fast after your final meal.';
        if (fastBtn) fastBtn.textContent = 'Start Fast';
        if (plusHrBtn) plusHrBtn.style.display = 'none';
    }
}

function setLifeScale(key, val) {
    if (lifeState.sanctuaryLocked) { triggerActionCue("Tap 'Undo / Unlock' below to edit", "🔒"); return; }
    hapticTap(8);
    lifeState[key] = val;
    saveToMemory();
    renderSanctuaryUI();
}

function toggleHabit(habitName) {
    if (lifeState.sanctuaryLocked) { triggerActionCue("Tap 'Undo / Unlock' below to edit", "🔒"); return; }
    lifeState.habits[habitName] = !lifeState.habits[habitName];
    saveToMemory();
    renderSanctuaryUI();
    if (lifeState.habits[habitName]) {
        triggerActionCue(`Completed: ${habitName}!`, "✓");
    }
}

function addHabitItem() {
    if (lifeState.sanctuaryLocked) { triggerActionCue("Tap 'Undo / Unlock' below to edit", "🔒"); return; }
    const inp = document.getElementById('new-habit-input');
    const name = inp ? inp.value.trim() : '';
    if (!name) return;
    lifeState.habits[name] = false;
    inp.value = '';
    saveToMemory();
    renderSanctuaryUI();
    triggerActionCue("Added New Daily Foundation!", "✨");
}

function editHabitItem(oldName, e) {
    if (e) e.stopPropagation();
    if (lifeState.sanctuaryLocked) return;
    const updated = prompt("Edit Daily Foundation:", oldName);
    if (!updated || !updated.trim() || updated.trim() === oldName) return;
    const newHabitObj = {};
    Object.entries(lifeState.habits).forEach(([k, v]) => {
        if (k === oldName) newHabitObj[updated.trim()] = v;
        else newHabitObj[k] = v;
    });
    lifeState.habits = newHabitObj;
    saveToMemory();
    renderSanctuaryUI();
}

function deleteHabitItem(habitName, e) {
    if (e) e.stopPropagation();
    if (lifeState.sanctuaryLocked) return;
    delete lifeState.habits[habitName];
    saveToMemory();
    renderSanctuaryUI();
}

function saveLifeData() {
    if (lifeState.sanctuaryLocked) return;
    lifeState.sleepHrs = parseFloat(document.getElementById('life-sleep-hrs').value) || 0;
    saveToMemory();
    updatePatternInsights();
    triggerActionCue(`Logged ${lifeState.sleepHrs} hrs Sleep!`, "🌙");
}

function updatePatternInsights() {
    const box = document.getElementById('pattern-insight-box');
    if (!box) return;
    const proPct = dailyTargets.protein > 0 ? Math.round((loggedMacros.protein / dailyTargets.protein) * 100) : 0;
    const fibPct = dailyTargets.fiber > 0 ? Math.round((loggedMacros.fiber / dailyTargets.fiber) * 100) : 0;
    const doneHabits = Object.values(lifeState.habits).filter(Boolean).length;
    const avgWellbeing = ((lifeState.mood + lifeState.energy + lifeState.clarity + lifeState.comfort) / 4).toFixed(1);

    let msg = `✨ <strong>Resonance Check (${avgWellbeing}/5 ★):</strong> `;
    if (lifeState.sleepHrs >= 7.5 && lifeState.clarity >= 4) {
        msg += `Restorative sleep (${lifeState.sleepHrs}h) is fueling high mental clarity today. Pair with steady hydration to hold this groove.`;
    } else if (proPct >= 75 && fibPct >= 75) {
        msg += `High-satiety nutrition unlocked (${Math.round(loggedMacros.protein)}g Protein & ${Math.round(loggedMacros.fiber)}g Fiber)—your blood sugar and evening recovery are well-supported.`;
    } else if (exerciseLog.length > 0 || (telemetry.steps || 0) >= 8000) {
        msg += `Active movement logged (${(telemetry.steps || 0).toLocaleString()} steps). Days with Zone 1/2 movement consistently boost physical comfort and sleep depth.`;
    } else if (doneHabits >= 3) {
        msg += `${doneHabits} Daily Foundations completed today—small, zero-pressure anchors compound faster than rigid streaks.`;
    } else {
        msg += `Tap any 1–5 scale, log a meal, or check off a Daily Foundation below to see how your fuel and rest connect to how you feel.`;
    }
    box.innerHTML = msg;
}

function renderSanctuaryUI() {
    updateFastingBannerText();
    updatePatternInsights();
    const isLocked = !!lifeState.sanctuaryLocked;
    const lockedBanner = document.getElementById('sanctuary-locked-banner');
    const submitBtn = document.getElementById('sanctuary-submit-btn');
    const unlockBtn = document.getElementById('sanctuary-unlock-btn');
    const wrap = document.getElementById('sanctuary-interactive-wrap');

    if (lockedBanner) lockedBanner.style.display = isLocked ? 'block' : 'none';
    if (submitBtn) submitBtn.style.display = isLocked ? 'none' : 'inline-block';
    if (unlockBtn) unlockBtn.style.display = isLocked ? 'inline-block' : 'none';
    if (wrap) wrap.style.opacity = isLocked ? '0.68' : '1';

    const sleepInput = document.getElementById('life-sleep-hrs');
    if (sleepInput && document.activeElement !== sleepInput) {
        sleepInput.value = lifeState.sleepHrs;
        sleepInput.disabled = isLocked;
    }

    ['mood', 'energy', 'clarity', 'comfort'].forEach(k => {
        const container = document.getElementById(`scale-${k}`);
        if (!container) return;
        container.innerHTML = [1, 2, 3, 4, 5].map(n => `
            <button type="button" class="scale-btn ${lifeState[k] === n ? 'active' : ''}" onclick="setLifeScale('${k}', ${n})">${n}</button>
        `).join('');
    });

    const habitsBox = document.getElementById('daily-habits-list');
    if (habitsBox) {
        habitsBox.innerHTML = Object.entries(lifeState.habits).map(([hName, done]) => {
            const safeName = hName.replace(/'/g, "\\'");
            return `
                <div class="habit-check-row ${done ? 'done' : ''}" onclick="toggleHabit('${safeName}')">
                    <span style="flex:1; cursor:pointer;">${done ? '✓ ' : '○ '} ${hName}</span>
                    <div style="display:flex; gap:0.35rem; align-items:center;">
                        <button type="button" class="unit-btn" style="padding:0.2rem 0.45rem;" onclick="editHabitItem('${safeName}', event)" title="Edit">✎</button>
                        <button type="button" class="unit-btn" style="padding:0.2rem 0.45rem; color:var(--text-carb);" onclick="deleteHabitItem('${safeName}', event)" title="Remove">&times;</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// VOICE JOURNAL, AUTO-TRANSCRIPTION WITH PUNCTUATION & MULTI-ENTRY AUDIO ENGINE
function formatPunctuatedTranscript(rawText) {
    if (!rawText) return '';
    let s = rawText.trim()
        .replace(/\bperiod\b/gi, '.')
        .replace(/\bcomma\b/gi, ',')
        .replace(/\bquestion mark\b/gi, '?')
        .replace(/\bexclamation point\b/gi, '!')
        .replace(/\bnew line\b/gi, '\n')
        .replace(/\s+([.,?!])/g, '$1');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    s = s.replace(/([.?!]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    if (!/[.?!]$/.test(s)) s += '.';
    return s;
}

function toggleSpeechTranscription() {
    const btn = document.getElementById('vj-transcribe-btn');
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
        alert("Speech-to-text dictation requires Chrome, Edge, or Safari with Speech Recognition enabled.");
        return;
    }
    if (isTranscribing && speechRecognizer) {
        speechRecognizer.stop();
        return;
    }
    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = 'en-US';

    speechRecognizer.onstart = () => {
        isTranscribing = true;
        if (btn) {
            btn.textContent = "🛑 Stop Dictation (Listening...)";
            btn.style.background = "var(--text-carb)";
            btn.style.color = "#ffffff";
        }
        triggerActionCue("Listening — Speak Your Reflection!", "🎙️");
    };

    speechRecognizer.onresult = (event) => {
        let chunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                chunk += event.results[i][0].transcript + ' ';
            }
        }
        if (chunk.trim()) {
            const formatted = formatPunctuatedTranscript(chunk);
            const ta = document.getElementById('vj-text-input');
            if (ta) {
                ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + formatted;
            }
        }
    };

    speechRecognizer.onend = () => {
        isTranscribing = false;
        if (btn) {
            btn.textContent = "📝 Dictate & Auto-Transcribe";
            btn.style.background = "var(--input-bg)";
            btn.style.color = "var(--text-pro)";
        }
    };

    speechRecognizer.onerror = () => {
        isTranscribing = false;
        if (btn) {
            btn.textContent = "📝 Dictate & Auto-Transcribe";
            btn.style.background = "var(--input-bg)";
            btn.style.color = "var(--text-pro)";
        }
    };

    speechRecognizer.start();
}

function initVoiceJournalDB() {
    if (!window.indexedDB) return;
    const req = indexedDB.open('JourneyVoiceJournalDB', 1);
    req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('entries')) {
            db.createObjectStore('entries', { keyPath: 'id' });
        }
    };
    req.onsuccess = (e) => { vjDatabase = e.target.result; };
}

function openVoiceJournalModal() {
    hapticTap(10);
    document.getElementById('voice-journal-modal').style.display = 'flex';
    renderVoiceJournalEntries();
}

function closeVoiceJournalModal() {
    if (isTranscribing && speechRecognizer) speechRecognizer.stop();
    if (mediaRecorder && mediaRecorder.state === 'recording') stopVoiceRecordingInternal();
    document.getElementById('voice-journal-modal').style.display = 'none';
}

async function persistVoiceEntryToDB(audioBlobOrFile, noteText = '') {
    if (!vjDatabase || !audioBlobOrFile) return;
    try {
        const rawBuffer = await audioBlobOrFile.arrayBuffer();
        const mimeType = audioBlobOrFile.type || 'audio/mp4';
        const uniqueId = 'vj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

        const entry = {
            id: uniqueId,
            timestamp: Date.now(),
            text: noteText,
            mood: lifeState.mood,
            energy: lifeState.energy,
            clarity: lifeState.clarity,
            comfort: lifeState.comfort,
            audioBuffer: rawBuffer,
            audioMime: mimeType,
            audioSize: rawBuffer.byteLength
        };

        const tx = vjDatabase.transaction('entries', 'readwrite');
        tx.objectStore('entries').put(entry);
        tx.oncomplete = () => {
            document.getElementById('vj-text-input').value = '';
            const timerDisp = document.getElementById('vj-timer-display');
            if (timerDisp) {
                const kb = Math.round(rawBuffer.byteLength / 1024);
                timerDisp.textContent = `✓ Saved Voice Memo (${kb} KB)`;
                timerDisp.style.color = 'var(--text-fib)';
            }
            currentRecordedBlob = null;
            renderVoiceJournalEntries();
            triggerActionCue("Voice Memo Saved to Journal Timeline!", "🎙️");
        };
    } catch (err) {
        console.error("Voice save error:", err);
    }
}

async function handleNativeAudioFile(inputEl) {
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
    const pickedFile = inputEl.files[0];
    const noteVal = document.getElementById('vj-text-input').value.trim();
    await persistVoiceEntryToDB(pickedFile, noteVal);
    inputEl.value = '';
}

function drawWaveform() {
    const canvas = document.getElementById('vj-waveform-canvas');
    if (!canvas || !analyserNode) return;
    const ctx = canvas.getContext('2d');
    const bufferLen = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLen);

    function renderFrame() {
        if (!analyserNode) return;
        waveformAnimId = requestAnimationFrame(renderFrame);
        analyserNode.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barCount = 42;
        const step = Math.floor(bufferLen / barCount);
        const barWidth = (canvas.width / barCount) - 3;

        for (let i = 0; i < barCount; i++) {
            const val = dataArray[i * step] || 4;
            const pct = val / 255;
            const barHeight = Math.max(4, pct * (canvas.height - 8));
            const x = i * (barWidth + 3);
            const y = (canvas.height - barHeight) / 2;
            ctx.fillStyle = pct > 0.6 ? '#ff2a6d' : (pct > 0.3 ? '#a78bfa' : '#00d2ff');
            ctx.fillRect(x, y, barWidth, barHeight);
        }
    }
    renderFrame();
}

function stopVoiceRecordingInternal() {
    const btn = document.getElementById('vj-record-btn');
    const canvas = document.getElementById('vj-waveform-canvas');
    if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
    if (recordTimerInterval) { clearInterval(recordTimerInterval); recordTimerInterval = null; }
    if (waveformAnimId) { cancelAnimationFrame(waveformAnimId); waveformAnimId = null; }
    analyserNode = null;
    if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
    if (canvas) canvas.style.display = 'none';
    if (btn) {
        btn.textContent = '● Record New Voice Memo';
        btn.style.background = '#99293d';
    }
}

async function toggleVoiceRecording() {
    const btn = document.getElementById('vj-record-btn');
    const timerDisp = document.getElementById('vj-timer-display');
    const canvas = document.getElementById('vj-waveform-canvas');

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopVoiceRecordingInternal();
        return;
    }

    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const nativeInput = document.getElementById('vj-native-audio-input');
        if (nativeInput) { nativeInput.value = ''; nativeInput.click(); }
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
        });
        let options = { audioBitsPerSecond: 96000 };
        if (MediaRecorder.isTypeSupported('audio/mp4')) options.mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) options.mimeType = 'audio/webm;codecs=opus';

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && canvas) {
            audioCtx = new AudioContextClass();
            const source = audioCtx.createMediaStreamSource(stream);
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 128;
            source.connect(analyserNode);
            canvas.style.display = 'block';
            drawWaveform();
        }

        mediaRecorder = new MediaRecorder(stream, options);
        audioChunks = [];
        mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) audioChunks.push(e.data); };
        mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(t => t.stop());
            const recordedBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/mp4' });
            const noteVal = document.getElementById('vj-text-input').value.trim();
            await persistVoiceEntryToDB(recordedBlob, noteVal);
        };

        mediaRecorder.start();
        recordStartTime = Date.now();
        btn.textContent = '■ Stop & Save Recording';
        btn.style.background = '#0f172a';
        timerDisp.style.color = 'var(--panel-text-main)';
        timerDisp.textContent = '00:00 / 05:00';

        recordTimerInterval = setInterval(() => {
            const sec = Math.floor((Date.now() - recordStartTime) / 1000);
            if (sec >= MAX_VOICE_SECONDS) {
                timerDisp.textContent = '05:00 / 05:00 (Max Reached)';
                stopVoiceRecordingInternal();
                return;
            }
            const m = String(Math.floor(sec / 60)).padStart(2, '0');
            const s = String(sec % 60).padStart(2, '0');
            timerDisp.textContent = `${m}:${s} / 05:00`;
            timerDisp.style.color = sec >= 270 ? 'var(--text-carb)' : 'var(--panel-text-main)';
        }, 400);
    } catch (err) {
        const nativeInput = document.getElementById('vj-native-audio-input');
        if (nativeInput) { nativeInput.value = ''; nativeInput.click(); }
    }
}

function saveJournalEntry() {
    const textVal = document.getElementById('vj-text-input').value.trim();
    if (!textVal) {
        alert('Type or dictate a reflection above, or tap "● Record New Voice Memo" to record and auto-save a voice entry.');
        return;
    }
    const uniqueId = 'vj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const entry = {
        id: uniqueId,
        timestamp: Date.now(),
        text: textVal,
        mood: lifeState.mood,
        energy: lifeState.energy,
        clarity: lifeState.clarity,
        comfort: lifeState.comfort,
        audioBuffer: null
    };

    if (vjDatabase) {
        const tx = vjDatabase.transaction('entries', 'readwrite');
        tx.objectStore('entries').put(entry);
        tx.oncomplete = () => {
            document.getElementById('vj-text-input').value = '';
            renderVoiceJournalEntries();
            triggerActionCue("Written Reflection Saved to Journal!", "📝");
        };
    }
}

function editJournalEntryNote(id) {
    if (!vjDatabase) return;
    const tx = vjDatabase.transaction('entries', 'readwrite');
    const store = tx.objectStore('entries');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
        const item = getReq.result;
        if (!item) return;
        const updated = prompt("Add or edit note for this journal entry:", item.text || "");
        if (updated === null) return;
        item.text = updated.trim();
        store.put(item);
        tx.oncomplete = () => renderVoiceJournalEntries();
    };
}

function deleteJournalEntry(id) {
    if (!vjDatabase) return;
    const tx = vjDatabase.transaction('entries', 'readwrite');
    tx.objectStore('entries').delete(id);
    tx.oncomplete = () => renderVoiceJournalEntries();
}

function renderVoiceJournalEntries() {
    const list = document.getElementById('vj-entries-list');
    if (!list || !vjDatabase) return;
    const tx = vjDatabase.transaction('entries', 'readonly');
    const req = tx.objectStore('entries').getAll();
    req.onsuccess = () => {
        const items = (req.result || []).sort((a, b) => b.timestamp - a.timestamp);
        if (items.length === 0) {
            list.innerHTML = `<p class="empty-state" style="margin:0.75rem 0;">No journal entries saved yet.</p>`;
            return;
        }
        list.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'meal-group-card';
            card.style.padding = '0.9rem 1rem';
            card.style.marginBottom = '0.5rem';
            const dateStr = new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            let audioHtml = '';
            if (item.audioBuffer) {
                const blob = new Blob([item.audioBuffer], { type: item.audioMime || 'audio/mp4' });
                const url = URL.createObjectURL(blob);
                const kbSize = Math.round((item.audioSize || item.audioBuffer.byteLength || 0) / 1024);
                audioHtml = `<div style="margin-top:0.55rem;"><audio controls src="${url}" style="width:100%; height:36px;"></audio><div style="font-size:0.65rem; font-family:var(--font-mono); color:var(--panel-text-muted);">Voice Memo (${kbSize} KB)</div></div>`;
            } else if (item.audioBlob) {
                const url = URL.createObjectURL(item.audioBlob);
                const kbSize = Math.round(item.audioBlob.size / 1024);
                audioHtml = `<div style="margin-top:0.55rem;"><audio controls src="${url}" style="width:100%; height:36px;"></audio><div style="font-size:0.65rem; font-family:var(--font-mono); color:var(--panel-text-muted);">Voice Memo (${kbSize} KB)</div></div>`;
            }
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.35rem;">
                    <span style="font-family:var(--font-mono); font-size:0.74rem; font-weight:800; color:var(--text-pro);">${dateStr}</span>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                        <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--panel-text-muted);">Mood ${item.mood}/5 • Energy ${item.energy}/5</span>
                        <button class="unit-btn" style="padding:0.2rem 0.5rem; font-size:0.68rem;" onclick="editJournalEntryNote('${item.id}')">✎ Note</button>
                        <button class="remove-btn" style="width:24px; height:24px; font-size:0.9rem;" onclick="deleteJournalEntry('${item.id}')">&times;</button>
                    </div>
                </div>
                ${item.text ? `<div style="font-size:0.88rem; line-height:1.45; white-space:pre-wrap;">${item.text}</div>` : ''}
                ${audioHtml}
            `;
            list.appendChild(card);
        });
    };
}

// CLICKABLE MACRO DEEP-DIVE POP-UP (IDEA 4)
function openMacroDetailModal(macroKey) {
    hapticTap(10);
    const meta = MACRO_META[macroKey];
    if (!meta) return;
    const staged = calculateStagedMacros();
    const loggedVal = loggedMacros[macroKey] || 0;
    const stagedVal = staged[macroKey] || 0;
    const targetVal = dailyTargets[macroKey] || 1;
    const remaining = Math.max(0, targetVal - loggedVal);
    const pct = Math.min(100, Math.round((loggedVal / targetVal) * 100));

    const contributors = {};
    Object.entries(dailyMeals).forEach(([slot, items]) => {
        items.forEach(it => {
            const f = foodDatabase[it.id];
            if (!f || it.weight <= 0) return;
            const gVal = (f[macroKey] || 0) * (it.weight / 100);
            if (gVal > 0.1) {
                if (!contributors[f.id]) contributors[f.id] = { food: f, grams: 0 };
                contributors[f.id].grams += gVal;
            }
        });
    });

    const sortedContrib = Object.values(contributors).sort((a, b) => b.grams - a.grams);
    let contribHtml = '';
    if (sortedContrib.length === 0) {
        contribHtml = `<p class="empty-state" style="margin:0.65rem 0;">No foods contributing to ${meta.title.replace(' Breakdown','')} logged yet today.</p>`;
    } else {
        contribHtml = sortedContrib.map(c => {
            const sharePct = Math.min(100, Math.round((c.grams / Math.max(1, loggedVal)) * 100));
            const emj = c.food.emoji.startsWith('http') ? '📸' : c.food.emoji;
            return `
                <div style="margin-bottom:0.55rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:800; margin-bottom:0.2rem;">
                        <span>${emj} ${c.food.name}</span>
                        <span style="font-family:var(--font-mono); color:${meta.color};">${c.grams.toFixed(1)}g (${sharePct}%)</span>
                    </div>
                    <div style="width:100%; height:8px; background:var(--card-sub-bg); border-radius:50px; overflow:hidden;">
                        <div style="width:${sharePct}%; height:100%; background:${meta.glow}; border-radius:50px;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const topPantryHtml = meta.topIds.map(id => {
        const f = foodDatabase[id];
        if (!f) return '';
        const gPerDef = ((f[macroKey] || 0) * (f.defaultWeight / 100)).toFixed(1);
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.75rem; background:var(--input-bg); border:1px solid var(--border-light); border-radius:10px; margin-bottom:0.4rem; font-size:0.82rem;">
                <span>${f.emoji} <strong>${f.name}</strong> (${f.defaultWeight}g = <strong>${gPerDef}g</strong>)</span>
                <button type="button" class="unit-btn" style="border-color:${meta.color}; color:${meta.color};" onclick="quickStageFromMacroModal('${f.id}', ${f.defaultWeight})">+ Stage</button>
            </div>
        `;
    }).join('');

    document.getElementById('macro-detail-title').textContent = meta.title;
    document.getElementById('macro-detail-body').innerHTML = `
        <div class="health-report-card" style="border-left-color:${meta.color};">
            <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:0.5rem;">
                <div style="font-size:1.3rem; font-weight:900; font-family:var(--font-mono); color:${meta.color};">
                    ${loggedVal.toFixed(1)}g Logged <span style="font-size:0.85rem; color:var(--panel-text-muted);">/ ${targetVal}g ${meta.limitWord} (${pct}%)</span>
                </div>
                <div style="font-family:var(--font-mono); font-size:0.8rem; font-weight:800;">
                    Staged: +${stagedVal.toFixed(1)}g • Remaining: ${remaining.toFixed(1)}g
                </div>
            </div>
        </div>
        <div style="font-size:0.74rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--panel-text-muted); margin:0.9rem 0 0.45rem 0;">📊 Today's Food Contributors</div>
        <div style="background:var(--input-bg); border:1.5px solid var(--border-light); border-radius:12px; padding:0.85rem;">${contribHtml}</div>
        <div style="font-size:0.74rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--panel-text-muted); margin:0.9rem 0 0.45rem 0;">🧬 How It Works in Your Body</div>
        <div style="font-size:0.85rem; line-height:1.5; background:var(--input-bg); border:1px solid var(--border-light); border-radius:12px; padding:0.85rem;">${meta.role}</div>
        <div style="font-size:0.74rem; font-family:var(--font-mono); font-weight:900; text-transform:uppercase; color:var(--panel-text-muted); margin:0.9rem 0 0.45rem 0;">⚡ Quick-Stage Top Pantry Sources</div>
        ${topPantryHtml}
    `;
    document.getElementById('macro-detail-modal').style.display = 'flex';
}

function closeMacroDetailModal() {
    document.getElementById('macro-detail-modal').style.display = 'none';
}

function quickStageFromMacroModal(foodId, gramWeight) {
    const existing = sandboxMeal.find(item => item.id === foodId);
    if (existing) existing.weight += gramWeight;
    else sandboxMeal.push({ id: foodId, weight: gramWeight, locked: false });
    sortSandboxByCulinaryOrder();
    closeMacroDetailModal();
    saveToMemory();
    updateSandboxUI();
    triggerActionCue(`Staged ${foodDatabase[foodId].name}!`, "🍽️");
}

// SETTINGS, EXPORT & END CYCLE
function openSettingsModal() {
    document.getElementById('set-unit-system').value = appSettings.unitSystem || 'imperial';
    document.getElementById('set-fiber-rate').value = appSettings.fiberPer1000 || 15;
    document.getElementById('settings-modal').style.display = 'flex';
}
function closeSettingsModal() { document.getElementById('settings-modal').style.display = 'none'; }

function saveSettings() {
    const prevUnit = appSettings.unitSystem;
    const nextUnit = document.getElementById('set-unit-system').value;
    appSettings.fiberPer1000 = parseInt(document.getElementById('set-fiber-rate').value) || 15;

    if (prevUnit !== nextUnit) {
        appSettings.unitSystem = nextUnit;
        const factor = nextUnit === 'metric' ? 0.453592 : 2.20462;
        telemetry.currentWeight = parseFloat((telemetry.currentWeight * factor).toFixed(1));
        telemetry.startWeight = parseFloat((telemetry.startWeight * factor).toFixed(1));
        telemetry.targetWeight = parseFloat((telemetry.targetWeight * factor).toFixed(1));
        telemetry.heightIn = nextUnit === 'metric' ? Math.round(telemetry.heightIn * 2.54) : Math.round(telemetry.heightIn / 2.54);
        weightHistory.forEach(w => { w.weight = parseFloat((w.weight * factor).toFixed(1)); });
    }
    document.getElementById('unit-mode-label').textContent = appSettings.unitSystem === 'metric' ? 'Metric' : 'Imperial';
    renderStagingWaterButtons();
    updateWaterWaveHeight();
    calculateMacros();
    saveToMemory();
    updateGoalsBarUI();
    updateUI();
}

function exportAllData() {
    const payload = { appSettings, telemetry, weightHistory, dailyMeals, exerciseLog, lifeState, journalHistory, savedRecipes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `journey-of-self-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function endCycle() {
    if (confirm("Start a new day? This archives today's meals into your history and resets today's meals, water, sanctuary lock, and workouts for the new day.")) {
        if (loggedMacros.calories > 0) {
            journalHistory.push({ timestamp: Date.now(), calories: loggedMacros.calories, weightedScore: loggedMacros.weightedScore });
        }
        dailyMeals = { "Breakfast": [], "Lunch": [], "Dinner": [], "Evening Meal": [], "Snacks": [] };
        exerciseLog = [];
        lifeState.waterOz = 0;
        lifeState.waterMl = 0;
        lifeState.sanctuaryLocked = false;
        waterHistoryStack = [];
        Object.keys(lifeState.habits).forEach(k => lifeState.habits[k] = false);
        sandboxMeal = [];
        hasSpunPlate = false;
        lastCommit = null;
        recalculateLoggedFromMeals();
        updateWaterWaveHeight();
        saveToMemory();
        updateSandboxUI();
        updateGoalsBarUI();
        updateExerciseBarUI();
        renderSanctuaryUI();
        triggerActionCue("Fresh Day Started!", "🌅");
    }
}

// TODAY'S MEALS & HYDRATION MODAL
function openJournalModal() { renderJournal(); document.getElementById('journal-modal').style.display = 'flex'; }
function closeJournalModal() { document.getElementById('journal-modal').style.display = 'none'; }

function renderJournal() {
    const body = document.getElementById('journal-body');
    body.innerHTML = '';

    const isMetric = appSettings.unitSystem === 'metric';
    const wVal = isMetric ? (lifeState.waterMl || 0) : (lifeState.waterOz || 0);
    const wGoal = isMetric ? (lifeState.waterGoalMl || 2500) : (lifeState.waterGoalOz || 96);
    const wUnit = isMetric ? 'ml' : 'oz';
    const wPct = Math.min(100, Math.round((wVal / wGoal) * 100));

    const waterBtnsHtml = isMetric ? `
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(250)">+250 ml</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(350)">+350 ml</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(500)">+500 ml</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(1000)">+1 L</button>
        <button class="unit-btn" style="padding:0.45rem; color:var(--text-pro);" onclick="undoWater()">⌫ Undo</button>
        <button class="unit-btn" style="padding:0.45rem; color:var(--text-carb);" onclick="resetWater()">↺ Reset</button>
    ` : `
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(8)">+8 oz</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(12)">+12 oz</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(16)">+16 oz</button>
        <button class="unit-btn" style="flex:1; padding:0.45rem;" onclick="addWater(24)">+24 oz</button>
        <button class="unit-btn" style="padding:0.45rem; color:var(--text-pro);" onclick="undoWater()">⌫ Undo</button>
        <button class="unit-btn" style="padding:0.45rem; color:var(--text-carb);" onclick="resetWater()">↺ Reset</button>
    `;

    body.innerHTML += `
        <div class="meal-group-card" style="padding:1rem; margin-bottom:1.25rem; border-left:4px solid var(--text-pro);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.65rem;">
                <div>
                    <h3 style="font-size:1.05rem; font-weight:900; color:var(--panel-text-main);">💧 Today's Hydration &amp; Electrolytes</h3>
                    <span style="font-size:0.76rem; font-family:var(--font-mono); font-weight:700; color:var(--panel-text-muted);">
                        Water: <strong>${wVal}/${wGoal} ${wUnit} (${wPct}%)</strong> • Logged Sodium: <strong>${Math.round(loggedMacros.sodium || 0)} mg</strong> / 2,300 mg
                    </span>
                </div>
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">${waterBtnsHtml}</div>
        </div>
    `;

    const slots = ["Breakfast", "Lunch", "Dinner", "Evening Meal", "Snacks"];
    let anyLogged = false;

    slots.forEach(slotName => {
        const items = dailyMeals[slotName] || [];
        if (items.length === 0) return;
        anyLogged = true;

        let slotCals = 0, slotC = 0, slotF = 0, slotP = 0, slotFat = 0, slotWeighted = 0;
        let rowsHtml = '';

        items.forEach((it, idx) => {
            const f = foodDatabase[it.id];
            if (!f) return;
            const r = it.weight / 100;
            const cals = f.calories * r;
            const nc = f.netCarbs * r;
            const fib = f.fiber * r;
            const pro = f.protein * r;
            const fat = f.fat * r;
            const sod = (f.sodium || 0) * r;
            const sug = (f.sugar || 0) * r;

            slotCals += cals; slotC += nc; slotF += fib; slotP += pro; slotFat += fat;
            slotWeighted += (f.healthScore * cals);

            let emj = f.emoji.startsWith('http') ? '📸' : f.emoji;
            rowsHtml += `
                <div class="meal-ing-row">
                    <div class="meal-ing-top">
                        <span style="font-weight:800; font-size:0.95rem; color:var(--panel-text-main);">${emj} ${f.name}</span>
                        <div style="display:flex; align-items:center; gap:0.35rem;">
                            <input type="number" value="${it.weight}" min="1" step="any" style="width:64px; padding:0.28rem; text-align:center; border-radius:6px; border:1px solid var(--border-light); background:var(--input-bg); color:var(--text-pro); font-weight:800; font-family:var(--font-mono);" onchange="updateLoggedItemWeight('${slotName}', ${idx}, this.value)">
                            <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:700;">g</span>
                            <button class="unit-btn" onclick="openFDAModal('${f.id}', ${it.weight}, 'g')">ⓘ</button>
                            <button class="delete-ing-pill" onclick="removeLoggedItem('${slotName}', ${idx})">🗑️ Delete</button>
                        </div>
                    </div>
                    <div class="meal-ing-nutri">
                        <strong>${Math.round(cals)} kcal</strong> | Net Carbs: ${nc.toFixed(1)}g | Fiber: ${fib.toFixed(1)}g | Protein: ${pro.toFixed(1)}g | Fat: ${fat.toFixed(1)}g | Sugars: ${sug.toFixed(1)}g | Sodium: ${Math.round(sod)}mg | <span style="color:var(--text-pro);">Score: ${f.healthScore}/10</span>
                    </div>
                </div>`;
        });

        const slotScore = slotCals > 0 ? Math.round((slotWeighted / slotCals) * 10) : 0;
        body.innerHTML += `
            <div class="meal-group-card">
                <div class="meal-group-header">
                    <div>
                        <h3 style="font-size:1.12rem; font-weight:900; color:var(--panel-text-main);">${slotName}</h3>
                        <span style="font-size:0.75rem; font-family:var(--font-mono); font-weight:700; color:var(--panel-text-muted);">
                            ${Math.round(slotCals)} kcal • ${slotC.toFixed(1)}g C • ${slotP.toFixed(1)}g P • ${slotFat.toFixed(1)}g F • ${slotF.toFixed(1)}g Fiber
                        </span>
                    </div>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                        <span class="food-score ${getScoreClass(slotScore / 10)}">Quality ${slotScore}%</span>
                        <button class="unit-btn" onclick="saveSlotAsRecipe('${slotName}')">+ Save Recipe</button>
                        <button class="unit-btn" style="color:var(--text-pro); border-color:var(--text-pro);" onclick="addMoreToSlot('${slotName}')">+ Add Food</button>
                    </div>
                </div>
                ${rowsHtml}
            </div>`;
    });

    if (!anyLogged) {
        body.innerHTML += `<p class="empty-state">No food meals logged yet today.<br>Stage foods on the dashboard to add them to Breakfast, Lunch, Dinner, Evening Meal, or Snacks.</p>`;
    }
}

function updateLoggedItemWeight(slotName, idx, newVal) {
    const w = parseFloat(newVal) || 0;
    if (w <= 0) dailyMeals[slotName].splice(idx, 1);
    else dailyMeals[slotName][idx].weight = w;
    recalculateLoggedFromMeals();
    saveToMemory(); renderJournal(); updateUI(); updateGoalsBarUI(); updatePatternInsights();
}

function removeLoggedItem(slotName, idx) {
    dailyMeals[slotName].splice(idx, 1);
    recalculateLoggedFromMeals();
    saveToMemory(); renderJournal(); updateUI(); updateGoalsBarUI(); updatePatternInsights();
}

function addMoreToSlot(slotName) {
    selectMealSlot(slotName); closeJournalModal(); openPantry('all');
}

function saveSlotAsRecipe(slotName) {
    document.getElementById('recipe-slot-key').value = slotName;
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-prep').value = '';
    closeJournalModal();
    document.getElementById('recipe-creator-modal').style.display = 'flex';
}
function closeRecipeCreator() { document.getElementById('recipe-creator-modal').style.display = 'none'; }

function sortRecipeItemsByCulinaryOrder(recipe) {
    if (!recipe || !Array.isArray(recipe.items)) return;
    recipe.items.sort((a, b) => getCulinarySortRank(a.id) - getCulinarySortRank(b.id));
}

function commitRecipeExtraction() {
    const slotName = document.getElementById('recipe-slot-key').value;
    const name = document.getElementById('recipe-name').value.trim() || `${slotName} Recipe`;
    const prep = document.getElementById('recipe-prep').value || "";
    const items = dailyMeals[slotName] || [];
    if (items.length === 0) return;
    const newId = 'recipe_' + Date.now();
    savedRecipes[newId] = { name, prep, portions: 1, batchMult: 1, items: items.map(i => ({ ...i })) };
    sortRecipeItemsByCulinaryOrder(savedRecipes[newId]);
    saveToMemory();
    closeRecipeCreator();
    openCookbookModal();
    openRecipeDetail(newId);
    triggerActionCue(`Saved "${name}" to Cookbook!`, "🍳");
}

// ============================================================================
// COOKBOOK, EDITABLE INGREDIENTS, PANTRY-TO-RECIPE & DIRECT PDF / PRINT EXPORT
// ============================================================================

function openCookbookModal() {
    hapticTap(10);
    activeCookbookRecipeId = null;
    renderCookbook();
    document.getElementById('cookbook-modal').style.display = 'flex';
}

function closeCookbookModal() {
    document.getElementById('cookbook-modal').style.display = 'none';
}

function openRecipeDetail(id) {
    hapticTap(8);
    activeCookbookRecipeId = id;
    renderCookbook();
}

function backToCookbookList() {
    hapticTap(8);
    activeCookbookRecipeId = null;
    renderCookbook();
}

function createNewBlankRecipe() {
    hapticTap(10);
    const defaultName = "New Custom Recipe";
    const entered = prompt("Enter a name for your new recipe:", defaultName);
    if (entered === null) return;
    const finalName = entered.trim() || defaultName;
    const newId = 'recipe_' + Date.now();
    savedRecipes[newId] = {
        name: finalName,
        prep: "",
        portions: 1,
        batchMult: 1,
        items: []
    };
    saveToMemory();
    document.getElementById('cookbook-modal').style.display = 'flex';
    openRecipeDetail(newId);
    triggerActionCue(`Created "${finalName}" — Add Ingredients Below!`, "🍳");
}

function updateRecipeTitle(recipeId, newTitle) {
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;
    const cleaned = (newTitle || '').trim();
    if (!cleaned) return;
    recipe.name = cleaned;
    const titleEl = document.getElementById('cookbook-modal-title');
    if (titleEl && activeCookbookRecipeId === recipeId) titleEl.textContent = cleaned;
    saveToMemory();
    triggerActionCue(`Renamed to "${cleaned}"`, "✎");
}

function setRecipeBatchMultiplier(recipeId, mult) {
    hapticTap(8);
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;
    recipe.batchMult = mult;
    saveToMemory();
    renderCookbook();
}

function updateRecipePortionsInline(recipeId, val) {
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;
    recipe.portions = Math.max(1, parseFloat(val) || 1);
    saveToMemory();
    renderCookbook();
}

function stepRecipeIngWeight(recipeId, idx, delta) {
    hapticTap(6);
    const recipe = savedRecipes[recipeId];
    if (!recipe || !recipe.items[idx]) return;
    const currentW = parseFloat(recipe.items[idx].weight) || 0;
    recipe.items[idx].weight = Math.max(1, Math.round((currentW + delta) * 10) / 10);
    saveToMemory();
    renderCookbook();
}

function updateRecipeIngWeight(recipeId, idx, newVal) {
    const recipe = savedRecipes[recipeId];
    if (!recipe || !recipe.items[idx]) return;
    const parsed = parseFloat(newVal);
    if (isNaN(parsed) || parsed <= 0) {
        removeRecipeIngredient(recipeId, idx);
        return;
    }
    recipe.items[idx].weight = Math.round(parsed * 10) / 10;
    saveToMemory();
    renderCookbook();
}

function removeRecipeIngredient(recipeId, idx) {
    hapticTap(10);
    const recipe = savedRecipes[recipeId];
    if (!recipe || !recipe.items[idx]) return;
    const removedFood = foodDatabase[recipe.items[idx].id];
    recipe.items.splice(idx, 1);
    saveToMemory();
    renderCookbook();
    if (removedFood) {
        triggerActionCue(`Removed ${removedFood.name.split(' (')[0]} from Recipe`, "🗑️");
    }
}

function openPantryForRecipe(recipeId) {
    hapticTap(10);
    closeCookbookModal();
    openPantry('all', recipeId);
}

function deleteCookbookRecipe(id) {
    if (!confirm("Delete this recipe from your Cookbook?")) return;
    delete savedRecipes[id];
    activeCookbookRecipeId = null;
    saveToMemory();
    renderCookbook();
}

function formatRecipeInstructions(type) {
    const ta = document.getElementById('recipe-detail-prep-editor');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const selected = val.substring(start, end);

    let insert = '';
    if (type === 'bold') insert = `**${selected || 'Bold Text'}**`;
    else if (type === 'italic') insert = `*${selected || 'Italic Text'}*`;
    else if (type === 'bullet') insert = `\n• ${selected || 'Step detail'}`;
    else if (type === 'step') insert = `\n1. ${selected || 'Cooking step'}`;
    else if (type === 'divider') insert = `\n───────────────\n`;

    ta.value = val.substring(0, start) + insert + val.substring(end);
    ta.focus();
    if (activeCookbookRecipeId && savedRecipes[activeCookbookRecipeId]) {
        savedRecipes[activeCookbookRecipeId].prep = ta.value;
        saveToMemory();
    }
}

function saveRecipeInstructionsLive(val) {
    if (activeCookbookRecipeId && savedRecipes[activeCookbookRecipeId]) {
        savedRecipes[activeCookbookRecipeId].prep = val;
        saveToMemory();
    }
}

function renderCookbook() {
    const body = document.getElementById('cookbook-body');
    const titleEl = document.getElementById('cookbook-modal-title');
    const newBtn = document.getElementById('new-blank-recipe-btn');
    body.innerHTML = '';

    if (activeCookbookRecipeId && savedRecipes[activeCookbookRecipeId]) {
        const recipe = savedRecipes[activeCookbookRecipeId];
        if (!recipe.portions || recipe.portions < 1) recipe.portions = 1;
        if (!recipe.batchMult) recipe.batchMult = 1;
        sortRecipeItemsByCulinaryOrder(recipe);

        if (titleEl) titleEl.textContent = recipe.name;
        if (newBtn) newBtn.style.display = 'none';

        let totCals = 0, totPro = 0, totNetCarb = 0, totFib = 0, totFat = 0, totWeighted = 0;
        let itemsHtml = '';

        if (recipe.items.length === 0) {
            itemsHtml = `<li class="empty-state" style="margin:0.8rem 0;">No ingredients in this recipe yet.<br>Tap "+ Add Ingredients from Pantry" below to build your recipe.</li>`;
        } else {
            recipe.items.forEach((it, idx) => {
                const f = foodDatabase[it.id];
                if (!f) return;
                const r = it.weight / 100;
                const itemCals = f.calories * r;
                totCals += itemCals;
                totPro += f.protein * r;
                totNetCarb += f.netCarbs * r;
                totFib += f.fiber * r;
                totFat += f.fat * r;
                totWeighted += f.healthScore * itemCals;

                const emj = f.emoji.startsWith('http') ? '📸' : f.emoji;
                const scaledGrams = Math.round(it.weight * recipe.batchMult * 10) / 10;
                const oz = (scaledGrams / 28.35).toFixed(2);
                const batchNote = recipe.batchMult > 1 ? ` <span style="color:var(--text-fib);">(${scaledGrams}g at ${recipe.batchMult}x)</span>` : '';

                itemsHtml += `
                    <li class="recipe-ing-edit-item">
                        <div class="recipe-ing-name-wrap">
                            <span>${emj}</span>
                            <div>
                                <div>${f.name}${batchNote}</div>
                                <div style="font-family:var(--font-mono); font-size:0.7rem; font-weight:700; color:var(--panel-text-muted);">
                                    ${Math.round(itemCals)} kcal • ${(f.protein * r).toFixed(1)}g P • ${(f.netCarbs * r).toFixed(1)}g NC • ${(f.fiber * r).toFixed(1)}g Fib • ${(f.fat * r).toFixed(1)}g Fat
                                </div>
                            </div>
                        </div>
                        <div class="recipe-ing-controls">
                            <button type="button" class="step-wt-btn" onclick="stepRecipeIngWeight('${activeCookbookRecipeId}', ${idx}, -10)">−10g</button>
                            <input type="number" class="recipe-gram-input" value="${it.weight}" min="1" step="any" title="Click to type exact grams (e.g. 17)" onchange="updateRecipeIngWeight('${activeCookbookRecipeId}', ${idx}, this.value)">
                            <span style="font-size:0.78rem; font-family:var(--font-mono); font-weight:900;">g</span>
                            <button type="button" class="step-wt-btn" onclick="stepRecipeIngWeight('${activeCookbookRecipeId}', ${idx}, 10)">+10g</button>
                            <span class="recipe-oz-readout">(${oz} oz)</span>
                            <button type="button" class="unit-btn" title="View Ingredient Nutrition Label" onclick="openFDAModal('${f.id}', ${it.weight}, 'g')">ⓘ</button>
                            <button type="button" class="delete-ing-pill" onclick="removeRecipeIngredient('${activeCookbookRecipeId}', ${idx})">🗑️ Delete</button>
                        </div>
                    </li>
                `;
            });
        }

        const portions = Math.max(1, parseFloat(recipe.portions) || 1);
        const calsPerPortion = Math.round(totCals / portions);
        const avgScore = totCals > 0 ? Math.round((totWeighted / totCals) * 10) : 100;
        const safeTitleVal = (recipe.name || '').replace(/"/g, '&quot;');

        body.innerHTML = `
            <div class="recipe-detail-box">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                    <button type="button" class="unit-btn" style="padding:0.45rem 0.85rem; font-size:0.76rem;" onclick="backToCookbookList()">← Back to All Recipes</button>
                    <div style="display:flex; gap:0.45rem; align-items:center;">
                        <span class="food-score ${getScoreClass(avgScore / 10)}">${calsPerPortion} kcal/portion • Quality ${avgScore}%</span>
                        <button type="button" class="delete-ing-pill" onclick="deleteCookbookRecipe('${activeCookbookRecipeId}')">🗑️ Delete Recipe</button>
                    </div>
                </div>

                <div>
                    <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:800; color:var(--panel-text-muted); text-transform:uppercase; letter-spacing:1.2px; margin-bottom:0.35rem;">Recipe Name (Click to Rename)</div>
                    <input type="text" class="recipe-title-edit-input" value="${safeTitleVal}" onchange="updateRecipeTitle('${activeCookbookRecipeId}', this.value)">
                </div>

                <div class="batch-scaler-bar">
                    <div style="display:flex; align-items:center; gap:0.45rem;">
                        <span style="font-family:var(--font-mono); font-size:0.74rem; font-weight:900; text-transform:uppercase;">🍽️ Recipe Yield (Portions):</span>
                        <input type="number" class="recipe-gram-input" style="width:58px;" value="${portions}" min="1" step="1" onchange="updateRecipePortionsInline('${activeCookbookRecipeId}', this.value)">
                    </div>
                    <div class="batch-pill-group">
                        <span style="font-family:var(--font-mono); font-size:0.72rem; font-weight:800; color:var(--panel-text-muted);">Batch Scale (PDF/Prep):</span>
                        <button type="button" class="batch-pill ${recipe.batchMult === 1 ? 'active' : ''}" onclick="setRecipeBatchMultiplier('${activeCookbookRecipeId}', 1)">1x</button>
                        <button type="button" class="batch-pill ${recipe.batchMult === 2 ? 'active' : ''}" onclick="setRecipeBatchMultiplier('${activeCookbookRecipeId}', 2)">2x</button>
                        <button type="button" class="batch-pill ${recipe.batchMult === 4 ? 'active' : ''}" onclick="setRecipeBatchMultiplier('${activeCookbookRecipeId}', 4)">4x</button>
                    </div>
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.45rem;">
                        <span style="font-size:0.74rem; font-family:var(--font-mono); font-weight:800; color:var(--text-pro); text-transform:uppercase; letter-spacing:1.2px;">Editable Ingredients (Culinary Prep Order)</span>
                        <button type="button" class="unit-btn" style="border-color:var(--glow-fib); color:var(--text-fib); padding:0.38rem 0.75rem; font-size:0.74rem;" onclick="openPantryForRecipe('${activeCookbookRecipeId}')">+ Add Ingredients from Pantry</button>
                    </div>
                    <ul class="recipe-ing-edit-list">${itemsHtml}</ul>
                </div>

                <div>
                    <div style="font-size:0.74rem; font-family:var(--font-mono); font-weight:800; color:var(--text-pro); text-transform:uppercase; letter-spacing:1.2px; margin-bottom:0.45rem;">Preparation &amp; Cooking Instructions</div>
                    <div class="fmt-toolbar">
                        <button type="button" class="fmt-btn" onclick="formatRecipeInstructions('bold')"><strong>B</strong> Bold</button>
                        <button type="button" class="fmt-btn" onclick="formatRecipeInstructions('italic')"><em>I</em> Italic</button>
                        <button type="button" class="fmt-btn" onclick="formatRecipeInstructions('bullet')">• Bullet</button>
                        <button type="button" class="fmt-btn" onclick="formatRecipeInstructions('step')">1. Step</button>
                        <button type="button" class="fmt-btn" onclick="formatRecipeInstructions('divider')">— Divider</button>
                    </div>
                    <textarea id="recipe-detail-prep-editor" class="recipe-instructions-editor" placeholder="Type cooking steps, temperatures, and seasoning notes here (auto-saves)..." oninput="saveRecipeInstructionsLive(this.value)">${recipe.prep || ''}</textarea>
                </div>

                <button type="button" class="nutrition-facts-hero-btn" onclick="openRecipeFDAModal('${activeCookbookRecipeId}')">
                    <span>📊</span> View Interactive Nutrition Facts Label (1 Portion)
                </button>

                <div class="recipe-export-btn-row">
                    <button type="button" class="export-pdf-btn" onclick="downloadRecipePDF('${activeCookbookRecipeId}')">
                        <span>📥</span> Download Recipe PDF
                    </button>
                    <button type="button" class="export-print-btn" onclick="printRecipeSheet('${activeCookbookRecipeId}')">
                        <span>🖨️</span> Print Recipe Sheet
                    </button>
                </div>

                <button type="button" class="primary-btn" onclick="loadRecipe('${activeCookbookRecipeId}')">
                    🍳 Stage 1 Portion to ${currentMealSlot}
                </button>
            </div>
        `;
        return;
    }

    if (titleEl) titleEl.textContent = "The Cookbook";
    if (newBtn) newBtn.style.display = 'inline-block';

    const recipeEntries = Object.entries(savedRecipes);
    if (recipeEntries.length === 0) {
        body.innerHTML = '<p class="empty-state">Your cookbook is empty.<br>Tap "+ New Recipe" above to build one from scratch, or tap "+ Save Recipe" inside Today\'s Meals.</p>';
        return;
    }

    recipeEntries.forEach(([id, recipe]) => {
        sortRecipeItemsByCulinaryOrder(recipe);
        let totalCals = 0, weightedScore = 0;
        const ingNames = [];
        recipe.items.forEach(it => {
            const f = foodDatabase[it.id];
            if (!f) return;
            ingNames.push(f.name);
            const c = f.calories * (it.weight / 100);
            totalCals += c;
            weightedScore += f.healthScore * c;
        });
        const commaList = ingNames.length > 0 ? ingNames.join(', ') : 'No ingredients added yet — tap to edit.';
        const portions = Math.max(1, parseFloat(recipe.portions) || 1);
        const calsPerPortion = Math.round(totalCals / portions);
        const avgScore = totalCals > 0 ? Math.round((weightedScore / totalCals) * 10) : 100;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cookbook-recipe-btn';
        btn.onclick = () => openRecipeDetail(id);
        btn.innerHTML = `
            <div class="cookbook-recipe-top">
                <span class="cookbook-recipe-title">${recipe.name}</span>
                <span class="food-score ${getScoreClass(avgScore / 10)}">${calsPerPortion} kcal • Quality ${avgScore}%</span>
            </div>
            <div class="cookbook-recipe-comma-list">${commaList}</div>
        `;
        body.appendChild(btn);
    });
}

// ============================================================================
// BUILD PRINTABLE / PDF RECIPE SHEET WITH EMBEDDED FDA NUTRITION FACTS LABEL
// ============================================================================

function formatPrepTextToHTML(rawPrep) {
    if (!rawPrep || !rawPrep.trim()) {
        return '<p style="color:#475569; font-style:italic;">No preparation instructions recorded.</p>';
    }
    const escaped = rawPrep
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
    return escaped.split('\n').map(line => `<div style="margin-bottom:4px;">${line || '&nbsp;'}</div>`).join('');
}

function buildRecipeExportHTML(recipeId) {
    const recipe = savedRecipes[recipeId];
    if (!recipe) return '';
    sortRecipeItemsByCulinaryOrder(recipe);

    const portions = Math.max(1, parseFloat(recipe.portions) || 1);
    const batchMult = Math.max(1, parseFloat(recipe.batchMult) || 1);
    const totalPortionsScaled = portions * batchMult;

    let totWeight = 0, totCals = 0, totFat = 0, totSatFat = 0, totChol = 0, totSod = 0;
    let totNetCarb = 0, totFib = 0, totSug = 0, totPro = 0, totWeighted = 0;
    const combinedMicros = {};

    const ingredientRowsHtml = recipe.items.map(it => {
        const f = foodDatabase[it.id];
        if (!f) return '';
        const r = it.weight / 100;
        const cals = f.calories * r;
        totWeight += it.weight; totCals += cals;
        totFat += f.fat * r; totSatFat += (f.satFat || 0) * r;
        totChol += (f.chol || 0) * r; totSod += (f.sodium || 0) * r;
        totNetCarb += f.netCarbs * r; totFib += f.fiber * r;
        totSug += (f.sugar || 0) * r; totPro += f.protein * r;
        totWeighted += f.healthScore * cals;

        if (f.micros) {
            Object.entries(f.micros).forEach(([k, v]) => {
                if (!combinedMicros[k]) combinedMicros[k] = `${v} (${f.name.split(' (')[0]})`;
            });
        }

        const scaledGrams = Math.round(it.weight * batchMult * 10) / 10;
        const scaledOz = (scaledGrams / 28.35).toFixed(2);
        const scaledCals = Math.round(cals * batchMult);
        const emj = f.emoji.startsWith('http') ? '•' : f.emoji;

        return `
            <li style="padding:6px 0; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:13.5px; color:#0f172a;">
                <span><strong>${emj} ${f.name}</strong></span>
                <span style="font-family:monospace; font-weight:700;">${scaledGrams}g (${scaledOz} oz) • ${scaledCals} kcal</span>
            </li>
        `;
    }).join('');

    const pWeight = Math.round(totWeight / portions);
    const cals = Math.round(totCals / portions);
    const fat = (totFat / portions).toFixed(1);
    const satFat = (totSatFat / portions).toFixed(1);
    const unSatFat = Math.max(0, (totFat - totSatFat) / portions).toFixed(1);
    const chol = Math.round(totChol / portions);
    const sod = Math.round(totSod / portions);
    const totalCarb = ((totNetCarb + totFib) / portions).toFixed(1);
    const fiber = (totFib / portions).toFixed(1);
    const netCarb = (totNetCarb / portions).toFixed(1);
    const sugar = (totSug / portions).toFixed(1);
    const pro = (totPro / portions).toFixed(1);
    const avgScore = totCals > 0 ? Math.round((totWeighted / totCals) * 10) : 100;

    const fatDV = Math.round(((totFat / portions) / 78) * 100);
    const satFatDV = Math.round(((totSatFat / portions) / 20) * 100);
    const cholDV = Math.round(((totChol / portions) / 300) * 100);
    const sodDV = Math.round(((totSod / portions) / 2300) * 100);
    const carbDV = Math.round((((totNetCarb + totFib) / portions) / 275) * 100);
    const fibDV = Math.round(((totFib / portions) / 28) * 100);
    const proDV = Math.round(((totPro / portions) / 50) * 100);

    const microRowsHtml = Object.keys(combinedMicros).slice(0, 6).map(k =>
        `<div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #cbd5e1; font-size:12px; color:#000;"><span><strong>${k}</strong></span><span>${combinedMicros[k]}</span></div>`
    ).join('');

    return `
        <div class="pdf-recipe-sheet">
            <div style="border-bottom:3px solid #0f172a; padding-bottom:10px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:8px;">
                <div>
                    <div style="font-size:11px; font-family:monospace; font-weight:800; text-transform:uppercase; color:#0284c7; letter-spacing:1.5px;">Journey of Self • Culinary Prep &amp; Nutrition Sheet</div>
                    <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:2px 0 0 0;">${recipe.name}</h1>
                </div>
                <div style="text-align:right; font-family:monospace; font-size:12px; font-weight:800; color:#0f172a;">
                    <div>Quality Score: ${avgScore}%</div>
                    <div>Batch Yield: ${totalPortionsScaled} Portion${totalPortionsScaled > 1 ? 's' : ''} (${batchMult}x Scale)</div>
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <h3 style="font-size:13px; font-family:monospace; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#0284c7; margin-bottom:6px;">
                    Ingredients (${batchMult}x Batch — Makes ${totalPortionsScaled} Portion${totalPortionsScaled > 1 ? 's' : ''})
                </h3>
                <ul style="list-style:none; padding:0; margin:0; border-top:1px solid #e2e8f0;">
                    ${ingredientRowsHtml || '<li style="padding:8px 0; color:#64748b;">No ingredients listed.</li>'}
                </ul>
            </div>

            <div style="margin-bottom:20px;">
                <h3 style="font-size:13px; font-family:monospace; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#0284c7; margin-bottom:6px;">
                    Preparation &amp; Cooking Instructions
                </h3>
                <div style="padding:12px 14px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; font-size:13.5px; color:#0f172a; line-height:1.55;">
                    ${formatPrepTextToHTML(recipe.prep)}
                </div>
            </div>

            <div style="border:3px solid #000000; padding:12px 14px; background:#ffffff; color:#000000; max-width:400px; margin:0 auto;">
                <div style="font-size:24px; font-weight:900; text-transform:uppercase; border-bottom:7px solid #000; padding-bottom:4px; line-height:1;">Nutrition Facts</div>
                <div style="font-size:12.5px; font-weight:800; padding:4px 0; border-bottom:1px solid #000;">
                    Serving Size: 1 Single Portion (${pWeight}g) • Servings Per Base Recipe: ${portions}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:4px solid #000; padding:4px 0;">
                    <span style="font-size:14px; font-weight:900;">Calories (Per 1 Portion)</span>
                    <span style="font-size:28px; font-weight:900; line-height:1;">${cals}</span>
                </div>
                <div style="text-align:right; font-size:10.5px; font-weight:900; border-bottom:1px solid #000; padding:2px 0;">% Daily Value*</div>
                <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #cbd5e1; font-size:12.5px; font-weight:800;"><span>Total Fat ${fat}g</span><span>${fatDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0 3px 14px; border-bottom:1px solid #cbd5e1; font-size:12px;"><span>Saturated Fat ${satFat}g</span><span>${satFatDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0 3px 14px; border-bottom:1px solid #cbd5e1; font-size:12px;"><span>Unsaturated Fat ${unSatFat}g</span><span></span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #cbd5e1; font-size:12.5px; font-weight:800;"><span>Cholesterol ${chol}mg</span><span>${cholDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #cbd5e1; font-size:12.5px; font-weight:800;"><span>Sodium ${sod}mg</span><span>${sodDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #cbd5e1; font-size:12.5px; font-weight:800;"><span>Total Carbohydrate ${totalCarb}g</span><span>${carbDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0 3px 14px; border-bottom:1px solid #cbd5e1; font-size:12px;"><span>Dietary Fiber ${fiber}g</span><span>${fibDV}%</span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0 3px 14px; border-bottom:1px solid #cbd5e1; font-size:12px;"><span>Total Sugars ${sugar}g</span><span></span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0 3px 14px; border-bottom:1px solid #cbd5e1; font-size:12.5px; font-weight:800; color:#e11d48;"><span>Net Carbs ${netCarb}g</span><span></span></div>
                <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:4px solid #000; font-size:12.5px; font-weight:800;"><span>Protein ${pro}g</span><span>${proDV}%</span></div>
                ${microRowsHtml}
            </div>
        </div>
    `;
}

function downloadRecipePDF(recipeId) {
    hapticTap(12);
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;

    const container = document.getElementById('recipe-export-container');
    if (!container) return;
    container.innerHTML = buildRecipeExportHTML(recipeId);

    const safeFileName = (recipe.name || 'recipe')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'recipe';

    if (typeof window.html2pdf === 'undefined') {
        printRecipeSheet(recipeId);
        return;
    }

    container.style.display = 'block';
    triggerActionCue(`Generating "${safeFileName}.pdf" for Downloads...`, "📥");

    const opt = {
        margin:       [0.35, 0.35, 0.35, 0.35],
        filename:     `${safeFileName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(container).save().then(() => {
        container.style.display = 'none';
        triggerActionCue(`Downloaded "${safeFileName}.pdf"!`, "✅");
    }).catch(() => {
        container.style.display = 'none';
        printRecipeSheet(recipeId);
    });
}

function printRecipeSheet(recipeId) {
    hapticTap(10);
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;
    const container = document.getElementById('recipe-export-container');
    if (!container) return;
    container.innerHTML = buildRecipeExportHTML(recipeId);
    window.print();
}

function openRecipeFDAModal(recipeId, newPortions = null) {
    const recipe = savedRecipes[recipeId];
    if (!recipe) return;
    if (newPortions !== null) {
        recipe.portions = Math.max(1, parseFloat(newPortions) || 1);
        saveToMemory();
        renderCookbook();
    }
    const portions = Math.max(1, parseFloat(recipe.portions) || 1);

    let totWeight = 0, totCals = 0, totFat = 0, totSatFat = 0, totChol = 0, totSod = 0;
    let totNetCarb = 0, totFib = 0, totSug = 0, totPro = 0, totWeighted = 0;
    const combinedMicros = {};

    recipe.items.forEach(it => {
        const f = foodDatabase[it.id];
        if (!f) return;
        const r = it.weight / 100;
        const cals = f.calories * r;
        totWeight += it.weight; totCals += cals;
        totFat += f.fat * r; totSatFat += (f.satFat || 0) * r;
        totChol += (f.chol || 0) * r; totSod += (f.sodium || 0) * r;
        totNetCarb += f.netCarbs * r; totFib += f.fiber * r;
        totSug += (f.sugar || 0) * r; totPro += f.protein * r;
        totWeighted += f.healthScore * cals;
        if (f.micros) {
            Object.entries(f.micros).forEach(([k, v]) => {
                if (!combinedMicros[k]) combinedMicros[k] = `${v} (${f.name.split(' (')[0]})`;
            });
        }
    });

    const pWeight = Math.round(totWeight / portions);
    const cals = Math.round(totCals / portions);
    const fat = (totFat / portions).toFixed(1);
    const satFat = (totSatFat / portions).toFixed(1);
    const unSatFat = Math.max(0, (totFat - totSatFat) / portions).toFixed(1);
    const chol = Math.round(totChol / portions);
    const sod = Math.round(totSod / portions);
    const totalCarb = ((totNetCarb + totFib) / portions).toFixed(1);
    const fiber = (totFib / portions).toFixed(1);
    const netCarb = (totNetCarb / portions).toFixed(1);
    const sugar = (totSug / portions).toFixed(1);
    const pro = (totPro / portions).toFixed(1);
    const avgScore = totCals > 0 ? (totWeighted / totCals).toFixed(1) : '10.0';

    const fatDV = Math.round(((totFat / portions) / 78) * 100);
    const satFatDV = Math.round(((totSatFat / portions) / 20) * 100);
    const cholDV = Math.round(((totChol / portions) / 300) * 100);
    const sodDV = Math.round(((totSod / portions) / 2300) * 100);
    const carbDV = Math.round((((totNetCarb + totFib) / portions) / 275) * 100);
    const fibDV = Math.round(((totFib / portions) / 28) * 100);
    const proDV = Math.round(((totPro / portions) / 50) * 100);

    let microRows = Object.keys(combinedMicros).slice(0, 8).map(k =>
        `<div class="fda-row"><span><strong>${k}</strong></span><span>${combinedMicros[k]}</span></div>`
    ).join('') || `<div class="fda-row"><span><strong>Ingredients</strong></span><span>${recipe.items.length} Whole Foods</span></div>`;

    const modal = document.getElementById('fda-modal');
    const content = document.getElementById('fda-modal-content');
    content.innerHTML = `
        <div class="fda-header">
            <button onclick="closeFDAModal()" style="position:absolute; right:0.85rem; top:0.85rem; background:#e2e8f0; border:1.5px solid #000; width:32px; height:32px; border-radius:50%; font-weight:900; color:#000;">&times;</button>
            <div class="fda-title">Nutrition Facts</div>
            <div class="fda-food-subtitle">🍳 ${recipe.name} • Score ${avgScore}/10</div>
            <div class="fda-serving-row">
                <span>Servings in Recipe:</span>
                <div style="display:flex; align-items:center; gap:0.35rem;">
                    <input type="number" class="fda-weight-input" value="${portions}" min="1" step="1" onchange="openRecipeFDAModal('${recipeId}', this.value)">
                    <span style="font-size:0.78rem; font-family:var(--font-mono);">Portions</span>
                </div>
            </div>
            <div style="font-size:0.75rem; font-family:var(--font-mono); font-weight:800; color:#0f172a; margin-top:0.3rem;">Serving Size: 1 Portion (${pWeight}g)</div>
        </div>
        <div class="fda-body">
            <div class="fda-cals-row"><span>Calories <span style="font-size:0.75rem; font-weight:700;">(Per 1 Portion)</span></span><span>${cals}</span></div>
            <div class="fda-dv-header">% Daily Value*</div>
            <div class="fda-row bold"><span>Total Fat ${fat}g</span><span>${fatDV}%</span></div>
            <div class="fda-row indent"><span>Saturated Fat ${satFat}g</span><span>${satFatDV}%</span></div>
            <div class="fda-row indent"><span>Unsaturated Fat ${unSatFat}g</span><span></span></div>
            <div class="fda-row bold"><span>Cholesterol ${chol}mg</span><span>${cholDV}%</span></div>
            <div class="fda-row bold"><span>Sodium ${sod}mg</span><span>${sodDV}%</span></div>
            <div class="fda-row bold"><span>Total Carbohydrate ${totalCarb}g</span><span>${carbDV}%</span></div>
            <div class="fda-row indent"><span>Dietary Fiber ${fiber}g</span><span>${fibDV}%</span></div>
            <div class="fda-row indent"><span>Total Sugars ${sugar}g</span><span></span></div>
            <div class="fda-row indent bold" style="color:#e11d48;"><span>Net Carbs ${netCarb}g</span><span></span></div>
            <div class="fda-row bold thick-border"><span>Protein ${pro}g</span><span>${proDV}%</span></div>
            <div style="font-size:0.75rem; font-weight:900; text-transform:uppercase; padding:0.4rem 0 0.2rem 0; color:#000;">Key Micronutrients &amp; Highlights</div>
            ${microRows}
            <div style="display:flex; gap:0.5rem; margin-top:1.1rem; flex-wrap:wrap;">
                <button type="button" onclick="closeFDAModal()" style="flex:1; padding:0.65rem; border-radius:8px; border:2px solid #000; background:#f1f5f9; color:#000; font-weight:800; font-size:0.76rem; text-transform:uppercase;">← Back</button>
                <button type="button" onclick="closeFDAModal(); downloadRecipePDF('${recipeId}');" style="flex:1; padding:0.65rem; border-radius:8px; border:2px solid #0284c7; background:#0284c7; color:#fff; font-weight:800; font-size:0.76rem; text-transform:uppercase;">📥 PDF</button>
                <button type="button" onclick="closeFDAModal(); loadRecipe('${recipeId}');" style="flex:1; padding:0.65rem; border-radius:8px; border:2px solid #000; background:#000; color:#fff; font-weight:800; font-size:0.76rem; text-transform:uppercase;">+ Stage 1 Portion</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function loadRecipe(id) {
    const recipe = savedRecipes[id];
    if (!recipe) return;
    const portions = Math.max(1, parseFloat(recipe.portions) || 1);
    recipe.items.forEach(it => {
        const portionWeight = Math.max(1, Math.round(it.weight / portions));
        const existing = sandboxMeal.find(s => s.id === it.id);
        if (existing) existing.weight += portionWeight;
        else sandboxMeal.push({ id: it.id, weight: portionWeight, locked: false });
    });
    sortSandboxByCulinaryOrder();
    saveToMemory(); updateSandboxUI(); closeCookbookModal();
    triggerActionCue(`Staged "${recipe.name}"!`, "🍳");
}

// ============================================================================
// ADD INGREDIENT TO RECIPE FROM FDA NUTRITION LABEL OR PANTRY
// ============================================================================

function handleAddFromFDAToRecipe(foodId, gramWeight) {
    hapticTap(10);
    const targetId = pantryRecipeTargetId || (document.getElementById('cookbook-modal').style.display === 'flex' ? activeCookbookRecipeId : null);
    if (targetId && savedRecipes[targetId]) {
        addFoodToSpecificRecipe(targetId, foodId, gramWeight);
        return;
    }

    const body = document.getElementById('recipe-picker-body');
    const f = foodDatabase[foodId];
    if (!body || !f) return;

    const recipeEntries = Object.entries(savedRecipes);
    let existingListHtml = '';
    if (recipeEntries.length === 0) {
        existingListHtml = `<p class="empty-state" style="margin:0.5rem 0;">No saved recipes yet. Create a new recipe below!</p>`;
    } else {
        existingListHtml = recipeEntries.map(([rId, rec]) => `
            <button type="button" class="secondary-btn" style="text-align:left; display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem;" onclick="addFoodToSpecificRecipe('${rId}', '${foodId}', ${gramWeight})">
                <span>🍳 <strong>${rec.name}</strong></span>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-fib);">+ Add ${gramWeight}g →</span>
            </button>
        `).join('');
    }

    body.innerHTML = `
        <div style="font-size:0.86rem; font-weight:800; color:var(--panel-text-main);">
            Adding <strong>${gramWeight}g of ${f.emoji.startsWith('http') ? '' : f.emoji} ${f.name}</strong> to Cookbook:
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; width:100%;">
            ${existingListHtml}
        </div>
        <div style="border-top:1px solid var(--border-light); padding-top:0.8rem; width:100%; display:flex; flex-direction:column; gap:0.5rem;">
            <label style="font-size:0.72rem; font-family:var(--font-mono); font-weight:800; color:var(--text-pro); text-transform:uppercase;">Or Start a New Recipe With This Ingredient:</label>
            <div style="display:flex; gap:0.45rem; width:100%;">
                <input type="text" id="picker-new-recipe-name" placeholder="New recipe name..." style="flex:1; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid var(--border-light); background:var(--input-bg); color:var(--panel-text-main); font-weight:700;">
                <button type="button" class="primary-btn" style="width:auto; padding:0.65rem 1rem;" onclick="createNewRecipeWithFood('${foodId}', ${gramWeight})">+ Create</button>
            </div>
        </div>
    `;
    document.getElementById('recipe-picker-modal').style.display = 'flex';
}

function closeRecipePickerModal() {
    document.getElementById('recipe-picker-modal').style.display = 'none';
}

function addFoodToSpecificRecipe(recipeId, foodId, gramWeight) {
    const recipe = savedRecipes[recipeId];
    const food = foodDatabase[foodId];
    if (!recipe || !food) return;

    const existing = recipe.items.find(i => i.id === foodId);
    if (existing) existing.weight = Math.round((existing.weight + gramWeight) * 10) / 10;
    else recipe.items.push({ id: foodId, weight: gramWeight });

    sortRecipeItemsByCulinaryOrder(recipe);
    pantryRecipeTargetId = null;
    pantrySelections.clear();
    saveToMemory();

    closeRecipePickerModal();
    closeFDAModal();
    closePantry();

    activeCookbookRecipeId = recipeId;
    renderCookbook();
    document.getElementById('cookbook-modal').style.display = 'flex';
    triggerActionCue(`Added ${gramWeight}g ${food.name.split(' (')[0]} to "${recipe.name}"!`, "🍳");
}

function createNewRecipeWithFood(foodId, gramWeight) {
    const inp = document.getElementById('picker-new-recipe-name');
    const name = (inp && inp.value.trim()) ? inp.value.trim() : "New Custom Recipe";
    const newId = 'recipe_' + Date.now();
    savedRecipes[newId] = {
        name,
        prep: "",
        portions: 1,
        batchMult: 1,
        items: [{ id: foodId, weight: gramWeight }]
    };
    pantryRecipeTargetId = null;
    pantrySelections.clear();
    saveToMemory();

    closeRecipePickerModal();
    closeFDAModal();
    closePantry();

    activeCookbookRecipeId = newId;
    renderCookbook();
    document.getElementById('cookbook-modal').style.display = 'flex';
    triggerActionCue(`Created "${name}" with ${gramWeight}g ${foodDatabase[foodId].name.split(' (')[0]}!`, "🍳");
}

// PERSONAL FOOD CREATOR & PANTRY
function openCustomFoodModal(editFoodId = null) {
    closePantry(); closeFDAModal(); initEmojiPicker();
    if (editFoodId && foodDatabase[editFoodId]) {
        const f = foodDatabase[editFoodId];
        document.getElementById('cf-modal-title').textContent = "Edit Personal Pantry Food";
        document.getElementById('cf-edit-id').value = f.id;
        document.getElementById('cf-name').value = f.name;
        document.getElementById('cf-emoji').value = f.emoji;
        document.getElementById('cf-category').value = f.category;
        document.getElementById('cf-weight').value = f.defaultWeight;
        document.getElementById('cf-cals').value = f.calories;
        document.getElementById('cf-score').value = f.healthScore;
        document.getElementById('cf-carbs').value = f.netCarbs;
        document.getElementById('cf-fiber').value = f.fiber;
        document.getElementById('cf-pro').value = f.protein;
        document.getElementById('cf-fat').value = f.fat;
        document.getElementById('cf-satfat').value = f.satFat || 0;
        document.getElementById('cf-sugar').value = f.sugar || 0;
        document.getElementById('cf-sodium').value = f.sodium || 0;
        document.getElementById('cf-chol').value = f.chol || 0;
        document.getElementById('cf-micros').value = f.micros ? Object.entries(f.micros).map(([k,v]) => `${k}: ${v}`).join(', ') : '';
    } else {
        document.getElementById('cf-modal-title').textContent = "Add Food to Personal Pantry";
        document.getElementById('cf-edit-id').value = "";
        document.getElementById('cf-name').value = "";
        document.getElementById('cf-emoji').value = "🥩";
        document.getElementById('cf-weight').value = 100;
        document.getElementById('cf-cals').value = 0;
        document.getElementById('cf-score').value = "";
        document.getElementById('cf-carbs').value = 0;
        document.getElementById('cf-fiber').value = 0;
        document.getElementById('cf-pro').value = 0;
        document.getElementById('cf-fat').value = 0;
        document.getElementById('cf-satfat').value = 0;
        document.getElementById('cf-sugar').value = 0;
        document.getElementById('cf-sodium').value = 0;
        document.getElementById('cf-chol').value = 0;
        document.getElementById('cf-micros').value = "";
    }
    document.getElementById('custom-food-modal').style.display = 'flex';
}
function closeCustomFoodModal() { document.getElementById('custom-food-modal').style.display = 'none'; }

function runDiagnosticsAndSave() {
    const editId = document.getElementById('cf-edit-id').value;
    const name = document.getElementById('cf-name').value.trim() || "Custom Food";
    const category = document.getElementById('cf-category').value;
    const emojiInput = document.getElementById('cf-emoji').value.trim() || "📦";
    const weight = parseFloat(document.getElementById('cf-weight').value) || 100;
    const cals = parseFloat(document.getElementById('cf-cals').value) || 0;
    const carbs = parseFloat(document.getElementById('cf-carbs').value) || 0;
    const fiber = parseFloat(document.getElementById('cf-fiber').value) || 0;
    const pro = parseFloat(document.getElementById('cf-pro').value) || 0;
    const fat = parseFloat(document.getElementById('cf-fat').value) || 0;
    const satFat = parseFloat(document.getElementById('cf-satfat').value) || 0;
    const sugar = parseFloat(document.getElementById('cf-sugar').value) || 0;
    const sodium = parseFloat(document.getElementById('cf-sodium').value) || 0;
    const chol = parseFloat(document.getElementById('cf-chol').value) || 0;
    const manualScore = parseInt(document.getElementById('cf-score').value);

    let finalScore = manualScore;
    if (!finalScore || finalScore < 1 || finalScore > 10) {
        let score = 6.0;
        score += Math.min(pro * 0.12, 2.5) + Math.min(fiber * 0.25, 2.5);
        score -= Math.min(sugar * 0.08, 3.0) + Math.min(satFat * 0.08, 1.5);
        if (category === 'Veggies' || category === 'Seafood & Shellfish' || category === 'Fruits & Berries') score += 1.5;
        finalScore = Math.max(1, Math.min(Math.round(score), 10));
    }

    const microObj = {};
    const microRaw = document.getElementById('cf-micros').value.trim();
    if (microRaw) {
        microRaw.split(',').forEach(pair => {
            const [k, v] = pair.split(':').map(s => s.trim());
            if (k) microObj[k] = v || "Present";
        });
    } else {
        microObj["Database"] = "Personal User Entry";
    }

    const id = editId || ('custom_' + Date.now());
    foodDatabase[id] = {
        id, name, emoji: emojiInput, category, defaultWeight: weight, healthScore: finalScore,
        affinity: foodDatabase[id] ? foodDatabase[id].affinity : 2,
        calories: cals, netCarbs: carbs, fiber, protein: pro, fat, satFat, sugar, sodium, chol,
        micros: microObj, isCustom: true
    };
    saveToMemory(); recalculateLoggedFromMeals(); updateSandboxUI(); closeCustomFoodModal(); openPantry('all');
    triggerActionCue(`Saved "${name}" to Pantry!`, "🔥");
}

function getVibeDots(affinity) {
    let dots = '';
    for (let i = 1; i <= 3; i++) dots += `<div class="vibe-dot ${affinity >= i ? 'active' : ''}"></div>`;
    return dots;
}
function getScoreClass(score) { return score >= 9 ? "score-high" : (score >= 5 ? "score-mid" : "score-low"); }

function setPantryViewMode(mode) {
    hapticTap(8);
    appSettings.pantryViewMode = mode;
    const btnIcons = document.getElementById('pantry-mode-icons');
    const btnList = document.getElementById('pantry-mode-list');
    if (btnIcons) btnIcons.classList.toggle('active', mode === 'icons');
    if (btnList) btnList.classList.toggle('active', mode === 'list');
    saveToMemory();
    renderPantry();
}

function openPantry(filterValue = 'all', forRecipeId = null) {
    pantryRecipeTargetId = forRecipeId;
    pantrySelections.clear();
    openPantryCategories.clear();
    const searchInput = document.getElementById('pantry-search');
    if (searchInput) searchInput.value = '';
    const toggleAllBtn = document.getElementById('toggle-all-cats-btn');
    if (toggleAllBtn) toggleAllBtn.textContent = 'Expand All';
    const mode = appSettings.pantryViewMode || 'list';
    const btnIcons = document.getElementById('pantry-mode-icons');
    const btnList = document.getElementById('pantry-mode-list');
    if (btnIcons) btnIcons.classList.toggle('active', mode === 'icons');
    if (btnList) btnList.classList.toggle('active', mode === 'list');

    const titleEl = document.getElementById('pantry-modal-title');
    const submitBtn = document.getElementById('pantry-submit-btn');
    if (pantryRecipeTargetId && savedRecipes[pantryRecipeTargetId]) {
        const rName = savedRecipes[pantryRecipeTargetId].name;
        if (titleEl) titleEl.textContent = `Pantry → ${rName}`;
        if (submitBtn) submitBtn.textContent = `🍳 Add Selected to "${rName}"`;
    } else {
        if (titleEl) titleEl.textContent = 'The Pantry';
        if (submitBtn) submitBtn.textContent = 'Add Selected to Staging';
    }

    setFilter(filterValue);
    document.getElementById('pantry-modal').style.display = 'flex';
}

function closePantry() {
    const searchInput = document.getElementById('pantry-search');
    if (searchInput) searchInput.value = '';
    document.getElementById('pantry-modal').style.display = 'none';
    if (pantryRecipeTargetId && savedRecipes[pantryRecipeTargetId]) {
        const returnId = pantryRecipeTargetId;
        pantryRecipeTargetId = null;
        activeCookbookRecipeId = returnId;
        renderCookbook();
        document.getElementById('cookbook-modal').style.display = 'flex';
    }
}

function setFilter(filterType) {
    currentFilter = filterType;
    document.querySelectorAll('.seg-filter-btn').forEach(btn => btn.classList.remove('active', 'rogue'));
    const activeBtn = document.querySelector(`.seg-filter-btn[onclick="setFilter('${filterType}')"]`);
    if (activeBtn) { activeBtn.classList.add('active'); if (filterType === 'rogue') activeBtn.classList.add('rogue'); }
    renderPantry();
}

function togglePantryCategory(catName, sectionEl) {
    const isOpen = sectionEl.classList.toggle('open');
    const iconEl = sectionEl.querySelector('.pantry-cat-toggle-icon');
    if (isOpen) { openPantryCategories.add(catName); if (iconEl) iconEl.textContent = '− HIDE'; }
    else { openPantryCategories.delete(catName); if (iconEl) iconEl.textContent = '+ EXPAND'; }
}

function toggleAllPantryCategories() {
    const allSections = document.querySelectorAll('.pantry-category');
    const btn = document.getElementById('toggle-all-cats-btn');
    const shouldExpand = openPantryCategories.size < allSections.length;
    openPantryCategories.clear();
    allSections.forEach(sec => {
        const catName = sec.getAttribute('data-cat');
        const iconEl = sec.querySelector('.pantry-cat-toggle-icon');
        if (shouldExpand) {
            sec.classList.add('open');
            if (catName) openPantryCategories.add(catName);
            if (iconEl) iconEl.textContent = '− HIDE';
        } else {
            sec.classList.remove('open');
            if (iconEl) iconEl.textContent = '+ EXPAND';
        }
    });
    if (btn) btn.textContent = shouldExpand ? 'Collapse All' : 'Expand All';
}

function renderPantry() {
    const body = document.getElementById('pantry-body');
    body.innerHTML = '';
    const categories = {};
    const searchInput = document.getElementById('pantry-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const isListMode = (appSettings.pantryViewMode || 'list') === 'list';

    Object.values(foodDatabase).forEach(food => {
        let include = currentFilter === 'all' ||
            (currentFilter === 'vitality' && food.healthScore >= 9) ||
            (currentFilter === 'nourish' && food.healthScore >= 7 && food.healthScore <= 8) ||
            (currentFilter === 'balance' && food.healthScore >= 5 && food.healthScore <= 6) ||
            (currentFilter === 'drift' && food.healthScore >= 3 && food.healthScore <= 4) ||
            (currentFilter === 'rogue' && food.healthScore <= 2);

        if (include && searchTerm && !food.name.toLowerCase().includes(searchTerm) && !food.category.toLowerCase().includes(searchTerm)) include = false;
        if (include) {
            if (!categories[food.category]) categories[food.category] = [];
            categories[food.category].push(food);
        }
    });

    if (Object.keys(categories).length === 0) {
        body.innerHTML = '<p class="empty-state">No foods match your filter.<br>Tap "+ New Food" above to add it to your personal pantry.</p>';
        return;
    }

    const sortedCats = [
        ...CATEGORY_ORDER.filter(c => categories[c]),
        ...Object.keys(categories).filter(c => !CATEGORY_ORDER.includes(c))
    ];

    sortedCats.forEach(cat => {
        const isExpanded = searchTerm.length > 0 || openPantryCategories.has(cat);
        const catSection = document.createElement('div');
        catSection.className = `pantry-category ${isExpanded ? 'open' : ''}`;
        catSection.setAttribute('data-cat', cat);

        const headerBtn = document.createElement('button');
        headerBtn.type = 'button';
        headerBtn.className = 'pantry-cat-header';
        headerBtn.onclick = () => togglePantryCategory(cat, catSection);
        headerBtn.innerHTML = `
            <div class="pantry-cat-title">${cat}<span class="pantry-cat-count">${categories[cat].length}</span></div>
            <span class="pantry-cat-toggle-icon">${isExpanded ? '− HIDE' : '+ EXPAND'}</span>
        `;
        catSection.appendChild(headerBtn);

        if (isListMode) {
            const listWrap = document.createElement('div');
            listWrap.className = 'food-list-container';
            categories[cat].forEach(food => {
                const isSelected = pantrySelections.has(food.id);
                const row = document.createElement('div');
                row.className = `food-list-row ${isSelected ? 'selected' : ''}`;
                row.onclick = () => togglePantrySelection(food.id, row);
                const displayEmoji = food.emoji.startsWith('http') ? '📸' : food.emoji;

                row.innerHTML = `
                    <div class="food-list-left">
                        <div class="food-list-check select-check-badge-list">${isSelected ? '✓' : '+'}</div>
                        <span style="font-size:1.25rem; flex-shrink:0;">${displayEmoji}</span>
                        <span class="food-list-name">${food.name}</span>
                    </div>
                    <div class="food-list-right">
                        <span class="food-score ${getScoreClass(food.healthScore)}">${food.healthScore}/10</span>
                        <button type="button" class="food-list-info-btn" title="Nutrition Facts" onclick="event.stopPropagation(); openFDAModal('${food.id}', ${food.defaultWeight}, 'g')">ⓘ</button>
                    </div>
                `;
                listWrap.appendChild(row);
            });
            catSection.appendChild(listWrap);
        } else {
            const grid = document.createElement('div');
            grid.className = 'food-grid';
            categories[cat].forEach(food => {
                const isSelected = pantrySelections.has(food.id);
                const card = document.createElement('div');
                card.className = `food-card ${isSelected ? 'selected' : ''}`;
                let displayEmoji = food.emoji.startsWith('http') ? `<img src="${food.emoji}" style="width:1.8rem; height:1.8rem; border-radius:50%; object-fit:cover;">` : food.emoji;

                card.innerHTML = `
                    <div class="food-card-select-zone" onclick="togglePantrySelection('${food.id}', this.parentElement)">
                        <div class="select-check-badge">${isSelected ? '✓' : '+'}</div>
                        <div class="food-vibe">${getVibeDots(food.affinity)}</div>
                        <div class="food-emoji">${displayEmoji}</div>
                        <span class="food-name">${food.name}</span>
                        <span class="food-score ${getScoreClass(food.healthScore)}">Score ${food.healthScore}/10</span>
                    </div>
                    <button type="button" class="food-card-info-btn" onclick="openFDAModal('${food.id}', ${food.defaultWeight}, 'g')">ⓘ Nutrition Facts</button>
                `;
                grid.appendChild(card);
            });
            catSection.appendChild(grid);
        }
        body.appendChild(catSection);
    });
}

function onFDAChangeUnit(foodId, newUnitKey) {
    const defaultQty = (newUnitKey === 'g' || newUnitKey === 'ml') ? 100 : 1;
    openFDAModal(foodId, defaultQty, newUnitKey);
}

function openFDAModal(foodId, unitQty = null, unitKey = 'g') {
    const food = foodDatabase[foodId];
    if (!food) return;
    const conv = UNIT_CONVERSIONS[unitKey] || UNIT_CONVERSIONS['g'];
    const qty = unitQty !== null ? unitQty : food.defaultWeight;
    const gramWeight = Math.max(1, Math.round(qty * conv.factor));
    const r = gramWeight / 100;

    const cals = Math.round(food.calories * r);
    const fat = (food.fat * r).toFixed(1);
    const satFat = ((food.satFat || 0) * r).toFixed(1);
    const unSatFat = Math.max(0, (food.fat - (food.satFat || 0)) * r).toFixed(1);
    const chol = Math.round((food.chol || 0) * r);
    const sod = Math.round((food.sodium || 0) * r);
    const totalCarb = ((food.netCarbs + food.fiber) * r).toFixed(1);
    const fiber = (food.fiber * r).toFixed(1);
    const netCarb = (food.netCarbs * r).toFixed(1);
    const sugar = ((food.sugar || 0) * r).toFixed(1);
    const pro = (food.protein * r).toFixed(1);

    const fatDV = Math.round(((food.fat * r) / 78) * 100);
    const satFatDV = Math.round((((food.satFat || 0) * r) / 20) * 100);
    const cholDV = Math.round((((food.chol || 0) * r) / 300) * 100);
    const sodDV = Math.round((((food.sodium || 0) * r) / 2300) * 100);
    const carbDV = Math.round((((food.netCarbs + food.fiber) * r) / 275) * 100);
    const fibDV = Math.round(((food.fiber * r) / 28) * 100);
    const proDV = Math.round(((food.protein * r) / 50) * 100);

    let unitOptionsHtml = Object.entries(UNIT_CONVERSIONS).map(([k, u]) =>
        `<option value="${k}" ${k === unitKey ? 'selected' : ''}>${u.label}</option>`
    ).join('');

    let microRows = (food.micros && Object.keys(food.micros).length > 0)
        ? Object.entries(food.micros).map(([k, v]) => `<div class="fda-row"><span><strong>${k}</strong></span><span>${v}</span></div>`).join('')
        : `<div class="fda-row"><span><strong>Category</strong></span><span>${food.category}</span></div>`;

    let stars = '';
    for (let i = 1; i <= 3; i++) {
        stars += `<span style="font-size:1.5rem; cursor:pointer; color:${food.affinity >= i ? '#0ea5e9' : '#cbd5e1'};" onclick="setFoodAffinity('${food.id}', ${i}, ${qty}, '${unitKey}')">★</span>`;
    }

    const modal = document.getElementById('fda-modal');
    const content = document.getElementById('fda-modal-content');
    content.innerHTML = `
        <div class="fda-header">
            <button onclick="closeFDAModal()" style="position:absolute; right:0.85rem; top:0.85rem; background:#e2e8f0; border:1.5px solid #000; width:32px; height:32px; border-radius:50%; font-weight:900; color:#000;">&times;</button>
            <div class="fda-title">Nutrition Facts</div>
            <div class="fda-food-subtitle">${food.emoji.startsWith('http') ? '' : food.emoji} ${food.name} • Score ${food.healthScore}/10</div>
            <div class="fda-serving-row">
                <span>Serving:</span>
                <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                    <input type="number" class="fda-weight-input" value="${qty}" min="0.25" step="any" onchange="openFDAModal('${food.id}', parseFloat(this.value)||1, '${unitKey}')">
                    <select class="fda-unit-select" onchange="onFDAChangeUnit('${food.id}', this.value)">${unitOptionsHtml}</select>
                </div>
            </div>
            <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:800; color:#475569; margin-top:0.25rem;">Equivalent Weight: ${gramWeight}g</div>
        </div>
        <div class="fda-body">
            <div class="fda-cals-row"><span>Calories</span><span>${cals}</span></div>
            <div class="fda-dv-header">% Daily Value*</div>
            <div class="fda-row bold"><span>Total Fat ${fat}g</span><span>${fatDV}%</span></div>
            <div class="fda-row indent"><span>Saturated Fat ${satFat}g</span><span>${satFatDV}%</span></div>
            <div class="fda-row indent"><span>Unsaturated Fat ${unSatFat}g</span><span></span></div>
            <div class="fda-row bold"><span>Cholesterol ${chol}mg</span><span>${cholDV}%</span></div>
            <div class="fda-row bold"><span>Sodium ${sod}mg</span><span>${sodDV}%</span></div>
            <div class="fda-row bold"><span>Total Carbohydrate ${totalCarb}g</span><span>${carbDV}%</span></div>
            <div class="fda-row indent"><span>Dietary Fiber ${fiber}g</span><span>${fibDV}%</span></div>
            <div class="fda-row indent"><span>Total Sugars ${sugar}g</span><span></span></div>
            <div class="fda-row indent bold" style="color:#e11d48;"><span>Net Carbs ${netCarb}g</span><span></span></div>
            <div class="fda-row bold thick-border"><span>Protein ${pro}g</span><span>${proDV}%</span></div>
            <div style="font-size:0.75rem; font-weight:900; text-transform:uppercase; padding:0.4rem 0 0.2rem 0; color:#000;">Vitamins, Minerals &amp; Profile</div>
            ${microRows}
            <div style="margin-top:1rem; padding-top:0.75rem; border-top:2px solid #000; text-align:center;">
                <div style="font-size:0.72rem; font-family:var(--font-mono); font-weight:800; color:#000; text-transform:uppercase; margin-bottom:0.3rem;">Personal Affinity Rating</div>
                <div style="display:flex; justify-content:center; gap:1rem;">${stars}</div>
            </div>
            <div style="display:flex; gap:0.45rem; margin-top:1rem; flex-wrap:wrap;">
                <button type="button" onclick="openCustomFoodModal('${food.id}')" style="flex:1; padding:0.62rem 0.4rem; border-radius:8px; border:2px solid #000; background:#f1f5f9; color:#000; font-weight:800; font-size:0.74rem; text-transform:uppercase;">✎ Edit</button>
                <button type="button" onclick="handleAddFromFDAToRecipe('${food.id}', ${gramWeight})" style="flex:1.3; padding:0.62rem 0.4rem; border-radius:8px; border:2px solid #059669; background:#059669; color:#fff; font-weight:800; font-size:0.74rem; text-transform:uppercase;">🍳 + Recipe (${gramWeight}g)</button>
                <button type="button" onclick="quickStageFromFDA('${food.id}', ${gramWeight})" style="flex:1.3; padding:0.62rem 0.4rem; border-radius:8px; border:2px solid #000; background:#000; color:#fff; font-weight:800; font-size:0.74rem; text-transform:uppercase;">+ Stage (${gramWeight}g)</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}
function closeFDAModal() { document.getElementById('fda-modal').style.display = 'none'; }

function quickStageFromFDA(foodId, gramWeight) {
    const existing = sandboxMeal.find(item => item.id === foodId);
    if (existing) existing.weight += gramWeight;
    else sandboxMeal.push({ id: foodId, weight: gramWeight, locked: false });
    sortSandboxByCulinaryOrder();
    pantryRecipeTargetId = null;
    pantrySelections.clear();
    const searchInput = document.getElementById('pantry-search');
    if (searchInput) searchInput.value = '';
    closeFDAModal(); closePantry(); saveToMemory(); updateSandboxUI();
    triggerActionCue(`Staged ${foodDatabase[foodId].name}!`, "🍽️");
}

function setFoodAffinity(foodId, rating, qty, unitKey) {
    if (!foodDatabase[foodId]) return;
    foodDatabase[foodId].affinity = rating;
    saveToMemory(); openFDAModal(foodId, qty, unitKey); renderPantry();
}

function togglePantrySelection(id, cardElement) {
    hapticTap(6);
    const badge = cardElement.querySelector('.select-check-badge') || cardElement.querySelector('.select-check-badge-list');
    if (pantrySelections.has(id)) {
        pantrySelections.delete(id);
        cardElement.classList.remove('selected');
        if (badge) badge.textContent = '+';
    } else {
        pantrySelections.add(id);
        cardElement.classList.add('selected');
        if (badge) badge.textContent = '✓';
    }
}

function sendToSandbox() {
    const count = pantrySelections.size;

    if (pantryRecipeTargetId && savedRecipes[pantryRecipeTargetId]) {
        const targetId = pantryRecipeTargetId;
        const recipe = savedRecipes[targetId];
        pantrySelections.forEach(id => {
            const food = foodDatabase[id];
            if (!food) return;
            const existing = recipe.items.find(it => it.id === id);
            if (existing) existing.weight += food.defaultWeight;
            else recipe.items.push({ id, weight: food.defaultWeight });
        });
        sortRecipeItemsByCulinaryOrder(recipe);
        pantrySelections.clear();
        pantryRecipeTargetId = null;
        const searchInput = document.getElementById('pantry-search');
        if (searchInput) searchInput.value = '';
        document.getElementById('pantry-modal').style.display = 'none';
        saveToMemory();
        activeCookbookRecipeId = targetId;
        renderCookbook();
        document.getElementById('cookbook-modal').style.display = 'flex';
        if (count > 0) triggerActionCue(`Added ${count} Ingredient${count > 1 ? 's' : ''} to "${recipe.name}"!`, "🍳");
        return;
    }

    pantrySelections.forEach(id => {
        if (!sandboxMeal.find(item => item.id === id)) {
            sandboxMeal.push({ id, weight: foodDatabase[id].defaultWeight, locked: false });
        }
    });
    sortSandboxByCulinaryOrder();
    pantrySelections.clear();
    const searchInput = document.getElementById('pantry-search');
    if (searchInput) searchInput.value = '';
    closePantry(); saveToMemory(); updateSandboxUI();
    if (count > 0) triggerActionCue(`Added ${count} Ingredient${count > 1 ? 's' : ''} to Staging!`, "🔥");
}

// APPLICATION BOOTSTRAP
loadFromMemory();
calculateMacros();
updateSandboxUI();