# 🎵 Ear Training Practice App

A simple, elegant web application for practicing musical ear training with support for Western, Hindustani, and Carnatic notation systems.

## Features

### Pattern Generation

- **Three Pattern Modes**
  - **Pedagogical**: Curated traditional ear training sequences
  - **Random**: Algorithm-based generation respecting interval difficulty rules
  - **Custom Input**: Enter your own patterns (e.g., "1 3 5 3 1")

- **Three Difficulty Levels** (based on interval size AND pattern length)
  - **Easy**: 3-5 notes, stepwise motion (seconds), mostly conjunct patterns
    - Examples: 1-2-3, 1-2-3-2-1 (traditional beginner exercises)
  - **Medium**: 5-7 notes, mix of steps and small skips (thirds/fourths)
    - Examples: 1-3-5-3-1 (triad arpeggio), 1-4-3-2-1 (fourth leaps)
  - **Hard**: 7-10 notes, large intervals (fifths/sixths), complex direction changes
    - Examples: 1-5-1 (perfect fifth), 1-6-4-2-7-5-3-1 (wide interval training)

### Scale Library

- **Western Scales**
  - Major (Ionian)
  - Natural Minor (Aeolian)
  - Harmonic Minor
  - Melodic Minor
  - Pentatonic Major
  - Pentatonic Minor

- **Hindustani Ragas** (with pakad phrases)
  - Bhairav - Morning, serious/spiritual
  - Yaman (Kalyan) - Evening, sweet/calm
  - Kafi - Afternoon, devotional
  - Bilaval - Morning (equivalent to Major)
  - Bhairavi - Night, melancholic
  - Todi - Afternoon, complex/intense

- **Carnatic Ragas** (popular melakartas)
  - Mayamalavagowla (15) - Beginner raga, morning
  - Shankarabharanam (29) - Versatile, joyful
  - Kalyani (65) - Joyful, auspicious
  - Kharaharapriya (22) - Serious, contemplative
  - Harikambhoji (28) - Bright, devotional
  - Natabhairavi (20) - Evening, contemplative

### Notation Display

- **Flexible Display Options**
  - Toggle numbers (1, 2, 3...) on/off
  - Toggle syllables (Do/Sa, Re, Mi/Ga...) on/off
  - Both can be shown simultaneously
  - Three syllable systems: Western, Hindustani, Carnatic

### Enhanced Playback Controls

- **Standard Controls**
  - Play, Pause, Resume, Restart
  - Adjustable playback speed (0.5x - 2x)

- **Advanced Practice Features**
  - **Replay Last Note**: Hear previous note again
  - **Step Forward**: Manual note-by-note playback
  - **Loop Pattern**: Auto-repeat pattern N times
  - **Adjustable Gap**: Control silence between notes (0-2 seconds)
  - **Manual Mode**: Click to play each note individually

### Practice Modes

- **Listen Mode**: Computer plays sound (normal practice)
- **Visual Only**: Pattern highlights but silent, you sing along
- **Test Mode**: Microphone listens and gives real-time feedback

### Pitch Detection & Test Mode

- **Real-Time Pitch Detection**
  - Accurate autocorrelation algorithm
  - Shows target note vs. detected note
  - Displays cents deviation (±50 = correct)
  - Visual pitch meter
  - No octave equivalence (precise pitch required)

- **Test Workflow**
  - Listen to pattern
  - Sing it back
  - Get instant feedback on each note
  - See accuracy percentage and specific errors
  - Identify which intervals need work

### Interval Training

- **Interval Name Display**
  - Shows interval labels (Perfect Fifth, Major Third, etc.)
  - Educational context during practice
  - Track which intervals you struggle with

### Practice History & Analytics

- **Session Tracking**
  - Auto-saves practice sessions
  - Track duration, scales practiced, accuracy
  - No manual effort required

- **Calendar View**
  - Visual calendar grid showing practice days
  - Color-coded by scale practiced
  - See which scales worked on which days
  - Weekly/monthly breakdown

- **Progress Stats (Factual)**
  - Accuracy trends by interval type
  - Most/least practiced scales
  - Weak vs. strong intervals
  - No gamification, just data

### Guessing Mode

- **Ear Training Games**
  - Computer plays mystery note or interval
  - Identify what you heard
  - Respond by singing or clicking
  - Immediate feedback

### Mobile Support

- **PWA (Progressive Web App)**
  - Installable on mobile devices
  - Works offline after first load
  - Full-screen app experience
  - No app store required

### UI Design

- **Minimalist Aesthetic**
  - Plain text, clean design
  - Light background, high contrast
  - Simple border-only buttons
  - Space for custom doodles/icons
  - No distracting animations

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

## Roadmap

### Phase 1 (Complete)
✅ Basic pattern playback
✅ Western notation support

### Phase 2 (In Progress)
- 🔄 Pattern modes (pedagogical/random/custom)
- 🔄 Full scale library (Western, Hindustani, Carnatic)
- 🔄 Enhanced playback controls
- 🔄 Notation display toggles

### Phase 3 (Upcoming)
- ⏳ Pitch detection & test mode
- ⏳ Interval name display
- ⏳ Practice history & calendar
- ⏳ Guessing mode
- ⏳ PWA support

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
