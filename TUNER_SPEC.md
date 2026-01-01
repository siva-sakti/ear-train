# Simple Tuner Tab Specification

## Overview
A minimal tuner interface that lets users:
1. **Sing/play a note** → see what note it is
2. **Choose a note** → hear it played

## UI Layout

```
┌─────────────────────────────────────┐
│           TUNER                      │
├─────────────────────────────────────┤
│                                      │
│  Listen Mode                         │
│  ┌──────────────────────────────┐  │
│  │   🎤 Click to start listening │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │                               │  │
│  │         You sang:             │  │
│  │                               │  │
│  │           [C]                 │  │
│  │         (Sa/Do)               │  │
│  │                               │  │
│  │      261.6 Hz                 │  │
│  │     +12 cents ↑               │  │
│  │                               │  │
│  └──────────────────────────────┘  │
│                                      │
│  Play Mode                           │
│  ┌──────────────────────────────┐  │
│  │  Choose a note to hear:       │  │
│  │                               │  │
│  │  [1] [2] [3] [4] [5] [6] [7]  │  │
│  │                               │  │
│  │  Or play frequency:           │  │
│  │  [261.6 Hz ▼] [Play ▶]       │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Features

### Listen Mode
- **Start/Stop Button**: Click to begin/end listening
- **Real-time Display**:
  - Note name (C, D, E, etc.)
  - Solfège syllable (Do, Re, Mi / Sa, Re, Ga)
  - Frequency in Hz
  - Cents deviation (how sharp/flat)
  - Visual indicator: green = in tune (±10 cents), yellow = close (±25 cents), red = off

### Play Mode
- **Note Buttons (1-7)**: Click to hear each scale degree
- **Frequency Selector**: Dropdown or input for specific frequencies
- **Play Button**: Plays the selected frequency

## Technical Implementation

### Microphone Input
```javascript
// Use existing pitch detection from PITCH_DETECTION.md
// Autocorrelation algorithm for accurate pitch detection
// Update display 10x per second (100ms intervals)
```

### Display Update
```javascript
function updateTunerDisplay(detectedPitch) {
    elements.tunerNote.textContent = detectedPitch.noteName; // "C"
    elements.tunerSyllable.textContent = detectedPitch.syllable; // "Do/Sa"
    elements.tunerFrequency.textContent = detectedPitch.frequency.toFixed(1) + " Hz";

    const cents = detectedPitch.cents;
    elements.tunerCents.textContent = (cents > 0 ? "+" : "") + cents.toFixed(0) + " cents";

    // Color indicator
    if (Math.abs(cents) < 10) {
        elements.tunerDisplay.className = "tuner-display in-tune"; // Green
    } else if (Math.abs(cents) < 25) {
        elements.tunerDisplay.className = "tuner-display close"; // Yellow
    } else {
        elements.tunerDisplay.className = "tuner-display off"; // Red
    }

    // Arrow indicator
    elements.tunerArrow.textContent = cents > 5 ? "↑" : cents < -5 ? "↓" : "•";
}
```

### Note Playback
```javascript
function playChosenNote(noteNumber) {
    // Reuse existing playNote() function from app.js
    playNote(noteNumber, 2.0); // Play for 2 seconds
}

function playFrequency(frequency) {
    // Use audioEngine directly
    audioEngine.playNote(frequency, 2.0);
}
```

## Minimal HTML Structure

```html
<!-- Tuner Mode Container -->
<div id="tuner-mode-container" style="display: none;">
    <section class="section">
        <h2>Tuner</h2>

        <!-- Listen Section -->
        <div class="tuner-listen">
            <h3>Listen</h3>
            <button id="tuner-listen-btn" class="btn btn-primary">
                🎤 Click to Listen
            </button>

            <div id="tuner-display" class="tuner-display" style="display: none;">
                <div class="tuner-note-name" id="tuner-note">--</div>
                <div class="tuner-syllable" id="tuner-syllable">--</div>
                <div class="tuner-frequency" id="tuner-frequency">-- Hz</div>
                <div class="tuner-cents">
                    <span id="tuner-cents-value">0 cents</span>
                    <span id="tuner-arrow">•</span>
                </div>
            </div>
        </div>

        <!-- Play Section -->
        <div class="tuner-play">
            <h3>Play</h3>
            <p class="info-text">Choose a note to hear:</p>

            <div class="note-buttons">
                <button class="tuner-note-btn" data-note="1">1</button>
                <button class="tuner-note-btn" data-note="2">2</button>
                <button class="tuner-note-btn" data-note="3">3</button>
                <button class="tuner-note-btn" data-note="4">4</button>
                <button class="tuner-note-btn" data-note="5">5</button>
                <button class="tuner-note-btn" data-note="6">6</button>
                <button class="tuner-note-btn" data-note="7">7</button>
            </div>

            <div class="tuner-frequency-play">
                <label>Or play specific frequency:</label>
                <input type="number" id="tuner-freq-input" value="261.6" step="0.1" min="80" max="1000">
                <button id="tuner-freq-play-btn" class="btn">Play ▶</button>
            </div>
        </div>
    </section>
</div>
```

## CSS Styling

```css
.tuner-display {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 32px;
    text-align: center;
    margin: 24px 0;
}

.tuner-display.in-tune {
    border-color: #4CAF50; /* Green */
    background: rgba(76, 175, 80, 0.1);
}

.tuner-display.close {
    border-color: #FFC107; /* Yellow */
    background: rgba(255, 193, 7, 0.1);
}

.tuner-display.off {
    border-color: #F44336; /* Red */
    background: rgba(244, 67, 54, 0.1);
}

.tuner-note-name {
    font-size: 4em;
    font-weight: bold;
    margin-bottom: 8px;
}

.tuner-syllable {
    font-size: 1.5em;
    color: var(--text-subtle);
    margin-bottom: 16px;
}

.tuner-frequency {
    font-size: 1.2em;
    margin-bottom: 8px;
}

.tuner-cents {
    font-size: 1.1em;
}

.tuner-arrow {
    font-size: 1.5em;
    margin-left: 8px;
}

.tuner-note-btn {
    min-width: 48px;
    height: 48px;
    margin: 4px;
}

.tuner-frequency-play {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    align-items: center;
}

#tuner-freq-input {
    width: 100px;
}
```

## User Flow

### Listening Flow
1. User clicks "🎤 Click to Listen"
2. Browser requests microphone permission
3. Button changes to "Stop Listening"
4. Display shows real-time pitch info
5. User sings/plays notes, sees immediate feedback
6. User clicks "Stop Listening" when done

### Playing Flow
1. User clicks note button (1-7)
2. App plays that scale degree for 2 seconds
3. OR: User enters custom frequency (e.g., 440 for A4)
4. Clicks "Play ▶" to hear it

## Implementation Priority

### Must Have (MVP)
- ✅ Microphone access and permission handling
- ✅ Real-time pitch detection display
- ✅ Note name, syllable, frequency display
- ✅ Play note buttons (1-7)

### Nice to Have
- Visual needle/gauge for cents deviation
- Waveform visualization
- Record and playback what you sang
- Tuner history (last 10 notes detected)
- Different tuning standards (A=440, A=432, etc.)

### Future Enhancements
- Chord detection (show all notes in a chord)
- Harmonic spectrum display
- Practice mode (drone + tuner together)

## Estimated Effort

- **UI/HTML**: 30 minutes
- **Pitch detection integration**: 1 hour (reuse from PITCH_DETECTION.md)
- **Display updates & styling**: 1 hour
- **Play mode implementation**: 30 minutes
- **Testing & polish**: 1 hour

**Total: ~4 hours** for full tuner tab with both listen and play modes.

## Notes

- Reuse autocorrelation code from `PITCH_DETECTION.md`
- Reuse `playNote()` and `audioEngine` from existing `app.js`
- Keep it **super simple** - no complex visualizations in MVP
- Make it useful for both beginners (hear the note) and advanced users (precise tuning)
