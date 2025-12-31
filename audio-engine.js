// Enhanced Audio Engine - Rich synthesis for Indian Classical & Western Music
// Multiple instrument timbres with realistic envelopes and harmonics

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.currentInstrument = 'harmonium';
        this.masterGain = null;
        this.activeOscillators = [];
    }

    initialize() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create master gain for overall volume control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.7; // Overall volume
        this.masterGain.connect(this.audioContext.destination);
    }

    setInstrument(instrumentName) {
        this.currentInstrument = instrumentName;
    }

    // Main method to play a note
    playNote(frequency, duration = 0.5) {
        if (!this.audioContext) return;

        const instrument = INSTRUMENTS[this.currentInstrument];
        if (!instrument) return;

        instrument.play(this.audioContext, this.masterGain, frequency, duration);
    }

    // Cleanup active oscillators
    cleanup() {
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        this.activeOscillators = [];
    }
}

// ===== INSTRUMENT DEFINITIONS =====

const INSTRUMENTS = {
    // Harmonium - Classic Indian keyboard instrument with rich harmonics
    harmonium: {
        name: 'Harmonium',
        description: 'Rich reed organ sound, popular in Indian classical',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Harmonium has multiple harmonics with specific amplitudes
            const harmonics = [
                { ratio: 1, gain: 0.6 },      // Fundamental
                { ratio: 2, gain: 0.3 },      // Octave
                { ratio: 3, gain: 0.15 },     // Fifth
                { ratio: 4, gain: 0.1 },      // Second octave
                { ratio: 5, gain: 0.08 },     // Third
                { ratio: 6, gain: 0.05 }      // Fifth + octave
            ];

            // Create oscillators for each harmonic
            harmonics.forEach(harmonic => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                // Use triangle wave for reedy quality
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);

                // Envelope: Medium attack, sustained, gentle release
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain * 0.8, now + 0.08);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain, now + 0.15);
                gainNode.gain.setValueAtTime(harmonic.gain, now + duration - 0.15);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Tanpura - Drone instrument with distinctive timbre
    tanpura: {
        name: 'Tanpura',
        description: 'Resonant drone with rich overtones',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Tanpura emphasizes certain harmonics creating a distinctive "buzz"
            const harmonics = [
                { ratio: 1, gain: 0.5, detune: 0 },
                { ratio: 2, gain: 0.35, detune: -2 },
                { ratio: 3, gain: 0.25, detune: 1 },
                { ratio: 4, gain: 0.2, detune: -1 },
                { ratio: 5, gain: 0.15, detune: 1 },
                { ratio: 6, gain: 0.1, detune: 0 },
                { ratio: 7, gain: 0.08, detune: -1 }
            ];

            // Add slight detuning for richness
            harmonics.forEach(harmonic => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                osc.type = 'sawtooth'; // Rich in harmonics
                osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);
                osc.detune.setValueAtTime(harmonic.detune, now);

                // Very slow attack, long sustain (tanpura character)
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain * 0.3, now + 0.2);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain, now + 0.4);
                gainNode.gain.setValueAtTime(harmonic.gain, now + duration - 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Piano - Western classical instrument with bright attack
    piano: {
        name: 'Piano',
        description: 'Bright, percussive with clear attack',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Piano harmonics with inharmonicity
            const harmonics = [
                { ratio: 1, gain: 0.7 },
                { ratio: 2, gain: 0.4 },
                { ratio: 3, gain: 0.25 },
                { ratio: 4, gain: 0.15 },
                { ratio: 5, gain: 0.12 },
                { ratio: 6, gain: 0.08 },
                { ratio: 7, gain: 0.05 }
            ];

            harmonics.forEach((harmonic, index) => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                osc.type = 'sine';
                // Slight inharmonicity for realism (piano strings aren't perfectly harmonic)
                const inharmonicity = 1 + (harmonic.ratio - 1) * 0.001;
                osc.frequency.setValueAtTime(frequency * harmonic.ratio * inharmonicity, now);

                // Piano: Fast attack, exponential decay
                const peakGain = harmonic.gain * (index === 0 ? 1 : 0.8);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.01); // Very fast attack
                gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, now + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Bansuri - Indian bamboo flute with breathy tone
    bansuri: {
        name: 'Bansuri (Flute)',
        description: 'Soft, breathy bamboo flute',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Flute has strong fundamental with odd harmonics
            const harmonics = [
                { ratio: 1, gain: 0.7 },
                { ratio: 2, gain: 0.2 },
                { ratio: 3, gain: 0.3 },
                { ratio: 4, gain: 0.1 },
                { ratio: 5, gain: 0.15 },
                { ratio: 6, gain: 0.05 }
            ];

            // Add breath noise for realism
            const noise = audioContext.createBufferSource();
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) {
                noiseData[i] = (Math.random() * 2 - 1) * 0.03; // Quiet noise
            }
            noise.buffer = noiseBuffer;

            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(frequency * 2, now);
            noiseFilter.Q.setValueAtTime(5, now);

            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            noiseGain.gain.setValueAtTime(0.1, now + duration - 0.1);
            noiseGain.gain.linearRampToValueAtTime(0, now + duration);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(destination);
            noise.start(now);

            // Tonal harmonics
            harmonics.forEach(harmonic => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);

                // Gentle attack and release
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain * 0.5, now + 0.08);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain, now + 0.15);
                gainNode.gain.setValueAtTime(harmonic.gain, now + duration - 0.12);
                gainNode.gain.linearRampToValueAtTime(0, now + duration);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Sarangi - Bowed string instrument with rich, vocal quality
    sarangi: {
        name: 'Sarangi',
        description: 'Rich bowed string with vocal quality',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Sarangi has very rich harmonics (bowed string)
            const harmonics = [
                { ratio: 1, gain: 0.5 },
                { ratio: 2, gain: 0.4 },
                { ratio: 3, gain: 0.35 },
                { ratio: 4, gain: 0.25 },
                { ratio: 5, gain: 0.2 },
                { ratio: 6, gain: 0.15 },
                { ratio: 7, gain: 0.12 },
                { ratio: 8, gain: 0.08 }
            ];

            harmonics.forEach(harmonic => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();

                osc.type = 'sawtooth'; // Rich harmonic content
                osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);

                // Add formant-like filtering for vocal quality
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800 + harmonic.ratio * 200, now);
                filter.Q.setValueAtTime(3, now);

                // Slow attack (bow), sustained
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain * 0.3, now + 0.15);
                gainNode.gain.linearRampToValueAtTime(harmonic.gain, now + 0.25);
                gainNode.gain.setValueAtTime(harmonic.gain, now + duration - 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Veena/Sitar - Plucked string with resonant decay
    veena: {
        name: 'Veena/Sitar',
        description: 'Plucked string with resonant decay',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Veena/Sitar has strong attack and sympathetic resonance
            const harmonics = [
                { ratio: 1, gain: 0.8 },
                { ratio: 2, gain: 0.5 },
                { ratio: 3, gain: 0.4 },
                { ratio: 4, gain: 0.3 },
                { ratio: 5, gain: 0.25 },
                { ratio: 6, gain: 0.2 },
                { ratio: 7, gain: 0.15 }
            ];

            harmonics.forEach((harmonic, index) => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                // Mix of triangle (fundamental) and sawtooth (upper harmonics)
                osc.type = index === 0 ? 'triangle' : 'sawtooth';
                osc.frequency.setValueAtTime(frequency * harmonic.ratio, now);

                // Sharp attack (pluck), long resonant decay
                const peakGain = harmonic.gain;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(peakGain * 1.2, now + 0.005); // Very fast attack
                gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.6, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.3, now + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration);
            });
        }
    },

    // Sine wave - Clean reference tone (the original)
    sine: {
        name: 'Pure Tone (Sine)',
        description: 'Clean reference tone for precise pitch',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now);

            // Simple envelope
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now + duration - 0.1);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);

            osc.connect(gainNode);
            gainNode.connect(destination);

            osc.start(now);
            osc.stop(now + duration);
        }
    },

    // Bell-like tone - Great for clarity
    bell: {
        name: 'Bell',
        description: 'Bright, clear bell tone',
        play: function(audioContext, destination, frequency, duration) {
            const now = audioContext.currentTime;

            // Bell has inharmonic partials
            const partials = [
                { ratio: 1, gain: 0.7 },
                { ratio: 2.4, gain: 0.4 },   // Inharmonic
                { ratio: 3.8, gain: 0.25 },  // Inharmonic
                { ratio: 5.2, gain: 0.15 },  // Inharmonic
                { ratio: 6.8, gain: 0.1 }    // Inharmonic
            ];

            partials.forEach(partial => {
                const osc = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(frequency * partial.ratio, now);

                // Bell: Fast attack, slow exponential decay
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(partial.gain, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);

                osc.connect(gainNode);
                gainNode.connect(destination);

                osc.start(now);
                osc.stop(now + duration * 1.5);
            });
        }
    }
};

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.AudioEngine = AudioEngine;
    window.INSTRUMENTS = INSTRUMENTS;
}

// Export for Node.js modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioEngine, INSTRUMENTS };
}
