
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
} from "lucide-react";

const STORAGE_KEY = "ordo-tasks";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My schedule", icon: CalendarDays },
  { label: "My tasks", icon: CheckSquare },
  { label: "Insights", icon: BarChart3 },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
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

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("17:00");
  const [newDuration, setNewDuration] = useState("30");
  const [newPriority, setNewPriority] = useState("Medium");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save Ordo tasks:", error);
    }
  }, [tasks]);

  const completed = tasks.filter((task) => task.done).length;
  const totalMinutes = tasks.reduce(
    (sum, task) => sum + Number(task.duration || 0),
    0
  );
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [tasks, search]);

  const nextTask = [...tasks]
    .filter((task) => !task.done)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""))[0];

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function addTask(event) {
    event.preventDefault();

    const title = newTitle.trim();
    if (!title) return;

    const task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      time: newTime,
      duration: Number(newDuration),
      priority: newPriority,
      category: "Personal",
      done: false,
    };

    setTasks((current) => [...current, task]);
    setNewTitle("");
    setNewTime("17:00");
    setNewDuration("30");
    setNewPriority("Medium");
    setShowForm(false);
  }

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenu(false);

    if (label === "My tasks" || label === "My schedule") {
      setSearch("");
    }
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
              className={`nav-item ${
                activeNav === label ? "nav-active" : ""
              }`}
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
            className={`nav-item ${
              activeNav === "Settings" ? "nav-active" : ""
            }`}
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
              aria-label="Notifications"
              title="Notifications"
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
                YOUR DAY, WITH INTENTION
              </div>

              <h1>
                {activeNav === "Overview"
                  ? "Good things take focus."
                  : activeNav}
              </h1>

              <p className="welcome-subtitle">
                A little structure goes a long way. Let's make today count.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
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
              <div className="stat-foot">Tasks you've added</div>
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
                <span>Time planned</span>
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
              <div className="stat-foot">Based on your task durations</div>
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

          <section className="content-grid">
            <article className="panel schedule-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">YOUR PLAN</div>
                  <h2>
                    {activeNav === "My tasks" ? "All tasks" : "Your schedule"}
                  </h2>
                  <p>Your tasks, organised by start time.</p>
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

              <div className="task-list">
                {visibleTasks.length === 0 ? (
                  <div className="empty-state">
                    <CalendarDays size={27} />
                    <strong>
                      {search ? "No matching tasks" : "Your day starts here"}
                    </strong>
                    <span>
                      {search
                        ? "Try a different search term."
                        : "Add your first task to start planning your day."}
                    </span>

                    {!search && (
                      <button
                        className="secondary-button"
                        onClick={() => setShowForm(true)}
                      >
                        <Plus size={15} /> Create your first task
                      </button>
                    )}
                  </div>
                ) : (
                  visibleTasks.map((task) => (
                    <div
                      className={`task-row ${
                        task.done ? "task-done" : ""
                      }`}
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
                          <span className="category-pill">
                            {task.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`priority priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <button
                        className="icon-button task-delete"
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {tasks.length > 0 && (
                <button
                  className="add-task-link"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} /> Add another task
                </button>
              )}
            </article>

            <div className="right-column">
              <article className="panel next-panel">
                <div className="section-kicker">UP NEXT</div>

                {nextTask ? (
                  <>
                    <h2 className="next-title">{nextTask.title}</h2>
                    <div className="next-time">
                      <Clock3 size={15} />
                      {formatTime(nextTask.time)}
                      <span>·</span>
                      {nextTask.duration} min planned
                    </div>
                    <div className="next-divider" />
                    <div className="next-tip">
                      <Zap size={17} />
                      <span>
                        Focus on your next task and keep your schedule in view.
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="all-done">
                    <CircleCheck size={25} />
                    <h3>{tasks.length ? "All caught up!" : "Nothing scheduled yet"}</h3>
                    <p>
                      {tasks.length
                        ? "You've completed every task you've added."
                        : "Add a task to see what's coming up next."}
                    </p>
                  </div>
                )}
              </article>

              <article className="panel focus-panel">
                <div className="focus-panel-icon">
                  <Target size={20} />
                </div>
                <div className="section-kicker">A MOMENT TO FOCUS</div>
                <h2>Give one thing your attention.</h2>
                <p>
                  Choose your next task, set a clear intention, and begin.
                </p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    if (nextTask) {
                      setSearch(nextTask.title);
                      setActiveNav("My tasks");
                    } else {
                      setShowForm(true);
                    }
                  }}
                >
                  {nextTask ? "Find my next task" : "Create a task"}
                  <ArrowUpRight size={16} />
                </button>
              </article>

              <article className="mini-insight">
                <div className="mini-insight-icon">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <strong>Progress over perfection</strong>
                  <p>Every completed task is a step forward.</p>
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
            }
          }}
        >
          <form className="task-modal" onSubmit={addTask}>
            <div className="modal-heading">
              <div>
                <div className="section-kicker">MAKE IT HAPPEN</div>
                <h2>Create a task</h2>
                <p>Give your next step a place in your day.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
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
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </label>
            </div>

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

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                <Plus size={17} /> Create task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
