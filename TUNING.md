# Tuning System Specification

## Overview

This app uses **two different tuning systems** for different purposes:

### 1. Just Intonation (JI) - For Scale Practice
**Used in:** Note training mode (playing scale degree patterns)

**Why:** Scales use the ratios defined in `scales.js` which are in just intonation. This creates "pure" intervals within each scale that sound pleasing and are culturally authentic (especially for Indian classical music).

**Example:** Major scale uses ratios `[1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8]`

### 2. Equal Temperament (ET) - For Interval Training
**Used in:** Interval training mode (melodic progressions and interval guessing)

**Why:** Equal temperament ensures that intervals are **consistent regardless of starting note**. A Perfect 5th (7 semitones) sounds the same whether you start from Do or from Mi.

**Formula:** `frequency = baseFreq * 2^(semitones/12)`

## Technical Implementation

### Scale Practice (JI)
```javascript
// app.js - playNote() function
const scale = SCALE_LIBRARY[currentScale];
const frequency = BASE_FREQUENCY * scale.ratios[noteNumber - 1];
```

### Interval Training (ET)
```javascript
// app.js - buildIntervalFromTemplate() function
const startFreq = BASE_FREQUENCY * Math.pow(2, startSemitone / 12);
const endFreq = BASE_FREQUENCY * Math.pow(2, endSemitone / 12);
```

### Interval Guessing (ET)
```javascript
// app.js - playCurrentMysteryInterval() function
const freq1 = BASE_FREQUENCY * scale.ratios[state.note1 - 1];
const freq2 = freq1 * Math.pow(2, state.mysteryInterval / 12);
```

## Why This Matters

### Equal Temperament Advantages:
- ✅ Every interval is mathematically consistent
- ✅ Works perfectly for all keys and starting notes
- ✅ Standard for modern Western instruments (piano, guitar)
- ✅ Easier to teach intervals (they always sound the same)

### Just Intonation Advantages:
- ✅ "Pure" consonant intervals (no beating)
- ✅ Culturally authentic for Indian classical music
- ✅ More beautiful for single-scale practice
- ✅ Better resonance and harmonic richness

### The Tradeoff:
- **JI sounds better** for playing within one scale
- **ET is more consistent** for interval training across different contexts

## Why Not Mix Them?

**Previous issue (now fixed):** The code was mixing JI starting notes with ET interval calculations. This created subtle tuning discrepancies:
- A perfect 5th from JI note 3 would be ~2-14 cents off from a pure interval
- Different starting notes created slightly different interval sizes
- This confused the ear training purpose (intervals should sound identical)

**Solution:** Use pure ET for all interval calculations, keeping JI only for scale degree practice.

## Base Frequency

**C4 (middle C) = 261.63 Hz** (defined as `BASE_FREQUENCY` in `app.js`)

This is the reference for all calculations.

## Semitone Mapping (Equal Temperament)

For major scale:
| Scale Degree | Semitones from C | Note Name |
|--------------|------------------|-----------|
| 1 (Do/Sa)    | 0                | C         |
| 2 (Re/Ri)    | 2                | D         |
| 3 (Mi/Ga)    | 4                | E         |
| 4 (Fa/Ma)    | 5                | F         |
| 5 (Sol/Pa)   | 7                | G         |
| 6 (La/Dha)   | 9                | A         |
| 7 (Ti/Ni)    | 11               | B         |
| 8 (Do/Sa)    | 12               | C (octave)|

## Interval Sizes (Equal Temperament)

| Interval      | Semitones | Ratio (ET)  | Ratio (JI Pure) |
|---------------|-----------|-------------|-----------------|
| Unison        | 0         | 1.0000      | 1/1             |
| Minor 2nd     | 1         | 1.0595      | 16/15           |
| Major 2nd     | 2         | 1.1225      | 9/8             |
| Minor 3rd     | 3         | 1.1892      | 6/5             |
| Major 3rd     | 4         | 1.2599      | 5/4             |
| Perfect 4th   | 5         | 1.3348      | 4/3             |
| Tritone       | 6         | 1.4142      | ~              |
| Perfect 5th   | 7         | 1.4983      | 3/2             |
| Minor 6th     | 8         | 1.5874      | 8/5             |
| Major 6th     | 9         | 1.6818      | 5/3             |
| Minor 7th     | 10        | 1.7818      | 16/9            |
| Major 7th     | 11        | 1.8877      | 15/8            |
| Octave        | 12        | 2.0000      | 2/1             |

Notice: ET and JI ratios are slightly different. ET is consistent; JI varies by context.

## Future Considerations

If users request tuning customization, we could add:
- **Tuning standard selector:** A=440 Hz (standard) vs A=432 Hz (alternative)
- **Temperament selector:** Switch between ET and JI for all modes
- **Cent deviation display:** Show how far from pure JI each ET interval is

---

**Last updated:** 2025-12-31
**Implemented in:** app.js lines 878-888 (interval training), lines 2491-2494 (interval guessing)
