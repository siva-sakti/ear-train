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

// Detailed interval names with short notations
const INTERVAL_NAMES_DETAILED = {
    0: { short: 'P1', long: 'Perfect Unison' },
    1: { short: 'm2', long: 'Minor Second' },
    2: { short: 'M2', long: 'Major Second' },
    3: { short: 'm3', long: 'Minor Third' },
    4: { short: 'M3', long: 'Major Third' },
    5: { short: 'P4', long: 'Perfect Fourth' },
    6: { short: 'TT', long: 'Tritone' },
    7: { short: 'P5', long: 'Perfect Fifth' },
    8: { short: 'm6', long: 'Minor Sixth' },
    9: { short: 'M6', long: 'Major Sixth' },
    10: { short: 'm7', long: 'Minor Seventh' },
    11: { short: 'M7', long: 'Major Seventh' },
    12: { short: 'P8', long: 'Perfect Octave' }
};

// Interval progression templates for pedagogical mode
// Format: { s: semitones, d: direction ('up'/'down') }
const INTERVAL_TEMPLATES = {
    easy: {
        progressions: [
            [{ s: 2, d: 'up' }, { s: 2, d: 'up' }, { s: 2, d: 'down' }],  // M2↑ M2↑ M2↓
            [{ s: 2, d: 'up' }, { s: 2, d: 'down' }, { s: 2, d: 'up' }],
            [{ s: 1, d: 'up' }, { s: 2, d: 'up' }, { s: 1, d: 'down' }],
            [{ s: 2, d: 'up' }, { s: 2, d: 'up' }, { s: 2, d: 'up' }, { s: 2, d: 'down' }],
            [{ s: 1, d: 'down' }, { s: 2, d: 'down' }, { s: 2, d: 'up' }]
        ],
        single: [1, 2]  // Only minor 2nd and major 2nd
    },
    medium: {
        progressions: [
            [{ s: 2, d: 'up' }, { s: 3, d: 'up' }, { s: 2, d: 'down' }],  // Mix 2nds and 3rds
            [{ s: 4, d: 'up' }, { s: 2, d: 'down' }, { s: 3, d: 'down' }],
            [{ s: 3, d: 'up' }, { s: 4, d: 'up' }, { s: 5, d: 'down' }],  // Add 4ths and 5ths
            [{ s: 2, d: 'up' }, { s: 3, d: 'up' }, { s: 4, d: 'down' }, { s: 2, d: 'down' }],
            [{ s: 5, d: 'up' }, { s: 3, d: 'down' }, { s: 4, d: 'up' }]
        ],
        single: [1, 2, 3, 4, 5]  // Up to perfect fifth
    },
    hard: {
        progressions: [
            [{ s: 5, d: 'up' }, { s: 7, d: 'up' }, { s: 4, d: 'down' }],  // Large leaps
            [{ s: 7, d: 'up' }, { s: 3, d: 'down' }, { s: 5, d: 'up' }],
            [{ s: 4, d: 'up' }, { s: 7, d: 'up' }, { s: 9, d: 'down' }, { s: 3, d: 'down' }],
            [{ s: 12, d: 'up' }, { s: 5, d: 'down' }, { s: 7, d: 'up' }],  // Octave leaps
            [{ s: 6, d: 'up' }, { s: 8, d: 'down' }, { s: 10, d: 'up' }, { s: 11, d: 'down' }]
        ],
        single: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]  // All intervals including octave
    }
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
let practiceMode = 'listen'; // 'listen', 'self-paced'
let playbackSpeed = 1.0;
let noteDuration = 1000; // milliseconds (1 second default)
let isPlaying = false;
let currentNoteIndex = 0;
let playbackTimeout = null;
let lastNote = null;
let currentLoop = 1;
let totalLoops = 1;
let currentInstrument = 'piano'; // Default instrument
let guessingModeInstrument = 'piano'; // Always use piano for guessing mode

// Interval training state
let currentTrainingType = 'note'; // 'note' or 'interval'
let currentIntervalMode = 'progressions'; // 'progressions' or 'single'
let currentIntervalPattern = []; // Array of interval objects
let intervalGenerationMode = 'pedagogical'; // 'pedagogical' or 'random'
let intervalDifficulty = 'medium'; // 'easy', 'medium', 'hard'
let intervalScale = 'major'; // Separate scale for interval training
let intervalPatternLength = 1; // Number of intervals in a progression (default 1)
let intervalNoteGap = 1000; // Gap between two notes within an interval (ms)
let intervalPatternGap = 1200; // Gap between intervals in a progression (ms)
let currentIntervalNoteIndex = 0; // For self-paced: 0 = start note, 1 = end note

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
    pakadPhrases: document.getElementById('pakad-phrases'),

    // Training Type Toggle
    noteTrainingBtn: document.getElementById('note-training-btn'),
    intervalTrainingBtn: document.getElementById('interval-training-btn'),
    noteTrainingContainer: document.getElementById('note-training-container'),
    intervalTrainingContainer: document.getElementById('interval-training-container'),

    // Interval Training
    intervalModeRadios: document.querySelectorAll('input[name="interval-mode"]'),
    intervalScale: document.getElementById('interval-scale'),
    intervalPatternMode: document.getElementById('interval-pattern-mode'),
    intervalDifficultySelect: document.getElementById('interval-difficulty'),
    patternLength: document.getElementById('pattern-length'),
    intervalNoteGap: document.getElementById('interval-note-gap'),
    intervalNoteGapValue: document.getElementById('interval-note-gap-value'),
    intervalPatternGap: document.getElementById('interval-pattern-gap'),
    intervalPatternGapValue: document.getElementById('interval-pattern-gap-value'),
    generateIntervalBtn: document.getElementById('generate-interval-btn'),
    intervalPatternDisplay: document.getElementById('interval-pattern-display'),
    intervalStyleRadios: document.querySelectorAll('input[name="interval-style"]'),
    bookmarkIntervalBtn: document.getElementById('bookmark-interval-btn'),
    intervalBookmarksList: document.getElementById('interval-bookmarks-list')
};

// ===== MOBILE AUDIO UNLOCK =====
function setupMobileAudioUnlock() {
    // On mobile browsers, audio context starts suspended and requires user interaction
    let unlocked = false;
    const banner = document.getElementById('audio-unlock-banner');

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Show banner on mobile devices
    if (isMobile && banner) {
        banner.style.display = 'block';
    }

    const unlockAudio = async () => {
        if (unlocked) return;

        if (audioEngine && audioEngine.audioContext) {
            // Resume the context
            await audioEngine.resumeContext();

            // Play a silent sound to fully unlock audio on iOS/Android
            try {
                const ctx = audioEngine.audioContext;
                const now = ctx.currentTime;

                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                gainNode.gain.value = 0.001;
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.start(now + 0.001);
                oscillator.stop(now + 0.002);

                await new Promise(resolve => setTimeout(resolve, 50));

            } catch (e) {
                console.error('Error unlocking audio:', e);
            }

            unlocked = true;

            // Update status indicator
            updateAudioStatus();

            // Hide banner
            if (banner) {
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 1500);
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

// ===== AUDIO HELP & STATUS =====
function setupAudioHelp() {
    const helpIcon = document.getElementById('audio-help-icon');
    const helpTooltip = document.getElementById('audio-help-tooltip');
    const helpClose = helpTooltip?.querySelector('.help-close');

    if (!helpIcon || !helpTooltip) return;

    // Toggle tooltip on click
    helpIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = helpTooltip.style.display === 'block';
        helpTooltip.style.display = isVisible ? 'none' : 'block';
    });

    // Close button
    if (helpClose) {
        helpClose.addEventListener('click', () => {
            helpTooltip.style.display = 'none';
        });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!helpTooltip.contains(e.target) && !helpIcon.contains(e.target)) {
            helpTooltip.style.display = 'none';
        }
    });
}

function updateAudioStatus() {
    const statusIndicator = document.getElementById('audio-status-indicator');
    if (!statusIndicator || !audioEngine?.audioContext) return;

    const state = audioEngine.audioContext.state;

    // Remove all state classes
    statusIndicator.classList.remove('ready', 'suspended', 'error');

    // Add current state class
    if (state === 'running') {
        statusIndicator.classList.add('ready');
    } else if (state === 'suspended') {
        statusIndicator.classList.add('suspended');
    } else {
        statusIndicator.classList.add('error');
    }
}

// ===== INITIALIZATION =====
function init() {

    // === AUTOMATIC CACHE BUSTING ON NEW DEPLOY ===
    fetch("/version.json?t=" + Date.now())
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch version");
            return res.json();
        })
        .then(data => {
            const newVersion = data.version;
            const oldVersion = localStorage.getItem("appVersion");

            if (oldVersion && oldVersion !== newVersion) {
                // New version detected → force full refresh
                console.log("New version detected:", newVersion, "→ forcing reload");

                // Unregister old service worker
                if (navigator.serviceWorker) {
                    navigator.serviceWorker.getRegistrations().then(regs => {
                        regs.forEach(reg => reg.unregister());
                    });
                }

                // Clear localStorage and hard reload
                localStorage.clear();
                window.location.reload(true); // true forces reload from server
            } else {
                // First visit or same version
                localStorage.setItem("appVersion", newVersion);
            }
        })
        .catch(err => {
            console.warn("Version check failed (offline or error) → continuing", err);
        });
    // =============================================
    // Initialize enhanced audio engine
    audioEngine = new AudioEngine();
    audioEngine.initialize();

    // Mobile audio unlock - resume context on first user interaction
    setupMobileAudioUnlock();

    // Set up audio help and status
    setupAudioHelp();
    updateAudioStatus();

    // Update status periodically
    setInterval(updateAudioStatus, 2000);

    // Set up event listeners
    setupEventListeners();

    // Initialize scale visual
    createScaleVisual();

    // Load bookmarks
    loadBookmarks();
    loadIntervalBookmarks();

    // Initialize practice history
    initializePracticeHistory();

    // Load saved instrument preference
    loadInstrumentPreference();

    // Set up guessing mode
    setupModeToggle();
    setupGuessTypeToggle();
    setupGuessingModeListeners();

    // Set up tuner mode
    setupTunerMode();

    // Register service worker for PWA support
    // TEMPORARILY DISABLED FOR DEVELOPMENT
    if (false && 'serviceWorker' in navigator) {
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

    // Training Type Toggle (Note vs Interval)
    elements.noteTrainingBtn.addEventListener('click', () => {
        currentTrainingType = 'note';
        elements.noteTrainingBtn.classList.add('active');
        elements.intervalTrainingBtn.classList.remove('active');
        elements.noteTrainingContainer.style.display = 'block';
        elements.intervalTrainingContainer.style.display = 'none';

        // Toggle bookmark sections
        document.getElementById('note-bookmarks-section').style.display = 'block';
        document.getElementById('interval-bookmarks-section').style.display = 'none';

        // Show practice history and coming soon (note training only)
        document.getElementById('practice-history-section').style.display = 'block';
        document.getElementById('coming-soon-section').style.display = 'block';

        // Show/hide gap controls in Advanced Controls
        document.getElementById('interval-note-gap-row').style.display = 'none';
        document.getElementById('interval-pattern-gap-row').style.display = 'none';

        // Rebuild scale visual for note training mode
        createScaleVisual();

        resetPlaybackState();
    });

    elements.intervalTrainingBtn.addEventListener('click', () => {
        currentTrainingType = 'interval';
        elements.intervalTrainingBtn.classList.add('active');
        elements.noteTrainingBtn.classList.remove('active');
        elements.intervalTrainingContainer.style.display = 'block';
        elements.noteTrainingContainer.style.display = 'none';

        // Toggle bookmark sections
        document.getElementById('note-bookmarks-section').style.display = 'none';
        document.getElementById('interval-bookmarks-section').style.display = 'block';

        // Hide practice history and coming soon (interval training doesn't need them)
        document.getElementById('practice-history-section').style.display = 'none';
        document.getElementById('coming-soon-section').style.display = 'none';

        // Show/hide gap controls in Advanced Controls
        document.getElementById('interval-note-gap-row').style.display = 'flex';
        document.getElementById('interval-pattern-gap-row').style.display = 'flex';

        // Rebuild scale visual for interval training mode
        createScaleVisual();

        resetPlaybackState();
    });

    // Interval Mode Toggle (Progressions vs Single)
    elements.intervalModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentIntervalMode = e.target.value;
            // Clear current pattern when switching modes
            currentIntervalPattern = [];
            updateIntervalPatternDisplay();

            // Show/hide pattern length setting
            const patternLengthRow = document.getElementById('pattern-length-row');
            if (patternLengthRow) {
                patternLengthRow.style.display = currentIntervalMode === 'progressions' ? 'flex' : 'none';
            }
        });
    });

    // Interval Pattern Settings
    if (elements.intervalScale) {
        elements.intervalScale.addEventListener('change', (e) => {
            intervalScale = e.target.value;
            // Update scale visual if we have a pattern
            if (currentIntervalPattern.length > 0) {
                updateScaleVisualForIntervals();
            }
        });
    }

    if (elements.intervalPatternMode) {
        elements.intervalPatternMode.addEventListener('change', (e) => {
            intervalGenerationMode = e.target.value;
        });
    }

    if (elements.intervalDifficultySelect) {
        elements.intervalDifficultySelect.addEventListener('change', (e) => {
            intervalDifficulty = e.target.value;
        });
    }

    if (elements.patternLength) {
        elements.patternLength.addEventListener('change', (e) => {
            intervalPatternLength = parseInt(e.target.value) || 1;
            // Clamp value between 1 and 12
            if (intervalPatternLength < 1) intervalPatternLength = 1;
            if (intervalPatternLength > 12) intervalPatternLength = 12;
            elements.patternLength.value = intervalPatternLength;
        });
    }

    if (elements.intervalNoteGap) {
        elements.intervalNoteGap.addEventListener('input', (e) => {
            intervalNoteGap = parseInt(e.target.value);
            elements.intervalNoteGapValue.textContent = `${intervalNoteGap}ms`;
        });
    }

    if (elements.intervalPatternGap) {
        elements.intervalPatternGap.addEventListener('input', (e) => {
            intervalPatternGap = parseInt(e.target.value);
            elements.intervalPatternGapValue.textContent = `${intervalPatternGap}ms`;
        });
    }

    // Interval Pattern Generation
    if (elements.generateIntervalBtn) {
        elements.generateIntervalBtn.addEventListener('click', () => {
            generateIntervalPattern();
            updateIntervalPatternDisplay();
            enablePlaybackControls();
            resetPlaybackState();
            // Enable bookmark button
            if (elements.bookmarkIntervalBtn) {
                elements.bookmarkIntervalBtn.disabled = false;
            }
        });
    }

    // Interval Bookmark
    if (elements.bookmarkIntervalBtn) {
        elements.bookmarkIntervalBtn.addEventListener('click', () => {
            bookmarkIntervalPattern();
        });
    }
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

// ===== INTERVAL TRAINING GENERATION =====

function generateIntervalPattern() {
    if (intervalGenerationMode === 'pedagogical') {
        generatePedagogicalIntervalPattern();
    } else if (intervalGenerationMode === 'random') {
        generateRandomIntervalPattern();
    }
}

function generatePedagogicalIntervalPattern() {
    const templates = currentIntervalMode === 'progressions'
        ? INTERVAL_TEMPLATES[intervalDifficulty].progressions
        : INTERVAL_TEMPLATES[intervalDifficulty].single;

    if (currentIntervalMode === 'progressions') {
        // Generate the exact number of intervals requested
        currentIntervalPattern = [];
        const template = templates[Math.floor(Math.random() * templates.length)];

        for (let i = 0; i < intervalPatternLength; i++) {
            // Cycle through the template if needed
            const templateInterval = template[i % template.length];
            currentIntervalPattern.push(buildIntervalFromTemplate(templateInterval));
        }
    } else {
        // Single interval mode: pick one interval
        const semitones = templates[Math.floor(Math.random() * templates.length)];
        const direction = Math.random() < 0.5 ? 'up' : 'down';
        currentIntervalPattern = [buildIntervalFromTemplate({ s: semitones, d: direction })];
    }
}

function generateRandomIntervalPattern() {
    const rules = {
        easy: { maxInterval: 2 },
        medium: { maxInterval: 5 },
        hard: { maxInterval: 12 }
    };

    const rule = rules[intervalDifficulty];
    const length = currentIntervalMode === 'single' ? 1 : intervalPatternLength;

    currentIntervalPattern = [];
    for (let i = 0; i < length; i++) {
        const semitones = 1 + Math.floor(Math.random() * rule.maxInterval);
        const direction = Math.random() < 0.5 ? 'up' : 'down';
        currentIntervalPattern.push(buildIntervalFromTemplate({ s: semitones, d: direction }));
    }
}

function buildIntervalFromTemplate(template) {
    const scale = currentTrainingType === 'interval' ? intervalScale : currentScale;
    const scaleLength = getScaleLength(scale);
    const scaleData = SCALE_LIBRARY[scale];

    // Pick valid starting note - try to keep intervals within scale range
    let startNote;
    if (template.d === 'up') {
        const maxStart = Math.max(1, scaleLength - Math.ceil(template.s / 2));
        startNote = 1 + Math.floor(Math.random() * Math.min(maxStart, scaleLength - 1));
    } else {
        const minStart = 1 + Math.ceil(template.s / 2);
        startNote = Math.max(2, Math.min(scaleLength, minStart + Math.floor(Math.random() * 3)));
    }

    // Calculate end note (can go beyond scaleLength for octaves)
    // For display purposes - actual frequency is calculated separately
    const scaleDegreeInterval = Math.ceil(template.s / 2); // Rough approximation
    const endNote = template.d === 'up'
        ? startNote + scaleDegreeInterval  // Allow > 7 for octave-up notes
        : Math.max(startNote - scaleDegreeInterval, 1);  // Clamp at 1 for down

    // Calculate frequencies using pure equal temperament
    // For interval training, we use ET exclusively for consistent intervals across all starting notes
    // Map scale degree to semitones above base (for major scale: 1=0, 2=2, 3=4, 4=5, 5=7, 6=9, 7=11)
    const scaleSemitones = [0, 2, 4, 5, 7, 9, 11]; // Major scale pattern
    const startSemitone = scaleSemitones[(startNote - 1) % scaleSemitones.length];

    const startFreq = BASE_FREQUENCY * Math.pow(2, startSemitone / 12);
    const endSemitone = template.d === 'up'
        ? startSemitone + template.s
        : startSemitone - template.s;
    const endFreq = BASE_FREQUENCY * Math.pow(2, endSemitone / 12);

    return {
        semitones: template.s,
        direction: template.d,
        name: INTERVAL_NAMES_DETAILED[template.s].long,
        notation: INTERVAL_NAMES_DETAILED[template.s].short,
        startNote,
        endNote,
        startFreq,
        endFreq
    };
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

function intervalNotationToHanddrawn(notation, direction) {
    // Convert interval notation like "M3" to handdrawn images
    let html = '';

    // Handle the letter part (M, m, P, TT)
    if (notation.startsWith('TT')) {
        // Tritone - use two T's
        html += '<img src="assets/letter-t.png" class="interval-letter" alt="T">';
        html += '<img src="assets/letter-t.png" class="interval-letter" alt="T">';
        notation = notation.substring(2); // Remove "TT"
    } else if (notation.startsWith('M') || notation.startsWith('m')) {
        html += '<img src="assets/letter-m.png" class="interval-letter" alt="' + notation[0] + '">';
        notation = notation.substring(1); // Remove first letter
    } else if (notation.startsWith('P')) {
        html += '<img src="assets/letter-p.png" class="interval-letter" alt="P">';
        notation = notation.substring(1); // Remove "P"
    }

    // Handle the number part using existing handdrawn digits
    const digits = notation.split('');
    digits.forEach(digit => {
        if (digit >= '0' && digit <= '9') {
            html += `<span class="handwritten-digit" data-digit="${digit}"></span>`;
        }
    });

    // Add arrow
    const arrowFile = direction === 'up' ? 'arrow-up.png' : 'arrow-down.png';
    html += `<img src="assets/${arrowFile}" class="interval-arrow" alt="${direction === 'up' ? '↑' : '↓'}">`;

    return html;
}

function updateIntervalPatternDisplay() {
    if (currentIntervalPattern.length === 0) {
        elements.intervalPatternDisplay.innerHTML = '<p class="info-text">Generate a pattern to begin</p>';
        return;
    }

    // Build handdrawn interval notation
    const intervalHtml = currentIntervalPattern.map(iv => {
        return `<span class="interval-notation">${intervalNotationToHanddrawn(iv.notation, iv.direction)}</span>`;
    }).join('<span class="interval-spacer">&nbsp;&nbsp;</span>');

    // Build plain English description
    const plainEnglish = currentIntervalPattern.map(iv => {
        const direction = iv.direction === 'up' ? 'Up' : 'Down';
        return `${iv.name} ${direction}`;
    }).join(', ');

    elements.intervalPatternDisplay.innerHTML = `
        <div>
            <div class="pattern-text interval-pattern">${intervalHtml}</div>
            <div class="interval-plain-english" style="margin-top: 12px; font-size: 0.9em; color: var(--text-muted);">${plainEnglish}</div>
        </div>
    `;

    // Update scale visual to show pattern notes in purple
    updateScaleVisualForIntervals();
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
        const hasPattern = currentTrainingType === 'interval'
            ? currentIntervalPattern.length > 0
            : currentPattern.length > 0;

        if (hasPattern) {
            startSelfPacedMode();
        }
    } else if (practiceMode === 'listen') {
        // Show auto-play controls, hide self-paced
        elements.selfPacedControls.style.display = 'none';
        elements.playbackControls.style.display = 'flex';
    }
}

// ===== SCALE VISUAL =====
function createScaleVisual() {
    // Use the appropriate scale based on training type
    const scale = currentTrainingType === 'interval' ? intervalScale : currentScale;
    const scaleLength = getScaleLength(scale);
    const scaleData = SCALE_LIBRARY[scale];

    elements.scaleVisual.innerHTML = '';

    for (let i = 1; i <= scaleLength; i++) {
        const noteCircle = document.createElement('div');
        noteCircle.className = 'note-circle';
        noteCircle.dataset.note = i;

        elements.scaleVisual.appendChild(noteCircle);
    }

    // Always update visual to populate numbers/syllables, and apply pattern highlighting if exists
    if (currentTrainingType === 'interval') {
        updateScaleVisualForIntervals();
    } else {
        updateScaleVisual();
    }
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
    // Route to highlightInterval for interval training
    if (currentTrainingType === 'interval') {
        highlightInterval(noteIndex);
        return;
    }

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

    if (!shouldPlaySound) {
        return;
    }
    if (!audioEngine) {
        return;
    }

    const scale = SCALE_LIBRARY[currentScale];
    const frequency = BASE_FREQUENCY * scale.ratios[noteNumber - 1];

    // Use the enhanced audio engine
    await audioEngine.playNote(frequency, duration);
}

async function playPattern() {
    // Check which training type and pattern exists
    if (currentTrainingType === 'note' && currentPattern.length === 0) return;
    if (currentTrainingType === 'interval' && currentIntervalPattern.length === 0) return;

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

    // Route to appropriate playback function
    if (currentTrainingType === 'note') {
        await playNextNote();
    } else {
        await playNextInterval();
    }
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

// ===== INTERVAL PLAYBACK =====

async function playNextInterval() {
    if (!isPlaying) {
        finishPlayback();
        return;
    }

    // Check if pattern is complete
    if (currentNoteIndex >= currentIntervalPattern.length) {
        // Check if we should loop again
        if (currentLoop < totalLoops) {
            currentLoop++;
            currentNoteIndex = 0;
            updateLoopIndicator();

            // Small gap before next loop
            playbackTimeout = setTimeout(() => playNextInterval(), 500);
            return;
        } else {
            // All loops complete
            finishPlayback();
            return;
        }
    }

    const interval = currentIntervalPattern[currentNoteIndex];

    // Check playback style (melodic or harmonic)
    const intervalStyle = document.querySelector('input[name="interval-style"]:checked')?.value || 'melodic';

    if (intervalStyle === 'melodic') {
        // Play notes sequentially
        const durationSec = noteDuration / 1000;

        // Highlight and play first note
        highlightSingleNote(interval.startNote);
        updateIntervalDisplay(interval);
        await playNote(interval.startNote, durationSec);

        // Gap between the two notes within the interval
        await new Promise(resolve => setTimeout(resolve, intervalNoteGap));

        // Highlight and play second note
        highlightSingleNote(interval.endNote);
        await playNote(interval.endNote, durationSec);

        currentNoteIndex++;

        // Wait for gap before next interval (only if there are more intervals)
        if (currentNoteIndex < currentIntervalPattern.length) {
            const totalDelay = intervalPatternGap / playbackSpeed;
            playbackTimeout = setTimeout(() => playNextInterval(), totalDelay);
        } else {
            // Wait a moment so user can see the last note highlighted before finishing
            await new Promise(resolve => setTimeout(resolve, 800));
            finishPlayback();
        }
    } else {
        // Harmonic playback - play both notes together
        const durationSec = noteDuration / 1000;

        // Highlight both notes for harmonic playback
        highlightInterval(currentNoteIndex);

        // Play both frequencies simultaneously using audioEngine
        const startFreq = interval.startFreq;
        const endFreq = interval.endFreq;

        // Start both notes at the same time (await both to ensure they complete)
        await Promise.all([
            audioEngine.playNote(startFreq, durationSec),
            audioEngine.playNote(endFreq, durationSec)
        ]);

        currentNoteIndex++;

        // Wait for gap before next interval (only if there are more intervals)
        if (currentNoteIndex < currentIntervalPattern.length) {
            const totalDelay = intervalPatternGap / playbackSpeed;
            playbackTimeout = setTimeout(() => playNextInterval(), totalDelay);
        } else {
            // Wait a moment so user can see the last interval highlighted before finishing
            await new Promise(resolve => setTimeout(resolve, 800));
            finishPlayback();
        }
    }
}

function highlightSingleNote(noteNumber) {
    // Highlight only one note at a time (used for melodic playback)
    const circles = elements.scaleVisual.querySelectorAll('.note-circle');
    circles.forEach(circle => {
        circle.classList.remove('active', 'interval-start', 'interval-end', 'octave-up');
    });

    // Map notes > 7 to 1-7 range (8→1, 9→2, etc.)
    const scaleLength = getScaleLength(currentTrainingType === 'interval' ? intervalScale : currentScale);
    const isOctaveUp = noteNumber > scaleLength;
    const displayNote = isOctaveUp ? ((noteNumber - 1) % scaleLength) + 1 : noteNumber;

    const circle = elements.scaleVisual.querySelector(`[data-note="${displayNote}"]`);
    if (circle) {
        circle.classList.add('active');
        if (isOctaveUp) {
            circle.classList.add('octave-up');
        }
    }
}

function highlightInterval(intervalIndex) {
    const circles = elements.scaleVisual.querySelectorAll('.note-circle');
    circles.forEach(circle => circle.classList.remove('active', 'interval-start', 'interval-end', 'octave-up'));

    if (intervalIndex >= 0 && intervalIndex < currentIntervalPattern.length) {
        const interval = currentIntervalPattern[intervalIndex];
        const scaleLength = getScaleLength(currentTrainingType === 'interval' ? intervalScale : currentScale);

        // In self-paced mode, only highlight the current note (start or end)
        // In listen mode, highlight both notes
        const isSelfPaced = practiceMode === 'self-paced';

        // Highlight start note (map to 1-7 if needed)
        const isStartOctaveUp = interval.startNote > scaleLength;
        const displayStartNote = isStartOctaveUp ? ((interval.startNote - 1) % scaleLength) + 1 : interval.startNote;
        const startCircle = elements.scaleVisual.querySelector(`[data-note="${displayStartNote}"]`);

        // Highlight end note (map to 1-7 if needed)
        const isEndOctaveUp = interval.endNote > scaleLength;
        const displayEndNote = isEndOctaveUp ? ((interval.endNote - 1) % scaleLength) + 1 : interval.endNote;
        const endCircle = elements.scaleVisual.querySelector(`[data-note="${displayEndNote}"]`);

        if (isSelfPaced) {
            // Only highlight the current note being played
            if (currentIntervalNoteIndex === 0 && startCircle) {
                startCircle.classList.add('active');
                if (isStartOctaveUp) {
                    startCircle.classList.add('octave-up');
                }
            } else if (currentIntervalNoteIndex === 1 && endCircle) {
                endCircle.classList.add('active');
                if (isEndOctaveUp) {
                    endCircle.classList.add('octave-up');
                }
            }
        } else {
            // Listen mode: highlight both notes
            if (startCircle) {
                startCircle.classList.add('active', 'interval-start');
                if (isStartOctaveUp) {
                    startCircle.classList.add('octave-up');
                }
            }
            if (endCircle) {
                endCircle.classList.add('active', 'interval-end');
                if (isEndOctaveUp) {
                    endCircle.classList.add('octave-up');
                }
            }
        }

        // Update interval display
        updateIntervalDisplay(interval);
    } else {
        // Clear interval display when not playing
        const intervalDisplay = document.getElementById('interval-display');
        if (intervalDisplay) {
            intervalDisplay.innerHTML = '';
        }
    }
}

function updateIntervalDisplay(interval) {
    const intervalDisplay = document.getElementById('interval-display');
    if (!intervalDisplay) return;

    const arrow = interval.direction === 'up' ? '↑' : '↓';
    intervalDisplay.innerHTML = `
        <span class="interval-arrow" style="font-size: 1.5em; color: var(--accent);">${arrow}</span>
        <span class="interval-name" style="font-weight: 600; margin: 0 8px;">${interval.notation}</span>
        <span class="interval-long-name" style="color: var(--text-muted);">(${interval.name})</span>
    `;
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
    currentIntervalNoteIndex = 0;
    lastNote = null;

    // Highlight first note
    highlightNote(0);

    // Enable self-paced controls
    elements.checkNoteBtn.disabled = false;
    elements.nextNoteBtn.disabled = false;
    elements.restartSelfPacedBtn.disabled = false;
}

function checkCurrentNote() {
    if (currentTrainingType === 'interval') {
        if (currentNoteIndex >= currentIntervalPattern.length) return;

        const interval = currentIntervalPattern[currentNoteIndex];
        const durationSec = noteDuration / 1000;

        // In self-paced mode, play only the current note (start or end)
        const noteToPlay = currentIntervalNoteIndex === 0 ? interval.startNote : interval.endNote;
        playNote(noteToPlay, durationSec);
    } else {
        if (currentNoteIndex >= currentPattern.length) return;

        const note = currentPattern[currentNoteIndex];
        const durationSec = noteDuration / 1000;

        // Play the current note on demand
        playNote(note, durationSec);
    }
}

function moveToNextNote() {
    if (currentTrainingType === 'interval') {
        // In interval mode, toggle between start and end notes
        if (currentIntervalNoteIndex === 0) {
            // Move from start to end note of current interval
            currentIntervalNoteIndex = 1;
        } else {
            // Move to next interval's start note
            currentIntervalNoteIndex = 0;
            currentNoteIndex++;

            // Check if pattern complete
            if (currentNoteIndex >= currentIntervalPattern.length) {
                elements.checkNoteBtn.disabled = true;
                elements.nextNoteBtn.disabled = true;
                highlightNote(-1);
                return;
            }
        }
        highlightNote(currentNoteIndex);
    } else {
        // Note training mode
        const patternLength = currentPattern.length;

        if (currentNoteIndex >= patternLength - 1) {
            currentNoteIndex = patternLength;
            elements.checkNoteBtn.disabled = true;
            elements.nextNoteBtn.disabled = true;
            highlightNote(-1);
            return;
        }

        currentNoteIndex++;
        highlightNote(currentNoteIndex);
    }
}

function restartSelfPaced() {
    currentNoteIndex = 0;
    currentIntervalNoteIndex = 0;
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

// ===== INTERVAL VISUAL UPDATES =====

function updateScaleVisualForIntervals() {
    const scaleLength = getScaleLength(intervalScale);
    const scale = SCALE_LIBRARY[intervalScale];

    // Recreate if scale length changed
    const currentCircles = elements.scaleVisual.querySelectorAll('.note-circle').length;
    if (currentCircles !== scaleLength) {
        createScaleVisual();
        return;
    }

    const circles = elements.scaleVisual.querySelectorAll('.note-circle');

    circles.forEach((circle, idx) => {
        const noteNum = idx + 1;
        circle.classList.remove('in-pattern', 'active', 'interval-start', 'interval-end', 'octave-up');

        // Build display content (always show numbers for intervals)
        let content = '';
        const handdrawnNum = numberToHanddrawn(noteNum);
        content += `<div class="note-number">${handdrawnNum}</div>`;

        if (showSyllables) {
            const syllable = scale.solfege[syllableSystem][idx];
            content += `<div class="note-name">${syllable}</div>`;
        }

        circle.innerHTML = content;

        // Mark notes that appear in ANY interval in the pattern
        // Check both regular note and octave-up notes (8→1, 9→2, etc.)
        let isInPattern = false;
        let isOctaveUp = false;

        currentIntervalPattern.forEach(interval => {
            // Check start note
            if (interval.startNote === noteNum) {
                isInPattern = true;
            } else if (interval.startNote > scaleLength) {
                const wrappedStart = ((interval.startNote - 1) % scaleLength) + 1;
                if (wrappedStart === noteNum) {
                    isInPattern = true;
                    isOctaveUp = true;
                }
            }

            // Check end note
            if (interval.endNote === noteNum) {
                isInPattern = true;
            } else if (interval.endNote > scaleLength) {
                const wrappedEnd = ((interval.endNote - 1) % scaleLength) + 1;
                if (wrappedEnd === noteNum) {
                    isInPattern = true;
                    isOctaveUp = true;
                }
            }
        });

        if (isInPattern) {
            circle.classList.add('in-pattern');
            if (isOctaveUp) {
                circle.classList.add('octave-up');
            }
        }
    });
}

// ===== INTERVAL BOOKMARKS =====
function bookmarkIntervalPattern() {
    if (currentIntervalPattern.length === 0) return;

    const bookmark = {
        id: Date.now(),
        intervalPattern: currentIntervalPattern.map(iv => ({
            semitones: iv.semitones,
            direction: iv.direction,
            notation: iv.notation
        })),
        intervalMode: currentIntervalMode,
        difficulty: intervalDifficulty,
        generationMode: intervalGenerationMode,
        date: new Date().toISOString()
    };

    // Get existing interval bookmarks
    const bookmarks = getIntervalBookmarks();

    // Add new bookmark at the beginning
    bookmarks.unshift(bookmark);

    // Limit to 20 bookmarks
    if (bookmarks.length > 20) {
        bookmarks.pop();
    }

    // Save to localStorage
    localStorage.setItem('earTrainingIntervalBookmarks', JSON.stringify(bookmarks));

    // Visual feedback
    if (elements.bookmarkIntervalBtn) {
        elements.bookmarkIntervalBtn.textContent = 'Bookmarked!';
        elements.bookmarkIntervalBtn.classList.add('bookmarked');
        setTimeout(() => {
            elements.bookmarkIntervalBtn.textContent = 'Bookmark This Pattern';
            elements.bookmarkIntervalBtn.classList.remove('bookmarked');
        }, 2000);
    }

    // Reload interval bookmarks display
    loadIntervalBookmarks();
}

function getIntervalBookmarks() {
    const stored = localStorage.getItem('earTrainingIntervalBookmarks');
    return stored ? JSON.parse(stored) : [];
}

function loadIntervalBookmarks() {
    const bookmarks = getIntervalBookmarks();

    if (!elements.intervalBookmarksList) return;

    if (bookmarks.length === 0) {
        elements.intervalBookmarksList.innerHTML = '<p class="info-text">No bookmarked intervals yet</p>';
        return;
    }

    elements.intervalBookmarksList.innerHTML = '';

    bookmarks.forEach(bookmark => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';

        const date = new Date(bookmark.date);
        const dateStr = date.toLocaleDateString();

        const patternStr = bookmark.intervalPattern.map(iv => {
            const arrow = iv.direction === 'up' ? '↑' : '↓';
            return `${iv.notation}${arrow}`;
        }).join(' ');

        item.innerHTML = `
            <div class="bookmark-info">
                <span class="bookmark-pattern">${patternStr}</span>
                <span class="bookmark-meta">${bookmark.intervalMode} • ${bookmark.difficulty} • ${dateStr}</span>
            </div>
            <div class="bookmark-actions">
                <button class="btn btn-small load-interval-bookmark-btn" data-id="${bookmark.id}">Load</button>
                <button class="btn btn-small btn-danger delete-interval-bookmark-btn" data-id="${bookmark.id}">Delete</button>
            </div>
        `;

        elements.intervalBookmarksList.appendChild(item);
    });

    // Add event listeners
    const loadBtns = elements.intervalBookmarksList.querySelectorAll('.load-interval-bookmark-btn');
    loadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            loadIntervalBookmark(id);
        });
    });

    const deleteBtns = elements.intervalBookmarksList.querySelectorAll('.delete-interval-bookmark-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteIntervalBookmark(id);
        });
    });
}

function loadIntervalBookmark(id) {
    const bookmarks = getIntervalBookmarks();
    const bookmark = bookmarks.find(b => b.id === id);

    if (!bookmark) return;

    // Rebuild full interval pattern from bookmark
    currentIntervalPattern = bookmark.intervalPattern.map(iv => buildIntervalFromTemplate({
        s: iv.semitones,
        d: iv.direction
    }));

    currentIntervalMode = bookmark.intervalMode;
    intervalDifficulty = bookmark.difficulty;
    intervalGenerationMode = bookmark.generationMode;

    // Update UI
    if (elements.intervalDifficultySelect) {
        elements.intervalDifficultySelect.value = bookmark.difficulty;
    }
    if (elements.intervalPatternMode) {
        elements.intervalPatternMode.value = bookmark.generationMode;
    }

    // Update interval mode radio
    const modeRadio = document.querySelector(`input[name="interval-mode"][value="${bookmark.intervalMode}"]`);
    if (modeRadio) {
        modeRadio.checked = true;
    }

    updateIntervalPatternDisplay();
    enablePlaybackControls();
    resetPlaybackState();
}

function deleteIntervalBookmark(id) {
    const bookmarks = getIntervalBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);

    localStorage.setItem('earTrainingIntervalBookmarks', JSON.stringify(filtered));
    loadIntervalBookmarks();
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

// ===== GUESSING MODE =====
let currentMode = 'training'; // 'training' or 'guessing'
let currentGuessType = 'note'; // 'note' or 'interval'
let guessState = {
    note: {
        mysteryNote: null,
        answered: false
    },
    interval: {
        currentQuestion: 1,
        totalQuestions: 10,
        correctCount: 0,
        mysteryInterval: null,
        note1: null,
        note2: null,
        answered: false
    }
};

function setupModeToggle() {
    const trainingBtn = document.getElementById('training-mode-btn');
    const guessingBtn = document.getElementById('guessing-mode-btn');
    const tunerBtn = document.getElementById('tuner-mode-btn');
    const trainingContainer = document.getElementById('training-mode-container');
    const guessingContainer = document.getElementById('guessing-mode-container');
    const tunerContainer = document.getElementById('tuner-mode-container');

    trainingBtn.addEventListener('click', () => {
        currentMode = 'training';
        trainingBtn.classList.add('active');
        guessingBtn.classList.remove('active');
        tunerBtn.classList.remove('active');
        trainingContainer.style.display = 'block';
        guessingContainer.style.display = 'none';
        tunerContainer.style.display = 'none';
    });

    guessingBtn.addEventListener('click', () => {
        currentMode = 'guessing';
        guessingBtn.classList.add('active');
        trainingBtn.classList.remove('active');
        tunerBtn.classList.remove('active');
        trainingContainer.style.display = 'none';
        guessingContainer.style.display = 'block';
        tunerContainer.style.display = 'none';
    });
}

function setupGuessTypeToggle() {
    const guessNoteBtn = document.getElementById('guess-note-btn');
    const guessIntervalBtn = document.getElementById('guess-interval-btn');
    const guessNoteMode = document.getElementById('guess-note-mode');
    const guessIntervalMode = document.getElementById('guess-interval-mode');

    guessNoteBtn.addEventListener('click', () => {
        currentGuessType = 'note';
        guessNoteBtn.classList.add('active');
        guessIntervalBtn.classList.remove('active');
        guessNoteMode.style.display = 'block';
        guessIntervalMode.style.display = 'none';
    });

    guessIntervalBtn.addEventListener('click', () => {
        currentGuessType = 'interval';
        guessIntervalBtn.classList.add('active');
        guessNoteBtn.classList.remove('active');
        guessNoteMode.style.display = 'none';
        guessIntervalMode.style.display = 'block';
    });
}

// Note Guessing Functions
function playCurrentMysteryNote() {
    console.log('playCurrentMysteryNote called!');
    const state = guessState.note;

    // If no mystery note exists yet, generate one
    if (!state.mysteryNote) {
        state.mysteryNote = Math.floor(Math.random() * 7) + 1;
        console.log('Generated new mystery note:', state.mysteryNote);
    }

    // Temporarily set instrument to piano for guessing mode
    const previousInstrument = currentInstrument;
    currentInstrument = 'piano';
    if (audioEngine) {
        audioEngine.setInstrument('piano');
    }

    // Play the current mystery note
    console.log('Playing mystery note:', state.mysteryNote);
    playNote(state.mysteryNote, 1.0);
}

function resetMysteryNote() {
    console.log('resetMysteryNote called!');
    const state = guessState.note;

    // Reset state for new question
    state.mysteryNote = null;
    state.answered = false;

    // Reset UI
    const buttons = document.querySelectorAll('.note-guess-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect', 'selected');
        btn.disabled = false;
    });

    const feedback = document.getElementById('note-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'guess-feedback';
    }

    const revealBtn = document.getElementById('reveal-note-btn');
    if (revealBtn) {
        revealBtn.style.display = 'inline-block';
    }

    const nextBtn = document.getElementById('next-question-note-btn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }

    console.log('Mystery note reset. Click Play Mystery Note to generate a new one.');
}

function guessNote(guessedNote) {
    console.log('guessNote called with:', guessedNote);
    const state = guessState.note;

    // Don't allow guessing if no note has been played
    if (!state.mysteryNote) {
        console.log('No mystery note - ignoring guess');
        return;
    }

    if (state.answered) return;

    state.answered = true;
    const correct = guessedNote === state.mysteryNote;

    // Update UI
    const buttons = document.querySelectorAll('.note-guess-btn');
    buttons.forEach(btn => {
        const note = parseInt(btn.dataset.note);
        if (note === state.mysteryNote) {
            btn.classList.add('correct');
        } else if (note === guessedNote && !correct) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    // Show feedback
    const feedback = document.getElementById('note-feedback');
    if (feedback) {
        if (correct) {
            feedback.textContent = `Correct! The note was ${state.mysteryNote}`;
            feedback.className = 'guess-feedback correct';
        } else {
            feedback.textContent = `Not quite. The note was ${state.mysteryNote}, you guessed ${guessedNote}`;
            feedback.className = 'guess-feedback incorrect';
        }
    }

    // Hide reveal button, show next button after answering
    const revealBtn = document.getElementById('reveal-note-btn');
    if (revealBtn) {
        revealBtn.style.display = 'none';
    }

    const nextBtn = document.getElementById('next-question-note-btn');
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
    }

    console.log('guessNote completed');
}

function revealNoteAnswer() {
    const state = guessState.note;
    if (state.answered || !state.mysteryNote) return;

    state.answered = true;

    // Highlight correct answer
    const buttons = document.querySelectorAll('.note-guess-btn');
    buttons.forEach(btn => {
        const note = parseInt(btn.dataset.note);
        if (note === state.mysteryNote) {
            btn.classList.add('correct');
        }
        btn.disabled = true;
    });

    // Show feedback
    const feedback = document.getElementById('note-feedback');
    feedback.textContent = `The note was ${state.mysteryNote}`;
    feedback.className = 'guess-feedback';

    // Hide reveal button, show next button
    document.getElementById('reveal-note-btn').style.display = 'none';

    const nextBtn = document.getElementById('next-question-note-btn');
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
    }
}

// Interval Guessing Functions
function getIntervalDifficulty() {
    const difficulty = document.getElementById('interval-difficulty').value;
    const intervals = {
        easy: [0, 1, 2, 3, 4, 5, 7], // Unison through 5th
        medium: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11], // All except octave
        hard: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // All intervals
    };
    return intervals[difficulty] || intervals.medium;
}

async function playCurrentMysteryInterval() {
    const state = guessState.interval;
    if (state.answered) return;

    // If no mystery interval exists yet, generate one
    if (state.mysteryInterval === null) {
        // Get available intervals based on difficulty
        const availableIntervals = getIntervalDifficulty();
        state.mysteryInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];

        // Generate starting note (always 1 for consistency)
        state.note1 = 1;

        console.log('Generated interval:', state.mysteryInterval, 'semitones from note', state.note1);
    }

    // Calculate frequencies based on semitones (equal temperament)
    const scale = SCALE_LIBRARY[currentScale];
    const freq1 = BASE_FREQUENCY * scale.ratios[state.note1 - 1];
    const freq2 = freq1 * Math.pow(2, state.mysteryInterval / 12); // Semitone ratio

    console.log('Playing interval:', state.mysteryInterval, 'semitones, freq1:', freq1, 'freq2:', freq2);

    // Play both notes in sequence using frequencies directly
    if (audioEngine) {
        await audioEngine.playNote(freq1, 0.8);
        setTimeout(() => {
            audioEngine.playNote(freq2, 0.8);
        }, 900);
    }
}

function resetMysteryInterval() {
    console.log('resetMysteryInterval called!');
    const state = guessState.interval;

    // Reset state for new question
    state.mysteryInterval = null;
    state.note1 = null;
    state.answered = false;

    // Reset UI
    const buttons = document.querySelectorAll('.interval-guess-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });

    const feedback = document.getElementById('interval-feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'guess-feedback';
    }

    const revealBtn = document.getElementById('reveal-interval-btn');
    if (revealBtn) {
        revealBtn.style.display = 'inline-block';
    }

    const nextBtn = document.getElementById('next-interval-btn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }

    console.log('Mystery interval reset. Click Play Mystery Interval to generate a new one.');
}

function guessInterval(guessedInterval) {
    const state = guessState.interval;
    if (state.answered) return;

    state.answered = true;
    const correct = guessedInterval === state.mysteryInterval;

    // Update UI
    const buttons = document.querySelectorAll('.interval-guess-btn');
    buttons.forEach(btn => {
        const interval = parseInt(btn.dataset.interval);
        if (interval === state.mysteryInterval) {
            btn.classList.add('correct');
        } else if (interval === guessedInterval && !correct) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    // Show feedback
    const feedback = document.getElementById('interval-feedback');
    const intervalName = INTERVAL_NAMES[state.mysteryInterval];
    if (correct) {
        state.correctCount++;
        feedback.textContent = `Correct! That was a ${intervalName}`;
        feedback.className = 'guess-feedback correct';
    } else {
        const guessedName = INTERVAL_NAMES[guessedInterval];
        feedback.textContent = `Not quite. That was a ${intervalName}, you guessed ${guessedName}`;
        feedback.className = 'guess-feedback incorrect';
    }

    // Update progress
    document.getElementById('interval-correct-count').textContent = `Correct: ${state.correctCount}`;

    // Show next button
    document.getElementById('reveal-interval-btn').style.display = 'none';
    if (state.currentQuestion < state.totalQuestions) {
        document.getElementById('next-interval-btn').style.display = 'inline-block';
    } else {
        document.getElementById('restart-interval-btn').style.display = 'inline-block';
        feedback.textContent += `\n\nGame Over! You got ${state.correctCount}/${state.totalQuestions} correct!`;
    }
}

function revealIntervalAnswer() {
    const state = guessState.interval;
    if (state.answered || state.mysteryInterval === null) return;

    state.answered = true;

    // Highlight correct answer
    const buttons = document.querySelectorAll('.interval-guess-btn');
    buttons.forEach(btn => {
        const interval = parseInt(btn.dataset.interval);
        if (interval === state.mysteryInterval) {
            btn.classList.add('correct');
        }
        btn.disabled = true;
    });

    // Show feedback
    const feedback = document.getElementById('interval-feedback');
    const intervalName = INTERVAL_NAMES[state.mysteryInterval];
    feedback.textContent = `The interval was a ${intervalName}`;
    feedback.className = 'guess-feedback';

    // Show next button
    document.getElementById('reveal-interval-btn').style.display = 'none';
    if (state.currentQuestion < state.totalQuestions) {
        document.getElementById('next-interval-btn').style.display = 'inline-block';
    } else {
        document.getElementById('restart-interval-btn').style.display = 'inline-block';
    }
}

function nextIntervalQuestion() {
    const state = guessState.interval;
    state.currentQuestion++;
    state.mysteryInterval = null;
    state.note1 = null;
    state.note2 = null;
    state.answered = false;

    // Reset UI
    const buttons = document.querySelectorAll('.interval-guess-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });

    document.getElementById('interval-feedback').textContent = '';
    document.getElementById('interval-feedback').className = 'guess-feedback';
    document.getElementById('interval-question-number').textContent = `Question ${state.currentQuestion}/${state.totalQuestions}`;
    document.getElementById('reveal-interval-btn').style.display = 'inline-block';
    document.getElementById('next-interval-btn').style.display = 'none';
}

function restartIntervalGame() {
    const state = guessState.interval;
    state.currentQuestion = 1;
    state.correctCount = 0;
    state.mysteryInterval = null;
    state.note1 = null;
    state.note2 = null;
    state.answered = false;

    // Reset UI
    const buttons = document.querySelectorAll('.interval-guess-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });

    document.getElementById('interval-feedback').textContent = '';
    document.getElementById('interval-feedback').className = 'guess-feedback';
    document.getElementById('interval-question-number').textContent = `Question ${state.currentQuestion}/${state.totalQuestions}`;
    document.getElementById('interval-correct-count').textContent = `Correct: 0`;
    document.getElementById('reveal-interval-btn').style.display = 'inline-block';
    document.getElementById('next-interval-btn').style.display = 'none';
    document.getElementById('restart-interval-btn').style.display = 'none';
}

function setupGuessingModeListeners() {
    console.log('Setting up guessing mode listeners...');

    // Note guessing
    const playBtn = document.getElementById('play-mystery-note');
    console.log('Play button found:', playBtn);
    if (playBtn) {
        playBtn.addEventListener('click', playCurrentMysteryNote);
    }

    const resetNoteBtn = document.getElementById('reset-mystery-note');
    if (resetNoteBtn) {
        resetNoteBtn.addEventListener('click', resetMysteryNote);
    }

    const revealBtn = document.getElementById('reveal-note-btn');
    if (revealBtn) {
        revealBtn.addEventListener('click', revealNoteAnswer);
    }

    const nextQuestionNoteBtn = document.getElementById('next-question-note-btn');
    if (nextQuestionNoteBtn) {
        nextQuestionNoteBtn.addEventListener('click', resetMysteryNote);
    }

    const guessButtons = document.querySelectorAll('.note-guess-btn');
    console.log('Found guess buttons:', guessButtons.length);
    guessButtons.forEach((btn, index) => {
        console.log('Adding listener to button', index, btn.dataset.note);
        btn.addEventListener('click', (e) => {
            console.log('BUTTON CLICKED!', e.currentTarget.dataset.note);
            const note = parseInt(e.currentTarget.dataset.note);
            guessNote(note);
        });
    });

    // Interval guessing
    document.getElementById('play-mystery-interval').addEventListener('click', playCurrentMysteryInterval);
    document.getElementById('reset-mystery-interval').addEventListener('click', resetMysteryInterval);
    document.getElementById('reveal-interval-btn').addEventListener('click', revealIntervalAnswer);
    document.getElementById('next-interval-btn').addEventListener('click', nextIntervalQuestion);
    document.getElementById('restart-interval-btn').addEventListener('click', restartIntervalGame);

    document.querySelectorAll('.interval-guess-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const interval = parseInt(e.target.dataset.interval);
            guessInterval(interval);
        });
    });
}

// ===== TUNER MODE =====
let tunerState = {
    isListening: false,
    audioContext: null,
    analyser: null,
    microphone: null,
    buffer: null,
    rafID: null,
    currentOctave: 4
};

function setupTunerMode() {
    // Mode toggle
    const tunerModeBtn = document.getElementById('tuner-mode-btn');
    if (!tunerModeBtn) return;

    tunerModeBtn.addEventListener('click', () => {
        showTunerMode();
    });

    // Listen button
    const listenBtn = document.getElementById('tuner-listen-btn');
    if (listenBtn) {
        listenBtn.addEventListener('click', toggleTunerListening);
    }

    // Play note buttons
    document.querySelectorAll('.tuner-note-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const note = parseInt(e.target.dataset.note);
            playTunerNote(note);
        });
    });

    // Octave controls
    document.getElementById('tuner-octave-up').addEventListener('click', () => {
        tunerState.currentOctave = Math.min(6, tunerState.currentOctave + 1);
        updateOctaveDisplay();
    });

    document.getElementById('tuner-octave-down').addEventListener('click', () => {
        tunerState.currentOctave = Math.max(2, tunerState.currentOctave - 1);
        updateOctaveDisplay();
    });
}

function showTunerMode() {
    currentMode = 'tuner';

    // Hide other modes
    document.getElementById('training-mode-container').style.display = 'none';
    document.getElementById('guessing-mode-container').style.display = 'none';
    document.getElementById('tuner-mode-container').style.display = 'block';

    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tuner-mode-btn').classList.add('active');
}

async function toggleTunerListening() {
    if (tunerState.isListening) {
        stopTunerListening();
    } else {
        await startTunerListening();
    }
}

async function startTunerListening() {
    const listenBtn = document.getElementById('tuner-listen-btn');
    const tunerDisplay = document.getElementById('tuner-display');

    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            }
        });

        // Create audio context if needed
        if (!tunerState.audioContext) {
            tunerState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        tunerState.analyser = tunerState.audioContext.createAnalyser();
        tunerState.microphone = tunerState.audioContext.createMediaStreamSource(stream);
        tunerState.analyser.fftSize = 2048;
        tunerState.microphone.connect(tunerState.analyser);
        tunerState.buffer = new Float32Array(tunerState.analyser.fftSize);

        tunerState.isListening = true;
        listenBtn.textContent = '⏸ Stop Listening';
        tunerDisplay.style.display = 'block';

        // Start pitch detection loop
        updateTunerPitch();

    } catch (error) {
        console.error('Microphone access denied:', error);
        alert('Microphone access is required for the tuner. Please allow microphone permissions.');
    }
}

function stopTunerListening() {
    const listenBtn = document.getElementById('tuner-listen-btn');

    if (tunerState.rafID) {
        cancelAnimationFrame(tunerState.rafID);
        tunerState.rafID = null;
    }

    if (tunerState.microphone) {
        tunerState.microphone.disconnect();
        tunerState.microphone = null;
    }

    if (tunerState.analyser) {
        tunerState.analyser.disconnect();
        tunerState.analyser = null;
    }

    tunerState.isListening = false;
    listenBtn.textContent = '🎤 Start Listening';
}

function updateTunerPitch() {
    if (!tunerState.isListening) return;

    tunerState.analyser.getFloatTimeDomainData(tunerState.buffer);
    const frequency = autoCorrelate(tunerState.buffer, tunerState.audioContext.sampleRate);

    if (frequency > 0 && frequency < 2000) {
        const midiNote = noteFromPitch(frequency);
        const noteInfo = noteNameFromMIDI(midiNote);
        const cents = centsOffFromPitch(frequency, midiNote);

        // Build note display with images
        const noteImagesContainer = document.getElementById('tuner-note-images');
        noteImagesContainer.innerHTML = '';

        // Add note letter image
        const noteLetter = noteInfo.name.replace('#', '').replace('b', '');
        const letterImg = document.createElement('img');
        letterImg.src = `assets/note-${noteLetter}.png`;
        letterImg.alt = noteLetter;
        letterImg.className = 'note-letter';
        noteImagesContainer.appendChild(letterImg);

        // Add sharp or flat if present
        if (noteInfo.name.includes('#')) {
            const sharpImg = document.createElement('img');
            sharpImg.src = 'assets/sharp.png';
            sharpImg.alt = '#';
            sharpImg.className = 'accidental';
            noteImagesContainer.appendChild(sharpImg);
        } else if (noteInfo.name.includes('b')) {
            const flatImg = document.createElement('img');
            flatImg.src = 'assets/flat.png';
            flatImg.alt = 'b';
            flatImg.className = 'accidental';
            noteImagesContainer.appendChild(flatImg);
        }

        // Add octave number image
        const octaveImg = document.createElement('img');
        octaveImg.src = `assets/digit-${noteInfo.octave}.png`;
        octaveImg.alt = noteInfo.octave;
        octaveImg.className = 'octave-num';
        noteImagesContainer.appendChild(octaveImg);

        // Update frequency and cents
        document.getElementById('tuner-frequency').textContent = frequency.toFixed(1) + ' Hz';
        document.getElementById('tuner-cents-value').textContent =
            (cents > 0 ? '+' : '') + cents + ' cents';

        // Get solfege syllable
        const scaleDegree = scaleDegreeFromNote(noteInfo.name);
        const solfege = solfegeFromScaleDegree(scaleDegree);
        document.getElementById('tuner-syllable').textContent =
            solfege.western + ' / ' + solfege.indian;

        // Arrow indicator
        const arrow = cents > 5 ? '↑' : cents < -5 ? '↓' : '•';
        document.getElementById('tuner-arrow').textContent = arrow;

        // Color feedback on dot only
        const tunerDot = document.getElementById('tuner-dot');
        tunerDot.classList.remove('in-tune', 'close', 'off');
        if (Math.abs(cents) < 10) {
            tunerDot.classList.add('in-tune');
        } else if (Math.abs(cents) < 25) {
            tunerDot.classList.add('close');
        } else {
            tunerDot.classList.add('off');
        }
    } else {
        // No pitch detected - show "--"
        const noteImagesContainer = document.getElementById('tuner-note-images');
        noteImagesContainer.innerHTML = '<span class="tuner-placeholder">--</span>';
        document.getElementById('tuner-syllable').textContent = '--';
        document.getElementById('tuner-frequency').textContent = '-- Hz';

        // Reset dot color
        const tunerDot = document.getElementById('tuner-dot');
        tunerDot.classList.remove('in-tune', 'close', 'off');
    }

    // Continue loop
    tunerState.rafID = requestAnimationFrame(updateTunerPitch);
}

function playTunerNote(noteNumber) {
    // Calculate frequency for the note in the current octave
    const scale = SCALE_LIBRARY['major'];
    const baseFreq = BASE_FREQUENCY; // C4 = 261.63

    // Adjust for octave (C4 is octave 4)
    const octaveMultiplier = Math.pow(2, tunerState.currentOctave - 4);
    const frequency = baseFreq * scale.ratios[noteNumber - 1] * octaveMultiplier;

    // Play using audioEngine
    if (audioEngine) {
        audioEngine.playNote(frequency, 1.5);
    }
}

function updateOctaveDisplay() {
    document.getElementById('tuner-current-octave').textContent =
        'Octave: ' + tunerState.currentOctave;
}

// ===== GLOBAL ERROR HANDLER (for debugging) =====
window.addEventListener('error', (e) => {
    console.error('UNCAUGHT ERROR:', e.message, e.filename, e.lineno);
});

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
