// Web Audio API procedural alarm synthesizer
// Generates unique, customizable audio alarms for each user persona without external audio files.

let audioCtx = null;
let activeLoop = null;
let activeGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SOUND_PROFILES = {
  "cyber-pulse": {
    name: "Cyber Synth Pulse",
    type: "pulse",
    baseFreq: 260,
    wave: "sawtooth",
    description: "Deep subterranean synth pulse with resonant harmonics. Ideal for deep work & flow states.",
  },
  "neon-staccato": {
    name: "Neon Rose Staccato",
    type: "staccato",
    baseFreq: 880,
    wave: "square",
    description: "Urgent dual-frequency ping designed to instantly cut through distraction and time-blindness.",
  },
  "harmonic-chime": {
    name: "Cerulean Harmonic",
    type: "chord",
    baseFreq: 440,
    wave: "sine",
    description: "Pure multi-tone crystalline chord progression. Balanced, soothing yet impossible to miss.",
  },
  "cascade-siren": {
    name: "Domino Cascade Alert",
    type: "siren",
    baseFreq: 640,
    wave: "triangle",
    description: "Stepped urgency pitch that scales as downstream schedule compressions mount.",
  },
  "custom": {
    name: "Custom Frequency",
    type: "custom",
    baseFreq: 520,
    wave: "sine",
    description: "Your personalized acoustic signature — uniquely tuned to your ear.",
  },
};

/**
 * Play a short 1-2 second sample tone so user can test their unique alarm sound
 */
export function playTonePreview(profile = {}) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreq = Number(profile.baseFreq) || 440;
    const wave = profile.wave || "sine";
    const soundType = profile.type || "chord";

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
    masterGain.connect(ctx.destination);

    if (soundType === "chord") {
      // Triad chord (root, major third, fifth)
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.12, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9 + idx * 0.1);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.2);
      });
    } else if (soundType === "staccato") {
      // Two crisp beeps
      [0, 0.2, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(baseFreq * (delay === 0.2 ? 1.2 : 1.0), now + delay);
        g.gain.setValueAtTime(0.0001, now + delay);
        g.gain.exponentialRampToValueAtTime(0.18, now + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.12);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      });
    } else if (soundType === "pulse") {
      // Deep pulsing filter
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.8);
      osc.type = wave;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.connect(filter);
      filter.connect(masterGain);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc.start(now);
      osc.stop(now + 0.9);
    } else {
      // Custom / Siren tone
      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, now + 0.4);
      osc.frequency.linearRampToValueAtTime(baseFreq, now + 0.8);
      osc.connect(masterGain);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc.start(now);
      osc.stop(now + 0.9);
    }
  } catch (err) {
    console.warn("Audio preview could not play:", err);
  }
}

/**
 * Triggers the continuous stress alarm loop with intensity modulated by stressLevel (0 to 100)
 */
export function startStressAlarmLoop(profile = {}, stressLevel = 50, volume = 0.5) {
  stopStressAlarm();

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Normalize stress level to modulate tempo
    const normalizedStress = Math.min(100, Math.max(10, stressLevel));
    // High stress = faster repetition interval (1.2s down to 0.45s)
    const intervalMs = Math.max(450, 1400 - normalizedStress * 9.5);

    playTonePreview(profile);

    activeLoop = window.setInterval(() => {
      playTonePreview(profile);
    }, intervalMs);
  } catch (err) {
    console.warn("Stress alarm loop failed to start:", err);
  }
}

/**
 * Halts any active stress alarm sound
 */
export function stopStressAlarm() {
  if (activeLoop) {
    clearInterval(activeLoop);
    activeLoop = null;
  }
  if (activeGain) {
    try {
      activeGain.disconnect();
    } catch {
      // Disconnected
    }
    activeGain = null;
  }
}
