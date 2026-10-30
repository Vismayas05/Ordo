import { useState } from "react";
import {
  Clock,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  FastForward,
  Layers,
  Sparkles,
  Zap,
  Plus,
} from "lucide-react";
import { parseTaskTime, formatTimeFromMs } from "../services/stressEngine.js";

export default function ScheduleCascadeVisualizer({
  tasks = [],
  now = Date.now(),
  cascadeInfo = {},
  onDominoShift,
  onCompressBuffers,
  onOpenNewTask,
  language = "en",
}) {
  const [simulationExtraMin, setSimulationExtraMin] = useState(15);

  const baseDate = new Date(now);

  const activeTasks = tasks
    .filter((t) => !t.done)
    .map((t) => {
      const startMs = parseTaskTime(t.time, baseDate);
      const endMs = startMs + (Number(t.duration) || 30) * 60000;
      return { ...t, startMs, endMs };
    })
    .sort((a, b) => a.startMs - b.startMs);

  const overdue = cascadeInfo.overdueTask;
  const currentRunning = cascadeInfo.inProgressTask;
  const targetTask = overdue || currentRunning || activeTasks[0] || null;

  // Compute what would happen if targetTask is delayed by simulationExtraMin
  const simulationSimulated = activeTasks.map((t, idx) => {
    if (!targetTask) return t;
    const targetStartMs = targetTask.startMs;
    const isTarget = t.id === targetTask.id;
    const isSubsequent = t.startMs >= targetStartMs && !isTarget;

    const simulatedStartMs = isSubsequent
      ? t.startMs + simulationExtraMin * 60000
      : t.startMs;
    const simulatedEndMs = simulatedStartMs + (Number(t.duration) || 30) * 60000;

    return {
      ...t,
      isTarget,
      isSubsequent,
      originalStartFormatted: formatTimeFromMs(t.startMs),
      simulatedStartFormatted: formatTimeFromMs(simulatedStartMs),
      simulatedEndFormatted: formatTimeFromMs(simulatedEndMs),
      delay: isSubsequent ? simulationExtraMin : isTarget ? simulationExtraMin : 0,
    };
  });

  return (
    <div className="panel cascade-visualizer-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">DOMINO CHAIN SIMULATOR</div>
          <h2>Schedule Cascade & Ripple Impact</h2>
          <p>
            See in real-time how delaying or hyperfocusing on one task pushes your downstream commitments.
          </p>
        </div>
      </div>

      {/* Simulator Control Bar */}
      <div className="simulator-banner">
        <div className="sim-left">
          <span className="sim-title">
            <Zap size={16} /> Cascade Delay Simulator
          </span>
          <span className="sim-desc">
            If “{targetTask ? targetTask.title : "Current Task"}” runs{" "}
            <strong>+{simulationExtraMin} minutes</strong> late:
          </span>
        </div>
        <div className="sim-slider-wrap">
          <input
            type="range"
            min="5"
            max="90"
            step="5"
            value={simulationExtraMin}
            onChange={(e) => setSimulationExtraMin(Number(e.target.value))}
          />
          <span className="sim-min-badge">+{simulationExtraMin} min</span>
        </div>
      </div>

      {/* Visual Chain Timeline */}
      <div className="cascade-timeline-chain">
        {simulationSimulated.length === 0 ? (
          <div className="empty-state">
            <Clock size={32} />
            <strong>No active tasks scheduled</strong>
            <span>Create your schedule to see the live cascade impact and test delays with the simulator.</span>
            {onOpenNewTask && (
              <button className="primary-button" style={{ marginTop: "10px" }} onClick={onOpenNewTask}>
                <Plus size={16} /> Create Your First Task
              </button>
            )}
          </div>
        ) : (
          simulationSimulated.map((task, idx) => {
            const isLate = task.isTarget && (cascadeInfo.overrunMinutes > 0 || simulationExtraMin > 0);
            return (
              <div
                key={task.id}
                className={`cascade-chain-card ${
                  task.isTarget
                    ? "target-node-card"
                    : task.isSubsequent
                    ? "shifted-node-card"
                    : ""
                }`}
              >
                <div className="chain-node-header">
                  <span className="chain-step-num">Step {idx + 1}</span>
                  <span className={`chain-priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  {task.isTarget && (
                    <span className="chain-status-pulse">Focus / Delay Source</span>
                  )}
                  {task.isSubsequent && (
                    <span className="chain-status-pushed">
                      Pushed +{simulationExtraMin}m
                    </span>
                  )}
                </div>

                <div className="chain-title-row">
                  <strong>{task.title}</strong>
                  <span className="chain-duration">{task.duration} min</span>
                </div>

                <div className="chain-time-shift-row">
                  <div className="time-block original-time">
                    <span className="time-sub">Planned</span>
                    <strong>{task.originalStartFormatted}</strong>
                  </div>

                  {task.isSubsequent && (
                    <>
                      <div className="time-shift-arrow">
                        <ArrowRight size={16} />
                      </div>
                      <div className="time-block shifted-time">
                        <span className="time-sub">Domino Start</span>
                        <strong className="neon-rose-text">{task.simulatedStartFormatted}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cascade Resolver Footer */}
      {targetTask && (
        <div className="cascade-footer-actions">
          <div className="footer-info">
            <Sparkles size={16} />
            <span>
              Prevent schedule domino collapse by adopting the shifted times or compressing buffer slack.
            </span>
          </div>
          <div className="footer-btns">
            <button
              className="action-btn btn-domino"
              onClick={() => onDominoShift(targetTask.id, simulationExtraMin)}
            >
              <FastForward size={16} /> Apply +{simulationExtraMin}m Domino Shift
            </button>
            <button
              className="action-btn btn-compress"
              onClick={() => onCompressBuffers(targetTask.id, simulationExtraMin)}
            >
              <Layers size={16} /> Compress Buffers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
