// Ear Training App - Main Application Logic

// ===== CONFIGURATION =====
const BASE_FREQUENCY = 261.63; // Middle C (C4)

// Pattern templates for pedagogical mode
const PATTERN_TEMPLATES = {
    easy: [
        [1, 2, 3],
        [1, 2, 3, 2, 1],
        [3, 2, 1],
        [1, 2, 1],
        [1, 3, 1],
        [1, 2, 3, 4],
        [5, 4, 3, 2, 1],
        [1, 2, 3, 4, 3, 2, 1]
    ],
    medium: [
        [1, 3, 5, 3, 1],
        [1, 2, 3, 4, 5],
        [1, 3, 2, 4, 3],
        [1, 4, 3, 2, 1],
        [5, 3, 1],
        [1, 2, 4, 3, 5],
        [1, 5, 4, 3, 2, 1],
        [1, 2, 3, 5, 4, 3, 2, 1]
    ],
    hard: [
        [1, 5, 1],
        [1, 6, 1],
        [1, 3, 5, 7],
        [1, 4, 7, 5, 3, 1],
        [1, 5, 2, 6, 3, 7],
        [1, 6, 4, 2, 7, 5, 3, 1],
        [1, 3, 5, 7, 5, 3, 1],
        [1, 4, 2, 5, 3, 6, 4, 7],
        [5, 1, 3, 7, 2, 6, 4, 1]
    ]
};

// Interval names mapping
const INTERVAL_NAMES = {
    0: 'Unison',
    1: 'Minor Second',
    2: 'Major Second',
    3: 'Minor Third',
    4: 'Major Third',
    5: 'Perfect Fourth',
    6: 'Tritone',
    7: 'Perfect Fifth',
    8: 'Minor Sixth',
    9: 'Major Sixth',
    10: 'Minor Seventh',
    11: 'Major Seventh',
    12: 'Octave'
};

// ===== STATE =====
let audioContext = null;
let currentPattern = [];
let currentScale = 'major';
let currentDifficulty = 'medium';
let currentPatternMode = 'pedagogical';
let syllableSystem = 'western';
let showNumbers = true;
let showSyllables = true;
let practiceMode = 'listen'; // 'listen', 'self-paced', 'test'
let playbackSpeed = 1.0;
let noteDuration = 500; // milliseconds
let isPlaying = false;
let currentNoteIndex = 0;
let playbackTimeout = null;
let lastNote = null;

// ===== DOM ELEMENTS =====
const elements = {
    // Pattern settings
    patternMode: document.getElementById('pattern-mode'),
    customPatternContainer: document.getElementById('custom-pattern-container'),
    customPatternInput: document.getElementById('custom-pattern-input'),
    useCustomPatternBtn: document.getElementById('use-custom-pattern-btn'),
    customPatternError: document.getElementById('custom-pattern-error'),
    scale: document.getElementById('scale'),
    difficulty: document.getElementById('difficulty'),
    generateBtn: document.getElementById('generate-btn'),

    // Display settings
    showNumbers: document.getElementById('show-numbers'),
    showSyllables: document.getElementById('show-syllables'),
    syllableSystem: document.getElementById('syllable-system'),

    // Pattern display
    patternDisplay: document.getElementById('pattern-display'),
    scaleInfo: document.getElementById('scale-info'),
    scaleVisual: document.getElementById('scale-visual'),
    currentNote: document.getElementById('current-note'),
    intervalDisplay: document.getElementById('interval-display'),

    // Playback controls
    practiceModeRadios: document.querySelectorAll('input[name="practice-mode"]'),
    selfPacedControls: document.getElementById('self-paced-controls'),
    checkNoteBtn: document.getElementById('check-note-btn'),
    nextNoteBtn: document.getElementById('next-note-btn'),
    restartSelfPacedBtn: document.getElementById('restart-self-paced-btn'),
    playbackControls: document.querySelector('.playback-controls'),
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    restartBtn: document.getElementById('restart-btn'),
    stepForwardBtn: document.getElementById('step-forward-btn'),
    replayLastBtn: document.getElementById('replay-last-btn'),

    // Advanced controls
    noteDuration: document.getElementById('note-duration'),
    noteDurationValue: document.getElementById('note-duration-value'),
    noteGap: document.getElementById('note-gap'),
    noteGapValue: document.getElementById('note-gap-value'),
    speed: document.getElementById('speed'),
    speedValue: document.getElementById('speed-value'),
    loopCount: document.getElementById('loop-count'),
    manualMode: document.getElementById('manual-mode')
};

// ===== INITIALIZATION =====
function init() {
    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Set up event listeners
    setupEventListeners();

    // Initialize scale visual
    createScaleVisual();

    console.log('Ear Training App initialized');
}

function setupEventListeners() {
    // Pattern settings
    elements.patternMode.addEventListener('change', handlePatternModeChange);
    elements.scale.addEventListener('change', handleScaleChange);
    elements.difficulty.addEventListener('change', handleDifficultyChange);
    elements.generateBtn.addEventListener('click', generateNewPattern);

    // Display settings
    elements.showNumbers.addEventListener('change', handleDisplayToggle);
    elements.showSyllables.addEventListener('change', handleDisplayToggle);
    elements.syllableSystem.addEventListener('change', handleSyllableSystemChange);

    // Practice mode
    elements.practiceModeRadios.forEach(radio => {
        radio.addEventListener('change', handlePracticeModeChange);
    });

    // Self-paced controls
    if (elements.checkNoteBtn) {
        elements.checkNoteBtn.addEventListener('click', checkCurrentNote);
    }
    if (elements.nextNoteBtn) {
        elements.nextNoteBtn.addEventListener('click', moveToNextNote);
    }
    if (elements.restartSelfPacedBtn) {
        elements.restartSelfPacedBtn.addEventListener('click', restartSelfPaced);
    }

    // Playback controls
    elements.playBtn.addEventListener('click', playPattern);
    elements.pauseBtn.addEventListener('click', pausePlayback);
    elements.restartBtn.addEventListener('click', restartPattern);

    // Advanced controls
    elements.noteDuration.addEventListener('input', (e) => {
        noteDuration = parseInt(e.target.value);
        elements.noteDurationValue.textContent = (noteDuration / 1000).toFixed(1) + 's';
    });

    elements.noteGap.addEventListener('input', (e) => {
        const gap = parseInt(e.target.value);
        elements.noteGapValue.textContent = (gap / 1000).toFixed(1) + 's';
    });

    elements.speed.addEventListener('input', (e) => {
        playbackSpeed = parseFloat(e.target.value);
        elements.speedValue.textContent = playbackSpeed.toFixed(1) + 'x';
    });
}

// ===== PATTERN GENERATION =====
function handlePatternModeChange(e) {
    currentPatternMode = e.target.value;

    // Show/hide custom pattern input
    if (currentPatternMode === 'custom') {
        elements.customPatternContainer.style.display = 'block';
    } else {
        elements.customPatternContainer.style.display = 'none';
    }
}

function handleScaleChange(e) {
    currentScale = e.target.value;
    if (currentPattern.length > 0) {
        updateScaleVisual();
        updateScaleInfo();
    }
}

function handleDifficultyChange(e) {
    currentDifficulty = e.target.value;
}

function generateNewPattern() {
    if (currentPatternMode === 'pedagogical') {
        generatePedagogicalPattern();
    } else if (currentPatternMode === 'random') {
        generateRandomPattern();
    }
    // Custom mode is handled separately

    updatePatternDisplay();
    updateScaleVisual();
    updateScaleInfo();
    enablePlaybackControls();
    resetPlaybackState();

    // If in self-paced mode, start it automatically
    if (practiceMode === 'self-paced') {
        startSelfPacedMode();
    }
}

function generatePedagogicalPattern() {
    const templates = PATTERN_TEMPLATES[currentDifficulty];
    const template = templates[Math.floor(Math.random() * templates.length)];
    currentPattern = [...template];

    // Validate pattern doesn't exceed scale length
    const scaleLength = getScaleLength(currentScale);
    currentPattern = currentPattern.filter(note => note <= scaleLength);
}

function generateRandomPattern() {
    // TODO: Implement random pattern generation with interval constraints
    // For now, fall back to pedagogical
    generatePedagogicalPattern();
}

function updatePatternDisplay() {
    const patternText = currentPattern.join(' ');
    elements.patternDisplay.innerHTML = `<span class="pattern-text">${patternText}</span>`;
}

function updateScaleInfo() {
    const scale = SCALE_LIBRARY[currentScale];
    let info = scale.name;

    if (scale.time) {
        info += ` • ${scale.time}`;
    }
    if (scale.mood) {
        info += ` • ${scale.mood}`;
    }

    elements.scaleInfo.textContent = info;
}

// ===== DISPLAY SETTINGS =====
function handleDisplayToggle() {
    showNumbers = elements.showNumbers.checked;
    showSyllables = elements.showSyllables.checked;

    // Ensure at least one is checked
    if (!showNumbers && !showSyllables) {
        elements.showNumbers.checked = true;
        showNumbers = true;
    }

    // Update visual if pattern exists
    if (currentPattern.length > 0) {
        updateScaleVisual();
    }
}

function handleSyllableSystemChange(e) {
    syllableSystem = e.target.value;
    if (currentPattern.length > 0) {
        updateScaleVisual();
    }
}

function handlePracticeModeChange(e) {
    practiceMode = e.target.value;

    // Stop any playback
    resetPlaybackState();

    if (practiceMode === 'self-paced') {
        // Show self-paced controls, hide auto-play controls
        elements.selfPacedControls.style.display = 'block';
        elements.playbackControls.style.display = 'none';

        // If pattern exists, start self-paced mode
        if (currentPattern.length > 0) {
            startSelfPacedMode();
        }
    } else if (practiceMode === 'listen') {
        // Show auto-play controls, hide self-paced
        elements.selfPacedControls.style.display = 'none';
        elements.playbackControls.style.display = 'flex';
    } else if (practiceMode === 'test') {
        alert('Test mode coming soon!');
        // Reset to listen mode
        document.querySelector('input[value="listen"]').checked = true;
        practiceMode = 'listen';
        elements.selfPacedControls.style.display = 'none';
        elements.playbackControls.style.display = 'flex';
    }
}

// ===== SCALE VISUAL =====
function createScaleVisual() {
    const scaleLength = getScaleLength(currentScale);
    const scale = SCALE_LIBRARY[currentScale];

    elements.scaleVisual.innerHTML = '';

    for (let i = 1; i <= scaleLength; i++) {
        const noteCircle = document.createElement('div');
        noteCircle.className = 'note-circle';
        noteCircle.dataset.note = i;

        elements.scaleVisual.appendChild(noteCircle);
    }

    updateScaleVisual();
}

function updateScaleVisual() {
    const scaleLength = getScaleLength(currentScale);
    const scale = SCALE_LIBRARY[currentScale];

    // Recreate if scale length changed
    const currentCircles = elements.scaleVisual.querySelectorAll('.note-circle').length;
    if (currentCircles !== scaleLength) {
        createScaleVisual();
        return;
    }

    const circles = elements.scaleVisual.querySelectorAll('.note-circle');

    circles.forEach((circle, idx) => {
        const noteNum = idx + 1;
        circle.classList.remove('in-pattern', 'active');

        // Build display content
        let content = '';

        if (showNumbers) {
            content += `<div class="note-number">${noteNum}</div>`;
        }

        if (showSyllables) {
            const syllable = scale.solfege[syllableSystem][idx];
            content += `<div class="note-name">${syllable}</div>`;
        }

        circle.innerHTML = content;

        // Mark notes in pattern
        if (currentPattern.includes(noteNum)) {
            circle.classList.add('in-pattern');
        }
    });
}

function highlightNote(noteIndex) {
    const circles = elements.scaleVisual.querySelectorAll('.note-circle');
    circles.forEach(circle => circle.classList.remove('active'));

    if (noteIndex >= 0 && noteIndex < currentPattern.length) {
        const note = currentPattern[noteIndex];
        const circle = elements.scaleVisual.querySelector(`[data-note="${note}"]`);
        if (circle) {
            circle.classList.add('active');
        }

        // Update current note display
        const scale = SCALE_LIBRARY[currentScale];
        let displayText = '';

        if (showNumbers) {
            displayText += note;
        }

        if (showSyllables) {
            const syllable = scale.solfege[syllableSystem][note - 1];
            if (showNumbers) {
                displayText += ` (${syllable})`;
            } else {
                displayText = syllable;
            }
        }

        elements.currentNote.textContent = displayText;

        // Show interval from previous note
        if (lastNote !== null && noteIndex > 0) {
            const interval = Math.abs(note - lastNote);
            const direction = note > lastNote ? '↑' : '↓';
            const intervalName = getIntervalName(interval);
            elements.intervalDisplay.textContent = `${direction} ${intervalName}`;
        } else {
            elements.intervalDisplay.textContent = '';
        }

        lastNote = note;
    } else {
        elements.currentNote.textContent = '';
        elements.intervalDisplay.textContent = '';
        lastNote = null;
    }
}

function getIntervalName(steps) {
    // Map scale steps to interval names
    const intervalMap = {
        0: 'Unison',
        1: 'Second',
        2: 'Third',
        3: 'Fourth',
        4: 'Fifth',
        5: 'Sixth',
        6: 'Seventh',
        7: 'Octave'
    };

    return intervalMap[steps] || `${steps} steps`;
}

// ===== AUDIO PLAYBACK =====
function playNote(noteNumber, duration = 0.5) {
    // Check if sound should play
    const shouldPlaySound = practiceMode === 'listen' || practiceMode === 'self-paced';

    if (!shouldPlaySound) return;
    if (!audioContext) return;

    const scale = SCALE_LIBRARY[currentScale];
    const frequency = BASE_FREQUENCY * scale.ratios[noteNumber - 1];

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

async function playPattern() {
    if (currentPattern.length === 0) return;

    isPlaying = true;
    currentNoteIndex = 0;

    elements.playBtn.disabled = true;
    elements.pauseBtn.disabled = false;
    elements.restartBtn.disabled = false;
    elements.generateBtn.disabled = true;

    await playNextNote();
}

async function playNextNote() {
    if (!isPlaying || currentNoteIndex >= currentPattern.length) {
        finishPlayback();
        return;
    }

    const note = currentPattern[currentNoteIndex];

    // Visual feedback
    highlightNote(currentNoteIndex);

    // Play the note with configured duration
    const durationSec = noteDuration / 1000;
    playNote(note, durationSec);

    currentNoteIndex++;

    // Get gap from settings
    const gap = parseInt(elements.noteGap.value);
    const totalDelay = (noteDuration + gap) / playbackSpeed;

    playbackTimeout = setTimeout(() => playNextNote(), totalDelay);
}

function pausePlayback() {
    isPlaying = false;
    elements.pauseBtn.disabled = true;
    elements.playBtn.disabled = false;
    elements.playBtn.textContent = 'Resume';

    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }
}

function restartPattern() {
    resetPlaybackState();
    playPattern();
}

function finishPlayback() {
    isPlaying = false;
    currentNoteIndex = 0;

    elements.playBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.generateBtn.disabled = false;
    elements.playBtn.textContent = 'Play';

    highlightNote(-1);

    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }
}

function resetPlaybackState() {
    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }

    isPlaying = false;
    currentNoteIndex = 0;

    elements.playBtn.textContent = 'Play';
    elements.pauseBtn.disabled = true;

    highlightNote(-1);
}

function enablePlaybackControls() {
    elements.playBtn.disabled = false;
    elements.restartBtn.disabled = false;
}

// ===== SELF-PACED MODE =====
function startSelfPacedMode() {
    currentNoteIndex = 0;
    lastNote = null;

    // Highlight first note
    highlightNote(0);

    // Enable self-paced controls
    elements.checkNoteBtn.disabled = false;
    elements.nextNoteBtn.disabled = false;
    elements.restartSelfPacedBtn.disabled = false;
}

function checkCurrentNote() {
    if (currentNoteIndex >= currentPattern.length) return;

    const note = currentPattern[currentNoteIndex];
    const durationSec = noteDuration / 1000;

    // Play the current note on demand
    playNote(note, durationSec);
}

function moveToNextNote() {
    if (currentNoteIndex >= currentPattern.length - 1) {
        // Pattern complete
        currentNoteIndex = currentPattern.length;
        elements.checkNoteBtn.disabled = true;
        elements.nextNoteBtn.disabled = true;
        highlightNote(-1); // Clear highlight
        return;
    }

    // Move to next note
    currentNoteIndex++;
    highlightNote(currentNoteIndex);
}

function restartSelfPaced() {
    currentNoteIndex = 0;
    lastNote = null;
    highlightNote(0);
    elements.checkNoteBtn.disabled = false;
    elements.nextNoteBtn.disabled = false;
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
