# Pitch Detection Implementation Guide

This document outlines how to implement pitch detection for the Test Mode and Guessing Mode features.

## Overview

Pitch detection will allow the app to:
1. **Listen to the user's voice** through their microphone
2. **Detect the pitch/frequency** of the sung note
3. **Compare it to the expected note** in the pattern
4. **Provide feedback** on accuracy

## Technical Approach

### 1. Microphone Access

Use the Web Audio API's `getUserMedia()` to access the microphone:

```javascript
async function getMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false
            }
        });
        return stream;
    } catch (error) {
        console.error('Microphone access denied:', error);
        return null;
    }
}
```

### 2. Audio Analysis Setup

Create an AnalyserNode to process the audio:

```javascript
function setupAudioAnalysis(stream) {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    microphone.connect(analyser);

    return { audioContext, analyser };
}
```

### 3. Pitch Detection Algorithm

Two main approaches:

#### A. Autocorrelation (Recommended)
- More accurate for musical notes
- Better for singing/voice detection
- Works well with harmonic sounds

```javascript
function autoCorrelate(buffer, sampleRate) {
    // Implementation based on: https://github.com/cwilso/PitchDetect

    let SIZE = buffer.length;
    let sumOfSquares = 0;

    for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        sumOfSquares += val * val;
    }

    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    if (rootMeanSquare < 0.01) {
        return -1; // Not enough signal
    }

    let r1 = 0;
    let r2 = SIZE - 1;
    const threshold = 0.2;

    // ... (full autocorrelation algorithm)

    return frequency;
}
```

#### B. FFT (Fast Fourier Transform)
- Faster computation
- Good for getting general frequency data
- Built into AnalyserNode

```javascript
function getFFTPitch(analyser) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    analyser.getFloatFrequencyData(dataArray);

    // Find the peak frequency
    let maxValue = -Infinity;
    let maxIndex = 0;

    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxValue) {
            maxValue = dataArray[i];
            maxIndex = i;
        }
    }

    const nyquist = audioContext.sampleRate / 2;
    const frequency = (maxIndex * nyquist) / bufferLength;

    return frequency;
}
```

### 4. Note Comparison

Convert detected frequency to closest note:

```javascript
function frequencyToNote(frequency) {
    // A4 = 440 Hz
    const A4 = 440;
    const C4 = 261.63; // Our base frequency

    // Calculate how many semitones from A4
    const semitones = 12 * Math.log2(frequency / A4);
    const noteNumber = Math.round(semitones) + 69; // A4 is MIDI note 69

    // Convert to scale degree (1-7)
    const scaleDegree = ((noteNumber - 60) % 12); // C4 is MIDI note 60

    // Map to major scale degrees
    const majorScaleMap = {
        0: 1,  // C -> Do/Sa
        2: 2,  // D -> Re/Re/Ri
        4: 3,  // E -> Mi/Ga
        5: 4,  // F -> Fa/Ma
        7: 5,  // G -> Sol/Pa
        9: 6,  // A -> La/Dha/Da
        11: 7  // B -> Ti/Ni
    };

    return {
        degree: majorScaleMap[scaleDegree] || null,
        cents: (semitones - Math.round(semitones)) * 100, // Deviation in cents
        frequency: frequency
    };
}
```

### 5. Accuracy Feedback

Calculate how close the sung note is:

```javascript
function calculateAccuracy(expectedNote, detectedNote) {
    if (detectedNote.degree === expectedNote) {
        // Correct note! Check how accurate the pitch is
        const centDeviation = Math.abs(detectedNote.cents);

        if (centDeviation < 10) return { correct: true, rating: 'Perfect!', accuracy: 100 };
        if (centDeviation < 25) return { correct: true, rating: 'Great!', accuracy: 90 };
        if (centDeviation < 50) return { correct: true, rating: 'Good', accuracy: 75 };

        return { correct: true, rating: 'On pitch', accuracy: 60 };
    } else {
        return { correct: false, rating: 'Try again', accuracy: 0 };
    }
}
```

## Implementation Plan

### Phase 1: Basic Pitch Detection
1. Add microphone permission request
2. Implement autocorrelation algorithm
3. Display detected pitch in real-time
4. Test with different voices and singing styles

### Phase 2: Test Mode
1. Create UI for test mode
2. Play a pattern, then record user's response
3. Compare each note and show results
4. Display accuracy percentage and feedback

### Phase 3: Guessing Mode
1. Play individual notes or intervals
2. User sings back what they hear
3. System identifies what they sang
4. Show if correct/incorrect with visual feedback

## UI Components Needed

```html
<!-- Test Mode Section -->
<section class="test-mode-section">
    <h2>Test Mode</h2>
    <button id="request-mic-btn">Allow Microphone Access</button>
    <div id="mic-status" class="mic-status"></div>

    <div id="test-controls" style="display: none;">
        <button id="start-test-btn">Start Test</button>
        <div id="pitch-display">Detected: <span id="detected-pitch">--</span></div>
        <div id="accuracy-meter">
            <div class="accuracy-bar"></div>
        </div>
    </div>

    <div id="test-results"></div>
</section>
```

## Challenges & Solutions

### Challenge 1: Background Noise
**Solution:** Use noise suppression in getUserMedia, set amplitude threshold

### Challenge 2: Harmonics/Overtones
**Solution:** Autocorrelation handles this better than FFT

### Challenge 3: Octave Confusion
**Solution:** Limit detection range to 1-2 octaves around base frequency

### Challenge 4: Latency
**Solution:** Use AudioWorklet instead of ScriptProcessorNode (deprecated)

## References

- [Detecting pitch with autocorrelation - Alexander Ellis](https://alexanderell.is/posts/tuner/)
- [Web Audio Tuner with FFT](https://npwi.com/npwiAccount/courses/assignments/course8/pitch/)
- [MDN - getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Web.dev - Processing microphone audio](https://web.dev/patterns/media/microphone-process)
- [GitHub - cwilso/PitchDetect](https://github.com/cwilso/PitchDetect)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Estimated Complexity

- **Basic pitch detection:** Medium (2-3 hours)
- **Test mode with feedback:** Medium-High (4-6 hours)
- **Guessing mode:** Medium (3-4 hours)
- **Polish and testing:** 2-3 hours

**Total:** ~12-16 hours of development time

## Next Steps

1. Implement basic pitch detection first
2. Test thoroughly with different users and environments
3. Add visual tuner display for immediate feedback
4. Build out test mode once detection is reliable
5. Add progress tracking and statistics
