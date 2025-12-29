# 🎵 Ear Training Practice App

A simple, elegant web application for practicing musical ear training with support for Western, Hindustani, and Carnatic notation systems.

## Features

### Current Features (v1.0)

- **Three Difficulty Levels** (based on interval size AND pattern length)
  - **Easy**: 3-5 notes, stepwise motion (seconds), mostly conjunct patterns
    - Examples: 1-2-3, 1-2-3-2-1 (traditional beginner exercises)
  - **Medium**: 5-7 notes, mix of steps and small skips (thirds/fourths)
    - Examples: 1-3-5-3-1 (triad arpeggio), 1-4-3-2-1 (fourth leaps)
  - **Hard**: 7-10 notes, large intervals (fifths/sixths), complex direction changes
    - Examples: 1-5-1 (perfect fifth), 1-6-4-2-7-5-3-1 (wide interval training)

- **Multiple Notation Systems**
  - Western: Do, Re, Mi, Fa, Sol, La, Ti
  - Hindustani: Sa, Re, Ga, Ma, Pa, Dha, Ni
  - Carnatic: Sa, Ri, Ga, Ma, Pa, Da, Ni

- **Pedagogically-Sound Pattern Generation**
  - Based on traditional ear training exercises and interval training
  - Patterns progress from stepwise motion → small skips → large leaps
  - Examples: 1-2-3-2-1 (stepwise), 1-3-5 (thirds), 1-5-1 (perfect fifth)
  - Each pattern is randomly selected from proven ear training sequences
  - Difficulty considers BOTH pattern length AND interval size (larger jumps = harder)

- **Audio Playback**
  - High-quality sine wave tones using Web Audio API
  - Adjustable playback speed (0.5x - 2x)
  - Play, pause, and repeat controls

- **Visual Feedback**
  - Scale position indicator showing all 7 notes
  - Highlighted notes that appear in the current pattern
  - Active note highlighting during playback
  - Optional solfege syllable display

- **Clean, Modern UI**
  - Dark theme optimized for extended practice sessions
  - Responsive design works on mobile and desktop
  - Elegant animations and transitions

## How to Use

1. **Open the App**
   - Simply open `index.html` in a modern web browser
   - No installation or build process required!

2. **Configure Your Settings**
   - Choose a difficulty level (Easy/Medium/Hard)
   - Select your preferred notation system
   - Adjust playback speed if desired
   - Toggle solfege display on/off

3. **Generate a Pattern**
   - Click "Generate New Pattern" to create a random sequence
   - The pattern will be displayed as numbers (e.g., "1 2 3 2 1")

4. **Practice**
   - Click "Play" to hear the pattern
   - Watch the visual scale as notes are highlighted
   - Use "Pause" to stop temporarily
   - Use "Repeat" to play the same pattern again
   - Try to sing along or internalize the pattern

5. **Repeat**
   - Generate new patterns and practice!
   - Switch notation systems to familiarize yourself with different traditions

## How Ear Training Works

Ear training develops your ability to:
- **Identify intervals** between notes
- **Recognize patterns** and melodic sequences
- **Internalize pitch relationships** (relative pitch)
- **Improve vocal accuracy** when singing

The pattern sequences (like 12321) represent scale degrees:
- `1` = Tonic (Do/Sa)
- `2` = Second degree (Re/Re/Ri)
- `3` = Third degree (Mi/Ga)
- etc.

By practicing these patterns, you train your brain to recognize the relationships between notes, which is fundamental to musical literacy and singing in tune.

## Notation System Details

### Western Solfege
- **Do Re Mi Fa Sol La Ti** (movable do system)
- Most common in Western music education
- Used in The Sound of Music!

### Hindustani Sargam
- **Sa Re Ga Ma Pa Dha Ni**
- North Indian classical music system
- Pronunciation: "Re" (not "Ri"), "Dha" (not "Da")
- Based on 22 śruti (microtones)

### Carnatic Sargam
- **Sa Ri Ga Ma Pa Da Ni**
- South Indian classical music system
- Pronunciation: "Ri" (not "Re"), "Da" (not "Dha")
- Based on 24 śruti (microtones)
- Sa and Pa are immovable anchors

## Coming Soon

### Test Mode
- Sing back patterns and receive pitch accuracy feedback
- Real-time pitch detection using Web Audio API
- Progress tracking

### Guessing Mode
- Identify intervals by ear
- Test your note recognition skills
- Gamified learning experience

## Technical Details

- **No dependencies** - Pure vanilla JavaScript
- **Web Audio API** for high-quality audio synthesis
- **Responsive CSS Grid** for flexible layouts
- **Modern ES6+** JavaScript features
- **Works offline** once loaded

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

Requires Web Audio API support.

## References

This app was designed based on established ear training methodologies:

- [EarMaster - Ear Training App](https://www.earmaster.com/)
- [ToneDear - Functional Ear Training](https://tonedear.com/ear-training/functional-solfege-scale-degrees)
- [Berklee - Ear Training Exercises](https://online.berklee.edu/takenote/ear-training-exercises-to-help-you-become-a-better-musician/)
- [Music Theory - Exercises](https://www.musictheory.net/exercises)
- [Wikipedia - Svara (Indian Music Notes)](https://en.wikipedia.org/wiki/Svara)
- [iPassio - Swaras in Music](https://www.ipassio.com/blog/types-of-musical-notes-in-indian-music)

## License

Free to use for personal practice and learning.

## Feedback

Enjoy your practice! 🎶
