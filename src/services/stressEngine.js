// Schedule Cascade & Stress Alarm Engine for Ordo
// Computes real-time overrun, stress indices, and downstream domino impact on future tasks.

export function parseTaskTime(timeStr, baseDate = new Date()) {
  const [h, m] = (timeStr || "00:00").split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
}

export function formatTimeFromMs(ms) {
  const d = new Date(ms);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function calculateScheduleCascade(tasks = [], now = Date.now(), profile = {}) {
  const baseDate = new Date(now);
  const tolerance = profile.delayToleranceMin ?? 5;
  const sensitivity = profile.sensitivity || "balanced";

  // Filter and sort active unfinished tasks chronologically
  const unfinished = tasks
    .filter((t) => !t.done)
    .map((t) => {
      const start = parseTaskTime(t.time, baseDate);
      const end = start + (Number(t.duration) || 30) * 60000;
      return { ...t, startMs: start, endMs: end };
    })
    .sort((a, b) => a.startMs - b.startMs);

  // Identify current running task or overdue stuck task
  const overdueTask = unfinished.find((t) => t.startMs <= now && now > t.endMs) || null;
  const inProgressTask = unfinished.find((t) => t.startMs <= now && now <= t.endMs) || null;

  const focusTask = overdueTask || inProgressTask || null;

  let overrunMinutes = 0;
  let stressScore = 0;
  let stressState = "calm"; // calm, warning, stress-alarm, critical
  let impactedUpcoming = [];
  let totalSqueezedMinutes = 0;

  if (overdueTask) {
    overrunMinutes = Math.max(1, Math.floor((now - overdueTask.endMs) / 60000));
    
    // Check against user persona's grace period tolerance
    const netOverrun = Math.max(0, overrunMinutes - tolerance);

    // Multiplier based on persona sensitivity
    const mult = sensitivity === "aggressive" ? 2.2 : sensitivity === "relaxed" ? 1.0 : 1.5;
    const taskDuration = Number(overdueTask.duration) || 30;
    const overdueRatio = (netOverrun / taskDuration) * 50;

    // Subsequent tasks that will be pushed or cannibalized
    const subsequent = unfinished.filter((t) => t.id !== overdueTask.id && t.startMs >= overdueTask.startMs);

    // Calculate domino cascade
    let cumulativeShift = overrunMinutes * 60000;
    impactedUpcoming = subsequent.map((task) => {
      const originalStart = task.startMs;
      const shiftedStart = originalStart + cumulativeShift;
      const originalEnd = task.endMs;
      const shiftedEnd = shiftedStart + (Number(task.duration) || 30) * 60000;

      return {
        ...task,
        originalStartFormatted: formatTimeFromMs(originalStart),
        shiftedStartFormatted: formatTimeFromMs(shiftedStart),
        shiftedStartMs: shiftedStart,
        shiftedEndMs: shiftedEnd,
        delayedByMin: overrunMinutes,
      };
    });

    totalSqueezedMinutes = overrunMinutes;

    // Stress calculation
    stressScore = 35 + overdueRatio * mult + subsequent.length * 8;
    if (overdueTask.priority === "High") stressScore += 18;

    stressScore = Math.min(100, Math.max(20, Math.round(stressScore)));

    if (stressScore >= 80) {
      stressState = "critical";
    } else if (stressScore >= 50) {
      stressState = "stress-alarm";
    } else {
      stressState = "warning";
    }
  } else if (inProgressTask) {
    // Current task in progress
    const remainingMs = inProgressTask.endMs - now;
    const remainingMin = Math.floor(remainingMs / 60000);
    const totalDuration = Number(inProgressTask.duration) || 30;
    const percentTimePassed = Math.round(((totalDuration * 60000 - remainingMs) / (totalDuration * 60000)) * 100);

    // If less than 5 min left, gentle warning
    if (remainingMin <= 5) {
      stressScore = 30 + (5 - remainingMin) * 4;
      stressState = "warning";
    } else {
      stressScore = Math.min(25, Math.round((percentTimePassed / 100) * 20));
      stressState = "calm";
    }
  }

  return {
    overdueTask,
    inProgressTask,
    focusTask,
    overrunMinutes,
    stressScore,
    stressState,
    impactedUpcoming,
    totalSqueezedMinutes,
  };
}

/**
 * Automatically shifts all upcoming tasks forward by delayMinutes
 * to eliminate scheduling conflicts without manual edits.
 */
export function applyDominoShift(tasks = [], overdueTaskId, delayMinutes = 15) {
  const baseDate = new Date();
  const targetTask = tasks.find((t) => t.id === overdueTaskId);
  if (!targetTask) return tasks;

  const targetStartMs = parseTaskTime(targetTask.time, baseDate);
  const shiftMs = delayMinutes * 60000;

  return tasks.map((task) => {
    if (task.done) return task;
    const taskStartMs = parseTaskTime(task.time, baseDate);

    // If this task starts after the overdue task, shift it forward
    if (taskStartMs >= targetStartMs && task.id !== overdueTaskId) {
      const newTime = formatTimeFromMs(taskStartMs + shiftMs);
      return { ...task, time: newTime };
    }
    return task;
  });
}

/**
 * Trims a few minutes from non-high-priority upcoming tasks to absorb
 * the delay and prevent pushing the end of the day.
 */
export function applyBufferCompression(tasks = [], overdueTaskId, minutesToRecover = 15) {
  const baseDate = new Date();
  const targetTask = tasks.find((t) => t.id === overdueTaskId);
  if (!targetTask) return tasks;

  const targetStartMs = parseTaskTime(targetTask.time, baseDate);
  const candidates = tasks.filter((t) => !t.done && t.id !== overdueTaskId && parseTaskTime(t.time, baseDate) >= targetStartMs);

  if (candidates.length === 0) return tasks;

  const trimPerTask = Math.max(5, Math.floor(minutesToRecover / candidates.length));

  return tasks.map((task) => {
    if (task.done || task.id === overdueTaskId) return task;
    const taskStartMs = parseTaskTime(task.time, baseDate);

    if (taskStartMs >= targetStartMs) {
      const currentDur = Number(task.duration) || 30;
      const newDur = Math.max(15, currentDur - trimPerTask);
      return { ...task, duration: newDur };
    }
    return task;
  });
}
