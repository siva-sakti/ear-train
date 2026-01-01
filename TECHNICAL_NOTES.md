# Technical Notes & Key Decisions
**Ear Training Practice App**
**Last Updated:** December 31, 2025

This document captures crucial technical decisions, design patterns, and learnings from building the app.

---

## 🎵 Musical Theory & Tuning Systems

### Tuning System Decision (CRITICAL)

**Problem:** Initially mixed Just Intonation (JI) for scales with Equal Temperament (ET) for intervals, causing tuning inconsistencies (2-14 cents off).

**Solution:**
- **Scale Practice (Training Mode):** Uses Just Intonation ratios for pure, resonant intervals
- **Interval Practice:** Uses pure Equal Temperament (12-TET) for consistency

**Why this matters:**
- JI sounds better for scale practice (pure 3/2 fifths, 5/4 thirds)
- ET needed for intervals so they sound the same regardless of starting note
- A Major 3rd up from C should sound identical to a Major 3rd up from D

**Implementation:**
```javascript
// Equal Temperament calculation for intervals
const intervalRatio = Math.pow(2, semitones / 12);
const endFreq = startFreq * intervalRatio;

// Just Intonation for scales
const frequency = BASE_FREQUENCY * scale.ratios[noteNumber - 1];
```

**Documented in:** `TUNING.md`

---

## 🎨 Design Patterns & Architecture

### 1. Mode Routing Pattern (Dispatcher)

**Pattern:** Use training type to route to correct implementation instead of duplicating code.

```javascript
function generateNewPattern() {
  if (currentTrainingType === 'note') {
    generateNotePattern();
  } else {
    generateIntervalPattern();
  }

  // Shared logic runs for both
  updatePatternDisplay();
  updateScaleVisual();
}
```

**Why:** Keeps code DRY, makes it easy to add new training types.

### 2. Independent Mode System

**Decision:** Training, Guessing, and Tuner are **mutually exclusive** - only one active at a time.

**Why:**
- Prevents state conflicts
- Clearer UX - user knows exactly what mode they're in
- Simpler state management

**Implementation:**
```javascript
function showTunerMode() {
  currentMode = 'tuner';

  // Hide other modes
  trainingContainer.style.display = 'none';
  guessingContainer.style.display = 'none';
  tunerContainer.style.display = 'block';

  // Update button states
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  tunerModeBtn.classList.add('active');
}
```

### 3. State Tracking for Self-Paced Intervals

**Problem:** Intervals have TWO notes (start and end), but self-paced should step through ONE note at a time.

**Solution:** Added `currentIntervalNoteIndex` to track position within each interval.

```javascript
let currentNoteIndex = 0;           // Which interval in pattern (0, 1, 2...)
let currentIntervalNoteIndex = 0;   // Which note in interval (0=start, 1=end)

function moveToNextNote() {
  if (currentIntervalNoteIndex === 0) {
    currentIntervalNoteIndex = 1;  // Start → End
  } else {
    currentIntervalNoteIndex = 0;  // Move to next interval
    currentNoteIndex++;
  }
}
```

**Flow:** Interval 1 start → Interval 1 end → Interval 2 start → Interval 2 end → ...

---

## 🎯 UI/UX Decisions

### Color-Coding System

**Visual hierarchy for note circles:**

1. **Gray (inactive):** Not in current pattern
2. **Purple (in-pattern):** Part of current pattern, not playing
3. **Peach (active):** Currently playing note
4. **Darker purple/peach (octave-up):** Same as above but for notes 8+

**Implementation:**
- Uses handdrawn PNG assets with different colors
- CSS classes control which image shows: `.note-circle.active`, `.note-circle.in-pattern`, `.note-circle.octave-up`

### Highlighting Logic: Listen vs Self-Paced

**Listen Mode (Auto-play):**
- Intervals: Both start AND end notes highlighted (both peach)
- Shows the full interval relationship

**Self-Paced Mode:**
- Intervals: ONLY current note highlighted (one peach)
- Pattern notes stay purple
- User controls stepping through each note

**Implementation:**
```javascript
function highlightInterval(intervalIndex) {
  const isSelfPaced = practiceMode === 'self-paced';

  if (isSelfPaced) {
    // Only highlight current note
    if (currentIntervalNoteIndex === 0 && startCircle) {
      startCircle.classList.add('active');
    } else if (currentIntervalNoteIndex === 1 && endCircle) {
      endCircle.classList.add('active');
    }
  } else {
    // Listen mode: highlight both
    startCircle.classList.add('active', 'interval-start');
    endCircle.classList.add('active', 'interval-end');
  }
}
```

### Handdrawn Aesthetic

**Design Philosophy:** Cute, approachable, hand-crafted feel

**Key Principles:**
1. **Irregular edges** - Nothing perfectly straight or circular
2. **Consistent style** - All assets drawn in same style
3. **Pastel colors** - Soft purple (#E6D9F6), peach (#FFC5A8), cream (#FAF7F2)
4. **Transparent backgrounds** - PNG assets layer nicely
5. **Animation-aware** - Active circles drawn with bolder outlines (they scale 1.15×)

**Asset Specs:**
- Note circles: 120×120px (desktop), 70×70px (mobile)
- Buttons: 100×50px (main), 80×40px (mobile)
- Digits: 35px height when displayed
- Corner doodles: 80×80px at 25% opacity

---

## 🔧 Critical Technical Gotchas

### 1. Duplicate IDs Break Everything

**Problem:** Had TWO elements with `id="next-note-btn"` (one in training, one in guessing)

**Symptom:** Button didn't work, `getElementById()` only finds first match

**Fix:** Use unique IDs everywhere! Renamed to `next-question-note-btn` for guessing mode

**Lesson:** Always use unique IDs. If you need to share behavior, use classes.

### 2. Hard Refresh for Cached Assets

**Problem:** Browser aggressively caches favicons, CSS, images

**Solutions:**
1. **Favicon:** Hard refresh (Cmd+Shift+R) or close/reopen tab
2. **CSS/JS:** Version query strings `?v=timestamp`
3. **Service Worker:** Network-first strategy in development

```javascript
// Cache busting via version.json
const version = await fetch('/version.json').then(r => r.json());
// Force reload when version changes
```

### 3. Octave Wrapping Logic

**Problem:** Notes beyond scale degree 7 need to wrap (8→1, 9→2) but stay visually distinct

**Solution:**
```javascript
const isOctaveUp = noteNumber > scaleLength;
const displayNote = isOctaveUp
  ? ((noteNumber - 1) % scaleLength) + 1
  : noteNumber;

// Add visual distinction
if (isOctaveUp) {
  circle.classList.add('octave-up'); // Uses darker filled circle
}
```

### 4. Practice Mode State Management

**Pattern:** Check which pattern exists based on training type

```javascript
// WRONG: Always checks currentPattern
if (currentPattern.length > 0) {
  startSelfPacedMode();
}

// RIGHT: Check appropriate pattern
const hasPattern = currentTrainingType === 'interval'
  ? currentIntervalPattern.length > 0
  : currentPattern.length > 0;

if (hasPattern) {
  startSelfPacedMode();
}
```

---

## 📦 Code Organization Principles

### File Structure

```
/ear-train/
├── index.html           # Main app structure
├── app.js              # Core logic (2900+ lines)
├── styles.css          # All styling
├── scales.js           # Scale definitions (JI ratios)
├── audio-engine.js     # Web Audio API wrapper
├── pitch-detection.js  # Autocorrelation for tuner
├── manifest.json       # PWA config
└── assets/            # All handdrawn images
```

### State Management Strategy

**Global State Variables:**
- Organized by feature (note training, interval training, guessing, tuner)
- Clear naming: `currentIntervalPattern` vs `currentPattern`
- Reset functions clear state completely

**No Framework:** Vanilla JavaScript with direct DOM manipulation
- Fast and simple
- No build step
- Easy to understand and debug

### Event Handler Pattern

**Centralized setup in init():**
```javascript
function init() {
  loadSettings();
  setupModeToggle();
  setupEventListeners();
  setupTunerMode();
  // ...
}
```

**Named functions over anonymous:**
```javascript
// GOOD
playBtn.addEventListener('click', playPattern);

// AVOID
playBtn.addEventListener('click', () => {
  // lots of logic here
});
```

---

## 🎼 Musical Logic Insights

### Interval Calculation (Equal Temperament)

**Semitone to frequency ratio:**
```javascript
// Each semitone is 2^(1/12) ratio
const ratio = Math.pow(2, semitones / 12);

// Examples:
// Perfect 5th (7 semitones): 2^(7/12) ≈ 1.498 (close to JI's 3/2 = 1.5)
// Major 3rd (4 semitones): 2^(4/12) ≈ 1.260 (vs JI's 5/4 = 1.25)
```

### Scale Degree Mapping

**Challenge:** Western music has 7 scale degrees, but chromatic has 12 semitones.

**Solution for Interval Training:**
```javascript
const scaleSemitones = [0, 2, 4, 5, 7, 9, 11]; // Major scale pattern
const semitone = scaleSemitones[(noteNum - 1) % 7];
const frequency = baseFreq * Math.pow(2, semitone / 12);
```

### Pitch Detection (Tuner)

**Algorithm:** Autocorrelation (ACF2+) from cwilso/PitchDetect

**Key insight:** Find periodicity in audio signal
1. Buffer audio samples
2. Compute autocorrelation
3. Find peak (fundamental frequency)
4. Parabolic interpolation for accuracy

**Trade-off:** ~30ms latency but accurate within ±10 cents

---

## 🚀 Performance Optimizations

### 1. Lazy Audio Context Initialization

**Pattern:** Create AudioContext only when needed (user interaction required for Web Audio API)

```javascript
if (!audioEngine) {
  audioEngine = new AudioEngine();
  await audioEngine.init();
}
```

### 2. Reuse DOM Elements

**Pattern:** Query elements once, store references

```javascript
// At initialization
const elements = {
  playBtn: document.getElementById('play-btn'),
  // ...
};

// Later
elements.playBtn.disabled = true;
```

### 3. Debounce Pitch Detection

**Pattern:** Request animation frame for smooth updates

```javascript
function updateTunerPitch() {
  // Process audio
  const frequency = autoCorrelate(buffer, sampleRate);

  // Update UI
  updateDisplay(frequency);

  // Continue loop
  rafID = requestAnimationFrame(updateTunerPitch);
}
```

---

## 🎓 Key Learnings

### 1. Musical Intuition Matters

**Insight:** Users hear tuning inconsistencies! Even small differences (2-14 cents) were noticeable when intervals sounded different starting from different notes.

**Takeaway:** Test with actual musicians, trust their ears.

### 2. Mode Separation Simplifies Everything

**Insight:** When Training/Guessing/Tuner were independent modes (not mixable), bugs dropped significantly.

**Takeaway:** Fewer states = fewer bugs. Constrain what users can do.

### 3. Visual Feedback is Critical

**Insight:** In self-paced mode, users were confused when BOTH interval notes highlighted. Showing only the current note made it instantly clear.

**Takeaway:** UI should match mental model. One action = one highlight.

### 4. Progressive Enhancement Works

**Approach:** Start with working core functionality, add handdrawn UI as layer on top.

**Benefit:** Could test logic independently of design, then enhance visuals without breaking anything.

### 5. Documentation Saves Time

**Insight:** Writing `TUNING.md` when we fixed the tuning system prevented future confusion. Same with this file!

**Takeaway:** Document WHY, not just WHAT. Future you will thank you.

---

## 🔮 Future Considerations

### If Adding New Features:

1. **New Training Type?**
   - Add to dispatcher pattern in `generateNewPattern()`
   - Create separate state variables
   - Add mode toggle button
   - Update `updatePatternDisplay()` to handle new type

2. **New Audio Feature?**
   - Extend `audio-engine.js`
   - Keep tuning system consistent (ET or JI, document choice)
   - Test latency on mobile devices

3. **New UI Component?**
   - Draw handdrawn asset at 2× resolution
   - Export as transparent PNG
   - Add to `/assets/`
   - Reference in CSS with appropriate sizing

### Scalability Notes:

- **Performance:** Current approach handles up to ~100 notes fine. For longer patterns, consider:
  - Virtualized rendering
  - Chunked playback
  - Web Workers for audio generation

- **State Management:** If app grows much larger, consider:
  - State management library (Zustand, Redux)
  - Component architecture (React, Vue)
  - TypeScript for type safety

But for current scope (ear training practice), vanilla JS is perfect!

---

## 📚 Related Documentation

- `TUNING.md` - Detailed tuning system explanation
- `TUNER_SPEC.md` - Tuner feature specification
- `IMPLEMENTATION_STATUS.md` - Current progress tracking
- `AUDIO_ARCHITECTURE.md` - Audio engine design
- `ICONS_README.md` - Asset creation guidelines

---

**Remember:** This app prioritizes:
1. **Musical accuracy** (correct tuning, proper interval calculation)
2. **User experience** (clear feedback, intuitive controls)
3. **Aesthetic consistency** (handdrawn, pastel, friendly)
4. **Code clarity** (readable, well-documented, maintainable)

Keep these priorities when making changes! ✨
