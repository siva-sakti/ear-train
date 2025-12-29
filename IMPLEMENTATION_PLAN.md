# Implementation Plan - Ear Training App

## Overview
Building a comprehensive ear training web application with Western, Hindustani, and Carnatic notation support, pitch detection, and practical practice features.

## Core Principles
- **Full-featured**: Support all scales, modes, and notation systems
- **Practical workflow**: Enhanced playback controls for real practice needs
- **Minimalist UI**: Clean, plain text design
- **No hand-holding**: Skip gamification, focus on functionality
- **Data-driven**: Track progress factually without motivational fluff

---

## Phase 1: Core Features & Enhanced Controls (Days 1-3)

### 1.1 Pattern Generation System

**Three modes:**
- **Pedagogical**: Curated traditional ear training sequences (current)
- **Random**: Algorithm-based generation respecting interval difficulty rules
- **Custom**: User text input (e.g., "1 3 5 3 1")

**Implementation:**
```javascript
const PATTERN_MODES = {
  PEDAGOGICAL: 'pedagogical',
  RANDOM: 'random',
  CUSTOM: 'custom'
};

function generateRandomPattern(difficulty, scaleLength) {
  // Respect interval constraints based on difficulty
  // Easy: maxInterval = 2 (seconds only)
  // Medium: maxInterval = 4 (up to fourths)
  // Hard: maxInterval = 7 (any interval)
}

function parseCustomPattern(input) {
  // Parse "1 3 5 3 1" or "1,3,5,3,1"
  // Validate: 1-7 (or 1-5 for pentatonic), min length 2
}
```

### 1.2 Scale Library

**Western scales:**
- Major (Ionian)
- Natural Minor (Aeolian)
- Harmonic Minor
- Melodic Minor
- Pentatonic Major
- Pentatonic Minor

**Hindustani ragas (6 popular):**
1. Bhairav - Morning, serious/spiritual
2. Yaman (Kalyan) - Evening, sweet/calm
3. Kafi - Afternoon, devotional
4. Bilaval - Morning, same as Western major
5. Bhairavi - Night, melancholic
6. Todi - Afternoon, complex/intense

**Carnatic ragas (6 popular melakartas):**
1. Mayamalavagowla (15) - Beginner raga, morning
2. Shankarabharanam (29) - Versatile, joyful
3. Kalyani (65) - Joyful, auspicious
4. Kharaharapriya (22) - Serious, contemplative
5. Harikambhoji (28) - Bright, devotional
6. Natabhairavi (20) - Evening, contemplative

**Data structure:**
```javascript
const SCALE_LIBRARY = {
  'major': {
    name: 'Major (Ionian)',
    category: 'western',
    ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni']
    }
  },
  'bhairav': {
    name: 'Bhairav',
    category: 'hindustani',
    ratios: [1, 16/15, 5/4, 4/3, 3/2, 8/5, 15/8],
    solfege: {
      western: ['Do', 'Ra', 'Mi', 'Fa', 'Sol', 'Le', 'Ti'],
      hindustani: ['Sa', 'Re komal', 'Ga', 'Ma', 'Pa', 'Dha komal', 'Ni'],
      carnatic: ['Sa', 'Ri1', 'Ga3', 'Ma1', 'Pa', 'Da1', 'Ni3']
    },
    time: 'Morning (6-9am)',
    mood: 'Serious, spiritual',
    pakad: [[1, 2, 3, 4, 2], [1, 2, 1, 3, 2]]  // Characteristic phrases
  }
  // ... more scales
};
```

### 1.3 Notation Display System

**Two independent toggles:**
- Show numbers (1, 2, 3...)
- Show syllables (Do/Sa, Re, Mi/Ga...)

**Three syllable systems:**
- Western: Do Re Mi Fa Sol La Ti
- Hindustani: Sa Re Ga Ma Pa Dha Ni (with komal/tivra variants)
- Carnatic: Sa Ri Ga Ma Pa Da Ni (with numbered variants)

**Display logic:**
- Both on: "3 (Mi)" or "3 (Ga)"
- Numbers only: "3"
- Syllables only: "(Mi)" or "(Ga)"
- Validation: At least one must be checked

### 1.4 Enhanced Playback Controls

**New features:**
1. **Pause/Resume**: Stop mid-pattern, continue later
2. **Replay Last Note**: Hear previous note again
3. **Step Forward**: Manual note-by-note playback
4. **Loop Pattern**: Auto-repeat pattern N times
5. **Note Gap**: Adjust silence between notes (0-2 seconds)
6. **Manual Mode**: Click to play each note individually

**UI:**
```html
<div class="playback-controls">
  <button id="play-btn">Play</button>
  <button id="pause-btn">Pause</button>
  <button id="restart-btn">Restart</button>
  <button id="step-forward-btn">Step →</button>
  <button id="replay-last-btn">← Last</button>

  <label>
    Loop: <input type="number" id="loop-count" min="1" max="10" value="1">
  </label>

  <label>
    Gap: <input type="range" id="note-gap" min="0" max="2000" value="500" step="100">
    <span id="gap-display">0.5s</span>
  </label>

  <label>
    <input type="checkbox" id="manual-mode">
    Manual stepping
  </label>
</div>
```

### 1.5 Practice Mode Toggle

**Three modes:**
1. **Listen Mode**: Computer plays sound (normal)
2. **Visual Only**: Pattern highlights but silent, you sing
3. **Test Mode**: Microphone listens and gives feedback

**Implementation:**
```javascript
const PRACTICE_MODES = {
  LISTEN: 'listen',     // soundEnabled = true
  VISUAL: 'visual',     // soundEnabled = false
  TEST: 'test'          // soundEnabled = false, micEnabled = true
};
```

### 1.6 Minimalist UI Update

**Style principles:**
- Plain text, minimal decoration
- Light background (#fafafa), dark text (#1a1a1a)
- Subtle borders, no heavy shadows
- Simple buttons (border-only)
- Plenty of whitespace
- Leave space for user to add doodles/icons later

---

## Phase 2: Pitch Detection & Test Mode (Days 4-7)

### 2.1 Microphone Access

**getUserMedia setup:**
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: false,  // Important for pitch accuracy
    sampleRate: 44100
  }
});
```

### 2.2 Pitch Detection Algorithm

**Autocorrelation approach:**
- More accurate than FFT for singing
- Based on cwilso/PitchDetect implementation
- Returns: { frequency: Hz, confidence: 0-1 }

**Frequency to note conversion:**
```javascript
function frequencyToScaleDegree(freq, baseFreq, scaleRatios) {
  // Convert Hz to closest scale degree (1-7)
  // Calculate cents deviation (±50 = correct)
  // Return: { degree: 3, cents: +15, confidence: 0.92 }
}
```

### 2.3 Real-Time Test Mode

**Workflow:**
1. User clicks "Test Mode"
2. Pattern plays (if Listen Mode enabled)
3. User sings back
4. Real-time feedback shows:
   - Target note
   - Detected note
   - Cents deviation
   - Visual pitch meter
5. Auto-advances when note held steady for 500ms
6. Results displayed at end

**Tolerance:**
- ±50 cents = correct (beginner-friendly)
- Show accuracy rating: Perfect (<10), Great (<25), Good (<50)
- NO octave equivalence (singing octave higher = wrong)

### 2.4 Interval Name Display

**Show interval labels:**
- Perfect Fifth (1→5)
- Major Third (1→3)
- Perfect Fourth (1→4)
- Minor Sixth (1→6♭)
- etc.

**Display:**
- During playback: Show interval between consecutive notes
- In results: Label which intervals user struggled with

---

## Phase 3: History, Calendar & Advanced (Days 8-10)

### 3.1 Session Tracking

**Data model (localStorage):**
```javascript
{
  sessions: [
    {
      id: "uuid",
      date: "2025-12-29",
      startTime: "10:30:00",
      endTime: "10:45:00",
      duration: 900,  // seconds
      exercises: [
        {
          timestamp: "10:30:15",
          type: "listen" | "test" | "guess",
          difficulty: "easy" | "medium" | "hard",
          scale: "major",
          pattern: [1,2,3,2,1],
          accuracy: 85,  // for test mode
          intervalsWorked: ["second", "third"]
        }
      ]
    }
  ],
  stats: {
    totalSessions: 42,
    totalMinutes: 630,
    lastPracticeDate: "2025-12-29",
    scalesHistory: {
      "major": { days: 15, totalMinutes: 240 },
      "bhairav": { days: 3, totalMinutes: 45 }
    }
  }
}
```

### 3.2 Calendar View

**Features:**
- Visual calendar grid
- Color-coded by scale practiced
- Hover to see: Scale, duration, accuracy
- Track which scales worked on which days
- Weekly breakdown

**UI:**
```html
<div class="practice-calendar">
  <div class="calendar-grid">
    <div class="day-cell" data-date="2025-12-27" data-scale="major">
      <span class="day-number">27</span>
      <span class="scale-indicator" style="background: blue">●</span>
    </div>
    <!-- ... -->
  </div>

  <div class="calendar-legend">
    <span><span class="dot" style="background: blue">●</span> Major</span>
    <span><span class="dot" style="background: red">●</span> Bhairav</span>
    <!-- ... -->
  </div>
</div>
```

### 3.3 Progress Stats (Factual, Not Motivational)

**Show data like:**
- "Accuracy on perfect fifths: 65% → 78% (↑13%)"
- "Most practiced scale: Major (15 days)"
- "Weak intervals: Minor sixths (45% avg)"
- "Strongest intervals: Perfect fourths (92% avg)"

**NO gamification:**
- No "Great job!"
- No streaks with fire emojis
- Just plain data

### 3.4 Guessing Mode

**Concept:**
- Computer plays single note or interval
- User identifies what they heard
- Can respond by:
  - Singing back (pitch detection)
  - Clicking button (1-7)
  - Typing number

**UI:**
```html
<section class="guess-mode">
  <h2>Guessing Mode</h2>
  <button id="play-mystery">Play Mystery Note</button>

  <div class="guess-input">
    <p>What note did you hear?</p>
    <div class="guess-buttons">
      <button data-note="1">1</button>
      <button data-note="2">2</button>
      <!-- ... -->
    </div>

    <p>Or sing it back:</p>
    <button id="guess-by-singing">Sing Response</button>
  </div>

  <div id="guess-feedback"></div>
</section>
```

### 3.5 PWA Support

**Make it installable:**

**manifest.json:**
```json
{
  "name": "Ear Training Practice",
  "short_name": "Ear Train",
  "description": "Musical ear training with multi-notation support",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fafafa",
  "theme_color": "#2196F3",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service worker (optional, for offline):**
- Cache HTML/CSS/JS
- Works offline after first load

---

## Optional Features (Time Permitting)

### Pattern Bookmarks
- Save favorite patterns
- Quick access to challenging patterns

### Quick Play Mode
- Enter any pattern + scale
- Hear it immediately
- Separate from main practice flow

### Comparison Mode
- Play two different scales/ragas side-by-side
- Hear differences in swaras

---

## Technical Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Audio**: Web Audio API (oscillators for playback, AnalyserNode for pitch detection)
- **Storage**: localStorage (Phase 1), optional Supabase/Firebase later
- **Hosting**: Vercel (free tier, auto-deploy from GitHub)
- **PWA**: manifest.json + optional service worker

---

## File Structure

```
ear-train/
├── index.html              # Main app
├── styles.css              # Minimalist styling
├── app.js                  # Core app logic
├── scales.js               # Scale library data (NEW)
├── pitch-detector.js       # Pitch detection class (NEW)
├── session-manager.js      # History/stats tracking (NEW)
├── manifest.json           # PWA manifest (NEW)
├── icons/                  # App icons (NEW)
│   ├── icon-192.png
│   └── icon-512.png
├── README.md               # User documentation
├── IMPLEMENTATION_PLAN.md  # This file
└── PITCH_DETECTION.md      # Technical reference
```

---

## Timeline

| Phase | Days | Focus |
|-------|------|-------|
| Phase 1 | 1-3 | Patterns, scales, notation, enhanced controls |
| Phase 2 | 4-7 | Pitch detection, test mode, intervals |
| Phase 3 | 8-10 | History, calendar, guessing mode, PWA |

**Total: ~10 days**

---

## Success Criteria

✅ All pattern modes working (pedagogical/random/custom)
✅ All scales playable (Western, Hindustani, Carnatic)
✅ Notation system toggles functional
✅ Enhanced playback controls (pause, step, loop, gap)
✅ Practice modes (listen/visual/test)
✅ Pitch detection accurate within ±50 cents
✅ Real-time test mode feedback
✅ Interval names displayed
✅ Session history saved
✅ Calendar shows scale-coded practice days
✅ Guessing mode functional
✅ PWA installable on mobile
✅ Minimalist UI, plain text aesthetic
✅ All features accessible, no progressive unlocking
