
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  Clock3,
  ArrowUpRight,
  CircleCheck,
  Circle,
  MoreHorizontal,
  Target,
  Zap,
  Menu,
  X,
  Trash2,
  Pencil,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Timer,
  Check,
} from "lucide-react";

const STORAGE_KEY = "ordo-tasks";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My schedule", icon: CalendarDays },
  { label: "My tasks", icon: CheckSquare },
  { label: "Insights", icon: BarChart3 },
];

const durations = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((task) => task && task.id && task.title)
      .map((task) => ({
        ...task,
        duration: Number(task.duration) || 30,
        priority: ["Low", "Medium", "High"].includes(task.priority)
          ? task.priority
          : "Medium",
        category: task.category || "Personal",
        time: task.time || "17:00",
        done: Boolean(task.done),
      }));
  } catch {
    return [];
  }
}

function formatTime(time) {
  if (!time) return "No time set";

  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function getTaskStart(task) {
  const [hours, minutes] = (task.time || "00:00").split(":").map(Number);
  const date = new Date();

  date.setHours(hours || 0, minutes || 0, 0, 0);

  return date.getTime();
}

function getTaskEnd(task) {
  return getTaskStart(task) + Number(task.duration || 30) * 60 * 1000;
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("17:00");
  const [newDuration, setNewDuration] = useState("30");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("Study");

  const [now, setNow] = useState(Date.now());

  const [focusTaskId, setFocusTaskId] = useState(null);
  const [focusEndAt, setFocusEndAt] = useState(null);
  const [pausedRemaining, setPausedRemaining] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save Ordo tasks:", error);
    }
  }, [tasks]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const currentDate = new Date(now);
  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.filter((task) => !task.done).length;

  const totalMinutes = tasks
    .filter((task) => !task.done)
    .reduce((sum, task) => sum + Number(task.duration || 0), 0);

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const timeDifference = (a.time || "").localeCompare(b.time || "");
        return timeDifference || a.title.localeCompare(b.title);
      }),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = sortedTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.category || "").toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (activeNav === "My tasks") return true;

      if (activeNav === "My schedule") return !task.done;

      return true;
    });

    return result;
  }, [sortedTasks, search, activeNav]);

  const nextTask = useMemo(() => {
    return sortedTasks
      .filter((task) => !task.done && getTaskStart(task) > now)
      .sort((a, b) => getTaskStart(a) - getTaskStart(b))[0] || null;
  }, [sortedTasks, now]);

  const currentTask = useMemo(() => {
    return sortedTasks
      .filter((task) => !task.done && getTaskStart(task) <= now)
      .sort((a, b) => getTaskStart(b) - getTaskStart(a))[0] || null;
  }, [sortedTasks, now]);

  const currentTaskOverrun = currentTask
    ? Math.max(0, now - getTaskEnd(currentTask))
    : 0;

  const focusTask = tasks.find((task) => task.id === focusTaskId) || null;
  const focusRemaining =
    pausedRemaining !== null
      ? pausedRemaining
      : focusEndAt
        ? Math.max(0, focusEndAt - now)
        : 0;

  const focusFinished = Boolean(
    focusTaskId && focusEndAt && pausedRemaining === null && now >= focusEndAt
  );

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );

    if (focusTaskId === id) {
      stopFocus();
    }
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));

    if (focusTaskId === id) {
      stopFocus();
    }
  }

  function resetForm() {
    setEditingTaskId(null);
    setNewTitle("");
    setNewTime("17:00");
    setNewDuration("30");
    setNewPriority("Medium");
    setNewCategory("Study");
  }

  function openNewTask() {
    resetForm();
    setShowForm(true);
  }

  function openEditTask(task) {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
    setNewTime(task.time || "17:00");
    setNewDuration(String(task.duration || 30));
    setNewPriority(task.priority || "Medium");
    setNewCategory(task.category || "Personal");
    setShowForm(true);
  }

  function saveTask(event) {
    event.preventDefault();

    const title = newTitle.trim();
    if (!title) return;

    const taskData = {
      title,
      time: newTime,
      duration: Number(newDuration),
      priority: newPriority,
      category: newCategory,
    };

    if (editingTaskId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTaskId ? { ...task, ...taskData } : task
        )
      );
    } else {
      const task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...taskData,
        done: false,
        createdAt: Date.now(),
      };

      setTasks((current) => [...current, task]);
    }

    setShowForm(false);
    resetForm();
  }

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenu(false);
    setSearch("");
  }

  function startFocus(task) {
    if (!task || task.done) return;

    setFocusTaskId(task.id);
    setFocusEndAt(Date.now() + Number(task.duration || 30) * 60 * 1000);
    setPausedRemaining(null);
  }

  function pauseFocus() {
    if (!focusEndAt || pausedRemaining !== null) return;

    setPausedRemaining(Math.max(0, focusEndAt - Date.now()));
  }

  function resumeFocus() {
    if (pausedRemaining === null) return;

    setFocusEndAt(Date.now() + pausedRemaining);
    setPausedRemaining(null);
  }

  function stopFocus() {
    setFocusTaskId(null);
    setFocusEndAt(null);
    setPausedRemaining(null);
  }

  function finishFocusedTask() {
    if (focusTaskId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === focusTaskId ? { ...task, done: true } : task
        )
      );
    }

    stopFocus();
  }

  function goToTask(task) {
    if (!task) {
      openNewTask();
      return;
    }

    setActiveNav("My tasks");
    setSearch(task.title);
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img
            src="/ordo-logo.png"
            alt="Ordo"
            className="brand-logo"
          />
          <button
            className="icon-button mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? "nav-active" : ""}`}
              onClick={() => selectNav(label)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "My tasks" && (
                <span className="nav-count">{tasks.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="focus-card">
            <div className="focus-icon">
              <Target size={19} />
            </div>
            <p className="focus-title">Make time count.</p>
            <p className="focus-description">
              Small steps. Meaningful progress.
            </p>
            <div className="focus-line">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button
            className={`nav-item ${activeNav === "Settings" ? "nav-active" : ""}`}
            onClick={() => selectNav("Settings")}
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">O</div>
            <div className="profile-info">
              <strong>My workspace</strong>
              <span>Personal planner</span>
            </div>
            <MoreHorizontal size={19} className="profile-more" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
              />
              <kbd>⌘ K</kbd>
            </label>

            <button
              className="icon-button notification-button"
              aria-label="Schedule status"
              title="Schedule status"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">O</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="status-dot" />
                {formatDate(currentDate).toUpperCase()}
              </div>

              <h1>
                {activeNav === "Overview"
                  ? "Good things take focus."
                  : activeNav === "My schedule"
                    ? "Your day, in sequence."
                    : activeNav === "Insights"
                      ? "Your progress, clearly."
                      : activeNav === "Settings"
                        ? "Your workspace."
                        : activeNav}
              </h1>

              <p className="welcome-subtitle">
                A little structure goes a long way. Let's make today count.
              </p>
            </div>

            <button className="primary-button" onClick={openNewTask}>
              <Plus size={18} /> New task
            </button>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Tasks</span>
                <span className="stat-icon">
                  <CheckSquare size={17} />
                </span>
              </div>
              <div className="stat-number">
                {tasks.length}
                <span className="stat-unit"> total</span>
              </div>
              <div className="stat-foot">{pending} remaining</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Completed</span>
                <span className="stat-icon coral-icon">
                  <CircleCheck size={17} />
                </span>
              </div>
              <div className="stat-number">
                {completed}
                <span className="stat-unit"> of {tasks.length}</span>
              </div>
              <div className="stat-foot">Tasks marked complete</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Time remaining</span>
                <span className="stat-icon">
                  <Clock3 size={17} />
                </span>
              </div>
              <div className="stat-number">
                {Math.floor(totalMinutes / 60)}
                <span className="stat-unit">h </span>
                {totalMinutes % 60}
                <span className="stat-unit">m</span>
              </div>
              <div className="stat-foot">Planned time for unfinished tasks</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Completion</span>
                <span className="stat-icon">
                  <Zap size={17} />
                </span>
              </div>
              <div className="stat-number">
                {progress}
                <span className="stat-unit">%</span>
              </div>
              <div className="stat-foot">Your current task progress</div>
            </article>
          </section>

          {currentTask && currentTaskOverrun > 0 && (
            <section className="schedule-alert" role="status">
              <div className="schedule-alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="schedule-alert-copy">
                <strong>Your schedule may need a small adjustment</strong>
                <p>
                  “{currentTask.title}” is running {formatCountdown(currentTaskOverrun)} over its planned time.
                  {nextTask
                    ? ` Your next task, “${nextTask.title}”, is scheduled for ${formatTime(nextTask.time)}.`
                    : " Review the remaining tasks before planning your next step."}
                </p>
                <span>
                  Ordo won't move any task automatically. You decide what to change.
                </span>
              </div>
              {nextTask && (
                <button
                  className="secondary-button schedule-alert-button"
                  onClick={() => goToTask(nextTask)}
                >
                  Review next task
                </button>
              )}
            </section>
          )}

          <section className="content-grid">
            <article className="panel schedule-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">
                    {activeNav === "Insights" ? "YOUR PROGRESS" : "YOUR PLAN"}
                  </div>
                  <h2>
                    {activeNav === "My tasks"
                      ? "All tasks"
                      : activeNav === "My schedule"
                        ? "Upcoming schedule"
                        : activeNav === "Insights"
                          ? "Progress summary"
                          : "Your schedule"}
                  </h2>
                  <p>
                    {activeNav === "My schedule"
                      ? "Unfinished tasks in start-time order."
                      : "Your tasks, organised by start time."}
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() => selectNav("My tasks")}
                >
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Task completion</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {activeNav === "Insights" && tasks.length > 0 && (
                <div className="insights-summary">
                  <div>
                    <span>Planned task time</span>
                    <strong>
                      {Math.floor(
                        tasks.reduce(
                          (sum, task) => sum + Number(task.duration || 0),
                          0
                        ) / 60
                      )}h{" "}
                      {tasks.reduce(
                        (sum, task) => sum + Number(task.duration || 0),
                        0
                      ) % 60}m
                    </strong>
                  </div>
                  <div>
                    <span>High-priority tasks</span>
                    <strong>
                      {tasks.filter((task) => !task.done && task.priority === "High").length}
                    </strong>
                  </div>
                  <div>
                    <span>Remaining tasks</span>
                    <strong>{pending}</strong>
                  </div>
                </div>
              )}

              <div className="task-list">
                {visibleTasks.length === 0 ? (
                  <div className="empty-state">
                    <CalendarDays size={27} />
                    <strong>
                      {search
                        ? "No matching tasks"
                        : activeNav === "My schedule"
                          ? "Nothing upcoming"
                          : "Your day starts here"}
                    </strong>
                    <span>
                      {search
                        ? "Try a different search term."
                        : "Add your first task to start planning your day."}
                    </span>

                    {!search && (
                      <button
                        className="secondary-button"
                        onClick={openNewTask}
                      >
                        <Plus size={15} /> Create your first task
                      </button>
                    )}
                  </div>
                ) : (
                  visibleTasks.map((task) => {
                    const taskEnd = getTaskEnd(task);
                    const isOverdue = !task.done && now > taskEnd;
                    const isCurrent =
                      !task.done &&
                      now >= getTaskStart(task) &&
                      now < taskEnd;

                    return (
                      <div
                        className={`task-row ${task.done ? "task-done" : ""}`}
                        key={task.id}
                      >
                        <button
                          className="task-check"
                          aria-label={
                            task.done ? "Mark incomplete" : "Mark complete"
                          }
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.done ? (
                            <CircleCheck size={21} />
                          ) : (
                            <Circle size={21} />
                          )}
                        </button>

                        <div className="task-main">
                          <div className="task-title">{task.title}</div>
                          <div className="task-meta">
                            <span>{formatTime(task.time)}</span>
                            <span className="meta-separator">·</span>
                            <span>{task.duration} min</span>
                            <span className="category-pill">{task.category}</span>
                            {isCurrent && (
                              <span className="task-status status-running">
                                In progress
                              </span>
                            )}
                            {isOverdue && (
                              <span className="task-status status-overdue">
                                Overrun
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                        <button
                          className="icon-button task-action"
                          aria-label={`Edit ${task.title}`}
                          title="Edit task"
                          onClick={() => openEditTask(task)}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          className="icon-button task-delete"
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {tasks.length > 0 && (
                <button className="add-task-link" onClick={openNewTask}>
                  <Plus size={16} /> Add another task
                </button>
              )}
            </article>

            <div className="right-column">
              <article className="panel next-panel">
                <div className="section-kicker">
                  {currentTask && currentTaskOverrun > 0
                    ? "CURRENT TASK"
                    : currentTask
                      ? "IN PROGRESS"
                      : "UP NEXT"}
                </div>

                {currentTask ? (
                  <>
                    <h2 className="next-title">{currentTask.title}</h2>
                    <div className="next-time">
                      <Clock3 size={15} />
                      {formatTime(currentTask.time)}
                      <span>·</span>
                      {currentTask.duration} min planned
                    </div>

                    <div className="live-countdown">
                      <div className="countdown-label">
                        {currentTaskOverrun > 0
                          ? "Time over plan"
                          : "Time remaining"}
                      </div>
                      <strong>
                        {currentTaskOverrun > 0 ? "+" : ""}
                        {formatCountdown(
                          currentTaskOverrun > 0
                            ? currentTaskOverrun
                            : getTaskEnd(currentTask) - now
                        )}
                      </strong>
                      <span>
                        {currentTaskOverrun > 0
                          ? "Consider reviewing the next task."
                          : "Until this task's planned end"}
                      </span>
                    </div>

                    <button
                      className="primary-button focus-start-button"
                      onClick={() => startFocus(currentTask)}
                    >
                      <Play size={16} /> Start focus session
                    </button>
                  </>
                ) : nextTask ? (
                  <>
                    <h2 className="next-title">{nextTask.title}</h2>
                    <div className="next-time">
                      <Clock3 size={15} />
                      Starts at {formatTime(nextTask.time)}
                      <span>·</span>
                      {nextTask.duration} min
                    </div>

                    <div className="next-divider" />

                    <div className="next-tip">
                      <Zap size={17} />
                      <span>
                        Your next task is coming up. You can start a focus
                        session whenever you're ready.
                      </span>
                    </div>

                    <button
                      className="primary-button focus-start-button"
                      onClick={() => startFocus(nextTask)}
                    >
                      <Play size={16} /> Start focus session
                    </button>
                  </>
                ) : (
                  <div className="all-done">
                    <CircleCheck size={25} />
                    <h3>{tasks.length ? "All caught up!" : "Nothing scheduled yet"}</h3>
                    <p>
                      {tasks.length
                        ? "No unfinished tasks remain."
                        : "Add a task to see what's coming up next."}
                    </p>
                    <button className="secondary-button" onClick={openNewTask}>
                      <Plus size={15} /> Create a task
                    </button>
                  </div>
                )}
              </article>

              <article className="panel focus-panel">
                <div className="focus-panel-icon">
                  <Target size={20} />
                </div>
                <div className="section-kicker">FOCUS MODE</div>

                {focusTask ? (
                  <>
                    <h2>{focusTask.title}</h2>
                    <p>
                      Keep one task in view. Your focus timer runs independently
                      of the planned schedule.
                    </p>

                    <div className="focus-timer-display">
                      <Timer size={18} />
                      <strong>{formatCountdown(focusRemaining)}</strong>
                    </div>

                    <div className="focus-session-status">
                      {focusFinished
                        ? "Session complete"
                        : pausedRemaining !== null
                          ? "Session paused"
                          : "Session in progress"}
                    </div>

                    <div className="focus-controls">
                      {!focusFinished && (
                        <button
                          className="secondary-button"
                          onClick={
                            pausedRemaining !== null ? resumeFocus : pauseFocus
                          }
                        >
                          {pausedRemaining !== null ? (
                            <Play size={15} />
                          ) : (
                            <Pause size={15} />
                          )}
                          {pausedRemaining !== null ? "Resume" : "Pause"}
                        </button>
                      )}

                      {focusFinished ? (
                        <button
                          className="primary-button"
                          onClick={finishFocusedTask}
                        >
                          <Check size={15} /> Complete task
                        </button>
                      ) : (
                        <button
                          className="secondary-button"
                          onClick={stopFocus}
                        >
                          <RotateCcw size={15} /> End session
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Give one thing your attention.</h2>
                    <p>
                      Choose a task, start a timer, and work without switching
                      between priorities.
                    </p>
                    <button
                      className="secondary-button"
                      onClick={() => startFocus(currentTask || nextTask)}
                      disabled={!currentTask && !nextTask}
                    >
                      <Play size={15} /> Start focus
                    </button>
                  </>
                )}
              </article>

              <article className="mini-insight">
                <div className="mini-insight-icon">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <strong>Progress over perfection</strong>
                  <p>
                    {completed} of {tasks.length} tasks completed. Every step
                    counts.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <footer className="page-footer">
            <span>ORDO / MAKE TIME COUNT</span>
            <span>Built for a more intentional day.</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              resetForm();
            }
          }}
        >
          <form className="task-modal" onSubmit={saveTask}>
            <div className="modal-heading">
              <div>
                <div className="section-kicker">
                  {editingTaskId ? "REFINE YOUR PLAN" : "MAKE IT HAPPEN"}
                </div>
                <h2>{editingTaskId ? "Edit task" : "Create a task"}</h2>
                <p>
                  {editingTaskId
                    ? "Update the details for this task."
                    : "Give your next step a place in your day."}
                </p>
              </div>

              <button
                type="button"
                className="icon-button"
                aria-label="Close form"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <X size={19} />
              </button>
            </div>

            <label className="form-label">
              Task name
              <input
                autoFocus
                required
                maxLength={120}
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="What do you want to work on?"
              />
            </label>

            <div className="form-row">
              <label className="form-label">
                Start time
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(event) => setNewTime(event.target.value)}
                />
              </label>

              <label className="form-label">
                Duration
                <select
                  value={newDuration}
                  onChange={(event) => setNewDuration(event.target.value)}
                >
                  {durations.map((duration) => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label className="form-label">
                Priority
                <select
                  value={newPriority}
                  onChange={(event) => setNewPriority(event.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <label className="form-label">
                Category
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                >
                  <option>Study</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Health</option>
                  <option>Project</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingTaskId ? <Check size={17} /> : <Plus size={17} />}
                {editingTaskId ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
