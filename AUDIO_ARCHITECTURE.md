# Audio Architecture - Before & After

## Architecture Comparison

### BEFORE (Simple Sine Wave)
```
User clicks Play
    ↓
app.js: playNote(noteNumber, duration)
    ↓
Calculate frequency: BASE_FREQUENCY × scale.ratios[noteNumber - 1]
    ↓
Create single oscillator
    ├── type = 'sine' (pure tone)
    ├── frequency = calculated value
    └── envelope:
        • 0ms → 0 volume
        • 50ms → 0.3 volume (attack)
        • 100ms → 0.2 volume (decay)
        • duration-100ms → 0.2 volume (sustain)
        • duration → 0 volume (release)
    ↓
SOUND: Flat, electronic beep 🔊

Problems:
❌ No harmonics - just fundamental frequency
❌ Generic envelope - same for all sounds
❌ Single waveform - no timbral variety
❌ Not musical - sounds synthetic
```

### AFTER (Rich Instrument Synthesis)
```
User selects instrument (e.g., "Harmonium")
    ↓
User clicks Play
    ↓
app.js: playNote(noteNumber, duration)
    ↓
Calculate frequency: BASE_FREQUENCY × scale.ratios[noteNumber - 1]
    ↓
audioEngine.playNote(frequency, duration)
    ↓
audio-engine.js: AudioEngine.playNote()
    ↓
Get current instrument definition: INSTRUMENTS[this.currentInstrument]
    ↓
Call instrument.play(audioContext, destination, frequency, duration)
    ↓
    ┌─────────────── HARMONIUM EXAMPLE ───────────────┐
    │                                                   │
    │  Create 6 oscillators (one per harmonic):        │
    │                                                   │
    │  Harmonic 1 (fundamental):                       │
    │    • Triangle wave                               │
    │    • frequency × 1 (e.g., 261.63 Hz = C)        │
    │    • gain: 0.6                                   │
    │                                                   │
    │  Harmonic 2 (octave):                           │
    │    • Triangle wave                               │
    │    • frequency × 2 (523.26 Hz = C5)             │
    │    • gain: 0.3                                   │
    │                                                   │
    │  Harmonic 3 (fifth):                            │
    │    • Triangle wave                               │
    │    • frequency × 3 (784.89 Hz = G5)             │
    │    • gain: 0.15                                  │
    │                                                   │
    │  Harmonic 4, 5, 6: (similar, decreasing gain)   │
    │                                                   │
    │  Each harmonic has custom envelope:              │
    │    • 0ms → 0 volume                             │
    │    • 80ms → 0.8 × gain (attack)                 │
    │    • 150ms → 1.0 × gain (full)                  │
    │    • duration-150ms → 1.0 × gain (sustain)      │
    │    • duration → 0.001 (release)                 │
    │                                                   │
    └───────────────────────────────────────────────────┘
    ↓
All oscillators → gain nodes → master gain → speakers
    ↓
SOUND: Rich, warm, reedy harmonium tone 🎵✨

Benefits:
✅ Multiple harmonics - full, rich sound
✅ Custom envelope - natural instrument character
✅ Appropriate waveform - reedy triangle waves
✅ Musical quality - sounds like real instrument
```

## Harmonic Series Visualization

### Single Sine Wave (Before)
```
Volume
  ↑
1.0│  ___
   │ /   \___
0.5│/        \___
   │             \___
0.0└──────────────────→ Time
   Only fundamental frequency (261.63 Hz)

Spectrum:
Frequency → 261.63 Hz
Amplitude → ▓▓▓▓▓▓▓▓▓▓
            (just one bar)
```

### Harmonium (After)
```
Volume per harmonic
  ↑
1.0│ Fundamental (1x) ▓▓▓▓▓▓▓▓▓▓ (261.63 Hz)
0.8│
0.6│
0.4│ Octave (2x)      ▓▓▓▓▓ (523.26 Hz)
0.2│ Fifth (3x)       ▓▓▓ (784.89 Hz)
   │ 4th harmonic     ▓▓ (1046.52 Hz)
   │ 5th harmonic     ▓ (1308.15 Hz)
   │ 6th harmonic     ▓ (1569.78 Hz)
0.0└─────────────────────────────────→ Frequency

Result: Rich, full sound with overtones
```

## Envelope Comparison

### Generic Envelope (Before)
```
Volume
  ↑
0.3│    ┌─────────────┐
    │   ╱              │
0.2│  ╱               │
    │ ╱                │
0.0└─┴────────────────┴─→ Time
    50ms            duration

Same for all sounds - no character
```

### Harmonium Envelope (After)
```
Volume
  ↑
1.0│      ┌──────────────────┐
    │     ╱                   │
0.8│    ╱                    │
    │   ╱                     │
    │  ╱                      ╲
0.0└─┴───────────────────────╲→ Time
    80ms  150ms          duration

Characteristics:
- Medium attack (80ms) - gentle onset
- Slight decay to sustain - natural
- Long sustain - organ-like
- Smooth release - no clicks
```

### Piano Envelope (After)
```
Volume
  ↑
1.0│┐
    ││╲
0.6│ │ ╲___
    │ │     ╲____
0.3│ │          ╲_____
    │ │                ╲______
0.0└─┴──────────────────────╲→ Time
   10ms  100ms           duration

Characteristics:
- Very fast attack (10ms) - hammer strike
- Exponential decay - string behavior
- Fades to silence - realistic piano
```

### Tanpura Envelope (After)
```
Volume
  ↑
1.0│           ┌──────────────┐
    │          ╱               │
    │         ╱                │
0.5│        ╱                 │
    │       ╱                  │
    │      ╱                   ╲
0.0└─────┴────────────────────╲→ Time
      200ms  400ms        duration

Characteristics:
- Very slow attack (200ms) - gradual onset
- Long ramp to full - drone character
- Extended sustain - continuous sound
- Gentle release - smooth ending
```

## Waveform Comparison

### Sine Wave (Before & Pure Tone option)
```
 1.0 ─────╱╲─────╱╲─────╱╲─────
         ╱  ╲   ╱  ╲   ╱  ╲
 0.0 ───╯────╲─╯────╲─╯────╲───
             ╲      ╲      ╲
-1.0 ─────────╲╱────╲╱─────╲╱──

Spectrum: Only fundamental (pure tone)
Character: Clean, clinical, no character
```

### Triangle Wave (Harmonium, Veena fundamental)
```
 1.0 ────╱╲────╱╲────╱╲────
        ╱  ╲  ╱  ╲  ╱  ╲
 0.0 ──╯────╲╱────╲╱────╲╱───

Spectrum: Odd harmonics (1, 3, 5, 7...)
Character: Reedy, organic, warm
```

### Sawtooth Wave (Tanpura, Sarangi)
```
 1.0 ──╱│  ╱│  ╱│  ╱│  ╱│
      ╱ │ ╱ │ ╱ │ ╱ │ ╱ │
 0.0 ╯  │╯  │╯  │╯  │╯  │

Spectrum: All harmonics (1, 2, 3, 4, 5...)
Character: Bright, rich, buzzy
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                          │
│                                                          │
│  <select id="instrument">                               │
│    <option value="harmonium">Harmonium</option>         │
│    <option value="tanpura">Tanpura</option>            │
│    ...                                                   │
│  </select>                                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ User selects instrument
┌─────────────────────────────────────────────────────────┐
│                       app.js                             │
│                                                          │
│  elements.instrument.addEventListener('change', e => {   │
│    currentInstrument = e.target.value;                  │
│    audioEngine.setInstrument(currentInstrument);        │
│  });                                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ User plays pattern
┌─────────────────────────────────────────────────────────┐
│                       app.js                             │
│                                                          │
│  playNote(noteNumber, duration) {                       │
│    const frequency = BASE_FREQUENCY ×                   │
│                      scale.ratios[noteNumber - 1];      │
│    audioEngine.playNote(frequency, duration);           │
│  }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  audio-engine.js                         │
│                                                          │
│  class AudioEngine {                                     │
│    playNote(frequency, duration) {                      │
│      const instrument = INSTRUMENTS[this.currentInst];  │
│      instrument.play(context, dest, freq, dur);         │
│    }                                                     │
│  }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  audio-engine.js                         │
│                                                          │
│  const INSTRUMENTS = {                                   │
│    harmonium: {                                         │
│      play: function(ctx, dest, freq, dur) {            │
│        // Create multiple oscillators                   │
│        // Apply envelopes                               │
│        // Connect to output                             │
│      }                                                   │
│    },                                                    │
│    tanpura: { ... },                                    │
│    piano: { ... },                                      │
│    ...                                                   │
│  }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ Web Audio API
┌─────────────────────────────────────────────────────────┐
│              Browser Audio System                        │
│                                                          │
│  Oscillators → Gain Nodes → Filters → Master Gain       │
│                                              ↓           │
│                                          Speakers 🔊     │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
ear-train/
├── index.html
│   └── Contains:
│       • <select id="instrument"> (NEW)
│       • <script src="audio-engine.js"> (NEW)
│       • <script src="app.js"> (MODIFIED)
│
├── app.js
│   └── Changes:
│       • let audioEngine = new AudioEngine() (REPLACED audioContext)
│       • handleInstrumentChange() (NEW)
│       • loadInstrumentPreference() (NEW)
│       • playNote() simplified (MODIFIED)
│
├── audio-engine.js (NEW)
│   └── Contains:
│       • class AudioEngine
│       • const INSTRUMENTS = { 8 instruments }
│       • Each instrument has .play() method
│
├── test-audio.html (NEW)
│   └── Test page for all instruments
│
├── AUDIO_IMPROVEMENTS.md (NEW)
│   └── Technical documentation
│
├── AUDIO_UPDATE_SUMMARY.md (NEW)
│   └── User-friendly summary
│
└── AUDIO_ARCHITECTURE.md (NEW - this file)
    └── Visual architecture diagrams
```

## Instrument Sound Characteristics Table

| Instrument | Waveforms | Harmonics | Attack | Sustain | Release | Special Features |
|-----------|-----------|-----------|--------|---------|---------|------------------|
| **Harmonium** | Triangle | 6 | 80ms | High | 150ms | Reedy quality |
| **Tanpura** | Sawtooth | 7 | 200ms | High | 300ms | Detuning, buzz |
| **Piano** | Sine | 7 | 10ms | Decay | Exp | Inharmonicity |
| **Bansuri** | Sine + Noise | 6 | 80ms | Medium | 120ms | Breath noise |
| **Sarangi** | Sawtooth | 8 | 150ms | High | 200ms | Bandpass filter |
| **Veena** | Triangle/Saw | 7 | 5ms | Decay | Exp | Fast pluck |
| **Bell** | Sine | 5 | 10ms | Long | 1.5×dur | Inharmonic |
| **Pure Tone** | Sine | 1 | 50ms | Medium | 100ms | Simple |

## Memory & Performance

### Before (Simple)
```
Per note:
- 1 oscillator
- 1 gain node
- ~0.5 KB memory
- Minimal CPU
```

### After (Rich)
```
Per note:
- 1-8 oscillators (depending on instrument)
- 1-8 gain nodes
- 0-1 filter nodes
- 0-1 buffer source (for noise)
- ~2-4 KB memory per note
- Still minimal CPU (Web Audio API is optimized)

Result: ~4-8× more processing, but still negligible
Browser handles hundreds of simultaneous oscillators easily
```

## Browser Compatibility

All features use standard Web Audio API:
- ✅ Chrome 34+ (2014)
- ✅ Firefox 25+ (2013)
- ✅ Safari 14+ (2020) - full support, iOS included
- ✅ Edge 79+ (2020)

No external libraries needed - pure Web Audio API!

## Conclusion

The transformation from simple sine waves to rich instrument synthesis represents:
- **300-700% more harmonic content** (1 harmonic → 5-8 harmonics)
- **Customized envelopes** (generic → instrument-specific)
- **Timbral variety** (1 sound → 8 instruments)
- **Musical quality** (synthetic → realistic)

All achieved with:
- ✅ No external libraries
- ✅ No audio files
- ✅ Real-time synthesis
- ✅ Minimal performance impact
- ✅ Works everywhere
