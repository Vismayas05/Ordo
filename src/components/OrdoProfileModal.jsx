import { useState } from "react";
import {
  Volume2,
  X,
  Sparkles,
  Sliders,
  Check,
  Radio,
  Activity,
  Zap,
  Shield,
  Layers,
} from "lucide-react";
import { PRESET_PERSONAS, saveProfile } from "../services/personaConfig.js";
import { playTonePreview } from "../services/alarmSound.js";

export default function OrdoProfileModal({ profile, onUpdateProfile, onClose }) {
  const [current, setCurrent] = useState({ ...profile });
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleSelectPreset = (preset) => {
    const updated = {
      ...current,
      personaId: preset.id,
      customName: preset.name,
      delayToleranceMin: preset.delayToleranceMin,
      sensitivity: preset.sensitivity,
      soundType: preset.soundType,
      soundFreq: preset.soundFreq,
      soundWave: preset.soundWave,
      alarmSoundKey: preset.alarmSoundKey,
      themeBias: preset.themeBias,
    };
    setCurrent(updated);
    testSound(updated);
  };

  const testSound = (profToTest = current) => {
    setIsPlayingTest(true);
    playTonePreview({
      baseFreq: profToTest.soundFreq,
      wave: profToTest.soundWave,
      type: profToTest.soundType,
    });
    setTimeout(() => setIsPlayingTest(false), 1200);
  };

  const handleSave = () => {
    saveProfile(current);
    onUpdateProfile(current);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="task-modal profile-modal">
        {/* Header */}
        <div className="modal-heading">
          <div>
            <div className="section-kicker">PERSONALIZED ACOUSTIC SIGNATURE</div>
            <h2>Your Unique Ordo</h2>
            <p>Every schedule is different. Tune your custom alarm sound and stress cascade tolerance.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close profile setup"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        {/* Unique Signature Badge */}
        <div className="ordo-fingerprint-card">
          <div className="fingerprint-left">
            <span className="fingerprint-label">ACOUSTIC SIGNATURE ID</span>
            <strong className="fingerprint-id">{current.uniqueId || "ORDO-7492"}</strong>
          </div>
          <div className="fingerprint-right">
            <button
              type="button"
              className={`test-sound-btn ${isPlayingTest ? "playing-pulse" : ""}`}
              onClick={() => testSound()}
            >
              <Volume2 size={16} />
              <span>{isPlayingTest ? "Playing Alarm..." : "Test My Unique Sound"}</span>
            </button>
          </div>
        </div>

        {/* Persona Archetype Picker */}
        <div className="profile-section-title">
          <span>Choose Your Flow Archetype</span>
        </div>

        <div className="personas-grid">
          {PRESET_PERSONAS.map((preset) => {
            const isSelected = current.personaId === preset.id;
            return (
              <div
                key={preset.id}
                className={`persona-card ${isSelected ? "persona-selected" : ""}`}
                onClick={() => handleSelectPreset(preset)}
              >
                <div className="persona-card-top">
                  <strong>{preset.name}</strong>
                  {isSelected && <span className="selected-check"><Check size={14} /></span>}
                </div>
                <div className="persona-meta">
                  <span className="meta-tag">{preset.delayToleranceMin}m grace cushion</span>
                  <span className="meta-tag tag-sound">{preset.soundType}</span>
                </div>
                <p className="persona-desc">{preset.description}</p>
              </div>
            );
          })}
        </div>

        {/* Sound & Tone Tuning Controls */}
        <div className="profile-section-title">
          <span>Acoustic Frequency & Timbre</span>
        </div>

        <div className="tuning-controls">
          <div className="control-row">
            <label className="form-label">
              Alarm Frequency: <strong>{current.soundFreq} Hz</strong>
              <input
                type="range"
                min="200"
                max="950"
                step="20"
                value={current.soundFreq}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = { ...current, soundFreq: val };
                  setCurrent(updated);
                }}
              />
              <div className="slider-labels">
                <span>200 Hz (Sub Synth)</span>
                <span>500 Hz (Mid)</span>
                <span>950 Hz (High Alert)</span>
              </div>
            </label>
          </div>

          <div className="control-grid-2">
            <label className="form-label">
              Waveform Timbre
              <select
                value={current.soundWave}
                onChange={(e) => {
                  const updated = { ...current, soundWave: e.target.value };
                  setCurrent(updated);
                  testSound(updated);
                }}
              >
                <option value="sine">Sine (Pure & Smooth Chime)</option>
                <option value="sawtooth">Sawtooth (Cyber Synth Buzz)</option>
                <option value="square">Square (Staccato 8-Bit Tone)</option>
                <option value="triangle">Triangle (Harmonic Wave)</option>
              </select>
            </label>

            <label className="form-label">
              Alarm Rhythm Pattern
              <select
                value={current.soundType}
                onChange={(e) => {
                  const updated = { ...current, soundType: e.target.value };
                  setCurrent(updated);
                  testSound(updated);
                }}
              >
                <option value="pulse">Sub Pulse (Deep Work)</option>
                <option value="staccato">Double Staccato (Sprinter)</option>
                <option value="chord">Harmonic Triad (Cerulean Chime)</option>
                <option value="siren">Stepped Urgency (Cascade Alert)</option>
              </select>
            </label>
          </div>

          <div className="control-grid-2">
            <label className="form-label">
              Overrun Delay Grace Cushion
              <select
                value={current.delayToleranceMin}
                onChange={(e) =>
                  setCurrent({ ...current, delayToleranceMin: Number(e.target.value) })
                }
              >
                <option value={0}>0 minutes (Strict / Zero Slack)</option>
                <option value={3}>3 minutes (Urgent Sprinter)</option>
                <option value={5}>5 minutes (Standard Flow)</option>
                <option value={10}>10 minutes (Balanced Cushion)</option>
                <option value={15}>15 minutes (Deep Concentration)</option>
              </select>
            </label>

            <label className="form-label">
              Stress Escalation Sensitivity
              <select
                value={current.sensitivity}
                onChange={(e) =>
                  setCurrent({ ...current, sensitivity: e.target.value })
                }
              >
                <option value="relaxed">Relaxed (Gentle Ramp-up)</option>
                <option value="balanced">Balanced (Normal Ramp-up)</option>
                <option value="aggressive">Aggressive (Rapid Neon Alert)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-button" onClick={handleSave}>
            <Check size={16} /> Save My Unique Ordo
          </button>
        </div>
      </div>
    </div>
  );
}
