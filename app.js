// Ear Training App - Main JavaScript

// ===== CONFIGURATION =====
const NOTATION_SYSTEMS = {
    western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
    hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'],
    carnatic: ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni']
};

// Base frequency for middle C (C4)
const BASE_FREQUENCY = 261.63;

// Major scale frequency ratios
const SCALE_RATIOS = [
    1.0,      // Do/Sa (1)
    9/8,      // Re/Re/Ri (2)
    5/4,      // Mi/Ga (3)
    4/3,      // Fa/Ma (4)
    3/2,      // Sol/Pa (5)
    5/3,      // La/Dha/Da (6)
    15/8      // Ti/Ni (7)
];

// Pattern templates for different difficulties
// Difficulty is based on:
// 1. Number of notes (more notes = harder)
// 2. Interval sizes (larger jumps = harder)
// 3. Pattern complexity (direction changes, non-stepwise motion)

const PATTERN_TEMPLATES = {
    // EASY: Stepwise motion (seconds), 3-5 notes, mostly conjunct
    // Traditional beginner ear training exercises
    easy: [
        [1, 2, 3],           // Simple ascending stepwise
        [1, 2, 3, 2, 1],     // Classic up and down pattern
        [3, 2, 1],           // Simple descending
        [1, 2, 1],           // Neighbor tone
        [1, 3, 1],           // Skip up third, return
        [1, 2, 3, 4],        // Four-note stepwise
        [5, 4, 3, 2, 1],     // Descending scale segment
        [1, 2, 3, 4, 3, 2, 1] // Stepwise arch
    ],

    // MEDIUM: Mix of steps and small skips (thirds), 5-7 notes
    // Introduces interval training with thirds and fourths
    medium: [
        [1, 3, 5, 3, 1],     // Triad arpeggio (thirds)
        [1, 2, 3, 4, 5],     // Five-note scale
        [1, 3, 2, 4, 3],     // Alternating steps/skips
        [1, 4, 3, 2, 1],     // Fourth jump, stepwise return
        [5, 3, 1],           // Descending thirds
        [1, 2, 4, 3, 5],     // Mixed intervals
        [1, 5, 4, 3, 2, 1],  // Fifth jump, stepwise descent
        [1, 2, 3, 5, 4, 3, 2, 1] // Scale with skip
    ],

    // HARD: Large intervals (fourths, fifths, sixths), 7-10 notes, complex patterns
    // Advanced ear training with challenging leaps and direction changes
    hard: [
        [1, 5, 1],           // Perfect fifth leap (challenging interval)
        [1, 6, 1],           // Sixth leap (very challenging)
        [1, 3, 5, 7],        // Seventh chord outline
        [1, 4, 7, 5, 3, 1],  // Large skips with direction changes
        [1, 5, 2, 6, 3, 7],  // Wide intervals, chromatic tendency
        [1, 6, 4, 2, 7, 5, 3, 1], // Complex interval pattern
        [1, 3, 5, 7, 5, 3, 1],    // Seventh chord arpeggio
        [1, 4, 2, 5, 3, 6, 4, 7], // Mixed large intervals
        [5, 1, 3, 7, 2, 6, 4, 1]  // Complex melodic pattern
    ]
};

// ===== STATE =====
let audioContext = null;
let currentPattern = [];
let currentDifficulty = 'medium';
let currentNotation = 'western';
let playbackSpeed = 1.0;
let showSolfege = true;
let isPlaying = false;
let isPaused = false;
let currentNoteIndex = 0;
let playbackTimeout = null;

// ===== DOM ELEMENTS =====
const elements = {
    difficulty: document.getElementById('difficulty'),
    notation: document.getElementById('notation'),
    speed: document.getElementById('speed'),
    speedValue: document.getElementById('speed-value'),
    showSolfege: document.getElementById('show-solfege'),
    patternDisplay: document.getElementById('pattern-display'),
    scaleVisual: document.getElementById('scale-visual'),
    currentNote: document.getElementById('current-note'),
    generateBtn: document.getElementById('generate-btn'),
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    repeatBtn: document.getElementById('repeat-btn')
};

// ===== INITIALIZATION =====
function init() {
    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Set up event listeners
    elements.difficulty.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
    });

    elements.notation.addEventListener('change', (e) => {
        currentNotation = e.target.value;
        if (currentPattern.length > 0) {
            updateScaleVisual();
        }
    });

    elements.speed.addEventListener('input', (e) => {
        playbackSpeed = parseFloat(e.target.value);
        elements.speedValue.textContent = playbackSpeed.toFixed(1) + 'x';
    });

    elements.showSolfege.addEventListener('change', (e) => {
        showSolfege = e.target.checked;
    });

    elements.generateBtn.addEventListener('click', generateNewPattern);
    elements.playBtn.addEventListener('click', playPattern);
    elements.pauseBtn.addEventListener('click', pausePlayback);
    elements.repeatBtn.addEventListener('click', repeatPattern);

    // Initialize scale visual
    createScaleVisual();
}

// ===== PATTERN GENERATION =====
function generateNewPattern() {
    // Get random template from current difficulty
    const templates = PATTERN_TEMPLATES[currentDifficulty];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Sometimes modify the template slightly for variety
    if (Math.random() > 0.7) {
        currentPattern = modifyPattern(template);
    } else {
        currentPattern = [...template];
    }

    // Update display
    updatePatternDisplay();
    updateScaleVisual();

    // Enable controls
    elements.playBtn.disabled = false;
    elements.repeatBtn.disabled = false;

    // Reset playback state
    resetPlaybackState();
}

function modifyPattern(template) {
    const modified = [...template];

    // Randomly add a note or two
    if (currentDifficulty !== 'easy' && Math.random() > 0.5) {
        const insertPos = Math.floor(Math.random() * modified.length);
        const nearbyNote = modified[insertPos];
        const newNote = nearbyNote + (Math.random() > 0.5 ? 1 : -1);

        // Make sure note is in valid range (1-7)
        if (newNote >= 1 && newNote <= 7) {
            modified.splice(insertPos, 0, newNote);
        }
    }

    return modified;
}

function updatePatternDisplay() {
    const patternText = currentPattern.join(' ');
    elements.patternDisplay.innerHTML = `<span class="pattern-text">${patternText}</span>`;
}

// ===== SCALE VISUAL =====
function createScaleVisual() {
    elements.scaleVisual.innerHTML = '';

    for (let i = 1; i <= 7; i++) {
        const noteCircle = document.createElement('div');
        noteCircle.className = 'note-circle';
        noteCircle.dataset.note = i;

        const noteNumber = document.createElement('div');
        noteNumber.className = 'note-number';
        noteNumber.textContent = i;

        const noteName = document.createElement('div');
        noteName.className = 'note-name';
        noteName.textContent = NOTATION_SYSTEMS[currentNotation][i - 1];

        noteCircle.appendChild(noteNumber);
        noteCircle.appendChild(noteName);
        elements.scaleVisual.appendChild(noteCircle);
    }
}

function updateScaleVisual() {
    // Reset all circles
    const circles = elements.scaleVisual.querySelectorAll('.note-circle');
    circles.forEach(circle => {
        circle.classList.remove('in-pattern', 'active');
        const noteName = circle.querySelector('.note-name');
        noteName.textContent = NOTATION_SYSTEMS[currentNotation][parseInt(circle.dataset.note) - 1];
    });

    // Highlight notes in pattern
    currentPattern.forEach(note => {
        const circle = elements.scaleVisual.querySelector(`[data-note="${note}"]`);
        if (circle) {
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
        if (showSolfege) {
            const syllable = NOTATION_SYSTEMS[currentNotation][note - 1];
            elements.currentNote.textContent = syllable;
        } else {
            elements.currentNote.textContent = note;
        }
    } else {
        elements.currentNote.textContent = '';
    }
}

// ===== AUDIO PLAYBACK =====
function playNote(noteNumber, duration = 0.5) {
    if (!audioContext) return;

    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Calculate frequency
    const frequency = BASE_FREQUENCY * SCALE_RATIOS[noteNumber - 1];

    // Set up oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Set up envelope (ADSR)
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1); // Decay
    gainNode.gain.setValueAtTime(0.2, now + duration - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

async function playPattern() {
    if (currentPattern.length === 0) return;

    isPlaying = true;
    isPaused = false;
    currentNoteIndex = 0;

    elements.playBtn.disabled = true;
    elements.pauseBtn.disabled = false;
    elements.generateBtn.disabled = true;

    await playNextNote();
}

async function playNextNote() {
    if (!isPlaying || isPaused) return;

    if (currentNoteIndex >= currentPattern.length) {
        // Pattern finished
        finishPlayback();
        return;
    }

    const note = currentPattern[currentNoteIndex];

    // Visual feedback
    highlightNote(currentNoteIndex);

    // Play the note
    const noteDuration = 0.5;
    playNote(note, noteDuration);

    currentNoteIndex++;

    // Schedule next note
    const delay = (noteDuration * 1000) / playbackSpeed;
    playbackTimeout = setTimeout(() => playNextNote(), delay);
}

function pausePlayback() {
    isPaused = true;
    elements.pauseBtn.disabled = true;
    elements.playBtn.disabled = false;
    elements.playBtn.textContent = '▶ Resume';

    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }
}

function repeatPattern() {
    resetPlaybackState();
    playPattern();
}

function finishPlayback() {
    isPlaying = false;
    isPaused = false;
    currentNoteIndex = 0;

    elements.playBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.generateBtn.disabled = false;
    elements.playBtn.textContent = '▶ Play';

    highlightNote(-1); // Clear highlight

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
    isPaused = false;
    currentNoteIndex = 0;

    elements.playBtn.textContent = '▶ Play';
    elements.pauseBtn.disabled = true;

    highlightNote(-1);
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
