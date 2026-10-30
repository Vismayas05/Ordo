import {
  AlertTriangle,
  ArrowRight,
  Clock,
  FastForward,
  ShieldAlert,
  Volume2,
  VolumeX,
  CheckCircle2,
} from "lucide-react";

export default function StressCascadeBanner({
  cascadeInfo,
  onDominoShift,
  onMarkDoneAndAdvance,
  onSnooze,
  isMuted = false,
  onToggleMute,
}) {
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
        <div className="stress-beacon-container">
          <div className="stress-beacon-ring" />
          <div className="stress-beacon-dot">
            {isCritical ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
          </div>
        </div>

        <div className="stress-copy">
          <div className="stress-top-meta">
            <span className="stress-badge">
              {isCritical ? "CRITICAL ALERT" : "SCHEDULE ALERT"}
            </span>
            <span className="stress-index-pill">
              STRESS: <strong>{stressScore}%</strong>
            </span>
            <span className="overrun-tag">
              <Clock size={13} /> +{overrunMinutes}m late
            </span>
          </div>

          <h3 className="stress-title">
            “{overdueTask.title}” is taking longer than planned
          </h3>

          <p className="stress-impact-text">
            {impactedUpcoming.length > 0 ? (
              <>
                Delays <strong>{impactedUpcoming.length} upcoming task{impactedUpcoming.length > 1 ? "s" : ""}</strong> by {overrunMinutes} minutes.
              </>
            ) : (
              "Task is past planned duration."
            )}
          </p>

          {/* Simple Timeline Shift Preview */}
          {impactedUpcoming.length > 0 && (
            <div className="domino-chain-preview">
              <div className="domino-chain-track">
                <div className="domino-node node-current">
                  <span className="node-label">Late Task</span>
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
              </div>
            </div>
          )}
        </div>

        <div className="stress-actions">
          <button
            className="action-btn btn-domino"
            onClick={onDominoShift}
            title="Automatically adjust upcoming tasks"
          >
            <FastForward size={16} />
            <span>Auto-Shift Schedule</span>
          </button>

          <button
            className="action-btn btn-advance"
            onClick={onMarkDoneAndAdvance}
            title="Mark current task complete"
          >
            <CheckCircle2 size={16} />
            <span>Mark Done</span>
          </button>

          <div className="stress-utility-row">
            <button className="utility-btn" onClick={onSnooze}>
              Snooze 5m
            </button>
            <button
              className={`utility-btn ${isMuted ? "muted-btn" : ""}`}
              onClick={onToggleMute}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isMuted ? "Muted" : "Sound"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
