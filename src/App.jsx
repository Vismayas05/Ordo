
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, CalendarDays, CheckSquare, BarChart3, Settings,
  Plus, Search, Clock3, ArrowUpRight, CircleCheck, Circle, Menu, X,
  Trash2, Pencil, AlertTriangle, Check, Volume2, VolumeX, Languages,
  Bell, CalendarClock,
} from "lucide-react";
import Insights from "./pages/Insights.jsx";
const STORAGE_KEY = "ordo-tasks";
const SETTINGS_KEY = "ordo-settings";

const NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My schedule", icon: CalendarDays },
  { label: "My tasks", icon: CheckSquare },
  { label: "Insights", icon: BarChart3 },
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

const TEXT = {
  en: {
    Overview: "Overview", "My schedule": "My schedule",
    "My tasks": "My tasks", Insights: "Insights", Settings: "Settings",
    workspace: "WORKSPACE", search: "Search tasks...", newTask: "New task",
    welcome: "Good things take focus.", subtitle: "A little structure goes a long way. Let's make today count.",
    tasks: "Tasks", total: "total", remaining: "remaining", completed: "Completed",
    marked: "Tasks marked complete", timeRemaining: "Time remaining",
    planned: "Planned time for unfinished tasks", completion: "Completion",
    progress: "Your current task progress", yourPlan: "YOUR PLAN",
    yourProgress: "YOUR PROGRESS", yourSchedule: "Your schedule",
    allTasks: "All tasks", upcoming: "Upcoming schedule",
    summary: "Progress summary", organised: "Your tasks, organised by start time.",
    unfinished: "Unfinished tasks in start-time order.",
    taskCompletion: "Task completion", viewAll: "View all",
    plannedTime: "Planned task time", highPriority: "High-priority tasks",
    remainingTasks: "Remaining tasks", noMatches: "No matching tasks",
    nothingUpcoming: "Nothing upcoming", startHere: "Your day starts here",
    searchTip: "Try a different search term.",
    firstTask: "Add your first task to start planning your day.",
    createFirst: "Create your first task", addAnother: "Add another task",
    current: "CURRENT TASK", inProgress: "IN PROGRESS", upNext: "UP NEXT",
    timeOver: "Time over plan", timeLeft: "Time remaining",
    untilEnd: "Until this task's planned end", reviewNext: "Review next task",
    scheduleAlert: "Your schedule may need a small adjustment",
    noAuto: "Ordo won't move any task automatically. You decide what to change.",
    nextComing: "Your next task is coming up. Get ready before it starts.",
    caughtUp: "All caught up!", nothingScheduled: "Nothing scheduled yet",
    noRemaining: "No unfinished tasks remain.",
    addToSee: "Add a task to see what's coming up next.", createTask: "Create a task",
    progressOver: "Progress over perfection",
    completedOf: "tasks completed. Every step counts.",
    footer: "Built for a more intentional day.",
    refine: "REFINE YOUR PLAN", makeHappen: "MAKE IT HAPPEN",
    editTask: "Edit task", createTitle: "Create a task",
    updateDetails: "Update the details for this task.",
    nextStep: "Give your next step a place in your day.",
    taskName: "Task name", taskPlaceholder: "What do you want to work on?",
    startTime: "Start time", duration: "Duration", priority: "Priority",
    category: "Category", cancel: "Cancel", saveChanges: "Save changes",
    create: "Create task", Personal: "Personal", Study: "Study",
    Work: "Work", Health: "Health", Project: "Project", Other: "Other",
    Low: "Low", Medium: "Medium", High: "High",
    markComplete: "Mark complete", markIncomplete: "Mark incomplete",
    delete: "Delete task", edit: "Edit task", language: "Language",
    voiceLabel: "Spoken reminders", notificationLabel: "Browser notifications",
    settingsTitle: "Your preferences",
    settingsDescription: "Choose your language and reminder preferences.",
    voiceOn: "Voice reminders on", voiceOff: "Voice reminders off",
    enableNotifications: "Enable notifications",
    notificationReady: "Browser notifications enabled.",
    permissionDenied: "Notifications are blocked in browser settings.",
    unavailable: "Browser notifications are unavailable.",
    startReminder: "It's time for", endReminder: "The planned time has ended for",
    taskStarting: "Your task is starting now.",
    endAlert: "Your task has reached its planned end time.",
    conflictTitle: "Schedule overlap detected",
    conflictDescription: "Choose a suggested time if you want to adjust your schedule.",
    moveAfter: "Move to", keepSchedule: "Keep schedule",
    moved: "Task rescheduled.", noConflicts: "No schedule overlaps detected.",
    alerts: "Schedule checks", languageHint: "Choose your preferred interface language.",
    english: "English", malayalam: "മലയാളം", priorityLabel: "Priority",
  },
  ml: {
    Overview: "അവലോകനം", "My schedule": "എന്റെ ഷെഡ്യൂൾ",
    "My tasks": "എന്റെ ടാസ്കുകൾ", Insights: "വിശകലനം", Settings: "ക്രമീകരണങ്ങൾ",
    workspace: "പ്രവർത്തന മേഖല", search: "ടാസ്കുകൾ തിരയുക...", newTask: "പുതിയ ടാസ്ക്",
    welcome: "ശ്രദ്ധയോടെ മുന്നേറാം.", subtitle: "ചെറിയൊരു ക്രമീകരണം ദിവസത്തെ മികച്ചതാക്കും.",
    tasks: "ടാസ്കുകൾ", total: "ആകെ", remaining: "ബാക്കി", completed: "പൂർത്തിയാക്കി",
    marked: "പൂർത്തിയാക്കിയ ടാസ്കുകൾ", timeRemaining: "ബാക്കിയുള്ള സമയം",
    planned: "പൂർത്തിയാകാത്ത ടാസ്കുകളുടെ ആസൂത്രിത സമയം", completion: "പൂർത്തീകരണം",
    progress: "നിലവിലെ ടാസ്ക് പുരോഗതി", yourPlan: "നിങ്ങളുടെ പ്ലാൻ",
    yourProgress: "നിങ്ങളുടെ പുരോഗതി", yourSchedule: "നിങ്ങളുടെ ഷെഡ്യൂൾ",
    allTasks: "എല്ലാ ടാസ്കുകളും", upcoming: "വരാനിരിക്കുന്ന ഷെഡ്യൂൾ",
    summary: "പുരോഗതി സംഗ്രഹം", organised: "സമയക്രമത്തിലുള്ള ടാസ്കുകൾ.",
    unfinished: "പൂർത്തിയാകാത്ത ടാസ്കുകൾ സമയക്രമത്തിൽ.",
    taskCompletion: "ടാസ്ക് പൂർത്തീകരണം", viewAll: "എല്ലാം കാണുക",
    plannedTime: "ആസൂത്രിത സമയം", highPriority: "ഉയർന്ന മുൻഗണനയുള്ളവ",
    remainingTasks: "ബാക്കിയുള്ള ടാസ്കുകൾ", noMatches: "ടാസ്കുകൾ കണ്ടെത്തിയില്ല",
    nothingUpcoming: "വരാനിരിക്കുന്ന ടാസ്കുകളില്ല", startHere: "ഇവിടെ തുടങ്ങാം",
    searchTip: "മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് തിരയൂ.",
    firstTask: "നിങ്ങളുടെ ആദ്യ ടാസ്ക് ചേർത്ത് ദിവസം പ്ലാൻ ചെയ്യൂ.",
    createFirst: "ആദ്യ ടാസ്ക് സൃഷ്ടിക്കുക", addAnother: "മറ്റൊരു ടാസ്ക് ചേർക്കുക",
    current: "നിലവിലെ ടാസ്ക്", inProgress: "പുരോഗമിക്കുന്നു", upNext: "അടുത്തത്",
    timeOver: "സമയം കഴിഞ്ഞു", timeLeft: "ബാക്കിയുള്ള സമയം",
    untilEnd: "ടാസ്ക് അവസാനിക്കാൻ", reviewNext: "അടുത്ത ടാസ്ക് പരിശോധിക്കുക",
    scheduleAlert: "ഷെഡ്യൂളിൽ ചെറിയ മാറ്റം ആവശ്യമായേക്കാം",
    noAuto: "Ordo സ്വയം ടാസ്കുകൾ മാറ്റില്ല. നിങ്ങൾക്ക് മാറ്റം തീരുമാനിക്കാം.",
    nextComing: "അടുത്ത ടാസ്ക് ഉടൻ തുടങ്ങും. തയ്യാറാകൂ.",
    caughtUp: "എല്ലാം പൂർത്തിയായി!", nothingScheduled: "ടാസ്കുകളൊന്നും ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല",
    noRemaining: "പൂർത്തിയാക്കാനുള്ള ടാസ്കുകളില്ല.",
    addToSee: "അടുത്ത ടാസ്ക് കാണാൻ ഒന്ന് ചേർക്കൂ.", createTask: "ടാസ്ക് സൃഷ്ടിക്കുക",
    progressOver: "പൂർണ്ണതയേക്കാൾ പുരോഗതി",
    completedOf: "ടാസ്കുകൾ പൂർത്തിയാക്കി. ഓരോ ചുവടും പ്രധാനമാണ്.",
    footer: "കൂടുതൽ ക്രമബദ്ധമായ ദിവസത്തിനായി.",
    refine: "പ്ലാൻ പുതുക്കുക", makeHappen: "തുടങ്ങാം",
    editTask: "ടാസ്ക് തിരുത്തുക", createTitle: "ടാസ്ക് സൃഷ്ടിക്കുക",
    updateDetails: "ടാസ്കിന്റെ വിവരങ്ങൾ പുതുക്കുക.",
    nextStep: "അടുത്ത ചുവടിന് നിങ്ങളുടെ ദിവസത്തിൽ ഇടം നൽകൂ.",
    taskName: "ടാസ്കിന്റെ പേര്", taskPlaceholder: "എന്താണ് ചെയ്യേണ്ടത്?",
    startTime: "ആരംഭ സമയം", duration: "ദൈർഘ്യം", priority: "മുൻഗണന",
    category: "വിഭാഗം", cancel: "റദ്ദാക്കുക", saveChanges: "മാറ്റങ്ങൾ സൂക്ഷിക്കുക",
    create: "ടാസ്ക് സൃഷ്ടിക്കുക", Personal: "വ്യക്തിപരം", Study: "പഠനം",
    Work: "ജോലി", Health: "ആരോഗ്യം", Project: "പ്രോജക്റ്റ്", Other: "മറ്റുള്ളവ",
    Low: "കുറഞ്ഞത്", Medium: "ഇടത്തരം", High: "ഉയർന്നത്",
    markComplete: "പൂർത്തിയാക്കുക", markIncomplete: "പൂർത്തിയാകാത്തതായി മാറ്റുക",
    delete: "ടാസ്ക് നീക്കം ചെയ്യുക", edit: "ടാസ്ക് തിരുത്തുക", language: "ഭാഷ",
    voiceLabel: "ശബ്ദ ഓർമ്മപ്പെടുത്തലുകൾ", notificationLabel: "ബ്രൗസർ അറിയിപ്പുകൾ",
    settingsTitle: "നിങ്ങളുടെ മുൻഗണനകൾ",
    settingsDescription: "ഭാഷയും ഓർമ്മപ്പെടുത്തൽ മുൻഗണനകളും തിരഞ്ഞെടുക്കൂ.",
    voiceOn: "ശബ്ദ ഓർമ്മപ്പെടുത്തൽ ഓൺ", voiceOff: "ശബ്ദ ഓർമ്മപ്പെടുത്തൽ ഓഫ്",
    enableNotifications: "അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക",
    notificationReady: "ബ്രൗസർ അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാണ്.",
    permissionDenied: "ബ്രൗസർ ക്രമീകരണങ്ങളിൽ അറിയിപ്പുകൾ അനുവദിക്കണം.",
    unavailable: "ഈ ബ്രൗസറിൽ അറിയിപ്പുകൾ ലഭ്യമല്ല.",
    startReminder: "ഇപ്പോൾ തുടങ്ങേണ്ട ടാസ്ക്", endReminder: "നിശ്ചയിച്ച സമയം അവസാനിച്ചു",
    taskStarting: "ടാസ്ക് ഇപ്പോൾ തുടങ്ങുന്നു.",
    endAlert: "ടാസ്കിന്റെ നിശ്ചയിച്ച സമയം അവസാനിച്ചു.",
    conflictTitle: "ഷെഡ്യൂൾ സമയങ്ങൾ തമ്മിൽ മുട്ടുന്നു",
    conflictDescription: "ആവശ്യമെങ്കിൽ നിർദ്ദേശിച്ച സമയത്തേക്ക് മാറ്റാം.",
    moveAfter: "സമയത്തിലേക്ക് മാറ്റുക", keepSchedule: "നിലവിലെ ഷെഡ്യൂൾ നിലനിർത്തുക",
    moved: "ടാസ്ക് മാറ്റി.", noConflicts: "ഷെഡ്യൂൾ സമയങ്ങൾ തമ്മിൽ മുട്ടുന്നില്ല.",
    alerts: "ഷെഡ്യൂൾ പരിശോധന", languageHint: "ഇഷ്ടമുള്ള ഭാഷ തിരഞ്ഞെടുക്കൂ.",
    english: "English", malayalam: "മലയാളം", priorityLabel: "മുൻഗണന",
  },
};

function readTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(tasks)) return [];
    return tasks.filter((task) => task?.id && task?.title).map((task) => ({
      ...task,
      duration: Number(task.duration) || 30,
      priority: ["Low", "Medium", "High"].includes(task.priority) ? task.priority : "Medium",
      category: task.category || "Personal",
      time: task.time || "17:00",
      done: Boolean(task.done),
    }));
  } catch {
    return [];
  }
}

function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return {
      language: saved.language === "ml" ? "ml" : "en",
      voice: saved.voice !== false,
      notifications: saved.notifications === true,
    };
  } catch {
    return { language: "en", voice: true, notifications: false };
  }
}

function taskStart(task, base = new Date()) {
  const [hours, minutes] = (task.time || "00:00").split(":").map(Number);
  const date = new Date(base);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date.getTime();
}

function taskEnd(task, base = new Date()) {
  return taskStart(task, base) + Number(task.duration || 30) * 60000;
}

function timeLabel(time, language) {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);
  return new Intl.DateTimeFormat(language === "ml" ? "ml-IN" : "en-IN", {
    hour: "numeric", minute: "2-digit",
  }).format(date);
}

function countdown(ms) {
  const seconds = Math.floor(Math.abs(ms) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function dayLabel(date, language) {
  return new Intl.DateTimeFormat(language === "ml" ? "ml-IN" : "en", {
    weekday: "long", month: "long", day: "numeric",
  }).format(date);
}

function speak(message, language) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = language === "ml" ? "ml-IN" : "en-IN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [settings, setSettings] = useState(readSettings);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("30");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Study");
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState("");
  const spoken = useRef(new Set());

  const language = settings.language;
  const t = (key) => TEXT[language]?.[key] || TEXT.en[key] || key;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Existing task-time voice reminders, without a reminder panel on the dashboard.
  useEffect(() => {
    const checkReminders = () => {
      const current = Date.now();
      const base = new Date(current);
      const today = base.toDateString();

      tasks.forEach((task) => {
        if (task.done) return;

        const start = taskStart(task, base);
        const end = taskEnd(task, base);
        const events = [
          { key: `${today}-${task.id}-start`, at: start, kind: "start" },
          { key: `${today}-${task.id}-end`, at: end, kind: "end" },
        ];

        events.forEach((event) => {
          if (current < event.at || current - event.at > 1800) return;
          if (spoken.current.has(event.key)) return;
          spoken.current.add(event.key);

          const message = event.kind === "start"
            ? `${task.title}. ${t("taskStarting")}`
            : `${task.title}. ${t("endAlert")}`;

          if (settings.voice) speak(message, language);

          if (
            settings.notifications &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(
                event.kind === "start" ? `${t("startReminder")} ${task.title}` : `${t("endReminder")} ${task.title}`,
                { body: event.kind === "start" ? t("taskStarting") : t("endAlert"), icon: "/ordo-logo.png" }
              );
            } catch {
              // Notification delivery depends on browser permission and support.
            }
          }
        });
      });
    };

    checkReminders();
    const timer = window.setInterval(checkReminders, 1000);
    return () => window.clearInterval(timer);
  }, [tasks, settings.voice, settings.notifications, language]);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title)),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedTasks.filter((task) => {
      const match = task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);
      if (!match) return false;
      if (activeNav === "My schedule") return !task.done;
      return true;
    });
  }, [sortedTasks, search, activeNav]);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const totalMinutes = tasks.filter((task) => !task.done)
    .reduce((sum, task) => sum + Number(task.duration || 0), 0);
  const allMinutes = tasks.reduce((sum, task) => sum + Number(task.duration || 0), 0);

  const currentTask = useMemo(() => sortedTasks
    .filter((task) => !task.done && taskStart(task) <= now && now < taskEnd(task))
    .sort((a, b) => taskStart(b) - taskStart(a))[0] || null, [sortedTasks, now]);

  const nextTask = useMemo(() => sortedTasks
    .filter((task) => !task.done && taskStart(task) > now)
    .sort((a, b) => taskStart(a) - taskStart(b))[0] || null, [sortedTasks, now]);

  const overrunTask = useMemo(() => sortedTasks
    .filter((task) => !task.done && taskStart(task) <= now && taskEnd(task) <= now)
    .sort((a, b) => taskEnd(b) - taskEnd(a))[0] || null, [sortedTasks, now]);

  const conflicts = useMemo(() => {
    const active = tasks.filter((task) => !task.done).sort((a, b) => taskStart(a) - taskStart(b));
    const found = [];
    for (let i = 0; i < active.length - 1; i += 1) {
      if (taskEnd(active[i]) > taskStart(active[i + 1])) {
        found.push({ first: active[i], second: active[i + 1] });
      }
    }
    return found;
  }, [tasks, now]);

  function setPreference(key, value) {
    setSettings((old) => ({ ...old, [key]: value }));
  }

  function toggleTask(id) {
    setTasks((old) => old.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function deleteTask(id) {
    setTasks((old) => old.filter((task) => task.id !== id));
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setTime("17:00");
    setDuration("30");
    setPriority("Medium");
    setCategory("Study");
  }

  function openNewTask() {
    resetForm();
    setShowForm(true);
  }

  function openEditTask(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setTime(task.time || "17:00");
    setDuration(String(task.duration || 30));
    setPriority(task.priority || "Medium");
    setCategory(task.category || "Personal");
    setShowForm(true);
  }

  function saveTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const data = {
      title: cleanTitle, time, duration: Number(duration), priority, category,
    };

    if (editingId) {
      setTasks((old) => old.map((task) => task.id === editingId ? { ...task, ...data } : task));
    } else {
      setTasks((old) => [...old, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...data, done: false, createdAt: Date.now(),
      }]);
    }

    setShowForm(false);
    resetForm();
  }

  function selectNav(label) {
    setActiveNav(label);
    setMobileMenu(false);
    setSearch("");
  }

  function moveTask(id, newTime) {
    setTasks((old) => old.map((task) => task.id === id ? { ...task, time: newTime } : task));
    setToast(t("moved"));
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setToast(t("unavailable"));
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPreference("notifications", true);
      setToast(t("notificationReady"));
    } else {
      setPreference("notifications", false);
      setToast(t("permissionDenied"));
    }
  }

  const heading = activeNav === "Overview" ? t("welcome")
    : activeNav === "My schedule" ? t("upcoming")
    : activeNav === "My tasks" ? t("allTasks")
    : activeNav === "Insights" ? t("yourProgress")
    : t("settingsTitle");

  return (
    <div className={`app-shell ${language === "ml" ? "language-ml" : ""}`}>
      {mobileMenu && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img src="/ordo-logo.png" alt="Ordo" className="brand-logo" />
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileMenu(false)}><X size={19} /></button>
        </div>

        <div className="workspace-label">{t("workspace")}</div>
        <nav className="nav-list">
          {NAV.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeNav === label ? "nav-active" : ""}`} onClick={() => selectNav(label)}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{t(label)}</span>
              {label === "My tasks" && <span className="nav-count">{tasks.length}</span>}
            </button>
          ))}
        </nav>

        {/* Clean sidebar: no extra bottom card or profile block. */}
        <div className="sidebar-bottom">
          <button className={`nav-item ${activeNav === "Settings" ? "nav-active" : ""}`} onClick={() => selectNav("Settings")}>
            <Settings size={18} strokeWidth={1.8} /><span>{t("Settings")}</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumb">Ordo <span>/</span> <strong>{t(activeNav)}</strong></div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("search")} aria-label={t("search")} />
              <kbd>⌕</kbd>
            </label>
            <button className="icon-button language-button" title={t("language")} aria-label={t("language")} onClick={() => setPreference("language", language === "en" ? "ml" : "en")}><Languages size={18} /></button>
            <button className="icon-button voice-button" title={settings.voice ? t("voiceOn") : t("voiceOff")} aria-label={settings.voice ? t("voiceOff") : t("voiceOn")} onClick={() => setPreference("voice", !settings.voice)}>
              {settings.voice ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </header>

        <div className="page-content">
                    {activeNav !== "Insights" && (
            <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="status-dot" />{dayLabel(new Date(now), language).toUpperCase()}</div>
              <h1>{heading}</h1>
              <p className="welcome-subtitle">{activeNav === "Settings" ? t("settingsDescription") : t("subtitle")}</p>
            </div>
            {activeNav !== "Settings" && <button className="primary-button" onClick={openNewTask}><Plus size={18} /> {t("newTask")}</button>}
                      </section>
          )}

          {activeNav === "Settings" ? (
            <section className="panel settings-panel">
              <div className="section-kicker">{t("Settings").toUpperCase()}</div>
              <h2>{t("settingsTitle")}</h2>
              <p>{t("settingsDescription")}</p>

              <div className="settings-option">
                <div><strong>{t("language")}</strong><span>{t("languageHint")}</span></div>
                <div className="settings-language">
                  <button className={`secondary-button ${language === "en" ? "setting-selected" : ""}`} onClick={() => setPreference("language", "en")}>{t("english")}</button>
                  <button className={`secondary-button ${language === "ml" ? "setting-selected" : ""}`} onClick={() => setPreference("language", "ml")}>{t("malayalam")}</button>
                </div>
              </div>

              <div className="settings-option">
                <div><strong>{t("voiceLabel")}</strong><span>{settings.voice ? t("voiceOn") : t("voiceOff")}</span></div>
                <button className={`toggle-switch ${settings.voice ? "toggle-on" : ""}`} role="switch" aria-checked={settings.voice} onClick={() => setPreference("voice", !settings.voice)}><span /></button>
              </div>

              <div className="settings-option">
                <div><strong>{t("notificationLabel")}</strong><span>
  {settings.notifications
    ? t("notificationReady")
    : t("enableNotifications")}
</span></div>
                <button className={`toggle-switch ${settings.notifications ? "toggle-on" : ""}`} role="switch" aria-checked={settings.notifications} onClick={enableNotifications}><span /></button>
              </div>

              <div className="section-kicker">{t("alerts").toUpperCase()}</div>
              {conflicts.length ? conflicts.map(({ first, second }) => {
                const suggestedDate = new Date(taskEnd(first));
                const suggested = `${String(suggestedDate.getHours()).padStart(2, "0")}:${String(suggestedDate.getMinutes()).padStart(2, "0")}`;
                return (
                  <div className="conflict-alert" key={`${first.id}-${second.id}`}>
                    <div className="conflict-icon"><AlertTriangle size={19} /></div>
                    <div className="conflict-copy">
                      <strong>{t("conflictTitle")}</strong>
                      <p>{first.title} · {timeLabel(first.time, language)} — {second.title} · {timeLabel(second.time, language)}</p>
                      <span>{t("conflictDescription")}</span>
                      <div className="conflict-actions">
                        <button className="secondary-button" onClick={() => moveTask(second.id, suggested)}><CalendarClock size={15} /> {t("moveAfter")} {timeLabel(suggested, language)}</button>
                        <button className="text-button" onClick={() => setToast(t("noConflicts"))}>{t("keepSchedule")}</button>
                      </div>
                    </div>
                  </div>
                );
              }) : <div className="no-conflicts"><CircleCheck size={17} /><span>{t("noConflicts")}</span></div>}
            </section>
                        ) : activeNav === "Insights" ? (
            <Insights tasks={tasks} language={language} />
          ) : (
            <>
              <section className="stats-grid">
                <article className="stat-card"><div className="stat-top"><span>{t("tasks")}</span><span className="stat-icon"><CheckSquare size={17} /></span></div><div className="stat-number">{tasks.length}<span className="stat-unit"> {t("total")}</span></div><div className="stat-foot">{pending} {t("remaining")}</div></article>
                <article className="stat-card"><div className="stat-top"><span>{t("completed")}</span><span className="stat-icon coral-icon"><CircleCheck size={17} /></span></div><div className="stat-number">{completed}<span className="stat-unit"> / {tasks.length}</span></div><div className="stat-foot">{t("marked")}</div></article>
                <article className="stat-card"><div className="stat-top"><span>{t("timeRemaining")}</span><span className="stat-icon"><Clock3 size={17} /></span></div><div className="stat-number">{Math.floor(totalMinutes / 60)}<span className="stat-unit">h </span>{totalMinutes % 60}<span className="stat-unit">m</span></div><div className="stat-foot">{t("planned")}</div></article>
                <article className="stat-card"><div className="stat-top"><span>{t("completion")}</span><span className="stat-icon"><BarChart3 size={17} /></span></div><div className="stat-number">{progress}<span className="stat-unit">%</span></div><div className="stat-foot">{t("progress")}</div></article>
              </section>

              {overrunTask && activeNav === "Overview" && (
                <section className="schedule-alert" role="status">
                  <div className="schedule-alert-icon"><AlertTriangle size={20} /></div>
                  <div className="schedule-alert-copy">
                    <strong>{t("scheduleAlert")}</strong>
                    <p>“{overrunTask.title}” — {countdown(now - taskEnd(overrunTask))} {t("timeOver")}.{nextTask ? ` ${nextTask.title} · ${timeLabel(nextTask.time, language)}` : ""}</p>
                    <span>{t("noAuto")}</span>
                  </div>
                  {nextTask && <button className="secondary-button schedule-alert-button" onClick={() => { selectNav("My tasks"); setSearch(nextTask.title); }}>{t("reviewNext")}</button>}
                </section>
              )}

              <section className="content-grid">
                <article className="panel schedule-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">{activeNav === "Insights" ? t("yourProgress") : t("yourPlan")}</div>
                      <h2>{activeNav === "My tasks" ? t("allTasks") : activeNav === "My schedule" ? t("upcoming") : activeNav === "Insights" ? t("summary") : t("yourSchedule")}</h2>
                      <p>{activeNav === "My schedule" ? t("unfinished") : t("organised")}</p>
                    </div>
                    <button className="text-button" onClick={() => selectNav("My tasks")}>{t("viewAll")} <ArrowUpRight size={15} /></button>
                  </div>

                  <div className="progress-section">
                    <div className="progress-label"><span>{t("taskCompletion")}</span><strong>{progress}%</strong></div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                  </div>

                  {activeNav === "Insights" && (
                    <div className="insights-summary">
                      <div><span>{t("plannedTime")}</span><strong>{Math.floor(allMinutes / 60)}h {allMinutes % 60}m</strong></div>
                      <div><span>{t("highPriority")}</span><strong>{tasks.filter((task) => !task.done && task.priority === "High").length}</strong></div>
                      <div><span>{t("remainingTasks")}</span><strong>{pending}</strong></div>
                    </div>
                  )}

                  <div className="task-list">
                    {visibleTasks.length === 0 ? (
                      <div className="empty-state">
                        <CalendarDays size={27} />
                        <strong>{search ? t("noMatches") : activeNav === "My schedule" ? t("nothingUpcoming") : t("startHere")}</strong>
                        <span>{search ? t("searchTip") : t("firstTask")}</span>
                        {!search && <button className="secondary-button" onClick={openNewTask}><Plus size={15} /> {t("createFirst")}</button>}
                      </div>
                    ) : visibleTasks.map((task) => {
                      const end = taskEnd(task);
                      const isCurrent = !task.done && now >= taskStart(task) && now < end;
                      const isOverdue = !task.done && now >= end;
                      return (
                        <div className={`task-row ${task.done ? "task-done" : ""}`} key={task.id}>
                          <button className="task-check" aria-label={task.done ? t("markIncomplete") : t("markComplete")} onClick={() => toggleTask(task.id)}>{task.done ? <CircleCheck size={21} /> : <Circle size={21} />}</button>
                          <div className="task-main">
                            <div className="task-title">{task.title}</div>
                            <div className="task-meta"><span>{timeLabel(task.time, language)}</span><span className="meta-separator">·</span><span>{task.duration} min</span><span className="category-pill">{t(task.category)}</span>{isCurrent && <span className="task-status status-running">{t("inProgress")}</span>}{isOverdue && <span className="task-status status-overdue">{t("timeOver")}</span>}</div>
                          </div>
                          <span className={`priority priority-${task.priority.toLowerCase()}`}>{t(task.priority)}</span>
                          <button className="icon-button task-action" aria-label={`${t("edit")} ${task.title}`} title={t("edit")} onClick={() => openEditTask(task)}><Pencil size={14} /></button>
                          <button className="icon-button task-delete" aria-label={`${t("delete")} ${task.title}`} title={t("delete")} onClick={() => deleteTask(task.id)}><Trash2 size={15} /></button>
                        </div>
                      );
                    })}
                  </div>
                  {tasks.length > 0 && <button className="add-task-link" onClick={openNewTask}><Plus size={16} /> {t("addAnother")}</button>}
                </article>

                <div className="right-column">
                  <article className="panel next-panel">
                    <div className="section-kicker">{currentTask ? t("inProgress") : t("upNext")}</div>
                    {currentTask ? (
                      <>
                        <h2 className="next-title">{currentTask.title}</h2>
                        <div className="next-time"><Clock3 size={15} />{timeLabel(currentTask.time, language)}<span>·</span>{currentTask.duration} min</div>
                        <div className="live-countdown">
                          <div className="countdown-label">{t("timeLeft")}</div>
                          <strong>{countdown(taskEnd(currentTask) - now)}</strong>
                          <span>{t("untilEnd")}</span>
                        </div>
                      </>
                    ) : nextTask ? (
                      <>
                        <h2 className="next-title">{nextTask.title}</h2>
                        <div className="next-time"><Clock3 size={15} />{t("startTime")}: {timeLabel(nextTask.time, language)}<span>·</span>{nextTask.duration} min</div>
                        <div className="next-divider" />
                        <div className="next-tip"><Clock3 size={17} /><span>{t("nextComing")}</span></div>
                      </>
                    ) : (
                      <div className="all-done"><CircleCheck size={25} /><h3>{tasks.length ? t("caughtUp") : t("nothingScheduled")}</h3><p>{tasks.length ? t("noRemaining") : t("addToSee")}</p><button className="secondary-button" onClick={openNewTask}><Plus size={15} /> {t("createTask")}</button></div>
                    )}
                  </article>

                  {activeNav === "Insights" && (
                    <article className="panel insights-card">
                      <div className="mini-insight-icon"><BarChart3 size={18} /></div>
                      <div className="section-kicker">{t("Insights").toUpperCase()}</div>
                      <h3>{t("progressOver")}</h3>
                      <p>{completed} / {tasks.length} {t("completedOf")}</p>
                    </article>
                  )}
                </div>
              </section>
            </>
          )}

          <footer className="page-footer"><span>ORDO / MAKE TIME COUNT</span><span>{t("footer")}</span></footer>
        </div>
      </main>

      {toast && <div className="ordo-toast" role="status"><CircleCheck size={16} />{toast}</div>}

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setShowForm(false); resetForm(); } }}>
          <form className="task-modal" onSubmit={saveTask}>
            <div className="modal-heading">
              <div><div className="section-kicker">{editingId ? t("refine") : t("makeHappen")}</div><h2>{editingId ? t("editTask") : t("createTitle")}</h2><p>{editingId ? t("updateDetails") : t("nextStep")}</p></div>
              <button type="button" className="icon-button" aria-label="Close form" onClick={() => { setShowForm(false); resetForm(); }}><X size={19} /></button>
            </div>
            <label className="form-label">{t("taskName")}<input autoFocus required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("taskPlaceholder")} /></label>
            <div className="form-row">
              <label className="form-label">{t("startTime")}<input type="time" required value={time} onChange={(event) => setTime(event.target.value)} /></label>
              <label className="form-label">{t("duration")}<select value={duration} onChange={(event) => setDuration(event.target.value)}>{DURATIONS.map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
            </div>
            <div className="form-row">
              <label className="form-label">{t("priority")}<select value={priority} onChange={(event) => setPriority(event.target.value)}>{["Low", "Medium", "High"].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select></label>
              <label className="form-label">{t("category")}<select value={category} onChange={(event) => setCategory(event.target.value)}>{["Study", "Work", "Personal", "Health", "Project", "Other"].map((item) => <option key={item} value={item}>{t(item)}</option>)}</select></label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => { setShowForm(false); resetForm(); }}>{t("cancel")}</button>
              <button type="submit" className="primary-button">{editingId ? <Check size={17} /> : <Plus size={17} />}{editingId ? t("saveChanges") : t("create")}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
