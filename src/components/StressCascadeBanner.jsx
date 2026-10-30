import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  FastForward,
  ShieldAlert,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

export default function StressCascadeBanner({
  cascadeInfo,
  onDominoShift,
  onCompressBuffers,
  onMarkDoneAndAdvance,
  onSnooze,
  isMuted = false,
  onToggleMute,
  language = "en",
}) {
  const [showDominoDetails, setShowDominoDetails] = useState(false);

  if (!cascadeInfo || !cascadeInfo.overdueTask) {
    return null;
  }

  const { overdueTask, overrunMinutes, stressScore, stressState, impactedUpcoming } = cascadeInfo;

  const isCritical = stressState === "critical" || stressScore >= 75;

  return (
    <section
      className={`stress-hud-banner ${isCritical ? "stress-critical-pulse" : "stress-warning-glow"}`}
      role="alert"
    >
      <div className="stress-hud-main">
        {/* Left Indicator & Icon */}
        <div className="stress-beacon-container">
          <div className="stress-beacon-ring" />
          <div className="stress-beacon-dot">
            {isCritical ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
          </div>
        </div>

        {/* Core Content */}
        <div className="stress-copy">
          <div className="stress-top-meta">
            <span className="stress-badge">
              {isCritical ? "CRITICAL DOMINO CASCADE" : "SCHEDULE STRESS ALARM"}
            </span>
            <span className="stress-index-pill">
              PRESSURE: <strong>{stressScore}%</strong>
            </span>
            <span className="overrun-tag">
              <Clock size={13} /> +{overrunMinutes}m over planned duration
            </span>
          </div>

          <h3 className="stress-title">
            Focusing too long on “{overdueTask.title}” is pushing upcoming tasks!
          </h3>

          <p className="stress-impact-text">
            {impactedUpcoming.length > 0 ? (
              <>
                Domino ripple: delaying <strong>{impactedUpcoming.length} upcoming tasks</strong> and
                squeezing <strong>{overrunMinutes} minutes</strong> from your remaining day.
              </>
            ) : (
              <>
                You have exceeded the planned time for this task. Moving forward maintains your daily momentum.
              </>
            )}
          </p>

          {/* Collapsible / Expandable Domino Impact Chain */}
          {impactedUpcoming.length > 0 && (
            <div className="domino-chain-preview">
              <div className="domino-chain-track">
                <div className="domino-node node-current">
                  <span className="node-label">Overdue</span>
                  <strong>{overdueTask.title}</strong>
                  <span className="node-time">+{overrunMinutes}m</span>
                </div>

                <div className="domino-arrow">
                  <ArrowRight size={16} />
                </div>

                {impactedUpcoming.slice(0, 2).map((item, idx) => (
                  <div key={item.id} className="domino-node node-pushed">
                    <span className="node-label">Pushed #{idx + 1}</span>
                    <strong>{item.title}</strong>
                    <span className="node-shift">
                      {item.originalStartFormatted} ➔ {item.shiftedStartFormatted}
                    </span>
                  </div>
                ))}

                {impactedUpcoming.length > 2 && (
                  <button
                    className="domino-more-pill"
                    onClick={() => setShowDominoDetails(!showDominoDetails)}
                  >
                    +{impactedUpcoming.length - 2} more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Resolution Buttons */}
        <div className="stress-actions">
          <button
            className="action-btn btn-domino"
            onClick={onDominoShift}
            title="Automatically reschedule all downstream tasks forward to eliminate overlap"
          >
            <FastForward size={16} />
            <span>Domino Shift Schedule</span>
          </button>

          <button
            className="action-btn btn-advance"
            onClick={onMarkDoneAndAdvance}
            title="Mark current task done right now and begin next task"
          >
            <CheckCircle2 size={16} />
            <span>Finish & Advance</span>
          </button>

          {impactedUpcoming.length > 0 && (
            <button
              className="action-btn btn-compress"
              onClick={onCompressBuffers}
              title="Trim a few minutes from downstream tasks to protect end-of-day"
            >
              <Layers size={16} />
              <span>Compress Buffers</span>
            </button>
          )}

          <div className="stress-utility-row">
            <button className="utility-btn" onClick={onSnooze}>
              Snooze 5m
            </button>
            <button
              className={`utility-btn ${isMuted ? "muted-btn" : ""}`}
              onClick={onToggleMute}
              title={isMuted ? "Unmute alarm audio" : "Mute alarm audio"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isMuted ? "Sound Off" : "Sound On"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
