// Persona and Personalization engine for Ordo
// Ensures each user's Ordo feels distinct with customized alarm profiles,
// buffer thresholds, stress sensitivity, and sound identity.

export const PROFILE_KEY = "ordo-persona-profile";

export const PRESET_PERSONAS = [
  {
    id: "hyperfocus",
    name: "Hyperfocus Deep Worker",
    title: "Deep Work Architect",
    description: "Designed for developers, writers, and researchers. Long uninterrupted focus blocks with a 15-minute grace buffer before stress escalates.",
    delayToleranceMin: 15,
    sensitivity: "relaxed", // relaxed, balanced, aggressive
    soundType: "pulse",
    soundFreq: 260,
    soundWave: "sawtooth",
    themeBias: "cerulean",
    alarmSoundKey: "cyber-pulse",
  },
  {
    id: "sprinter",
    name: "Velocity Sprinter / ADHD Flow",
    title: "High-Frequency Sprinter",
    description: "Combats time-blindness with rapid, impossible-to-miss Neon Rose staccato alerts after only 3 minutes of overrun.",
    delayToleranceMin: 3,
    sensitivity: "aggressive",
    soundType: "staccato",
    soundFreq: 880,
    soundWave: "square",
    themeBias: "neon-rose",
    alarmSoundKey: "neon-staccato",
  },
  {
    id: "zen",
    name: "Zen Harmonic Flow",
    title: "Mindful Strategist",
    description: "Gentle transitions with multi-tone harmonic crystal chimes. Protects rest buffers and prevents burnout.",
    delayToleranceMin: 10,
    sensitivity: "balanced",
    soundType: "chord",
    soundFreq: 440,
    soundWave: "sine",
    themeBias: "cerulean",
    alarmSoundKey: "harmonic-chime",
  },
  {
    id: "relentless",
    name: "Zero-Slack Cascade Crusher",
    title: "Relentless Executor",
    description: "Zero tolerance for delays. Instantly calculates the downstream domino impact on your entire day the second a task overruns.",
    delayToleranceMin: 0,
    sensitivity: "aggressive",
    soundType: "siren",
    soundFreq: 640,
    soundWave: "triangle",
    themeBias: "neon-rose",
    alarmSoundKey: "cascade-siren",
  },
];

export function getStoredProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not read profile:", err);
  }

  // Default initial profile
  return {
    id: "hyperfocus",
    customName: "My Custom Ordo",
    personaId: "hyperfocus",
    delayToleranceMin: 10,
    sensitivity: "balanced",
    soundType: "pulse",
    soundFreq: 320,
    soundWave: "sawtooth",
    alarmSoundKey: "cyber-pulse",
    themeBias: "cerulean",
    uniqueId: `ORDO-${Math.floor(1000 + Math.random() * 9000)}`,
    soundVolume: 0.7,
  };
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn("Could not save profile:", err);
  }
}
