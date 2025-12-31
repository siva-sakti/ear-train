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
let audioEngine = null; // New audio engine instance
let currentPattern = [];
let currentScale = 'major';
let currentDifficulty = 'medium';
let currentPatternMode = 'pedagogical';
let syllableSystem = 'western';
let showNumbers = true;
let showSyllables = true;
let practiceMode = 'listen'; // 'listen', 'self-paced', 'test'
let playbackSpeed = 1.0;
let noteDuration = 1000; // milliseconds (1 second default)
let isPlaying = false;
let currentNoteIndex = 0;
let playbackTimeout = null;
let lastNote = null;
let currentLoop = 1;
let totalLoops = 1;
let currentInstrument = 'piano'; // Default instrument

// ===== DOM ELEMENTS =====
const elements = {
    // Pattern settings
    patternMode: document.getElementById('pattern-mode'),
    customPatternContainer: document.getElementById('custom-pattern-container'),
    customPatternBoxes: document.getElementById('custom-pattern-boxes'),
    useCustomPatternBtn: document.getElementById('use-custom-pattern-btn'),
    clearCustomPatternBtn: document.getElementById('clear-custom-pattern-btn'),
    customPatternError: document.getElementById('custom-pattern-error'),
    scale: document.getElementById('scale'),
    difficulty: document.getElementById('difficulty'),
    generateBtn: document.getElementById('generate-btn'),

    // Audio settings
    instrument: document.getElementById('instrument'),

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
    loopIndicator: document.getElementById('loop-indicator'),

    // Advanced controls
    noteDuration: document.getElementById('note-duration'),
    noteDurationValue: document.getElementById('note-duration-value'),
    noteGap: document.getElementById('note-gap'),
    noteGapValue: document.getElementById('note-gap-value'),
    speed: document.getElementById('speed'),
    speedValue: document.getElementById('speed-value'),
    loopCount: document.getElementById('loop-count'),
    manualMode: document.getElementById('manual-mode'),

    // Bookmarks
    bookmarkPatternBtn: document.getElementById('bookmark-pattern-btn'),
    bookmarksList: document.getElementById('bookmarks-list'),

    // Practice History
    totalSessions: document.getElementById('total-sessions'),
    currentStreak: document.getElementById('current-streak'),
    totalPatterns: document.getElementById('total-patterns'),
    practiceCalendar: document.getElementById('practice-calendar'),

    // Pakad Phrases
    pakadSection: document.getElementById('pakad-section'),
    pakadPhrases: document.getElementById('pakad-phrases')
};

// ===== MOBILE AUDIO UNLOCK =====
function setupMobileAudioUnlock() {
    // On mobile browsers, audio context starts suspended and requires user interaction
    // This function sets up a one-time event listener to resume the context

    // DEBUG: Change subtitle to show this function ran
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.textContent = 'DEBUG: setupMobileAudioUnlock() is running!';
    }

    let unlocked = false;
    const banner = document.getElementById('audio-unlock-banner');

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Debug: Always show banner for now to test
    console.log('Mobile detection:', isMobile);
    console.log('User agent:', navigator.userAgent);
    console.log('Banner element:', banner);

    // Force show banner to test (remove isMobile check temporarily)
    if (banner) {
        banner.style.display = 'block';
        const bannerP = banner.querySelector('p');
        if (bannerP) {
            bannerP.textContent = `Tap to enable audio (Mobile: ${isMobile})`;
        }
    } else {
        // If banner doesn't exist, show in subtitle
        if (subtitle) {
            subtitle.textContent = 'ERROR: Banner element not found!';
        }
    }

    const unlockAudio = async () => {
        if (unlocked) return;

        if (audioEngine && audioEngine.audioContext) {
            console.log('Attempting to unlock audio context...');
            console.log('Audio context state before:', audioEngine.audioContext.state);

            if (banner) {
                banner.querySelector('p').textContent = `Unlocking... (State: ${audioEngine.audioContext.state})`;
            }

            // Resume the context
            await audioEngine.resumeContext();

            // Play a silent sound to fully unlock audio on iOS/Android
            // This is required because some mobile browsers need actual audio to play
            try {
                const oscillator = audioEngine.audioContext.createOscillator();
                const gainNode = audioEngine.audioContext.createGain();
                gainNode.gain.value = 0; // Silent
                oscillator.connect(gainNode);
                gainNode.connect(audioEngine.audioContext.destination);
                oscillator.start(0);
                oscillator.stop(audioEngine.audioContext.currentTime + 0.001);
                console.log('Silent unlock sound played');
            } catch (e) {
                console.error('Error playing unlock sound:', e);
                if (banner) {
                    banner.querySelector('p').textContent = `Error: ${e.message}`;
                }
            }

            console.log('Audio context state after:', audioEngine.audioContext.state);
            unlocked = true;

            // Update banner
            if (banner) {
                banner.querySelector('p').textContent = `Audio unlocked! (State: ${audioEngine.audioContext.state})`;
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 2000);
            }
        } else {
            console.error('AudioEngine not initialized!');
            if (banner) {
                banner.querySelector('p').textContent = 'Error: Audio engine not ready';
            }
        }

        // Remove listeners after first interaction
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('touchend', unlockAudio);
        document.removeEventListener('click', unlockAudio);
    };

    // Listen for first user interaction
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('touchend', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
}

// ===== INITIALIZATION =====
function init() {
    // Initialize enhanced audio engine
    audioEngine = new AudioEngine();
    audioEngine.initialize();

    // Mobile audio unlock - resume context on first user interaction
    setupMobileAudioUnlock();

    // Set up event listeners
    setupEventListeners();

    // Initialize scale visual
    createScaleVisual();

    // Load bookmarks
    loadBookmarks();

    // Initialize practice history
    initializePracticeHistory();

    // Load saved instrument preference
    loadInstrumentPreference();

    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);

                // Check for updates on page load
                registration.update();

                // Detect development mode
                const isLocalhost = window.location.hostname === 'localhost' ||
                                  window.location.hostname === '127.0.0.1' ||
                                  window.location.port === '8001';

                if (isLocalhost) {
                    console.log('%c🔧 DEVELOPMENT MODE: Service worker using network-first strategy',
                                'background: #4CAF50; color: white; padding: 4px 8px; border-radius: 3px;');
                    console.log('Edit → Save → Refresh to see changes immediately!');
                } else {
                    console.log('Production mode: Service worker using cache-first strategy for offline support');
                }
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }

    console.log('Ear Training App initialized');
}

function setupEventListeners() {
    // Pattern settings
    elements.patternMode.addEventListener('change', handlePatternModeChange);
    elements.scale.addEventListener('change', handleScaleChange);
    elements.difficulty.addEventListener('change', handleDifficultyChange);
    elements.generateBtn.addEventListener('click', generateNewPattern);

    // Custom pattern
    elements.useCustomPatternBtn.addEventListener('click', useCustomPattern);
    elements.clearCustomPatternBtn.addEventListener('click', clearCustomPattern);
    initializeCustomPatternBoxes();

    // Bookmarks
    elements.bookmarkPatternBtn.addEventListener('click', bookmarkCurrentPattern);

    // Audio settings
    elements.instrument.addEventListener('change', handleInstrumentChange);

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

// ===== UTILITY FUNCTIONS =====
function numberToHanddrawn(num) {
    // Convert a number to handdrawn digit spans
    const digits = num.toString().split('');
    return digits.map(digit =>
        `<span class="handwritten-digit" data-digit="${digit}"></span>`
    ).join('');
}

function stringToHanddrawn(str) {
    // Convert a string of numbers (like "1 2 3") to handdrawn digits
    return str.split('').map(char => {
        if (char >= '0' && char <= '9') {
            return `<span class="handwritten-digit" data-digit="${char}"></span>`;
        } else {
            return char; // Keep spaces and other characters
        }
    }).join('');
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
    updatePakadDisplay();
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
    const scaleLength = getScaleLength(currentScale);
    const templateLengths = PATTERN_TEMPLATES[currentDifficulty].map(t => t.length);
    const minLength = Math.min(...templateLengths);
    const maxLength = Math.max(...templateLengths);
    const patternLength = minLength + Math.floor(Math.random() * (maxLength - minLength + 1));

    // Interval constraints based on difficulty
    const intervalRules = {
        easy: { max: 2, preferredMax: 1 },      // Stepwise (seconds), occasionally a third
        medium: { max: 5, preferredMax: 3 },    // Up to fourths, occasionally a fifth
        hard: { max: 7, preferredMax: 7 }       // Any interval up to octave
    };

    const rules = intervalRules[currentDifficulty];
    const pattern = [];

    // Start with note 1 (most common) or occasionally 3 or 5
    const startNotes = [1, 1, 1, 3, 5];
    let currentNote = startNotes[Math.floor(Math.random() * startNotes.length)];
    pattern.push(currentNote);

    let lastInterval = 0;
    let direction = null; // 'up', 'down', or null

    for (let i = 1; i < patternLength; i++) {
        const isLastNote = (i === patternLength - 1);
        let nextNote;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            attempts++;
            if (attempts > maxAttempts) {
                // Fallback: stepwise motion toward 1
                nextNote = currentNote > 1 ? currentNote - 1 : currentNote + 1;
                break;
            }

            // Melodic rule: After a large leap, prefer stepwise return
            if (Math.abs(lastInterval) >= 4) {
                // Move stepwise in opposite direction
                const returnDirection = lastInterval > 0 ? -1 : 1;
                nextNote = currentNote + returnDirection * (Math.random() < 0.8 ? 1 : 2);
            }
            // Melodic rule: Tend to resolve to 1 on the last note
            else if (isLastNote && pattern.length > 2) {
                if (Math.random() < 0.7) {
                    nextNote = 1; // Strong tendency to end on tonic
                } else {
                    // Or approach stepwise
                    nextNote = currentNote > 1 ? currentNote - 1 : currentNote + 1;
                }
            }
            // Normal random interval generation
            else {
                // Determine interval size (prefer smaller intervals 70% of the time)
                const maxInterval = Math.random() < 0.7 ? rules.preferredMax : rules.max;
                const interval = Math.floor(Math.random() * (maxInterval + 1));

                // Melodic rule: Prefer changing direction after continued motion
                let newDirection;
                if (direction && Math.random() < 0.4) {
                    // 40% chance to change direction
                    newDirection = direction === 'up' ? 'down' : 'up';
                } else {
                    newDirection = Math.random() < 0.5 ? 'up' : 'down';
                }

                nextNote = newDirection === 'up'
                    ? currentNote + interval
                    : currentNote - interval;
            }

            // Ensure note is within scale bounds
            nextNote = Math.max(1, Math.min(scaleLength, nextNote));

        } while (nextNote === currentNote); // Avoid repeated notes (unisons)

        pattern.push(nextNote);
        lastInterval = nextNote - currentNote;
        direction = lastInterval > 0 ? 'up' : 'down';
        currentNote = nextNote;
    }

    currentPattern = pattern;
}

// ===== CUSTOM PATTERN =====
const MAX_PATTERN_LENGTH = 12;

function initializeCustomPatternBoxes() {
    // Start with one empty box
    createPatternBox();
}

function createPatternBox() {
    const boxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    if (boxes.length >= MAX_PATTERN_LENGTH) return null;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pattern-box';
    input.maxLength = 1;
    input.inputMode = 'numeric';
    input.pattern = '[0-9]';

    input.addEventListener('input', handleBoxInput);
    input.addEventListener('keydown', handleBoxKeydown);
    input.addEventListener('paste', handleBoxPaste);

    elements.customPatternBoxes.appendChild(input);
    return input;
}

function handleBoxInput(e) {
    const input = e.target;
    const value = input.value;

    // Only allow digits
    if (!/^\d$/.test(value)) {
        input.value = '';
        return;
    }

    // Remove error state
    input.classList.remove('error');
    elements.customPatternError.textContent = '';

    // Validate against current scale
    const scaleLength = getScaleLength(currentScale);
    const noteNum = parseInt(value);

    if (noteNum < 1 || noteNum > scaleLength) {
        input.classList.add('error');
        elements.customPatternError.textContent = `Note must be between 1 and ${scaleLength} for ${SCALE_LIBRARY[currentScale].name}`;
        return;
    }

    // Create next box if this is the last one
    const boxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    const currentIndex = Array.from(boxes).indexOf(input);

    if (currentIndex === boxes.length - 1 && boxes.length < MAX_PATTERN_LENGTH) {
        const nextBox = createPatternBox();
        if (nextBox) {
            nextBox.focus();
        }
    } else if (currentIndex < boxes.length - 1) {
        // Focus next existing box
        boxes[currentIndex + 1].focus();
    }
}

function handleBoxKeydown(e) {
    const input = e.target;
    const boxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    const currentIndex = Array.from(boxes).indexOf(input);

    // Backspace on empty box - go to previous and delete it
    if (e.key === 'Backspace' && input.value === '' && currentIndex > 0) {
        e.preventDefault();
        const prevBox = boxes[currentIndex - 1];
        prevBox.focus();
        prevBox.value = '';

        // Remove current empty box if it's not the last one
        if (boxes.length > 1) {
            input.remove();
        }
    }

    // Arrow keys for navigation
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        boxes[currentIndex - 1].focus();
    }
    if (e.key === 'ArrowRight' && currentIndex < boxes.length - 1) {
        e.preventDefault();
        boxes[currentIndex + 1].focus();
    }
}

function handleBoxPaste(e) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numbers = pasteData.match(/\d/g);

    if (!numbers) return;

    const boxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    const currentIndex = Array.from(boxes).indexOf(e.target);

    // Clear existing boxes after current
    for (let i = boxes.length - 1; i > currentIndex; i--) {
        boxes[i].remove();
    }

    // Fill boxes with pasted numbers
    const scaleLength = getScaleLength(currentScale);
    let boxIndex = currentIndex;

    for (let i = 0; i < numbers.length && boxIndex < MAX_PATTERN_LENGTH; i++) {
        const num = parseInt(numbers[i]);

        // Validate number
        if (num < 1 || num > scaleLength) {
            elements.customPatternError.textContent = `Note ${num} exceeds scale length (${scaleLength})`;
            continue;
        }

        // Get or create box
        let box = elements.customPatternBoxes.querySelectorAll('.pattern-box')[boxIndex];
        if (!box) {
            box = createPatternBox();
        }

        if (box) {
            box.value = num;
            boxIndex++;
        }
    }

    // Create one empty box at the end if under limit
    const finalBoxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    if (finalBoxes.length < MAX_PATTERN_LENGTH) {
        const newBox = createPatternBox();
        if (newBox) newBox.focus();
    } else {
        finalBoxes[finalBoxes.length - 1].focus();
    }
}

function useCustomPattern() {
    const boxes = elements.customPatternBoxes.querySelectorAll('.pattern-box');
    const pattern = [];
    const scaleLength = getScaleLength(currentScale);

    elements.customPatternError.textContent = '';

    // Extract values from boxes
    for (const box of boxes) {
        if (box.value) {
            const num = parseInt(box.value);

            if (num < 1 || num > scaleLength) {
                elements.customPatternError.textContent = `All notes must be between 1 and ${scaleLength}`;
                box.classList.add('error');
                return;
            }

            pattern.push(num);
        }
    }

    if (pattern.length === 0) {
        elements.customPatternError.textContent = 'Please enter at least one note';
        return;
    }

    // Set as current pattern
    currentPattern = pattern;

    updatePatternDisplay();
    updateScaleVisual();
    updateScaleInfo();
    enablePlaybackControls();
    resetPlaybackState();

    // If in self-paced mode, start it automatically
    if (practiceMode === 'self-paced') {
        startSelfPacedMode();
    }

    elements.customPatternError.textContent = '';
}

function clearCustomPattern() {
    // Remove all boxes
    elements.customPatternBoxes.innerHTML = '';

    // Create one empty box
    const newBox = createPatternBox();
    if (newBox) newBox.focus();

    elements.customPatternError.textContent = '';
}

function updatePatternDisplay() {
    const patternText = currentPattern.join(' ');
    const handdrawnText = stringToHanddrawn(patternText);
    elements.patternDisplay.innerHTML = `<span class="pattern-text">${handdrawnText}</span>`;
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

function handleInstrumentChange(e) {
    currentInstrument = e.target.value;
    if (audioEngine) {
        audioEngine.setInstrument(currentInstrument);
    }

    // Save preference to localStorage
    localStorage.setItem('preferredInstrument', currentInstrument);
}

function loadInstrumentPreference() {
    const saved = localStorage.getItem('preferredInstrument');
    if (saved && INSTRUMENTS[saved]) {
        currentInstrument = saved;
        elements.instrument.value = saved;
        if (audioEngine) {
            audioEngine.setInstrument(currentInstrument);
        }
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
            const handdrawnNum = numberToHanddrawn(noteNum);
            content += `<div class="note-number">${handdrawnNum}</div>`;
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
        let displayHTML = '';

        if (showNumbers) {
            displayHTML += numberToHanddrawn(note);
        }

        if (showSyllables) {
            const syllable = scale.solfege[syllableSystem][note - 1];
            if (showNumbers) {
                displayHTML += ` (${syllable})`;
            } else {
                displayHTML = syllable;
            }
        }

        elements.currentNote.innerHTML = displayHTML;

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
async function playNote(noteNumber, duration = 0.5) {
    // Check if sound should play
    const shouldPlaySound = practiceMode === 'listen' || practiceMode === 'self-paced';

    if (!shouldPlaySound) return;
    if (!audioEngine) return;

    const scale = SCALE_LIBRARY[currentScale];
    const frequency = BASE_FREQUENCY * scale.ratios[noteNumber - 1];

    // Use the enhanced audio engine
    await audioEngine.playNote(frequency, duration);
}

async function playPattern() {
    if (currentPattern.length === 0) return;

    isPlaying = true;
    currentNoteIndex = 0;

    // Initialize loop tracking
    totalLoops = parseInt(elements.loopCount.value) || 1;
    currentLoop = 1;

    elements.playBtn.disabled = true;
    elements.pauseBtn.disabled = false;
    elements.restartBtn.disabled = false;
    elements.generateBtn.disabled = true;

    updateLoopIndicator();
    await playNextNote();
}

async function playNextNote() {
    if (!isPlaying) {
        finishPlayback();
        return;
    }

    // Check if pattern is complete
    if (currentNoteIndex >= currentPattern.length) {
        // Check if we should loop again
        if (currentLoop < totalLoops) {
            currentLoop++;
            currentNoteIndex = 0;
            updateLoopIndicator();

            // Small gap before next loop
            playbackTimeout = setTimeout(() => playNextNote(), 500);
            return;
        } else {
            // All loops complete
            finishPlayback();
            return;
        }
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

    // Record practice session
    recordPracticeSession();
}

function resetPlaybackState() {
    if (playbackTimeout) {
        clearTimeout(playbackTimeout);
        playbackTimeout = null;
    }

    isPlaying = false;
    currentNoteIndex = 0;
    currentLoop = 1;

    elements.playBtn.textContent = 'Play';
    elements.pauseBtn.disabled = true;

    highlightNote(-1);
    elements.loopIndicator.textContent = '';
}

function updateLoopIndicator() {
    if (totalLoops > 1) {
        elements.loopIndicator.textContent = `Loop ${currentLoop} of ${totalLoops}`;
    } else {
        elements.loopIndicator.textContent = '';
    }
}

function enablePlaybackControls() {
    elements.playBtn.disabled = false;
    elements.restartBtn.disabled = false;
    elements.bookmarkPatternBtn.disabled = false;
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

// ===== BOOKMARKS =====
function bookmarkCurrentPattern() {
    if (currentPattern.length === 0) return;

    const bookmark = {
        id: Date.now(),
        pattern: [...currentPattern],
        scale: currentScale,
        difficulty: currentDifficulty,
        patternMode: currentPatternMode,
        date: new Date().toISOString()
    };

    // Get existing bookmarks
    const bookmarks = getBookmarks();

    // Add new bookmark at the beginning
    bookmarks.unshift(bookmark);

    // Limit to 20 bookmarks
    if (bookmarks.length > 20) {
        bookmarks.pop();
    }

    // Save to localStorage
    localStorage.setItem('earTrainingBookmarks', JSON.stringify(bookmarks));

    // Reload bookmarks display
    loadBookmarks();

    // Visual feedback
    elements.bookmarkPatternBtn.textContent = 'Bookmarked!';
    elements.bookmarkPatternBtn.classList.add('bookmarked');
    setTimeout(() => {
        elements.bookmarkPatternBtn.textContent = 'Bookmark This Pattern';
        elements.bookmarkPatternBtn.classList.remove('bookmarked');
    }, 2000);
}

function getBookmarks() {
    const stored = localStorage.getItem('earTrainingBookmarks');
    return stored ? JSON.parse(stored) : [];
}

function loadBookmarks() {
    const bookmarks = getBookmarks();

    if (bookmarks.length === 0) {
        elements.bookmarksList.innerHTML = '<p class="empty-state">No bookmarks yet. Generate a pattern and bookmark it!</p>';
        return;
    }

    elements.bookmarksList.innerHTML = '';

    bookmarks.forEach(bookmark => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';

        const scale = SCALE_LIBRARY[bookmark.scale];
        const date = new Date(bookmark.date);
        const dateStr = date.toLocaleDateString();

        item.innerHTML = `
            <div class="bookmark-info">
                <div class="bookmark-pattern">${bookmark.pattern.join(' ')}</div>
                <div class="bookmark-meta">
                    ${scale.name} • ${bookmark.difficulty} • ${dateStr}
                </div>
            </div>
            <div class="bookmark-actions">
                <button class="btn btn-small load-bookmark" data-id="${bookmark.id}">Load</button>
                <button class="btn btn-small delete-bookmark" data-id="${bookmark.id}">Delete</button>
            </div>
        `;

        elements.bookmarksList.appendChild(item);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.load-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            loadBookmark(id);
        });
    });

    document.querySelectorAll('.delete-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteBookmark(id);
        });
    });
}

function loadBookmark(id) {
    const bookmarks = getBookmarks();
    const bookmark = bookmarks.find(b => b.id === id);

    if (!bookmark) return;

    // Set scale and difficulty
    currentScale = bookmark.scale;
    currentDifficulty = bookmark.difficulty;
    currentPatternMode = bookmark.patternMode;
    currentPattern = [...bookmark.pattern];

    // Update UI
    elements.scale.value = bookmark.scale;
    elements.difficulty.value = bookmark.difficulty;
    elements.patternMode.value = bookmark.patternMode;

    updatePatternDisplay();
    updateScaleVisual();
    updateScaleInfo();
    enablePlaybackControls();
    resetPlaybackState();

    // If in self-paced mode, start it
    if (practiceMode === 'self-paced') {
        startSelfPacedMode();
    }

    // Scroll to pattern display
    document.querySelector('.pattern-display-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deleteBookmark(id) {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);

    localStorage.setItem('earTrainingBookmarks', JSON.stringify(filtered));
    loadBookmarks();
}

// ===== PRACTICE HISTORY =====
function recordPracticeSession() {
    const today = new Date().toDateString();
    const history = getPracticeHistory();

    // Find or create today's entry
    let todayEntry = history.sessions.find(s => s.date === today);
    if (!todayEntry) {
        todayEntry = { date: today, patterns: 0 };
        history.sessions.push(todayEntry);
    }

    // Increment pattern count
    todayEntry.patterns++;
    history.totalPatterns++;

    // Save to localStorage
    localStorage.setItem('earTrainingHistory', JSON.stringify(history));

    // Update UI
    updatePracticeStats();
    updatePracticeCalendar();
}

function getPracticeHistory() {
    const stored = localStorage.getItem('earTrainingHistory');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default structure
    return {
        sessions: [],
        totalPatterns: 0
    };
}

function updatePracticeStats() {
    const history = getPracticeHistory();

    // Total sessions (unique days)
    elements.totalSessions.textContent = history.sessions.length;

    // Total patterns played
    elements.totalPatterns.textContent = history.totalPatterns;

    // Calculate streak
    const streak = calculateStreak(history.sessions);
    elements.currentStreak.textContent = streak;
}

function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;

    // Sort sessions by date (most recent first)
    const sorted = sessions.map(s => new Date(s.date)).sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if most recent session is today or yesterday
    const mostRecent = sorted[0];
    mostRecent.setHours(0, 0, 0, 0);

    if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
        return 0; // Streak broken
    }

    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(mostRecent);

    for (let i = 1; i < sorted.length; i++) {
        const prevDate = new Date(sorted[i]);
        prevDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);

        if (prevDate.getTime() === expectedDate.getTime()) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    return streak;
}

function updatePracticeCalendar() {
    const history = getPracticeHistory();
    const today = new Date();

    // Generate last 28 days (4 weeks)
    const days = [];
    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date);
    }

    // Create calendar header with weekday names
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let calendarHTML = '<div class="calendar-header">';
    weekdays.forEach(day => {
        calendarHTML += `<div class="calendar-weekday">${day}</div>`;
    });
    calendarHTML += '</div><div class="practice-calendar">';

    // Add empty cells for alignment (first day of the first week)
    const firstDayOfWeek = days[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Add calendar days
    days.forEach(date => {
        const dateStr = date.toDateString();
        const session = history.sessions.find(s => s.date === dateStr);
        const isToday = dateStr === today.toDateString();

        const classes = ['calendar-day'];
        if (session) classes.push('has-practice');
        if (isToday) classes.push('today');

        const dayNumber = date.getDate();
        const practiceCount = session ? `${session.patterns}×` : '';

        calendarHTML += `
            <div class="${classes.join(' ')}" title="${dateStr}${session ? ` - ${session.patterns} patterns` : ''}">
                <span class="day-number">${dayNumber}</span>
                ${session ? `<span class="practice-count">${practiceCount}</span>` : ''}
            </div>
        `;
    });

    calendarHTML += '</div>';

    // Update the parent container (which includes both header and calendar)
    const calendarContainer = elements.practiceCalendar.parentElement;
    const existingHeader = calendarContainer.querySelector('.calendar-header');
    if (existingHeader) {
        existingHeader.remove();
    }

    elements.practiceCalendar.outerHTML = calendarHTML;

    // Re-get the element reference after updating HTML
    elements.practiceCalendar = document.getElementById('practice-calendar');
}

function initializePracticeHistory() {
    updatePracticeStats();
    updatePracticeCalendar();
}

// ===== PAKAD PHRASES =====
function updatePakadDisplay() {
    const scale = SCALE_LIBRARY[currentScale];

    // Only show pakad for ragas that have them (Hindustani ragas)
    if (!scale.pakad || scale.pakad.length === 0) {
        elements.pakadSection.style.display = 'none';
        return;
    }

    // Show the pakad section
    elements.pakadSection.style.display = 'block';

    // Clear existing phrases
    elements.pakadPhrases.innerHTML = '';

    // Display each pakad phrase
    scale.pakad.forEach((phrase, index) => {
        const item = document.createElement('div');
        item.className = 'pakad-item';

        // Display the phrase as numbers
        const patternDiv = document.createElement('div');
        patternDiv.className = 'pakad-pattern';
        const phraseText = phrase.join(' ');
        patternDiv.innerHTML = stringToHanddrawn(phraseText);

        // Create play button
        const playBtn = document.createElement('button');
        playBtn.className = 'btn btn-small';
        playBtn.textContent = 'Play';
        playBtn.onclick = () => playPakadPhrase(phrase);

        item.appendChild(patternDiv);
        item.appendChild(playBtn);
        elements.pakadPhrases.appendChild(item);
    });
}

function playPakadPhrase(phrase) {
    // Stop any current playback
    if (isPlaying) {
        pausePlayback();
    }

    // Play each note in the phrase
    let noteIndex = 0;

    function playNextPakadNote() {
        if (noteIndex >= phrase.length) {
            return;
        }

        const note = phrase[noteIndex];
        const durationSec = noteDuration / 1000;

        // Play the note
        playNote(note, durationSec);

        noteIndex++;

        // Schedule next note
        const gap = parseInt(elements.noteGap.value);
        const totalDelay = (noteDuration + gap) / playbackSpeed;
        setTimeout(() => playNextPakadNote(), totalDelay);
    }

    playNextPakadNote();
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
